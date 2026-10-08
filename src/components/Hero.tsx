import React from 'react';
import { ArrowLeft, ShieldCheck, Award, Sparkles, Phone, FileText, CheckCircle2, Sprout } from 'lucide-react';
import { companyInfo } from '../data/company';
import { PishgamanLogo } from './PishgamanLogo';
import heroWheatImg from '../assets/images/hero_wheat_field_1791480930784.jpg';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenConsult: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onOpenConsult }) => {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white pt-12 pb-24 md:pt-20 md:pb-32">
      {/* 1. Real Agricultural Wheat Field Background Photo with Cinematic Gradients */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 scale-105 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${heroWheatImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-900/80" />
      <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/60 via-transparent to-stone-950/80" />
      
      {/* Background glow and subtle tech grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-36 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Top Brand Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold backdrop-blur-md">
                <Sprout className="w-3.5 h-3.5" />
                <span>برند رسمی: {companyInfo.brand}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-900/80 text-stone-300 border border-stone-700/80 text-[11px] font-mono backdrop-blur-md">
                {companyInfo.sloganEn}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.25] text-white drop-shadow-md">
              نوآوری در تغذیه گیاهی،{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-teal-300 to-green-300">
                پایداری در عملکرد خاک
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl font-light drop-shadow-sm">
              شرکت <strong className="font-bold text-white">پیشگامان پایدار فلات نیک</strong> با برند نام‌آشنای{' '}
              <strong className="font-bold text-emerald-400">پرواز نهاده</strong> و مدیریت{' '}
              <strong className="font-bold text-white">{companyInfo.manager}</strong>، ارائه‌دهنده سبد کامل ۱۶ محصول استراتژیک کشاورزی از اصلاح‌کننده‌های شوری و اسیدیته تا محرک‌های ارگانیک، ژل‌های پتاس و فسفر و کلات‌های اختصاصی.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-200">
              <div className="flex items-center gap-2 bg-stone-900/70 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فرمولاسیون اختصاصی برای خاک‌های آهکی و شور کشور</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/70 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>کلات‌های آهن EDDHA و گوگرد مایع با خلوص ۱۰۰٪</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/70 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>جدول دقیق مصرف زراعی، باغی و گلخانه‌ای</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/70 border border-white/15 rounded-xl p-3 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مشاوره و طراحی برنامه کودی توسط {companyInfo.manager}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>مشاهده ۱۶ محصول کاتالوگ</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenConsult}
                className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-white rounded-xl font-semibold text-sm border border-stone-700/80 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
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

          {/* Corporate Profile Card with Official Logo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-stone-900/90 border border-stone-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {/* Official Logo Header */}
              <div className="flex items-center justify-between border-b border-stone-700/80 pb-5 mb-6">
                <PishgamanLogo variant="white" size="lg" />
                <div className="text-left">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">
                    Official Brand
                  </span>
                  <span className="text-xs text-stone-300 font-bold block">
                    {companyInfo.brand}
                  </span>
                </div>
              </div>

              {/* Stat items */}
              <div className="grid grid-cols-2 gap-3.5 mb-6 text-right">
                <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-emerald-400 font-mono">16</span>
                  <span className="text-xs text-stone-300 mt-1 block">محصول تخصصی با فرمولاسیون اختصاصی</span>
                </div>
                <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-amber-400 font-mono">100%</span>
                  <span className="text-xs text-stone-300 mt-1 block">حلالیت و کارایی در خاک‌های شور و آهکی</span>
                </div>
                <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-teal-400 font-mono">EDDHA</span>
                  <span className="text-xs text-stone-300 mt-1 block">پایدار تا اسیدیته ۹ (کود آهن ردفول)</span>
                </div>
                <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/50">
                  <span className="block text-2xl font-black text-blue-400 font-mono">0.0%</span>
                  <span className="text-xs text-stone-300 mt-1 block">کلر آزاد در ژل‌های پتاس و فسفر تایگر</span>
                </div>
              </div>

              {/* Management Note */}
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-xs text-stone-200 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>مدیریت ارشد علمی و اجرایی:</span>
                  <span className="text-white">{companyInfo.manager}</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">
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
