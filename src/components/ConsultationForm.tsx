import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, MessageSquare, AlertCircle, FileText } from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  prefilledProduct?: string;
  onSubmitted?: () => void;
}

export const ConsultationForm: React.FC<Props> = ({ prefilledProduct, onSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cropType: 'باغات پسته',
    city: '',
    areaSize: '',
    problem: prefilledProduct ? `درخواست استعلام و خرید محصول ${prefilledProduct}` : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);

    try {
      // Send to server API
      await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {
      // Local fallback
    }

    // Save to local storage for admin panel
    try {
      const existing = JSON.parse(localStorage.getItem('pishgaman_inquiries') || '[]');
      const newInquiry = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toLocaleDateString('fa-IR'),
        status: 'new'
      };
      localStorage.setItem('pishgaman_inquiries', JSON.stringify([newInquiry, ...existing]));
    } catch {
      // ignore storage errors
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    if (onSubmitted) onSubmitted();
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `سلام دکتر راستین رستمی عزیز. اینجانب ${formData.name || 'کشاورز'} هستم از ${formData.city || 'منطقه'}. برای محصول ${formData.cropType || 'زراعی'} درخواست مشاوره در زمینه: ${formData.problem || 'تغذیه گیاهی و خرید کود'} دارم.`
    );
    window.open(`https://wa.me/989128247415?text=${text}`, '_blank');
  };

  return (
    <section id="consult" className="py-20 bg-stone-100 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl text-right">
          
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>مشاوره علمی و نسخه تغذیه گیاهی</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              درخواست مشاوره تخصصی و استعلام قیمت
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              مشخصات مزرعه یا باغ خود را وارد کنید تا کارشناسان ما به سرپرستی {companyInfo.manager} جهت تنظیم نسخه اختصاصی با شما تماس بگیرند.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-black text-emerald-950">
                درخواست شما با موفقیت ثبت شد
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                همکاران ما در اولین فرصت با شماره اعلام‌شده تماس خواهند گرفت. برای پیگیری فوری یا ارسال عکس آزمایش خاک می‌توانید مستقیم به واتساپ دکتر رستمی پیام دهید.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleWhatsAppDirect}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ارسال پیام در واتساپ (۰۹۱۲۸۲۴۷۴۱۵)</span>
                </button>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2.5 bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold"
                >
                  ثبت درخواست جدید
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    نام و نام خانوادگی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: مهندس حسینی"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    شماره تماس همراه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="۰۹۱۲..."
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50 text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    نوع محصول کشت‌شده
                  </label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                  >
                    <option value="باغات پسته">باغات پسته</option>
                    <option value="مرکبات">مرکبات</option>
                    <option value="میوه‌های هسته‌دار و دانه‌دار">میوه‌های هسته‌دار و دانه‌دار</option>
                    <option value="گندم و جو">غلات (گندم و جو)</option>
                    <option value="گوجه و صیفی‌جات">گوجه و صیفی‌جات</option>
                    <option value="چغندر قند">چغندر قند</option>
                    <option value="گلخانه صنعتی">گلخانه صنعتی</option>
                    <option value="سایر">سایر محصولات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    شهر و استان محل مزرعه
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="مثال: رفسنجان، شیراز، قزوین..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    مساحت سطح زیر کشت
                  </label>
                  <input
                    type="text"
                    value={formData.areaSize}
                    onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
                    placeholder="مثال: ۵ هکتار / ۲۰۰۰ متر"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  شرح مشکل یا محصول مورد نیاز
                </label>
                <textarea
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="مثال: شوری آب، زردی برگ‌های جوان در درخت پسته، نیاز به اصلاح کننده و کود آهن ردفول..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'در حال ثبت اطلاعات...' : 'ثبت درخواست مشاوره زراعی'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>یا تماس مستقیم:</span>
                  <a
                    href={companyInfo.callUrl}
                    className="font-mono font-bold text-emerald-800 hover:underline"
                  >
                    {companyInfo.phoneFormatted}
                  </a>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
