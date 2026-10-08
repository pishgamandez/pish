import React from 'react';
import { Product } from '../types';
import { PishgamanLogo } from './PishgamanLogo';

interface Props {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductPackageIllustration: React.FC<Props> = ({ product, className = '', size = 'md' }) => {
  const [imageError, setImageError] = React.useState(false);

  // Reset error state if product image URL changes
  React.useEffect(() => {
    setImageError(false);
  }, [product.imageUrl]);

  const heightClass = size === 'sm' ? 'h-36' : size === 'lg' ? 'h-88' : 'h-56';

  if (product.imageUrl && product.imageUrl.trim() !== '' && !imageError) {
    return (
      <div
        className={`relative w-full ${heightClass} flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-100 to-white border border-stone-200/90 shadow-inner group ${className}`}
      >
        <img
          src={product.imageUrl}
          alt={product.nameFa}
          className="w-full h-full object-contain p-1.5 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-md z-20 bg-emerald-700">
            {product.badge}
          </span>
        )}
      </div>
    );
  }

  // Theme accent colors based on product category
  let badgeColor = '#15803D'; // Emerald
  let capColor = '#0F5132';
  let bodyGrad = 'from-emerald-950 via-emerald-800 to-emerald-900';
  let glowColor = 'rgba(21, 128, 61, 0.25)';

  if (product.id === 'red-full') {
    badgeColor = '#DC2626';
    capColor = '#991B1B';
    bodyGrad = 'from-rose-950 via-red-800 to-rose-900';
    glowColor = 'rgba(220, 38, 38, 0.25)';
  } else if (product.id === 'tiger-k' || product.id === 'doping') {
    badgeColor = '#D97706';
    capColor = '#B45309';
    bodyGrad = 'from-amber-950 via-amber-800 to-amber-900';
    glowColor = 'rgba(217, 119, 6, 0.25)';
  } else if (product.id === 'tiger-p') {
    badgeColor = '#2563EB';
    capColor = '#1D4ED8';
    bodyGrad = 'from-blue-950 via-blue-800 to-blue-900';
    glowColor = 'rgba(37, 99, 235, 0.25)';
  } else if (product.id === 'sulmax') {
    badgeColor = '#CA8A04';
    capColor = '#A16207';
    bodyGrad = 'from-yellow-950 via-yellow-700 to-amber-900';
    glowColor = 'rgba(202, 138, 4, 0.25)';
  } else if (product.id === 'salt-stop') {
    badgeColor = '#0D9488';
    capColor = '#0F766E';
    bodyGrad = 'from-teal-950 via-teal-800 to-teal-900';
    glowColor = 'rgba(13, 148, 136, 0.25)';
  } else if (product.id === 'fiction') {
    badgeColor = '#047857';
    capColor = '#065F46';
    bodyGrad = 'from-emerald-950 via-teal-900 to-emerald-900';
    glowColor = 'rgba(4, 120, 87, 0.25)';
  }

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border border-stone-700/60 shadow-inner group ${className}`}
      style={{
        boxShadow: `0 10px 30px -10px ${glowColor}`
      }}
    >
      {/* Subtle tech background grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* SVG Agri-Tech Canister / Bottle */}
      <div className="relative z-10 flex flex-col items-center drop-shadow-2xl transition-transform duration-300 group-hover:scale-105">
        {/* Cap */}
        <div
          className="w-12 h-4 rounded-t-md shadow-md border-t border-white/30"
          style={{ backgroundColor: capColor }}
        />
        <div className="w-8 h-2 bg-stone-700/80" />

        {/* Canister Body */}
        <div className={`w-28 md:w-32 h-36 md:h-40 rounded-2xl p-2.5 flex flex-col justify-between text-center relative border border-white/20 shadow-2xl bg-gradient-to-b ${bodyGrad}`}>
          {/* Parvaz Nahadeh Top Logo Badge */}
          <div className="flex items-center justify-between border-b border-white/20 pb-1">
            <PishgamanLogo variant="icon" size="sm" />
            <span className="text-[7px] font-bold px-1 py-0.2 rounded text-white bg-white/20">پرواز نهاده</span>
          </div>

          {/* Product Center Brand Plate */}
          <div className="my-auto py-1">
            <div className="text-white font-extrabold text-sm md:text-base tracking-tight leading-tight">
              {product.nameFa}
            </div>
            <div className="text-[9px] font-mono tracking-widest text-emerald-300 font-semibold uppercase mt-0.5">
              {product.nameEn}
            </div>
            <div className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-medium text-white/90 bg-black/40 border border-white/10">
              {product.appearance?.split(' ')[0] || 'فرمولاسیون ویژه'}
            </div>
          </div>

          {/* Bottom Regulatory Stamp */}
          <div className="pt-1 border-t border-white/15 flex items-center justify-between text-[7px] text-white/60">
            <span>دکتر راستین رستمی</span>
            <span className="font-mono">Agri-Tech</span>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      {product.badge && (
        <span
          className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-md z-20 backdrop-blur-md"
          style={{ backgroundColor: badgeColor }}
        >
          {product.badge}
        </span>
      )}
    </div>
  );
};
