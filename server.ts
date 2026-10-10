import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initialProducts } from './src/data/products';
import { companyInfo } from './src/data/company';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directory exists
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Predefined product images slot directory
const productsImagesDir = path.resolve(__dirname, 'public', 'assets', 'images', 'products');
if (!fs.existsSync(productsImagesDir)) {
  fs.mkdirSync(productsImagesDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.resolve(__dirname, 'public', 'assets')));

// Ensure data persistence directory exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const productsFilePath = path.resolve(dataDir, 'products.json');
const srcProductsFilePath = path.resolve(__dirname, 'src', 'data', 'products.ts');
const githubConfigFile = path.resolve(__dirname, '.github-config.json');

// Interface and helpers for GitHub sync
interface GithubConfig {
  repo: string;
  branch: string;
  token: string;
  autoPush: boolean;
}

function getGithubConfig(): GithubConfig {
  const defaultConf: GithubConfig = {
    repo: 'pishgamandez/pishgaman',
    branch: 'main',
    token: '',
    autoPush: true
  };
  if (fs.existsSync(githubConfigFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(githubConfigFile, 'utf-8'));
      return { ...defaultConf, ...data };
    } catch {}
  }
  return defaultConf;
}

function saveGithubConfig(config: Partial<GithubConfig>): GithubConfig {
  const current = getGithubConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(githubConfigFile, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

function syncGitCommit(message: string): boolean {
  try {
    execSync('git add -A', { stdio: 'ignore' });
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function syncGitPush(): { success: boolean; message: string; output?: string } {
  try {
    const config = getGithubConfig();
    if (!config.token || !config.token.trim()) {
      return {
        success: false,
        message: 'توکن دسترسی گیت‌هاب (Personal Access Token) هنوز تنظیم نشده است.'
      };
    }
    const token = config.token.trim();
    const repo = config.repo.trim() || 'pishgamandez/pishgaman';
    const branch = config.branch.trim() || 'main';

    const remoteUrl = `https://x-access-token:${token}@github.com/${repo}.git`;
    try {
      execSync('git remote remove origin', { stdio: 'ignore' });
    } catch {}
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'ignore' });

    const pushResult = execSync(`git push origin ${branch}`, {
      encoding: 'utf-8',
      timeout: 45000
    });
    return {
      success: true,
      message: `تغییرات با موفقیت به مخزن گیت‌هاب (${repo}) ارسال شد.`,
      output: pushResult
    };
  } catch (err: any) {
    console.error('Git push error:', err);
    let msg = err?.stderr?.toString() || err?.message || 'خطا در ارسال به گیت‌هاب';
    if (msg.includes('Authentication failed') || msg.includes('Invalid username or token') || msg.includes('403')) {
      msg = 'احراز هویت گیت‌هاب ناموفق بود. لطفاً بررسی کنید توکن معتبر و دارای مجوز repo باشد.';
    }
    return { success: false, message: msg };
  }
}

function saveProductsToSourceFiles(products: any[]) {
  // 1. Write data/products.json
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');

  // 2. Write src/data/products.ts so GitHub Actions & Vite have exact source data
  const tsContent = `import { Product } from '../types';\n\nexport const initialProducts: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  fs.writeFileSync(srcProductsFilePath, tsContent, 'utf-8');
}

// Initialize products file if it doesn't exist
if (!fs.existsSync(productsFilePath)) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(initialProducts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to initialize products.json:', err);
  }
}

// In-memory consultations storage
const consultations: any[] = [];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System instructions for Gemini AI Agronomist
const productsKnowledge = initialProducts.map(p => 
  `- نام: ${p.nameFa} (${p.nameEn})
   رده: ${p.categoryTitle} (${p.appearance})
   توضیحات و مزایا: ${p.tagline}. ${p.benefits.join('; ')}
   جدول مصرف: ${p.dosageTable.map(d => `${d.crop}: ${d.method} - ${d.rate}`).join(' | ')}`
).join('\n\n');

const systemInstruction = `شما مشاور ارشد و هوشمند تغذیه گیاهی شرکت «پیشگامان پایدار فلات نیک» با برند نام‌آشنای «پرواز نهاده» و مدیریت «دکتر راستین رستمی» هستید.
شعار شرکت: "${companyInfo.sloganEn}"
شماره تماس مستقیم مدیریت و کارشناسان جهت خرید و مشاوره: ${companyInfo.phone} (${companyInfo.phoneFormatted})

دانشنامه کامل ۱۶ محصول تخصصی شرکت:
${productsKnowledge}

دستورالعمل‌های پاسخگویی:
۱. همواره مؤدب، علمی، دلسوز و متناسب با شرایط باغبانی و زراعت در ایران (خاک‌های عمدتاً آهکی، کم‌آب و شور) پاسخ دهید.
۲. اگر کاربر درباره شوری خاک یا EC سوال کرد، محصول اصلی «سالت استاپ» (Salt Stop) و «سول مکس» (گوگرد مایع) را توصیه کنید.
۳. اگر درباره زردی برگ‌ها یا کلروز پرسید، کود آهن کلاته «ردفول» (EDDHA پایدار تا pH 9) و «تاپ استار» (میکس آهن، روی، منگنز) را معرفی کنید.
۴. اگر درباره ریزش گل پرسید، «فول شارژر» (محلول روی و بُر) را توصیه کنید.
۵. اگر درباره اصلاح خاک و هیومیک پرسید، «چلنجر» (پودری) و «هیومی فارم» (مایع غنی‌شده) را معرفی کنید.
۶. اگر درباره درشت شدن میوه یا رنگ‌آوری پرسید، «دوپینگ» و «تایگر K High» (ژل پتاسیم بالا) را توصیه کنید.
۷. در پایان پاسخ‌های مشاوره، همواره به کاربر یادآوری کنید که برای استعلام قیمت، دریافت نسخه دقیق کودی و خرید می‌توانند با شماره 09128247415 (دکتر راستین رستمی) تماس بگیرند.`;

// API endpoint for AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'پیام ارسال نشده است.' });
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ reply: response.text });
    } else {
      // Fallback if no API key is attached
      return res.json({
        reply: `سلام از طرف شرکت پیشگامان پایدار فلات نیک (برند پرواز نهاده). برای دریافت نسخه کودی تخصصی، استعلام موجودی ۱۶ محصول و مشاوره مستقیم زراعی، لطفاً با شماره 09128247415 (دکتر راستین رستمی) تماس بگیرید یا در واتساپ پیام ارسال فرمایید.`
      });
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({
      error: 'خطا در ارتباط با مشاور هوش مصنوعی',
      fallback: `برای ارتباط مستقیم با کارشناسان پیشگامان فلات نیک، با شماره 09128247415 تماس حاصل فرمایید.`
    });
  }
});

// API endpoint for Consultations & Soil Tests
app.post('/api/consultations', (req, res) => {
  const { name, phone, cropType, city, areaSize, problem } = req.body;
  const inquiry = {
    id: Date.now().toString(),
    name,
    phone,
    cropType,
    city,
    areaSize,
    problem,
    createdAt: new Date().toISOString()
  };
  consultations.unshift(inquiry);
  res.json({ success: true, inquiry });
});

app.get('/api/consultations', (req, res) => {
  res.json(consultations);
});

// Products API: Get list of products
app.get('/api/products', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json(parsed);
      }
    }
  } catch (err) {
    console.error('Error reading products.json:', err);
  }
  return res.json(initialProducts);
});

// Products API: Save products list permanently (writes to both JSON and TypeScript source files, commits to Git, and syncs to GitHub)
app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'فرمت داده نامعتبر است.' });
    }

    // Save to both data/products.json and src/data/products.ts
    saveProductsToSourceFiles(products);

    // Commit changes to Git so GitHub tracks all modifications
    const committed = syncGitCommit('admin: update product details and structure');

    // Auto push to GitHub if configured
    let pushResult = { success: false, message: '' };
    const conf = getGithubConfig();
    if (conf.autoPush && conf.token) {
      pushResult = syncGitPush();
    }

    return res.json({
      success: true,
      count: products.length,
      gitCommitted: committed,
      gitPushed: pushResult.success,
      pushMessage: pushResult.message
    });
  } catch (err) {
    console.error('Error saving products:', err);
    return res.status(500).json({ error: 'خطا در ذخیره‌سازی داده‌های محصول.' });
  }
});

// Predefined Slot Image Upload API: saves user's raw file to predetermined product slot
app.post('/api/upload', (req, res) => {
  try {
    const { data, filename, productId } = req.body;
    if (!data || typeof data !== 'string') {
      return res.status(400).json({ error: 'اطلاعات تصویری ارسال نشده است.' });
    }

    let buffer: Buffer;
    let ext = 'jpg';

    // Parse data URL scheme
    const matches = data.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const rawExt = matches[1].toLowerCase();
      if (rawExt.includes('png')) ext = 'png';
      else if (rawExt.includes('webp')) ext = 'webp';
      else if (rawExt.includes('svg')) ext = 'svg';
      else if (rawExt.includes('gif')) ext = 'gif';
      else ext = 'jpg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64');
    }

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'فایل تصویری خالی یا نامعتبر است.' });
    }

    // Predefined file naming architecture:
    // If productId is provided, use the exact predefined slot for that product:
    // e.g. public/assets/images/products/jumper.jpg
    const safeSlotName = productId 
      ? productId.replace(/[^a-zA-Z0-9_-]/g, '_')
      : (filename || 'product').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    
    const targetFilename = `${safeSlotName}.${ext}`;
    const targetFilePath = path.resolve(productsImagesDir, targetFilename);

    fs.writeFileSync(targetFilePath, buffer);

    // Also mirror to uploadsDir for backwards compatibility
    try {
      fs.writeFileSync(path.resolve(uploadsDir, targetFilename), buffer);
    } catch {}

    // Sync to dist if exists
    const distProductsImagesDir = path.resolve(__dirname, 'dist', 'assets', 'images', 'products');
    if (!fs.existsSync(distProductsImagesDir)) {
      try { fs.mkdirSync(distProductsImagesDir, { recursive: true }); } catch {}
    }
    try {
      fs.writeFileSync(path.resolve(distProductsImagesDir, targetFilename), buffer);
    } catch {}

    // Relative public URL that works on localhost, Vite dev server, and GitHub Pages
    const publicUrl = `./assets/images/products/${targetFilename}`;

    // Auto commit this image file to git
    syncGitCommit(`admin: upload product image for ${safeSlotName}`);

    // Auto push to GitHub if token configured
    const conf = getGithubConfig();
    let pushResult = { success: false, message: '' };
    if (conf.autoPush && conf.token) {
      pushResult = syncGitPush();
    }

    return res.json({
      success: true,
      url: publicUrl,
      size: buffer.length,
      filename: targetFilename,
      gitPushed: pushResult.success,
      pushMessage: pushResult.message
    });
  } catch (err: any) {
    console.error('Direct upload error:', err);
    return res.status(500).json({ error: 'خطا در بارگذاری و ذخیره فایل تصویر.' });
  }
});

// GitHub Integration Endpoints
app.get('/api/github/status', (req, res) => {
  const conf = getGithubConfig();
  let lastCommit = '';
  try {
    lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%cr)"', { encoding: 'utf-8' }).trim();
  } catch {}
  return res.json({
    configured: Boolean(conf.token && conf.token.trim()),
    repo: conf.repo,
    branch: conf.branch,
    autoPush: conf.autoPush,
    hasToken: Boolean(conf.token && conf.token.trim()),
    tokenPreview: conf.token ? `${conf.token.slice(0, 4)}••••${conf.token.slice(-4)}` : '',
    lastCommit
  });
});

app.post('/api/github/config', (req, res) => {
  try {
    const { token, repo, branch, autoPush } = req.body;
    const current = getGithubConfig();
    const updated = saveGithubConfig({
      token: token !== undefined ? token : current.token,
      repo: repo || current.repo,
      branch: branch || current.branch,
      autoPush: autoPush !== undefined ? autoPush : current.autoPush
    });
    return res.json({
      success: true,
      config: {
        repo: updated.repo,
        branch: updated.branch,
        autoPush: updated.autoPush,
        hasToken: Boolean(updated.token)
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'خطا در ذخیره تنظیمات گیت‌هاب.' });
  }
});

app.post('/api/github/test', async (req, res) => {
  try {
    const { token, repo } = req.body;
    const effectiveToken = token || getGithubConfig().token;
    const effectiveRepo = repo || getGithubConfig().repo || 'pishgamandez/pishgaman';

    if (!effectiveToken || !effectiveToken.trim()) {
      return res.status(400).json({ success: false, message: 'توکن وارد نشده است.' });
    }

    const ghRes = await fetch(`https://api.github.com/repos/${effectiveRepo}`, {
      headers: {
        'Authorization': `Bearer ${effectiveToken.trim()}`,
        'User-Agent': 'Pishgaman-Admin-Panel',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!ghRes.ok) {
      const errData = await ghRes.json().catch(() => ({} as any));
      return res.status(ghRes.status).json({
        success: false,
        message: errData.message || `خطا در اتصال به مخزن گیت‌هاب (${ghRes.status})`
      });
    }

    const repoData = await ghRes.json();
    return res.json({
      success: true,
      message: `اتصال با موفقیت برقرار شد! مخزن: ${repoData.full_name}`,
      repoName: repoData.full_name,
      permissions: repoData.permissions,
      defaultBranch: repoData.default_branch
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'خطا در تست اتصال.' });
  }
});

app.post('/api/github/push', (req, res) => {
  const result = syncGitPush();
  if (result.success) {
    return res.json(result);
  } else {
    return res.status(400).json(result);
  }
});

// Dev or Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
