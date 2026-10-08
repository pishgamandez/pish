import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductPackageIllustration } from './ProductPackageIllustration';
import { ArrowLeft, Check, Sparkles, Filter, Phone, Eye } from 'lucide-react';
import { companyInfo } from '../data/company';

interface ProductTabsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  products,
  onSelectProduct,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedProductId, setSelectedProductId] = useState<string>('all');

  const categories: { id: ProductCategory; label: string; count: number }[] = [
    { id: 'all', label: 'همه محصولات (۱۶)', count: products.length },
    {
      id: 'soil-conditioner',
      label: 'ضد شوری و اصلاح خاک',
      count: products.filter(p => p.category === 'soil-conditioner').length
    },
    {
      id: 'humic-organic',
      label: 'هیومیک و مواد آلی',
      count: products.filter(p => p.category === 'humic-organic').length
    },
    {
      id: 'stimulant',
      label: 'محرک رشد و ضد تنش',
      count: products.filter(p => p.category === 'stimulant').length
    },
    {
      id: 'nutrition-gel',
      label: 'ژل‌های تغذیه و ریزمغذی',
      count: products.filter(p => p.category === 'nutrition-gel').length
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Specific single product tab filter
      if (selectedProductId !== 'all' && product.id !== selectedProductId) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesFa = product.nameFa.toLowerCase().includes(q);
        const matchesEn = product.nameEn.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTag = product.tagline.toLowerCase().includes(q);
        return matchesFa || matchesEn || matchesDesc || matchesTag;
      }
      return true;
    });
  }, [products, selectedCategory, selectedProductId, searchQuery]);

  return (
    <section id="products" className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>سبد جامع ۱۶ محصولی پرواز نهاده</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            کاتالوگ تخصصی محصولات پیشگامان فلات نیک
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
            فرموله‌شده با آخرین تکنولوژی‌های زراعی جهت برطرف‌سازی کمبودهای فیزیولوژیک، شکستن سختی و شوری خاک و تضمین باروری مزارع و باغات.
          </p>
        </div>

        {/* 1. Category Pill Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedProductId('all');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat.id ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* 2. Horizontal 16-Product Quick Tabs (Requested in roadmap 1.2) */}
        <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs mb-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedProductId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedProductId === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              نمایش همه
            </button>
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProductId(p.id);
                  if (selectedCategory !== 'all' && p.category !== selectedCategory) {
                    setSelectedCategory('all');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedProductId === p.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-50 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200/60'
                }`}
              >
                <span className="font-bold">{p.nameFa}</span>
                <span className="font-mono text-[10px] opacity-75 uppercase">{p.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm">هیچ محصولی با معیارهای جستجوی شما یافت نشد.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedProductId('all');
              }}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              نمایش مجدد همه محصولات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group text-right"
              >
                {/* Visual Packaging Illustration */}
                <div className="p-4 pb-0">
                  <ProductPackageIllustration product={product} size="md" />
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Category & Appearance Badge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-bold text-emerald-700">{product.categoryTitle}</span>
                      <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-[10px] text-stone-600">
                        {product.appearance}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-stone-900 group-hover:text-emerald-700 transition-colors pt-1">
                      {product.nameFa}
                      <span className="text-xs font-mono text-stone-400 font-semibold mr-2 uppercase">
                        {product.nameEn}
                      </span>
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Bullet Benefits preview */}
                  <div className="space-y-1.5 border-t border-stone-100 pt-3 text-[11px] text-stone-600">
                    {product.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 leading-snug">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dosage overview chip */}
                  <div className="bg-stone-50 rounded-xl p-2.5 text-[11px] text-stone-600 flex items-center justify-between">
                    <span className="text-stone-500">نحوه مصرف نمونه:</span>
                    <span className="font-bold text-stone-800">
                      {product.dosageTable[0]?.rate || 'در جدول کامل'}
                    </span>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>جدول مصرف و جزئیات</span>
                    </button>

                    <a
                      href={companyInfo.callUrl}
                      className="p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-colors cursor-pointer"
                      title={`خرید و استعلام ${product.nameFa} (09128247415)`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
