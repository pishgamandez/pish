import React, { useState, useMemo } from 'react';
import { articlesData, Article } from '../data/articles';
import { BookOpen, Search, Clock, Calendar, User, ArrowLeft, ArrowRight, Share2, Sparkles, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';
import { PishgamanLogo } from './PishgamanLogo';
import researchImg from '../assets/images/agri_research_lab_1791480948724.jpg';

interface Props {
  onBackToHome: () => void;
  onSelectProductByName?: (name: string) => void;
}

export const ArticlesPage: React.FC<Props> = ({ onBackToHome, onSelectProductByName }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const list = Array.from(new Set(articlesData.map(a => a.category)));
    return ['all', ...list];
  }, []);

  const filteredArticles = useMemo(() => {
    return articlesData.filter(art => {
      if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.abstract.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans text-right">
      
      {/* Top Banner with Agricultural Research Photo */}
      <div className="relative bg-gradient-to-l from-stone-900 via-stone-900 to-emerald-950 text-white overflow-hidden py-16 sm:py-20 border-b border-stone-800">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-luminosity"
          style={{ backgroundImage: `url(${researchImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-xs font-bold transition-colors cursor-pointer border border-white/10"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت به صفحه اصلی سایت</span>
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>پایگاه مقالات و پژوهش‌های علمی زراعی</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                مقالات تخصصی و رفرنس‌دار کشاورزی پیشگامان
              </h1>

              <p className="text-sm text-stone-300 font-light leading-relaxed">
                مجموعه پژوهش‌های کاربردی در زمینه فیزیولوژی تغذیه گیاهی، اصلاح شوری و اسیدیته خاک، رفتار کلات‌های آهن و بهبود باروری درختان میوه و صیفی‌جات بر مبنای مراجع معتبر دانشگاهی و فائو (FAO).
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center text-center">
              <PishgamanLogo variant="white" size="lg" />
              <span className="text-xs text-emerald-300 font-bold mt-2">دپارتمان تحقیق و توسعه علمی</span>
              <span className="text-[11px] text-stone-300">شرکت پیشگامان پایدار فلات نیک</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-4 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat === 'all' ? 'همه مقالات' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مقالات (شوری، کلات، هیومیک...)"
              className="w-full bg-stone-100 text-xs py-2 pr-9 pl-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-right"
            />
          </div>

        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white rounded-3xl border border-stone-200 hover:border-emerald-500/60 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group text-right"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-stone-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-black text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                  {art.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="truncate">{art.author}</span>
                  <span className="font-mono">{art.date}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-700">
                  <span>مطالعه متن کامل و رفرنس‌ها</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 animate-in fade-in zoom-in-95 duration-200 text-right">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-stone-500">مقاله علمی و پژوهشی</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto space-y-8">
              
              {/* Meta and Title */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                    {selectedArticle.category}
                  </span>
                  <span>نویسنده: <strong>{selectedArticle.author}</strong></span>
                  <span>·</span>
                  <span>تاریخ انتشار: <strong>{selectedArticle.date}</strong></span>
                  <span>·</span>
                  <span>مدت مطالعه: <strong>{selectedArticle.readTime}</strong></span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Abstract Box */}
              <div className="bg-stone-50 border-r-4 border-emerald-700 p-5 rounded-2xl text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
                <strong className="block text-emerald-900 font-bold text-sm">چکیده پژوهش (Abstract):</strong>
                <p>{selectedArticle.abstract}</p>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {selectedArticle.contentSections.map((sec, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-1.5">
                      {idx + 1}. {sec.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light text-justify">
                      {sec.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Related Products from Pishgaman */}
              {selectedArticle.relatedProducts?.length > 0 && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>محصولات مرتبط شرکت پیشگامان پایدار فلات نیک:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.relatedProducts.map((pName, i) => (
                      <span
                        key={i}
                        className="bg-white border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs"
                      >
                        {pName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Scientific References (APA format) */}
              <div className="bg-stone-100 rounded-2xl p-6 space-y-3 border border-stone-200">
                <h4 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>منابع و مراجع علمی معتبر (References):</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-600 font-mono text-left" dir="ltr">
                  {selectedArticle.references.map((ref, idx) => (
                    <li key={idx} className="p-2 bg-white rounded-lg border border-stone-200/80 leading-relaxed">
                      [{idx + 1}] {ref}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Close Button */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  بستن و بازگشت به لیست مقالات
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
