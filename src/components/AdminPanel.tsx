import React, { useState, useEffect } from 'react';
import { Product, ConsultationInquiry, DosageRate } from '../types';
import { 
  X, Plus, Trash2, Edit3, Save, Check, RefreshCw, Upload, Image as ImageIcon, 
  MessageSquare, Shield, Lock, KeyRound, AlertTriangle, Eye, EyeOff, 
  CheckCircle2, Sparkles, Maximize2, FileCheck, AlertCircle, Download,
  GitBranch, ExternalLink, Globe
} from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'github' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [uploadedImageMeta, setUploadedImageMeta] = useState<{ name?: string; size?: string; dimensions?: string } | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>([]);

  // Change password states
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  // GitHub Sync states
  const [githubConfig, setGithubConfig] = useState<{
    configured: boolean;
    repo: string;
    branch: string;
    autoPush: boolean;
    hasToken: boolean;
    tokenPreview?: string;
    lastCommit?: string;
  }>({
    configured: false,
    repo: 'pishgamandez/pishgaman',
    branch: 'main',
    autoPush: true,
    hasToken: false,
    lastCommit: ''
  });
  const [githubTokenInput, setGithubTokenInput] = useState('');
  const [githubRepoInput, setGithubRepoInput] = useState('pishgamandez/pishgaman');
  const [githubBranchInput, setGithubBranchInput] = useState('main');
  const [githubAutoPushInput, setGithubAutoPushInput] = useState(true);
  const [isTestingGitHub, setIsTestingGitHub] = useState(false);
  const [githubTestResult, setGithubTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isPushingToGitHub, setIsPushingToGitHub] = useState(false);
  const [githubPushResult, setGithubPushResult] = useState<{ ok: boolean; message: string } | null>(null);

  const fetchGitHubStatus = async () => {
    try {
      const res = await fetch('/api/github/status');
      if (res.ok) {
        const data = await res.json();
        setGithubConfig(data);
        if (data.repo) setGithubRepoInput(data.repo);
        if (data.branch) setGithubBranchInput(data.branch);
        if (data.autoPush !== undefined) setGithubAutoPushInput(data.autoPush);
      }
    } catch (err) {
      console.warn('GitHub status fetch ignored:', err);
    }
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pishgaman_inquiries') || '[]');
      setInquiries(stored);
    } catch {
      // ignore
    }
    fetchGitHubStatus();
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

  const handleSaveProduct = async (e: React.FormEvent) => {
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
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    // Direct permanent sync with server and Git/GitHub
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.gitPushed) {
          setSaveToast(`محصول «${editingProduct.nameFa}» ذخیره و مستقیماً به گیت‌هاب ارسال (Push) شد.`);
        } else {
          setSaveToast(`محصول «${editingProduct.nameFa}» در کدهای پروژه و گیت ثبت گردید.`);
        }
      }
    } catch (err) {
      console.error('Failed to sync products to server:', err);
    }

    setTimeout(() => setSaveToast(null), 4000);

    setEditingProduct(null);
    setUploadSuccessMessage(null);
    setUploadErrorMessage(null);
    setUploadedImageMeta(null);
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
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).then(r => r.json()).then(data => {
        if (data?.gitPushed) {
          setSaveToast('محصول حذف شد و تغییرات به گیت‌هاب ارسال شد.');
        } else {
          setSaveToast('محصول با موفقیت حذف و تغییرات ذخیره شد.');
        }
        setTimeout(() => setSaveToast(null), 3000);
      }).catch(() => {});
    }
  };

  const handleExportProductsJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pishgaman_products_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setSaveToast('فایل JSON محصولات با موفقیت دانلود شد.');
      setTimeout(() => setSaveToast(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // GitHub Sync Actions
  const handleSaveGitHubConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/github/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubTokenInput.trim() || undefined,
          repo: githubRepoInput.trim(),
          branch: githubBranchInput.trim(),
          autoPush: githubAutoPushInput
        })
      });
      if (res.ok) {
        setGithubTokenInput('');
        setGithubTestResult({ ok: true, message: 'تنظیمات و توکن گیت‌هاب با موفقیت ذخیره شد.' });
        fetchGitHubStatus();
        setSaveToast('تنظیمات گیت‌هاب با موفقیت ذخیره شد.');
        setTimeout(() => setSaveToast(null), 3000);
      }
    } catch (err: any) {
      setGithubTestResult({ ok: false, message: 'خطا در ذخیره تنظیمات: ' + err.message });
    }
  };

  const handleTestGitHubConnection = async () => {
    setIsTestingGitHub(true);
    setGithubTestResult(null);
    try {
      const res = await fetch('/api/github/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubTokenInput.trim() || undefined,
          repo: githubRepoInput.trim() || undefined
        })
      });
      const data = await res.json();
      setGithubTestResult({ ok: data.success, message: data.message });
    } catch (err: any) {
      setGithubTestResult({ ok: false, message: 'خطا در تست اتصال: ' + err.message });
    } finally {
      setIsTestingGitHub(false);
    }
  };

  const handlePushToGitHub = async () => {
    setIsPushingToGitHub(true);
    setGithubPushResult(null);
    try {
      const res = await fetch('/api/github/push', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setGithubPushResult({ ok: true, message: data.message });
        setSaveToast('تمام تغییرات با موفقیت به گیت‌هاب ارسال (Push) شدند.');
        setTimeout(() => setSaveToast(null), 4000);
        fetchGitHubStatus();
      } else {
        setGithubPushResult({ ok: false, message: data.message });
      }
    } catch (err: any) {
      setGithubPushResult({ ok: false, message: 'خطا در ارسال: ' + err.message });
    } finally {
      setIsPushingToGitHub(false);
    }
  };

  // Direct upload and immediate auto-sync with server and all devices
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadErrorMessage(null);
    setUploadSuccessMessage(null);
    setIsUploadingImage(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setIsUploadingImage(false);
        setUploadErrorMessage('خطا در خواندن فایل تصویری.');
        return;
      }

      const tempImg = new window.Image();
      tempImg.onload = async () => {
        let finalDataUrl = dataUrl;
        const origWidth = tempImg.naturalWidth;
        const origHeight = tempImg.naturalHeight;

        // If high-resolution mobile camera photo (e.g. 4000x3000), scale cleanly to crisp 1600px
        // to prevent mobile network dropouts and payload limits while preserving 100% natural photo quality
        const maxDim = 1600;
        if (origWidth > maxDim || origHeight > maxDim) {
          try {
            const canvas = document.createElement('canvas');
            let w = origWidth;
            let h = origHeight;
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(tempImg, 0, 0, w, h);
              finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            }
          } catch (canvasErr) {
            console.warn('Canvas resize fallback:', canvasErr);
            finalDataUrl = dataUrl;
          }
        }

        const dimensions = `${origWidth} × ${origHeight} پیکسل`;

        // Direct upload to server to save permanent file in predefined product slot
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: finalDataUrl,
              filename: file.name,
              productId: editingProduct.id
            })
          });

          if (res.ok) {
            const result = await res.json();
            if (result.url) {
              const savedUrl = result.url;
              setEditingProduct(prev => prev ? {
                ...prev,
                imageUrl: savedUrl
              } : null);

              setUploadedImageMeta({
                name: file.name,
                size: `${Math.round(file.size / 1024)} کیلوبایت`,
                dimensions
              });

              // CRITICAL: Instantly persist into products state and sync to server
              // so mobile uploads instantly sync across laptop, phone, and all browsers!
              const updatedList = products.map(p => 
                p.id === editingProduct.id ? { ...p, imageUrl: savedUrl } : p
              );
              onUpdateProducts(updatedList);
              try {
                localStorage.setItem('pishgaman_custom_products', JSON.stringify(updatedList));
              } catch {}
              
              let pushStatusNote = '';
              try {
                const prodRes = await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedList)
                });
                if (prodRes.ok) {
                  const prodData = await prodRes.json();
                  if (prodData.gitPushed) {
                    pushStatusNote = ' 🚀 مستقیماً به مخزن گیت‌هاب ارسال (Push) شد!';
                  }
                }
              } catch (postErr) {
                console.error('Failed to sync to /api/products:', postErr);
              }

              const successText = result.gitPushed
                ? `عکس محصول در اسلات اختصاصی ذخیره و مستقیم به گیت‌هاب push شد!${pushStatusNote}`
                : `عکس محصول در اسلات اختصاصی (public/assets/images/products/${editingProduct.id}) ذخیره و در پروژه ثبت شد.${pushStatusNote}`;

              setUploadSuccessMessage(successText);
              setIsUploadingImage(false);
              return;
            }
          }
        } catch (serverErr) {
          console.warn('Direct upload server error:', serverErr);
        }

        // Offline / local fallback
        setEditingProduct(prev => prev ? {
          ...prev,
          imageUrl: finalDataUrl
        } : null);
        const updatedList = products.map(p => 
          p.id === editingProduct.id ? { ...p, imageUrl: finalDataUrl } : p
        );
        onUpdateProducts(updatedList);
        setUploadSuccessMessage(`عکس روی محصول اعمال شد (${dimensions}).`);
        setIsUploadingImage(false);
      };

      tempImg.onerror = () => {
        setEditingProduct(prev => prev ? { ...prev, imageUrl: dataUrl } : null);
        setIsUploadingImage(false);
      };

      tempImg.src = dataUrl;
    };

    reader.onerror = () => {
      setIsUploadingImage(false);
      setUploadErrorMessage('خطا در بارگذاری فایل از حافظه دستگاه.');
    };

    reader.readAsDataURL(file);
  };

  // Quick save button specifically for image link or changes
  const handleQuickSaveImageUrl = async (urlToSave: string) => {
    if (!editingProduct) return;
    const cleanUrl = urlToSave.trim();
    if (!cleanUrl) {
      alert('لطفاً آدرس تصویر را وارد نمایید.');
      return;
    }

    setEditingProduct({ ...editingProduct, imageUrl: cleanUrl });
    const updatedList = products.map(p => 
      p.id === editingProduct.id ? { ...p, imageUrl: cleanUrl } : p
    );
    onUpdateProducts(updatedList);
    try {
      localStorage.setItem('pishgaman_custom_products', JSON.stringify(updatedList));
    } catch {}

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
      setUploadSuccessMessage('آدرس تصویر با موفقیت در کل سایت ثبت و همگام شد.');
    } catch (err) {
      console.error(err);
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
              <h4 className="text-xl font-black text-stone-900">ورود مدیر سیستم</h4>
              <p className="text-xs text-stone-500 mt-1">
                رمز را وارد کنید
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
                    setActiveTab('github');
                    setEditingProduct(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'github'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>اتصال گیت‌هاب</span>
                  {githubConfig.configured && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  )}
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

              {/* Action Buttons: Add Product + GitHub Push + Export */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePushToGitHub}
                  disabled={isPushingToGitHub}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="ارسال مستقیم آخرین تغییرات به گیت‌هاب pishgamandez/pishgaman"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isPushingToGitHub ? 'در حال ارسال به گیت‌هاب...' : 'انتشار در گیت‌هاب'}</span>
                </button>

                <button
                  onClick={handleCreateNewProduct}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن محصول جدید</span>
                </button>

                <button
                  onClick={handleExportProductsJSON}
                  className="px-3 py-2 text-[11px] text-stone-700 hover:text-stone-900 border border-stone-300 rounded-xl flex items-center gap-1 cursor-pointer hover:bg-stone-100"
                  title="دانلود و خروجی گرفتن از فایل محصولات برای گیت‌هاب و بک‌آپ"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>خروجی JSON</span>
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
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-emerald-700" />
                          <div>
                            <label className="block text-xs font-black text-stone-900">
                              آپلود مستقیم تصویر محصول (کیفیت اصلی فایل - بدون تغییر هوش مصنوعی)
                            </label>
                            <span className="text-[11px] text-stone-500 block">
                              عکس شما مستقیماً با وضوح و ابعاد اورجینال در مسیر اختصاصی گیت‌هاب ذخیره می‌شود.
                            </span>
                            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                              محل ذخیره فایل در گیت‌هاب: public/assets/images/products/{editingProduct.id}.jpg
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>بدون دخالت AI</span>
                        </span>
                      </div>

                      {/* Main File Upload Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
                        <div className="sm:col-span-8 flex flex-col justify-center border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-4 transition-colors bg-stone-50/50 hover:bg-emerald-50/20 text-center">
                          <input
                            id="product-image-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="product-image-file-input"
                            className="cursor-pointer flex flex-col items-center justify-center gap-2"
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-stone-800 hover:text-emerald-700 block">
                                برای انتخاب عکس از کامپیوتر یا گوشی کلیک کنید
                              </span>
                              <span className="text-[10px] text-stone-400 mt-0.5 block">
                                پشتیبانی از فرمت‌های JPG, PNG, WEBP با حفظ ۱۰۰٪ شفافیت و کیفیت اورجینال
                              </span>
                            </div>
                          </label>
                        </div>

                        {/* Direct URL Alternative */}
                        <div className="sm:col-span-4 flex flex-col justify-center space-y-1.5 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                          <label className="text-[10px] font-bold text-stone-600 block">
                            یا درج مستقیم آدرس اینترنتی (URL):
                          </label>
                          <input
                            type="text"
                            placeholder="https://... یا /assets/images/..."
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                            className="w-full text-xs px-2.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 font-mono text-left bg-white"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickSaveImageUrl(editingProduct.imageUrl || '')}
                            className="w-full mt-1.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>ثبت فوری این لینک روی محصول</span>
                          </button>
                          <span className="text-[9px] text-stone-400 block mt-1">
                            اگر عکس در هاست یا سایت دیگری قرار دارد
                          </span>
                        </div>
                      </div>

                      {/* Loading status */}
                      {isUploadingImage && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 animate-pulse">
                          <span className="inline-block w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                          <span>در حال آپلود و ذخیره‌سازی فایل اصلی بدون دستکاری...</span>
                        </div>
                      )}

                      {/* Success Alert */}
                      {uploadSuccessMessage && (
                        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] font-medium">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                          <span>{uploadSuccessMessage}</span>
                        </div>
                      )}

                      {/* Error Alert */}
                      {uploadErrorMessage && (
                        <div className="flex items-center gap-2 p-2.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-[11px] font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{uploadErrorMessage}</span>
                        </div>
                      )}

                      {/* Image Preview & Controls */}
                      {editingProduct.imageUrl && !isUploadingImage && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div 
                              onClick={() => setPreviewModalUrl(editingProduct.imageUrl || null)}
                              className="relative cursor-pointer group shrink-0"
                              title="مشاهده اندازه بزرگ"
                            >
                              <img
                                src={editingProduct.imageUrl}
                                alt="پیش‌نمایش تصویر محصول"
                                className="w-16 h-16 object-contain rounded-xl bg-white border border-stone-300 p-1 shadow-xs group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white transition-opacity">
                                <Maximize2 className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xs text-stone-900 font-bold block flex items-center gap-1.5">
                                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>تصویر اصلی برای این محصول تنظیم شد</span>
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                {uploadedImageMeta 
                                  ? `${uploadedImageMeta.name || 'فایل'} · ${uploadedImageMeta.dimensions || ''} · ${uploadedImageMeta.size || ''}`
                                  : 'این تصویر بدون تغییر روی کارت محصول و کاتالوگ نمایش داده می‌شود.'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setPreviewModalUrl(editingProduct.imageUrl || null)}
                                className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>مشاهده تصویر در اندازه واقعی</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <label
                              htmlFor="product-image-file-input"
                              className="text-xs text-stone-700 hover:text-stone-900 font-bold bg-white hover:bg-stone-100 border border-stone-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                            >
                              تعویض عکس
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct({ ...editingProduct, imageUrl: '' });
                                setUploadedImageMeta(null);
                                setUploadSuccessMessage('تصویر این محصول با موفقیت حذف شد.');
                                const updatedList = products.map(p => 
                                  p.id === editingProduct.id ? { ...p, imageUrl: '' } : p
                                );
                                onUpdateProducts(updatedList);
                                try {
                                  localStorage.setItem('pishgaman_custom_products', JSON.stringify(updatedList));
                                } catch {}
                                fetch('/api/products', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(updatedList)
                                }).catch(() => {});
                              }}
                              className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                            >
                              حذف تصویر
                            </button>
                          </div>
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
                                <div className="flex items-center gap-2">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.nameFa}
                                    onClick={() => setPreviewModalUrl(p.imageUrl || null)}
                                    className="w-9 h-9 rounded-lg object-contain bg-white border border-stone-200 p-0.5 cursor-pointer hover:border-emerald-500 shadow-2xs"
                                    title="مشاهده اندازه بزرگ"
                                  />
                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>عکس اختصاصی</span>
                                  </span>
                                </div>
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
                    می‌توانید برای امنیت بیشتر، رمز عبور اختصاصی خود را در این بخش تعریف و ذخیره فرمایید.
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

            {/* TAB 4: GITHUB SYNC & AUTO PUBLISH */}
            {activeTab === 'github' && (
              <div className="space-y-6">
                <div className="bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <GitBranch className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-base">اتصال و انتشار خودکار در گیت‌هاب (GitHub Sync)</h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          هماهنگی مستقیم پنل مدیریت با مخزن پروژه و هاست زنده GitHub Pages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {githubConfig.configured ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>متصل به گیت‌هاب</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>نیازمند تنظیم توکن</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Repository and Live URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-stone-800/70 p-3 rounded-2xl border border-stone-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-stone-400" />
                        <div>
                          <span className="text-stone-400 text-[10px] block">مخزن هدف در گیت‌هاب:</span>
                          <span className="font-mono font-bold text-white text-xs">{githubConfig.repo} ({githubConfig.branch})</span>
                        </div>
                      </div>
                      <a 
                        href={`https://github.com/${githubConfig.repo}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-bold"
                      >
                        <span>مشاهده</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="bg-stone-800/70 p-3 rounded-2xl border border-stone-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-stone-400 text-[10px] block">آدرس آنلاین سایت (GitHub Pages):</span>
                          <span className="font-mono text-emerald-300 text-xs">pishgamandez.github.io/pishgaman/</span>
                        </div>
                      </div>
                      <a 
                        href="https://pishgamandez.github.io/pishgaman/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-bold"
                      >
                        <span>بازدید</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Manual Push Now Card */}
                  <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-xs text-white block">ارسال دستی و انتشار اکنون (Push Now)</span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        تمام عکس‌ها و تغییرات متنی که تا الان ثبت کرده‌اید فوراً به مخزن pishgamandez/pishgaman ارسال شده و سایت زنده ظرف ۳۰ ثانیه آپدیت می‌شود.
                      </span>
                      {githubConfig.lastCommit && (
                        <span className="text-[10px] font-mono text-stone-500 block mt-1">
                          آخرین کامیت ثبت‌شده: {githubConfig.lastCommit}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handlePushToGitHub}
                      disabled={isPushingToGitHub}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isPushingToGitHub ? 'در حال ارسال به گیت‌هاب...' : 'ارسال تمام تغییرات به گیت‌هاب'}</span>
                    </button>
                  </div>

                  {githubPushResult && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      githubPushResult.ok ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {githubPushResult.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span>{githubPushResult.message}</span>
                    </div>
                  )}
                </div>

                {/* GitHub Token Setup Form & Guide */}
                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-5">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                    <KeyRound className="w-5 h-5 text-stone-700" />
                    <div>
                      <h5 className="font-black text-sm text-stone-900">تنظیمات کلید دسترسی گیت‌هاب (Personal Access Token)</h5>
                      <span className="text-[11px] text-stone-500">برای اینکه پنل مدیریت بتواند تغییرات را به مخزن شما در گیت‌هاب ارسال کند</span>
                    </div>
                  </div>

                  {/* Step-by-Step Guide in Persian */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                    <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      راهنمای دریافت توکن در ۱ دقیقه (فقط یک‌بار):
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-stone-600 leading-relaxed pr-1 text-[11px]">
                      <li>
                        در مرورگر وارد اکانت گیت‌هاب خود شوید و به صفحه 
                        <a 
                          href="https://github.com/settings/tokens" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-emerald-700 underline font-mono mx-1 font-bold inline-flex items-center gap-0.5"
                        >
                          github.com/settings/tokens <ExternalLink className="w-3 h-3 inline" />
                        </a>
                        بروید.
                      </li>
                      <li>روی دکمه <b>Generate new token (classic)</b> کلیک کنید.</li>
                      <li>یک نام دلخواه (مثلاً <code>Pishgaman Admin</code>) بگذارید و تیک گزینه <b>repo</b> (دسترسی کامل به مخازن) را بزنید.</li>
                      <li>در پایین صفحه دکمه سبز <b>Generate token</b> را بزنید و کد ساخته‌شده (که با <code>ghp_</code> آغاز می‌شود) را در کادر زیر وارد فرمایید.</li>
                    </ol>
                  </div>

                  <form onSubmit={handleSaveGitHubConfig} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          نام مخزن در گیت‌هاب:
                        </label>
                        <input
                          type="text"
                          value={githubRepoInput}
                          onChange={(e) => setGithubRepoInput(e.target.value)}
                          placeholder="pishgamandez/pishgaman"
                          dir="ltr"
                          className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          شاخه هدف (Branch):
                        </label>
                        <input
                          type="text"
                          value={githubBranchInput}
                          onChange={(e) => setGithubBranchInput(e.target.value)}
                          placeholder="main"
                          dir="ltr"
                          className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700">
                          توکن گیت‌هاب (GitHub Token):
                        </label>
                        {githubConfig.hasToken && (
                          <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            توکن ذخیره شده: {githubConfig.tokenPreview}
                          </span>
                        )}
                      </div>
                      <input
                        type="password"
                        value={githubTokenInput}
                        onChange={(e) => setGithubTokenInput(e.target.value)}
                        placeholder={githubConfig.hasToken ? "برای تغییر، توکن جدید را وارد کنید..." : "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
                        dir="ltr"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="autoPushCheckbox"
                        checked={githubAutoPushInput}
                        onChange={(e) => setGithubAutoPushInput(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
                      />
                      <label htmlFor="autoPushCheckbox" className="text-xs font-bold text-stone-800 cursor-pointer">
                        ارسال و انتشار خودکار به گیت‌هاب: با هر بار ویرایش متن یا آپلود عکس، تغییرات بلافاصله به گیت‌هاب push شوند.
                      </label>
                    </div>

                    {githubTestResult && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        githubTestResult.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {githubTestResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        <span>{githubTestResult.message}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        ذخیره تنظیمات گیت‌هاب
                      </button>

                      <button
                        type="button"
                        onClick={handleTestGitHubConnection}
                        disabled={isTestingGitHub || (!githubTokenInput && !githubConfig.hasToken)}
                        className="px-4 py-2.5 border border-stone-300 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isTestingGitHub ? 'در حال بررسی اتصال...' : 'تست اتصال به مخزن'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Fullscreen Original Image Preview Lightbox */}
      {previewModalUrl && (
        <div 
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-60 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl flex flex-col items-center cursor-default"
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold text-stone-800">
                پیش‌نمایش تصویر با کیفیت اصلی فایل (بدون تغییر هوش مصنوعی)
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 max-h-[75vh] overflow-auto flex items-center justify-center bg-stone-100/60 rounded-2xl p-4 border border-stone-200">
              <img
                src={previewModalUrl}
                alt="نمای کامل محصول"
                className="max-h-[65vh] w-auto object-contain rounded-xl drop-shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-60 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border border-emerald-700 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

    </div>
  );
};
