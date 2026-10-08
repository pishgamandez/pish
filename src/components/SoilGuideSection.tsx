import React, { useState } from 'react';
import { soilGuideData } from '../data/soilGuide';
import { Activity, Droplets, CheckCircle, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import { companyInfo } from '../data/company';
import researchImg from '../assets/images/agri_research_lab_1791480948724.jpg';

interface Props {
  onOpenConsult: () => void;
}

export const SoilGuideSection: React.FC<Props> = ({ onOpenConsult }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentGuide = soilGuideData[activeTab];

  return (
    <section id="soil-guide" className="py-20 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>آموزش علمی و استاندارد زراعی (صفحات ۱۳ و ۱۴ مستند رسمی)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            راهنمای تخصصی مدیریت اسیدیته (pH) و شوری (EC) خاک
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
            بیش از ۸۰ درصد افت باروری در باغات و مزارع کشور، ناشی از قفل شدن عناصر در pH های قلیایی و تجمع املاح سدیمی (EC بالا) است. پیشگامان فلات نیک راهکارهای اصلاحی تضمینی ارائه می‌دهد.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 0
                ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>راهنمای اسیدیته و پتانسیل pH</span>
          </button>

          <button
            onClick={() => setActiveTab(1)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 1
                ? 'bg-teal-800 text-white shadow-lg shadow-teal-900/20'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>هدایت الکتریکی (EC) و ضد شوری</span>
          </button>
        </div>

          {/* Content Box */}
          <div className="bg-stone-50 rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-8 text-right">
            
            {/* Visual Photo Card for Soil Testing */}
            <div className="relative rounded-2xl overflow-hidden h-48 sm:h-64 shadow-md border border-stone-200">
              <img
                src={researchImg}
                alt="پژوهش علمی خاک و آزمایشگاه تغذیه گیاهی"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">کنترل علمی و آزمون دقیق خاک</span>
                  <h4 className="text-lg sm:text-xl font-black">
                    آنالیز فیزیولوژیک برهم‌کنش عناصر، شوری (EC) و اسیدیته (pH)
                  </h4>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase font-mono">
                Scientific Agronomy Guide
              </span>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              {currentGuide.title}
            </h3>
            <div className="text-sm font-semibold text-stone-600">
              {currentGuide.subtitle}
            </div>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed pt-2">
              {currentGuide.description}
            </p>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentGuide.points.map((pt, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-start gap-3 text-xs text-stone-800 leading-relaxed"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          {currentGuide.table && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-stone-900">
                جدول تحلیلی و راهکارهای درمانی پیشگامان فلات نیک:
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                    <tr>
                      {currentGuide.table.headers.map((h, i) => (
                        <th key={i} className="py-3.5 px-4 font-black">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {currentGuide.table.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900 font-mono">
                          {row[0]}
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 font-medium">
                          {row[1]}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {row[2]}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-800">
                          {row[3]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA Box inside guide */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base">نیاز به آنالیز آزمون آب و خاک مزرعه خود دارید؟</h4>
              <p className="text-xs text-emerald-200 mt-1">
                برگه آزمایشگاه خود را برای ما ارسال کنید تا دکتر راستین رستمی نسخه دقیق کودی متناسب با خاک شما تجویز نماید.
              </p>
            </div>
            <button
              onClick={onOpenConsult}
              className="px-5 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer shadow-md"
            >
              ارسال اطلاعات خاک جهت بررسی
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
