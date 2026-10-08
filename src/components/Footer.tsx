import React from 'react';
import { companyInfo } from '../data/company';
import { initialProducts } from '../data/products';
import { Leaf, Phone, Mail, MapPin, ShieldCheck, HeartHandshake, ArrowUp, Lock, BookOpen } from 'lucide-react';
import { PishgamanLogo } from './PishgamanLogo';

interface Props {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Company Profile (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <PishgamanLogo variant="white" size="lg" />

            <p className="text-xs text-stone-400 leading-relaxed font-light pt-2">
              پیشرو در نوآوری، تولید و واردات محصولات جدید و ارائه راه‌حل‌های علمی برای تغذیه خاک، افزایش مقاومت در برابر شوری و ارتقای چشمگیر کیفیت و کمیت محصولات کشاورزی در سراسر کشور.
            </p>

            <div className="pt-1 text-xs text-emerald-400 font-mono tracking-wider">
              {companyInfo.sloganEn}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] text-stone-400">مدیریت عالی:</span>
              <span className="text-xs font-bold text-white">{companyInfo.manager}</span>
            </div>
          </div>

          {/* Column 2: 16 Products List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-stone-800 pb-2">
              کاتالوگ ۱۶ محصول اختصاصی
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-stone-400">
              {initialProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => onNavigate('products')}
                  className="text-right hover:text-emerald-400 transition-colors py-0.5 truncate cursor-pointer"
                >
                  • {p.nameFa} ({p.nameEn})
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Contact & Direct Call (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-stone-800 pb-2">
              اطلاعات تماس مستقیم و ارتباط
            </h4>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-center gap-3 bg-stone-800/80 p-3 rounded-xl border border-stone-700/80">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block">مشاوره مستقیم فروش و مهندسی زراعی:</span>
                  <a
                    href={companyInfo.callUrl}
                    className="font-mono text-base font-black text-white hover:text-emerald-300 tracking-wider"
                  >
                    {companyInfo.phoneFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] text-stone-400">{companyInfo.email}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-stone-400">{companyInfo.address}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ورود به پنل مدیریت شرکت</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} کلیه حقوق برای شرکت{' '}
            <strong className="text-stone-400">{companyInfo.name}</strong> (برند {companyInfo.brand}) محفوظ است.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('articles')}
              className="hover:text-stone-300 transition-colors cursor-pointer text-emerald-400 font-semibold"
            >
              مقالات علمی و پژوهشی
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('soil-guide')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              راهنمای علمی pH و EC
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              درباره ما
            </button>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>بازگشت به بالا</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
