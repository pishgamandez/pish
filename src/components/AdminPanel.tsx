import React, { useState, useEffect } from 'react';
import { Product, ConsultationInquiry } from '../types';
import { X, Plus, Trash2, Edit3, Save, Check, RefreshCw, Upload, Image, MessageSquare, Shield, Lock } from 'lucide-react';
import { companyInfo } from '../data/company';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'inquiries'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pishgaman_inquiries') || '[]');
      setInquiries(stored);
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Simple PIN protection (default: 1234 or 0912 or 1403)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234' || pinCode === '0912' || pinCode === 'admin' || pinCode === 'pishgaman') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedList = products.map(p =>
      p.id === editingProduct.id ? editingProduct : p
    );

    // If it's a new product not found
    if (!products.some(p => p.id === editingProduct.id)) {
      updatedList.push(editingProduct);
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
              <h3 className="font-bold text-sm">پنل مدیریت شرکت پیشگامان فلات نیک</h3>
              <span className="text-[10px] text-stone-400">مدیریت محصولات، عکس‌ها و پیام‌ها</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900">ورود مدیر سیستم</h4>
              <p className="text-xs text-stone-500 mt-1">
                رمز عبور مدیریت را وارد کنید (رمز پیش‌فرض: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">1234</code> یا <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">0912</code>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="رمز عبور"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-bold">رمز عبور نادرست است.</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                ورود به پنل
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  مدیریت و عکس محصولات ({products.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('inquiries');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  پیام‌های مشاوره ({inquiries.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 text-[11px] text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg flex items-center gap-1 cursor-pointer"
                  title="بازنشانی به ۱۶ محصول اولیه"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>بازنشانی پیش‌فرض</span>
                </button>
              </div>
            </div>

            {/* TAB 1: PRODUCTS */}
            {activeTab === 'products' && (
              <div>
                {editingProduct ? (
                  /* Edit Form */
                  <form onSubmit={handleSaveProduct} className="space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <h4 className="font-bold text-stone-900 text-sm">
                        ویرایش محصول: {editingProduct.nameFa} ({editingProduct.nameEn})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-stone-500 hover:text-stone-800 text-xs"
                      >
                        انصراف
                      </button>
                    </div>

                    {/* Image Upload / URL Section (crucial for user's request) */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                      <label className="block text-xs font-bold text-stone-800">
                        عکس محصول (آپلود فایل از گوشی/کامپیوتر یا وارد کردن لینک):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="block w-full text-xs text-stone-500 file:mr-0 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200"
                          />
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            عکس انتخابی مستقیماً جایگزین تصویر محصول می‌شود.
                          </span>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="یا درج آدرس مستقیم تصویر (URL)..."
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 font-mono text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">نام فارسی</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.nameFa}
                          onChange={(e) => setEditingProduct({ ...editingProduct, nameFa: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">نام انگلیسی</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.nameEn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white uppercase font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">دسته بندی</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as any,
                            categoryTitle: e.target.value === 'soil-conditioner' ? 'ضد شوری و اصلاح خاک' :
                                           e.target.value === 'humic-organic' ? 'هیومیک و مواد آلی' :
                                           e.target.value === 'stimulant' ? 'محرک رشد و ضد تنش' : 'ژل‌های تغذیه و ریزمغذی'
                          })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value="soil-conditioner">ضد شوری و اصلاح خاک</option>
                          <option value="humic-organic">هیومیک و مواد آلی</option>
                          <option value="stimulant">محرک رشد و ضد تنش</option>
                          <option value="nutrition-gel">ژل‌های تغذیه و ریزمغذی</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">شعار یا برچسب کوتاه</label>
                      <input
                        type="text"
                        value={editingProduct.tagline}
                        onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">توضیحات کامل محصول</label>
                      <textarea
                        rows={4}
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>ذخیره تغییرات</span>
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
                          <th className="py-3 px-4">دسته بندی</th>
                          <th className="py-3 px-4">حالت فیزیکی</th>
                          <th className="py-3 px-4">وضعیت تصویر</th>
                          <th className="py-3 px-4 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {products.map((p, index) => (
                          <tr key={p.id} className="hover:bg-stone-50">
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

          </div>
        )}

      </div>
    </div>
  );
};
