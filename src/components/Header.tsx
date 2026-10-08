import React, { useState } from 'react';
import { Phone, Menu, X, ShieldCheck, Leaf, Search, Lock } from 'lucide-react';
import { companyInfo } from '../data/company';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeSection,
  onOpenAdmin,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      {/* Top micro bar for corporate identity */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>برند رسمی: {companyInfo.brand}</span>
            </span>
            <span className="hidden sm:inline text-stone-500">|</span>
            <span className="hidden sm:inline text-stone-400">
              مدیریت: {companyInfo.manager}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-wider text-stone-400 hidden md:inline">
              {companyInfo.sloganEn}
            </span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-stone-800"
              title="ورود به پنل مدیریت شرکت"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>پنل مدیریت</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-emerald-100" />
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl font-black text-stone-900 leading-tight tracking-tight flex items-center gap-1.5">
              <span>پیشگامان فلات نیک</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold tracking-wide flex items-center gap-1">
              <span>پرواز نهاده</span>
              <span className="text-stone-400">·</span>
              <span className="font-mono text-[10px] text-stone-500 uppercase">Pishgaman Agri-Tech</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
          <button
            onClick={() => handleNavClick('hero')}
            className={`transition-colors hover:text-emerald-700 cursor-pointer ${
              activeSection === 'hero' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            صفحه اصلی
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className={`transition-colors hover:text-emerald-700 cursor-pointer ${
              activeSection === 'products' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            کاتالوگ محصولات (۱۶ گانه)
          </button>
          <button
            onClick={() => handleNavClick('soil-guide')}
            className={`transition-colors hover:text-emerald-700 cursor-pointer ${
              activeSection === 'soil-guide' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            راهنمای علمی pH و EC
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors hover:text-emerald-700 cursor-pointer ${
              activeSection === 'about' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            درباره شرکت
          </button>
          <button
            onClick={() => handleNavClick('consult')}
            className={`transition-colors hover:text-emerald-700 cursor-pointer ${
              activeSection === 'consult' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            مشاوره زراعی
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors hover:text-emerald-700 cursor-pointer ${
              activeSection === 'contact' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            تماس با ما
          </button>
        </nav>

        {/* Action Controls & Call Button */}
        <div className="flex items-center gap-3">
          {/* Quick Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-stone-100 rounded-xl px-3 py-1.5 border border-stone-300">
                <Search className="w-4 h-4 text-stone-500 ml-2" />
                <input
                  type="text"
                  placeholder="جستجوی محصول (مانند چلنجر، ردفول...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-stone-800 focus:outline-none w-44 md:w-56"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition-colors"
                title="جستجوی سریع در محصولات"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Direct Phone Call Button */}
          <a
            href={companyInfo.callUrl}
            className="hidden sm:inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Phone className="w-4 h-4 animate-bounce" />
            <div className="text-right">
              <span className="block text-[10px] text-emerald-200 font-normal">مشاوره مستقیم فروش:</span>
              <span className="font-mono text-xs">{companyInfo.phoneFormatted}</span>
            </div>
          </a>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-emerald-700 lg:hidden rounded-lg hover:bg-stone-100"
            aria-label="منوی موبایل"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-6 py-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('hero')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
            >
              کاتالوگ ۱۶ محصول اختصاصی
            </button>
            <button
              onClick={() => handleNavClick('soil-guide')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
            >
              راهنمای کاربردی pH و EC خاک
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
            >
              درباره پیشگامان پایدار فلات نیک
            </button>
            <button
              onClick={() => handleNavClick('consult')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
            >
              درخواست مشاوره و نسخه کودی
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
            >
              اطلاعات تماس و آدرس
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-bold text-amber-800 hover:bg-amber-50"
            >
              ورود به پنل مدیریت
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <a
              href={companyInfo.callUrl}
              className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>تماس با دکتر راستین رستمی: {companyInfo.phoneFormatted}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
