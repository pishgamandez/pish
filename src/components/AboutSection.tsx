import React from 'react';
import { companyInfo } from '../data/company';
import { Award, ShieldCheck, HeartHandshake, TrendingUp, Users, Leaf, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual column */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            <div className="relative bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-3xl p-8 shadow-2xl border border-stone-700 overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              
              <div className="space-y-4 relative z-10">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-emerald-300">
                  {companyInfo.sloganEn}
                </div>
                
                <h3 className="text-2xl font-black text-white">
                  {companyInfo.name}
                </h3>
                <div className="text-emerald-400 font-bold text-sm">
                  برند رسمی: {companyInfo.brand}
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  تلفیق دانش روز بیوشیمی گیاهی و فرمولاسیون اختصاصی کودهای کشاورزی، با تکیه بر سال‌ها تجربه میدانی در باغات پسته، مرکبات، گردو، مزارع غلات، صیفی‌جات و گلخانه‌های صنعتی کشور.
                </p>

                <div className="pt-4 border-t border-white/15 space-y-2">
                  <div className="text-xs text-stone-400">مدیریت عالی و مشاوره علمی:</div>
                  <div className="text-lg font-black text-white flex items-center justify-between">
                    <span>{companyInfo.manager}</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      PhD Agronomy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
                <span className="block text-xl font-black text-emerald-700 font-mono">16+</span>
                <span className="text-[11px] text-stone-500 mt-1 block">محصول تخصصی</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
                <span className="block text-xl font-black text-emerald-700 font-mono">100%</span>
                <span className="text-[11px] text-stone-500 mt-1 block">تعهد به کیفیت</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
                <span className="block text-xl font-black text-emerald-700 font-mono">24/7</span>
                <span className="text-[11px] text-stone-500 mt-1 block">مشاوره کارشناسی</span>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>درباره شرکت پیشگامان پایدار فلات نیک</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-snug">
              پیشرو در نوآوری، تولید و ارائه راهکارهای توسعه پایدار کشاورزی
            </h2>

            <div className="space-y-4 text-sm text-stone-700 leading-relaxed font-light text-justify">
              <p className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <strong className="font-bold text-stone-900 block mb-1">رسالت و هدف سازمان:</strong>
                {companyInfo.intro}
              </p>

              <p className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <strong className="font-bold text-stone-900 block mb-1">تعهد به پایداری و مشتری‌مداری:</strong>
                {companyInfo.mission}
              </p>

              <p className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <strong className="font-bold text-stone-900 block mb-1">ارزش‌های بنیادین:</strong>
                {companyInfo.values}
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-stone-800 font-semibold bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>فرمولاسیون اختصاصی مطابق اقلیم کم‌آب و خاک‌های شور کشور</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-800 font-semibold bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>صداقت در مشاوره و انتقال حس رضایت عمیق به باغدار و کشاورز</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
