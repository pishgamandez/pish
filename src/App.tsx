import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/products';
import { Product } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductTabs } from './components/ProductTabs';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SoilGuideSection } from './components/SoilGuideSection';
import { AboutSection } from './components/AboutSection';
import { ConsultationForm } from './components/ConsultationForm';
import { AdminPanel } from './components/AdminPanel';
import { FloatingAssistant } from './components/FloatingAssistant';
import { FloatingContactButtons } from './components/FloatingContactButtons';
import { Footer } from './components/Footer';
import { ArticlesPage } from './components/ArticlesPage';
import { ShieldCheck, Award, Zap, Truck, CheckCircle2 } from 'lucide-react';
import { companyInfo } from './data/company';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pishgaman_custom_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialProducts;
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const [consultPrefilledProduct, setConsultPrefilledProduct] = useState<string>('');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'articles') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenConsultForProduct = (productName: string) => {
    setConsultPrefilledProduct(productName);
    handleNavigate('consult');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* 1. Header (Sticky) */}
      <Header
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdmin={() => setAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {activeSection === 'articles' ? (
        /* Dedicated Scientific Articles Tab View (As requested: not on home page) */
        <main className="flex-1">
          <ArticlesPage
            onBackToHome={() => handleNavigate('hero')}
            onSelectProductByName={(name) => {
              const found = products.find(p => p.nameFa.includes(name) || name.includes(p.nameFa));
              if (found) setSelectedProduct(found);
            }}
          />
        </main>
      ) : (
        /* Home Main View */
        <main className="flex-1">
          {/* 2. Hero Section with Real Farm Wheat Field Background */}
          <section id="hero">
            <Hero
              onExploreProducts={() => handleNavigate('products')}
              onOpenConsult={() => handleNavigate('consult')}
            />
          </section>

          {/* Corporate Trust Strip (Bayer-style Quality Standard) */}
          <div className="bg-white border-y border-stone-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">آنالیز کیفی معتبر</h4>
                    <p className="text-[11px] text-stone-500">کنترل پیوسته عناصر و خلوص ۱۰۰٪</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">فرمولاسیون اختصاصی</h4>
                    <p className="text-[11px] text-stone-500">سازگار با اقلیم و خاک‌های شور ایران</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">نظارت علمی مستقیم</h4>
                    <p className="text-[11px] text-stone-500">تیم تخصصی به مدیریت {companyInfo.manager}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">ارسال به سراسر کشور</h4>
                    <p className="text-[11px] text-stone-500">توزیع سریع در تمامی استان‌ها و نمایندگی‌ها</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 16 Products Tabs & Catalog */}
          <ProductTabs
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            searchQuery={searchQuery}
          />

          {/* 4. Soil Guide Section (pH & EC Educational Content) */}
          <SoilGuideSection
            onOpenConsult={() => handleNavigate('consult')}
          />

          {/* 5. About Company & Leadership */}
          <AboutSection />

          {/* 6. Consultation & Soil Diagnosis Request Form */}
          <ConsultationForm
            prefilledProduct={consultPrefilledProduct}
            onSubmitted={() => setConsultPrefilledProduct('')}
          />
        </main>
      )}

      {/* 7. Comprehensive Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenConsult={handleOpenConsultForProduct}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
        onUpdateProducts={(updated) => {
          setProducts(updated);
          if (selectedProduct) {
            const found = updated.find(p => p.id === selectedProduct.id);
            if (found) setSelectedProduct(found);
          }
        }}
      />

      {/* Floating AI Agronomist Assistant */}
      <FloatingAssistant
        isOpen={isAssistantOpen}
        onOpenChange={setIsAssistantOpen}
      />

      {/* Floating Contact Buttons (Phone & WhatsApp) - automatically hidden when chat is open to prevent UI overlap on mobile */}
      {!isAssistantOpen && <FloatingContactButtons />}

    </div>
  );
}
