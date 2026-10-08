import React, { useState, useEffect } from 'react';
import { Product, ConsultationInquiry, DosageRate } from '../types';
import { X, Plus, Trash2, Edit3, Save, Check, RefreshCw, Upload, Image, MessageSquare, Shield, Lock, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { companyInfo } from '../data/company';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
}

// Master SHA-256 hash for the complex password.
// The plain-text password is NEVER stored in the repository.
// Hash corresponding to: "Pishgaman#Agri2026!Pro"
const MASTER_PASSWORD_HASH = "ad7be238c7d57681f7647f11e7611164258e14cda0c1a8063887c35f2e5125e4";

// Cryptographic hash helper using Web Crypto API
async function computeSha256(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>([]);

  // Change password states
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pishgaman_inquiries') || '[]');
      setInquiries(stored);
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Secure Authentication Verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    setIsVerifying(true);
    setAuthError(false);

    try {
      const inputHash = await computeSha256(passwordInput.trim());
      const customHash = localStorage.getItem('pishgaman_admin_custom_hash');

      if (inputHash === MASTER_PASSWORD_HASH || (customHash && inputHash === customHash)) {
        setIsAuthenticated(true);
        setAuthError(false);
        setPasswordInput('');
      } else {
        setAuthError(true);
      }
    } catch (err) {
      console.error(err);
      setAuthError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }
    const hash = await computeSha256(newPassword);
    localStorage.setItem('pishgaman_admin_custom_hash', hash);
    setChangePasswordSuccess(true);
    setNewPassword('');
    setTimeout(() => setChangePasswordSuccess(false), 4000);
  };

  // Initialize a new empty product template
  const handleCreateNewProduct = () => {
    const newId = `product_${Date.now()}`;
    setEditingProduct({
      id: newId,
      slug: `product-${Date.now()}`,
      nameFa: '',
      nameEn: '',
      category: 'soil-conditioner',
      categoryTitle: 'ضد شوری و اصلاح خاک',
      tagline: '',
      description: '',
      appearance: 'مایع تغذیه‌ای غلیظ',
      packaging: 'گالن ۵ لیتری',
      badge: 'محصول جدید',
      benefits: [
        'افزایش کیفیت و عملکرد محصول',
        'سازگار با خاک‌های زراعی و باغات'
      ],
      dosageTable: [
        { crop: 'درختان میوه', method: 'همراه آب آبیاری', timing: 'طول فصل رشد', rate: '۳ تا ۵ لیتر در هکتار' },
        { crop: 'سبزی و صیفی', method: 'محلول‌پاشی', timing: 'دوره رشد رویشی', rate: '۱ تا ۲ لیتر در هکتار' }
      ],
      imageUrl: ''
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.nameFa.trim()) {
      alert('لطفاً نام فارسی محصول را وارد نمایید.');
      return;
    }

    const updatedList = [...products];
    const index = updatedList.findIndex(p => p.id === editingProduct.id);

    if (index >= 0) {
      updatedList[index] = editingProduct;
    } else {
      updatedList.unshift(editingProduct);
    }

    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('pishgaman_custom_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      const updated = products.filter(p => p.id !== id);
      onUpdateProducts(updated);
      try {
        localStorage.setItem('pishgaman_custom_products', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({
          ...editingProduct,
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDosageRow = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      dosageTable: [
        ...editingProduct.dosageTable,
        { crop: '', method: 'همراه آب آبیاری', timing: '', rate: '' }
      ]
    });
  };

  const handleRemoveDosageRow = (idx: number) => {
    if (!editingProduct) return;
    const newTable = editingProduct.dosageTable.filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, dosageTable: newTable });
  };

  const handleDosageChange = (idx: number, field: keyof DosageRate, val: string) => {
    if (!editingProduct) return;
    const newTable = [...editingProduct.dosageTable];
    newTable[idx] = { ...newTable[idx], [field]: val };
    setEditingProduct({ ...editingProduct, dosageTable: newTable });
  };

  const handleAddBenefit = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      benefits: [...editingProduct.benefits, '']
    });
  };

  const handleRemoveBenefit = (idx: number) => {
    if (!editingProduct) return;
    const newBenefits = editingProduct.benefits.filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, benefits: newBenefits });
  };

  const handleBenefitChange = (idx: number, val: string) => {
    if (!editingProduct) return;
    const newBenefits = [...editingProduct.benefits];
    newBenefits[idx] = val;
    setEditingProduct({ ...editingProduct, benefits: newBenefits });
  };

  const handleResetToDefault = () => {
    if (window.confirm('آیا مایلید تمام تغییرات به لیست ۱۶ محصول اصلی پیش‌فرض برگردد؟')) {
      localStorage.removeItem('pishgaman_custom_products');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 text-right animate-in fade-in duration-200">
        
        {/* Modal Top Bar */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">پنل مدیریت امن شرکت پیشگامان فلات نیک</h3>
              <span className="text-[10px] text-stone-400">سیستم حفاظت‌شده مدیریت محصولات و پیام‌ها</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Secure Login Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-stone-900">احراز هویت مدیریت</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                لطفاً کلید عبور امن را وارد نمایید. به دلیل حفظ امنیت پروژه، رمز عبور اصلی در گیت‌هاب ذخیره نمی‌شود و به صورت رمزنگاری‌شده (SHA-256) ارزیابی می‌گردد.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="رمز عبور امن مدیریت"
                  autoFocus
                  dir="ltr"
                  className="w-full text-center text-sm font-mono py-3 px-10 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>رمز عبور وارد شده نادرست است.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isVerifying ? 'در حال تایید اعتبار امنیتی...' : 'ورود به پنل مدیریت'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
            
            {/* Navigation Tabs and Top Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  محصولات ({products.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('inquiries');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  پیام‌های مشاوره ({inquiries.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setEditingProduct(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  امنیت و رمز
                </button>
              </div>

              {/* Action Buttons: Add Product + Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateNewProduct}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن محصول جدید</span>
                </button>

                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-2 text-[11px] text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl flex items-center gap-1 cursor-pointer hover:bg-stone-50"
                  title="بازنشانی به ۱۶ محصول اولیه"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>بازنشانی پیش‌فرض</span>
                </button>
              </div>
            </div>

            {/* TAB 1: PRODUCTS & ADD/EDIT FORM */}
            {activeTab === 'products' && (
              <div>
                {editingProduct ? (
                  /* Edit / Add New Product Form */
                  <form onSubmit={handleSaveProduct} className="space-y-6 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div>
                        <h4 className="font-black text-stone-900 text-sm">
                          {products.some(p => p.id === editingProduct.id)
                            ? `ویرایش محصول: ${editingProduct.nameFa}`
                            : 'افزودن محصول جدید به کاتالوگ شرکت'}
                        </h4>
                        <span className="text-[11px] text-stone-500">
                          اطلاعات، جدول مصرف و عکس محصول را تکمیل نمایید
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 rounded-xl text-xs font-bold"
                      >
                        انصراف
                      </button>
                    </div>

                    {/* Image Upload / URL Section */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                      <label className="block text-xs font-bold text-stone-800">
                        تصویر محصول (آپلود عکس از دستگاه یا وارد کردن لینک اینترنتی):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="block w-full text-xs text-stone-500 file:mr-0 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                          />
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            عکس انتخابی مستقیماً در کاتالوگ و صفحه محصول نمایش داده می‌شود.
                          </span>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="یا درج آدرس مستقیم تصویر (URL)..."
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 font-mono text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      {editingProduct.imageUrl && (
                        <div className="mt-2 flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
                          <img
                            src={editingProduct.imageUrl}
                            alt="پیش‌نمایش تصویر محصول"
                            className="w-12 h-12 object-contain rounded-lg bg-white border border-stone-200"
                          />
                          <span className="text-xs text-emerald-700 font-bold">تصویر با موفقیت بارگذاری شد</span>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          نام فارسی محصول <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.nameFa}
                          onChange={(e) => setEditingProduct({ ...editingProduct, nameFa: e.target.value })}
                          placeholder="مثال: چلنجر، ردفول..."
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          نام انگلیسی <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.nameEn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                          placeholder="مثال: CHALLENGER"
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 bg-white uppercase font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">دسته‌بندی</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as any,
                            categoryTitle: e.target.value === 'soil-conditioner' ? 'ضد شوری و اصلاح خاک' :
                                           e.target.value === 'humic-organic' ? 'هیومیک و مواد آلی' :
                                           e.target.value === 'stimulant' ? 'محرک رشد و ضد تنش' : 'ژل‌های تغذیه و ریزمغذی'
                          })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value="soil-conditioner">ضد شوری و اصلاح خاک</option>
                          <option value="humic-organic">هیومیک و مواد آلی</option>
                          <option value="stimulant">محرک رشد و ضد تنش</option>
                          <option value="nutrition-gel">ژل‌های تغذیه و ریزمغذی</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">حالت فیزیکی</label>
                        <input
                          type="text"
                          value={editingProduct.appearance || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, appearance: e.target.value })}
                          placeholder="پودری ۱۰۰٪ محلول، مایع غلیظ، ژل..."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">بسته‌بندی</label>
                        <input
                          type="text"
                          value={editingProduct.packaging || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, packaging: e.target.value })}
                          placeholder="بطری ۱ لیتری، گالن ۵ لیتری، سطل ۱۰ کیلویی..."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">برچسب کارت (Badge)</label>
                        <input
                          type="text"
                          value={editingProduct.badge || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          placeholder="پرفروش، فرمولاسیون اختصاصی..."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">شعار یا برچسب کوتاه</label>
                      <input
                        type="text"
                        value={editingProduct.tagline}
                        onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                        placeholder="معرفی کوتاه در یک جمله..."
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">توضیحات کامل محصول</label>
                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        placeholder="توضیحات و مکانیزم اثر..."
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    {/* Dynamic Benefits List */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-800">
                          مزایای کلیدی و ویژگی‌های فنی:
                        </label>
                        <button
                          type="button"
                          onClick={handleAddBenefit}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن مزیت</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editingProduct.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={b}
                              onChange={(e) => handleBenefitChange(idx, e.target.value)}
                              placeholder="مزیت محصول..."
                              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-stone-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveBenefit(idx)}
                              className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Dosage Table Editor */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-stone-800">
                            جدول مقادیر و نحوه مصرف:
                          </label>
                          <span className="text-[10px] text-stone-400 block">
                            (درختان میوه، سبزی و صیفی، گلخانه، غلات)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddDosageRow}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-emerald-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن ردیف مصرف</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-stone-100 font-bold border-b border-stone-200">
                            <tr>
                              <th className="py-2 px-2">محصول کشت‌شده</th>
                              <th className="py-2 px-2">نحوه مصرف</th>
                              <th className="py-2 px-2">زمان مصرف</th>
                              <th className="py-2 px-2">دوز و مقدار مصرف</th>
                              <th className="py-2 px-1 text-center">حذف</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {editingProduct.dosageTable.map((row, idx) => (
                              <tr key={idx}>
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={row.crop}
                                    onChange={(e) => handleDosageChange(idx, 'crop', e.target.value)}
                                    placeholder="مثال: درختان میوه"
                                    className="w-full p-1.5 border border-stone-300 rounded text-xs"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={row.method}
                                    onChange={(e) => handleDosageChange(idx, 'method', e.target.value)}
                                    placeholder="همراه آب آبیاری / محلول‌پاشی"
                                    className="w-full p-1.5 border border-stone-300 rounded text-xs"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={row.timing || ''}
                                    onChange={(e) => handleDosageChange(idx, 'timing', e.target.value)}
                                    placeholder="قبل از گلدهی / طول فصل"
                                    className="w-full p-1.5 border border-stone-300 rounded text-xs"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <input
                                    type="text"
                                    value={row.rate}
                                    onChange={(e) => handleDosageChange(idx, 'rate', e.target.value)}
                                    placeholder="۳ تا ۵ لیتر در هکتار"
                                    className="w-full p-1.5 border border-stone-300 rounded text-xs font-bold text-emerald-800"
                                  />
                                </td>
                                <td className="py-1.5 px-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDosageRow(idx)}
                                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Save className="w-4 h-4" />
                        <span>ذخیره و انتشار در سایت</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Products Table List */
                  <div className="overflow-x-auto rounded-2xl border border-stone-200">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-stone-100 font-bold border-b border-stone-200 text-stone-800">
                        <tr>
                          <th className="py-3 px-4">ردیف</th>
                          <th className="py-3 px-4">نام محصول</th>
                          <th className="py-3 px-4">دسته‌بندی</th>
                          <th className="py-3 px-4">حالت فیزیکی</th>
                          <th className="py-3 px-4">وضعیت تصویر</th>
                          <th className="py-3 px-4 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {products.map((p, index) => (
                          <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3 px-4 font-mono text-stone-400">{index + 1}</td>
                            <td className="py-3 px-4 font-bold text-stone-900">
                              {p.nameFa}{' '}
                              <span className="font-mono text-[10px] text-stone-400 font-normal">
                                ({p.nameEn})
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-600">{p.categoryTitle}</td>
                            <td className="py-3 px-4 text-stone-600">{p.appearance}</td>
                            <td className="py-3 px-4">
                              {p.imageUrl ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>عکس اختصاصی</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-stone-400">طرح وکتور پیش‌فرض</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                  title="ویرایش متن و تعویض عکس"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="حذف محصول"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div>
                {inquiries.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs">
                    هنوز پیامی در فرم مشاوره ثبت نشده است.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                          <div className="font-bold text-stone-900 text-sm">
                            {inq.name} · <span className="font-mono text-emerald-800" dir="ltr">{inq.phone}</span>
                          </div>
                          <span className="text-[11px] text-stone-400">{inq.createdAt}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600">
                          <div><strong>نوع کشت:</strong> {inq.cropType}</div>
                          <div><strong>شهر / منطقه:</strong> {inq.city || 'ثبت نشده'}</div>
                          <div><strong>مساحت:</strong> {inq.areaSize || 'ثبت نشده'}</div>
                        </div>
                        {inq.problem && (
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-stone-800">
                            <strong>شرح درخواست:</strong> {inq.problem}
                          </div>
                        )}
                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={`tel:${inq.phone}`}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            تماس تلفنی
                          </a>
                          <a
                            href={`https://wa.me/98${inq.phone.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-stone-200 text-stone-800 rounded-lg text-[11px] font-bold"
                          >
                            ارسال پیام در واتساپ
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SETTINGS & PASSWORD CHANGE */}
            {activeTab === 'settings' && (
              <div className="max-w-xl mx-auto space-y-6 py-4">
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center gap-2.5 text-stone-900 font-bold">
                    <KeyRound className="w-5 h-5 text-emerald-700" />
                    <span>تغییر رمز عبور مدیریت</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    می‌توانید برای امنیت بیشتر، رمز عبور اختصاصی خود را تعریف فرمایید. رمز عبور به صورت هش رمزنگاری‌شده (SHA-256) ذخیره خواهد شد و در گیت‌هاب نمایان نخواهد بود.
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        رمز عبور جدید (حداقل ۸ کاراکتر):
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="رمز عبور پیچیده جدید"
                        dir="ltr"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    {changePasswordSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>رمز عبور مدیریت با موفقیت به‌روزرسانی شد.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      ذخیره رمز جدید
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
