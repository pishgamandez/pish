import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.resolve(__dirname, 'public', 'assets')));

// Ensure data persistence directory exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const productsFilePath = path.resolve(dataDir, 'products.json');

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

// Products API: Save products list permanently
app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'فرمت داده نامعتبر است.' });
    }
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
    return res.json({ success: true, count: products.length });
  } catch (err) {
    console.error('Error writing products.json:', err);
    return res.status(500).json({ error: 'خطا در ذخیره‌سازی داده‌های محصول.' });
  }
});

// Direct Image Upload API: saves user's raw file without AI modification
app.post('/api/upload', (req, res) => {
  try {
    const { data, filename } = req.body;
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

    const timestamp = Date.now();
    const safeBase = (filename || 'product')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFilename = `${safeBase}_${timestamp}.${ext}`;
    const targetFilePath = path.resolve(uploadsDir, uniqueFilename);

    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    return res.json({
      success: true,
      url: publicUrl,
      size: buffer.length,
      filename: uniqueFilename
    });
  } catch (err: any) {
    console.error('Direct upload error:', err);
    return res.status(500).json({ error: 'خطا در بارگذاری و ذخیره فایل تصویر.' });
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
