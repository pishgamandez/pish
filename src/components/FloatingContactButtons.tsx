import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { companyInfo } from '../data/company';

export const FloatingContactButtons: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 flex flex-col gap-3 transition-opacity duration-300">
      {/* WhatsApp Floating Button */}
      <a
        href={companyInfo.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 border-2 border-white cursor-pointer group"
        title="ارسال پیام در واتساپ به دکتر راستین رستمی"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute left-14 bg-stone-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          ارتباط در واتساپ
        </span>
      </a>

      {/* Phone Call Floating Button */}
      <a
        href={companyInfo.callUrl}
        className="w-12 h-12 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 border-2 border-white cursor-pointer group"
        title="تماس مستقیم با شماره 09128247415"
      >
        <Phone className="w-6 h-6 animate-pulse" />
        <span className="absolute left-14 bg-stone-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1.5">
          <span>تماس:</span>
          <span dir="ltr" className="font-mono">{companyInfo.phoneFormatted}</span>
        </span>
      </a>
    </div>
  );
};
