import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Globe, Layers, Send, Smartphone, Sparkles, X } from 'lucide-react';
import heroImg from './assets/images/hero_creative_workspace_1791024799906.jpg';
import showcaseImg from './assets/images/project_showcase_minimal_1791024815397.jpg';

export default function App() {
  const [formData, setFormData] = useState({ name: '', contact: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<'all' | 'branding' | 'digital'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) return;
    setIsSubmitted(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 flex flex-col selection:bg-amber-100 selection:text-stone-900">
      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <a href="#" className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900"></span>
            استودیو وب
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-stone-900 transition-colors cursor-pointer">
              ویژگی‌ها
            </button>
            <button onClick={() => scrollToSection('showcase')} className="hover:text-stone-900 transition-colors cursor-pointer">
              نمونه کار
            </button>
            <button onClick={() => scrollToSection('process')} className="hover:text-stone-900 transition-colors cursor-pointer">
              روند ساخت
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-stone-900 transition-colors cursor-pointer">
              ارتباط با ما
            </button>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              شروع پروژه آزمایشی
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>آماده بارگذاری عکس‌ها و شیت‌های شما</span>
                <span aria-hidden="true">·</span>
                <span>هاست رایگان ابری</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-stone-950 leading-[1.3] tracking-tight">
                یک وب‌سایت شیک، سبک و سریع برای معرفی ایده شما
              </h1>

              <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl">
                این یک نمونه زنده و واقعی است. شیت‌ها، متون و تصاویر خود را ارسال کنید تا در کمترین زمان به سایتی واکنش‌گرا و قابل اتصال به دامنه‌های ملی (<span dir="ltr" className="font-mono text-sm bg-stone-200/60 px-1.5 py-0.5 rounded">.ir</span>) تبدیل شود.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>ثبت و ارسال اطلاعات</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('showcase')}
                  className="px-6 py-3 text-sm font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer"
                >
                  مشاهده ظاهر نمونه
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  نمایش بهینه در موبایل و تبلت
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-stone-600" />
                  قابل اتصال به گیت‌هاب و دامنه اختصاصی
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100 group">
                <img
                  src={heroImg}
                  alt="محیط طراحی و استودیو کار"
                  referrerPolicy="no-referrer"
                  className="w-full h-[360px] md:h-[440px] object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-right">
                    <p className="text-xs font-light text-stone-200">پیش‌نمایش زنده در کلود گوگل</p>
                    <p className="text-sm font-semibold mt-0.5">آماده اضافه شدن تصاویر دلخواه شما</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES / FEATURES */}
      <section id="features" className="py-16 md:py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-right max-w-xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-950">
              ویژگی‌های کلیدی سایت آینده شما
            </h2>
            <p className="text-stone-600 mt-2 text-sm md:text-base">
              همه‌چیز به گونه‌ای تنظیم شده که به‌سادگی بتوان محتوای شیت‌ها و عکس‌ها را به صفحات استاندارد وب تبدیل کرد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-[#FAF9F6] border border-stone-200/80 hover:border-stone-300 transition-colors">
              <div className="text-xs font-bold text-stone-400 mb-3">01</div>
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                ورود اطلاعات از روی شیت و اکسل
              </h3>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                کافی است فایل شیت، متن‌ها یا جداول خود را بفرستید تا دقیقاً در قالب بخش‌ها، لیست‌ها یا کارت‌های سایت سازماندهی شوند.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-[#FAF9F6] border border-stone-200/80 hover:border-stone-300 transition-colors">
              <div className="text-xs font-bold text-stone-400 mb-3">02</div>
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                واکنش‌گرا و فوق‌العاده سریع
              </h3>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                سایت با جدیدترین استانداردهای روز ساخته شده تا بدون کندی و با کیفیت بالا روی موبایل، تبلت و لپ‌تاپ نمایش داده شود.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-[#FAF9F6] border border-stone-200/80 hover:border-stone-300 transition-colors">
              <div className="text-xs font-bold text-stone-400 mb-3">03</div>
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                اتصال رایگان به GitHub و دامنه ir
              </h3>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                خروجی سایت را بدون هزینه هاست روی GitHub Pages قرار می‌دهیم و دامنه ایرانی ثبت‌شده در ایرنیک را به آن متصل می‌کنیم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE SECTION */}
      <section id="showcase" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-right">
            <div>
              <span className="text-xs font-medium text-stone-500">گالری و نمونه استایل</span>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-950 mt-1">
                جایگاه تصاویر و کاتالوگ شما
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg self-start md:self-auto">
              <button
                onClick={() => setSelectedPreview('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedPreview === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                نمای کلی
              </button>
              <button
                onClick={() => setSelectedPreview('branding')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedPreview === 'branding' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                کاتالوگ و عکس‌ها
              </button>
              <button
                onClick={() => setSelectedPreview('digital')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedPreview === 'digital' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                شیت‌ها و توضیحات
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 md:p-8 border border-stone-200/80 shadow-sm">
            <div className="md:col-span-6 overflow-hidden rounded-xl bg-stone-100 border border-stone-200/80">
              <img
                src={showcaseImg}
                alt="نمونه کارت و موکاپ محصولات"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] object-cover hover:scale-102 transition-transform duration-500 cursor-pointer"
                onClick={() => setModalOpen(true)}
              />
            </div>

            <div className="md:col-span-6 space-y-4 text-right">
              <div className="text-xs font-medium text-stone-500">
                <span>دسته‌بندی نمونه</span>
                <span className="mx-2">·</span>
                <span>فرمت استاندارد وب</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-stone-900">
                ترکیب تصاویر کالا یا پروژه در محیطی چشم‌نواز
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                عکس‌هایی که در اختیار دارید (محصولات، خدمات، نمونه‌کارها یا تصاویر شخصی) را با وضوح بالا، لود سریع و افکت‌های ملایم به نمایش می‌گذاریم تا مخاطب بهترین تجربه دیداری را داشته باشد.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  بزرگ‌نمایی تصویر نمونه
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section id="process" className="py-16 md:py-20 bg-stone-100/70 border-t border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-right max-w-xl mb-12">
            <span className="text-xs font-medium text-stone-500">مراحل ۳ گانه</span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-950 mt-1">
              چگونه سایت شما نهایی می‌شود؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-stone-200/80 text-right">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-bold flex items-center justify-center text-xs mb-4">
                ۱
              </div>
              <h4 className="font-bold text-stone-900 mb-2">ارسال فایل‌ها و شیت‌ها</h4>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                عکس‌ها، متون و ستون‌های شیت را همینجا در چت ارسال می‌کنید.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200/80 text-right">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-bold flex items-center justify-center text-xs mb-4">
                ۲
              </div>
              <h4 className="font-bold text-stone-900 mb-2">طراحی و تست زنده</h4>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                سایت به‌صورت آنی ساخته شده و روی همین آدرس تست آنلاین آن را بررسی می‌کنید.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200/80 text-right">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-bold flex items-center justify-center text-xs mb-4">
                ۳
              </div>
              <h4 className="font-bold text-stone-900 mb-2">راه‌اندازی روی GitHub و ir</h4>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                فایل‌ها را به مخزن گیت‌هاب منتقل کرده و دامنه ملی شما را متصل می‌کنیم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE CONTACT / TEST FORM */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-stone-200/80 shadow-sm text-right">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                فرم تست تعاملی
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-950">
                فرم آزمایشی ارسال اطلاعات یا پیام
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                این فرم را تست کنید تا ببینید سیستم تعاملی سایت چگونه بدون رفرش کار می‌کند.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  اطلاعات تست شما با موفقیت ثبت شد!
                </div>
                <p className="text-xs md:text-sm text-emerald-800 leading-relaxed">
                  نام: <span className="font-semibold">{formData.name}</span> | راه ارتباطی: <span className="font-semibold">{formData.contact}</span>
                </p>
                <p className="text-xs text-emerald-700">
                  پیام شما دریافت شد. در پروژه واقعی، این اطلاعات می‌تواند به ایمیل، تلگرام یا پایگاه داده شما فرستاده شود.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', contact: '', notes: '' });
                    }}
                    className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors cursor-pointer"
                  >
                    ارسال مجدد یا تست دیگر
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    نام یا نام کسب‌وکار شما *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: علی رضایی یا فروشگاه نمونه"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    شماره تماس یا ایمیل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="0912... یا ایمیل شما"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    توضیحات کوتاه یا موضوع شیت‌ها
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="در مورد عکس‌ها یا اطلاعاتی که دارید بنویسید..."
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>ثبت اطلاعات آزمایشی</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. QUIET FOOTER */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            استودیو وب
          </div>
          <div className="flex items-center gap-6">
            <span>طراحی اختصاصی و ساده</span>
            <span>·</span>
            <span>سازگار با GitHub Pages</span>
            <span>·</span>
            <span>پشتیبانی از دامنه‌های ir</span>
          </div>
          <div>
            © ۲۰۲۶ کلیه حقوق محفوظ است
          </div>
        </div>
      </footer>

      {/* MODAL FOR IMAGE PREVIEW */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 p-2 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={showcaseImg}
              alt="نمایش تصویر کامل"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[75vh] object-contain bg-stone-100"
            />
            <div className="p-4 bg-white text-right">
              <h4 className="font-bold text-stone-900 text-sm">نمونه نمایش پاپ‌آپ تصاویر</h4>
              <p className="text-xs text-stone-500 mt-0.5">کاربر می‌تواند با کلیک روی هر تصویر جزئیات بیشتری را مشاهده کند.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
