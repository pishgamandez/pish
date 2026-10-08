import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initialProducts } from './src/data/products';
import { companyInfo } from './src/data/company';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

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
