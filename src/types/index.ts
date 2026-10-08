export interface DosageRate {
  crop: string; // محصول (e.g. درختان میوه، سبزی و صیفی)
  method: string; // نحوه مصرف (e.g. همراه آب آبیاری، محلول‌پاشی)
  timing?: string; // زمان مصرف (e.g. قبل از جوانه‌زنی)
  rate: string; // مقدار مصرف (e.g. ۳-۵ کیلوگرم در هکتار)
}

export type ProductCategory = 
  | 'soil-conditioner' // ضد شوری و اصلاح خاک
  | 'humic-organic'    // هیومیک و مواد آلی
  | 'stimulant'        // محرک رشد و ضد تنش
  | 'nutrition-gel'    // ژل‌های تغذیه و عناصر میکرو/ماکرو
  | 'all';

export interface Product {
  id: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  category: ProductCategory;
  categoryTitle: string;
  tagline: string;
  description: string;
  benefits: string[];
  dosageTable: DosageRate[];
  specialNotes?: string;
  imageUrl?: string;
  appearance?: string; // e.g. پودری، مایع غلیظ، ژل
  packaging?: string;  // e.g. بطری ۱ لیتری، گالن ۵ لیتری، سطل ۱۰ کیلویی
  badge?: string;
}

export interface ConsultationInquiry {
  id: string;
  name: string;
  phone: string;
  cropType: string;
  city: string;
  areaSize?: string;
  problem: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}
