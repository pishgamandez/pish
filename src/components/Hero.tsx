import React from 'react';
import { ArrowLeft, ShieldCheck, Award, Sparkles, Phone, FileText, CheckCircle2, Sprout, Compass } from 'lucide-react';
import { companyInfo } from '../data/company';
import { PishgamanLogo } from './PishgamanLogo';
import goldenWheatImg from '../assets/images/golden_wheat_field_1791481535252.jpg';
import farmAerialImg from '../assets/images/hero_wheat_field_1791480930784.jpg';
import researchImg from '../assets/images/agri_research_lab_1791480948724.jpg';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenConsult: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onOpenConsult }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white pt-10 pb-20 md:pt-16 md:pb-28">
      {/* 1. Real Vibrant Agricultural Golden Wheat Field Background Photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-85 scale-100 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${goldenWheatImg})` }}
      />
      
      {/* Soft directional overlays that keep the wheat field vividly visible while guaranteeing text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
      <div className="absolute inset-0 bg-gradient-to-l from-stone-950/85 via-stone-950/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Content Column with Glassmorphism Backdrop */}
          <div className="lg:col-span-7 space-y-6 text-right bg-stone-950/75 p-6 sm:p-10 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl">
            {/* Top Brand Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold backdrop-blur-md shadow-sm">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>برند رسمی: {companyInfo.brand}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/60 text-stone-200 border border-white/20 text-[11px] font-mono backdrop-blur-md">
                {companyInfo.sloganEn}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.25] text-white drop-shadow-lg">
              نوآوری در تغذیه گیاهی،{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-teal-300 to-amber-300">
                پایداری در عملکرد خاک
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-normal drop-shadow">
              شرکت <strong className="font-bold text-white">پیشگامان پایدار فلات نیک</strong> با برند نام‌آشنای{' '}
              <strong className="font-bold text-emerald-300">پرواز نهاده</strong> و مدیریت{' '}
              <strong className="font-bold text-white">{companyInfo.manager}</strong>، ارائه‌دهنده سبد کامل ۱۶ محصول استراتژیک کشاورزی از اصلاح‌کننده‌های شوری و اسیدیته تا محرک‌های ارگانیک، ژل‌های پتاس و فسفر و کلات‌های اختصاصی.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-stone-100">
              <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فرمولاسیون اختصاصی برای خاک‌های آهکی و شور کشور</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>کلات‌های آهن EDDHA و گوگرد مایع با خلوص ۱۰۰٪</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>جدول دقیق مصرف زراعی، باغی و گلخانه‌ای</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-xl p-3 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مشاوره و طراحی برنامه کودی توسط {companyInfo.manager}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-950/70 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>مشاهده ۱۶ محصول کاتالوگ</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenConsult}
                className="px-6 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-100 hover:text-white rounded-xl font-semibold text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>درخواست نسخه کودی و مشاوره</span>
              </button>

              <a
                href={companyInfo.callUrl}
                className="px-4 py-3.5 text-stone-200 hover:text-white text-xs flex items-center gap-2 underline underline-offset-4"
              >
                <Phone className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>تماس فوری: {companyInfo.phoneFormatted}</span>
              </a>
            </div>
          </div>

          {/* Corporate Profile Card with Official Logo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-stone-950/85 border border-white/20 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              {/* Official Logo Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-5 mb-6">
                <PishgamanLogo variant="white" size="lg" />
                <div className="text-left">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">
                    Official Brand
                  </span>
                  <span className="text-xs text-stone-200 font-bold block">
                    {companyInfo.brand}
                  </span>
                </div>
              </div>

              {/* Stat items */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-right">
                <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
                  <span className="block text-2xl font-black text-emerald-400 font-mono">16</span>
                  <span className="text-xs text-stone-300 mt-1 block">محصول تخصصی با فرمولاسیون اختصاصی</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
                  <span className="block text-2xl font-black text-amber-400 font-mono">100%</span>
                  <span className="text-xs text-stone-300 mt-1 block">حلالیت و کارایی در خاک‌های شور و آهکی</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
                  <span className="block text-2xl font-black text-teal-400 font-mono">EDDHA</span>
                  <span className="text-xs text-stone-300 mt-1 block">پایدار تا اسیدیته ۹ (کود آهن ردفول)</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
                  <span className="block text-2xl font-black text-blue-400 font-mono">0.0%</span>
                  <span className="text-xs text-stone-300 mt-1 block">کلر آزاد در ژل‌های پتاس و فسفر تایگر</span>
                </div>
              </div>

              {/* Management Note */}
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-xs text-stone-200 space-y-2">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>مدیریت ارشد علمی و اجرایی:</span>
                  <span className="text-white">{companyInfo.manager}</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  «هدف ما صرفاً فروش کود نیست؛ ارائه راهکارهای علمی برای برطرف‌سازی کمبودهای فیزیولوژیک، شکستن شوری خاک و ارتقای تناژ و کیفیت محصول است.»
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-emerald-500/30 text-[11px]">
                  <span className="text-stone-300">مشاوره تخصصی باغات و زراعت:</span>
                  <a
                    href={companyInfo.callUrl}
                    className="font-mono text-emerald-300 font-bold hover:underline"
                  >
                    {companyInfo.phoneFormatted}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Agricultural Field Showcase Strip (Makes home page richly photographic) */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative rounded-2xl overflow-hidden h-36 border border-white/20 group shadow-lg">
            <img
              src={goldenWheatImg}
              alt="مزارع حاصلخیز گندم طلایی"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3.5 text-right">
              <div>
                <span className="text-[10px] text-amber-300 font-bold block">مزارع غلات و دانه‌های روغنی</span>
                <h4 className="text-xs font-black text-white">تغذیه تخصصی و افزایش وزن هزار دانه</h4>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-36 border border-white/20 group shadow-lg">
            <img
              src={farmAerialImg}
              alt="سیستم‌های نوین آبیاری و کشاورزی پایدار"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3.5 text-right">
              <div>
                <span className="text-[10px] text-emerald-300 font-bold block">مدیریت شوری و آبیاری قطره‌ای</span>
                <h4 className="text-xs font-black text-white">اصلاح بافت خاک با سالت استاپ و سول مکس</h4>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-36 border border-white/20 group shadow-lg">
            <img
              src={researchImg}
              alt="پژوهش و آزمایشگاه بیوشیمی گیاهی"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3.5 text-right">
              <div>
                <span className="text-[10px] text-teal-300 font-bold block">توسعه ریشه و جذب عناصر</span>
                <h4 className="text-xs font-black text-white">فرمولاسیون کلات‌های پیشرفته و ارگانیک</h4>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
