import React from 'react';
import { ArrowLeft, ShieldCheck, Award, Sparkles, Phone, FileText, CheckCircle2, Sprout } from 'lucide-react';
import { companyInfo } from '../data/company';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenConsult: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onOpenConsult }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-emerald-950 text-white pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-36 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Top Brand Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold backdrop-blur-md">
                <Sprout className="w-3.5 h-3.5" />
                <span>برند رسمی: {companyInfo.brand}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 border border-stone-700/80 text-[11px] font-mono">
                {companyInfo.sloganEn}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.25] text-white">
              نوآوری در تغذیه گیاهی،{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-teal-300 to-green-300">
                پایداری در عملکرد خاک
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
              شرکت <strong className="font-bold text-white">پیشگامان پایدار فلات نیک</strong> با برند نام‌آشنای{' '}
              <strong className="font-bold text-emerald-400">پرواز نهاده</strong> و مدیریت{' '}
              <strong className="font-bold text-white">{companyInfo.manager}</strong>، ارائه‌دهنده سبد کامل ۱۶ محصول استراتژیک کشاورزی از اصلاح‌کننده‌های شوری و اسیدیته تا محرک‌های ارگانیک، ژل‌های پتاس و فسفر و کلات‌های اختصاصی.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فرمولاسیون اختصاصی برای خاک‌های آهکی و شور کشور</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>کلات‌های آهن EDDHA و گوگرد مایع با خلوص ۱۰۰٪</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>جدول دقیق مصرف زراعی، باغی و گلخانه‌ای</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مشاوره و طراحی برنامه کودی توسط {companyInfo.manager}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/40 hover:shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>مشاهده ۱۶ محصول کاتالوگ</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenConsult}
                className="px-6 py-3.5 bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl font-semibold text-sm border border-stone-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>درخواست نسخه کودی و مشاوره</span>
              </button>

              <a
                href={companyInfo.callUrl}
                className="px-4 py-3.5 text-stone-300 hover:text-white text-xs flex items-center gap-2 underline underline-offset-4"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>تماس فوری: {companyInfo.phoneFormatted}</span>
              </a>
            </div>
          </div>

          {/* Corporate Profile Card (Bayer-style authority box) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-stone-800/90 to-stone-900/95 border border-stone-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {/* Badge */}
              <div className="flex items-center justify-between border-b border-stone-700/80 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-emerald-400">شناسنامه شرکت</span>
                  <h3 className="text-lg font-black text-white">{companyInfo.name}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Stat items */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-right">
                <div className="bg-stone-800/60 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-emerald-400 font-mono">16</span>
                  <span className="text-xs text-stone-400 mt-1 block">محصول تخصصی با فرمولاسیون اختصاصی</span>
                </div>
                <div className="bg-stone-800/60 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-amber-400 font-mono">100%</span>
                  <span className="text-xs text-stone-400 mt-1 block">حلالیت و کارایی در خاک‌های شور و آهکی</span>
                </div>
                <div className="bg-stone-800/60 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-teal-400 font-mono">EDDHA</span>
                  <span className="text-xs text-stone-400 mt-1 block">پایدار تا اسیدیته ۹ (کود آهن ردفول)</span>
                </div>
                <div className="bg-stone-800/60 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-blue-400 font-mono">0.0%</span>
                  <span className="text-xs text-stone-400 mt-1 block">کلر آزاد در ژل‌های پتاس و فسفر تایگر</span>
                </div>
              </div>

              {/* Management Note */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs text-stone-300 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>مدیریت ارشد علمی و اجرایی:</span>
                  <span className="text-white">{companyInfo.manager}</span>
                </div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  «هدف ما صرفاً فروش کود نیست؛ ارائه راهکارهای علمی برای برطرف‌سازی کمبودهای فیزیولوژیک، شکستن شوری خاک و ارتقای تناژ و کیفیت محصول است.»
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-emerald-500/20 text-[11px]">
                  <span className="text-stone-400">مشاوره تخصصی باغات و زراعت:</span>
                  <a
                    href={companyInfo.callUrl}
                    className="font-mono text-emerald-400 font-bold hover:underline"
                  >
                    {companyInfo.phoneFormatted}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
