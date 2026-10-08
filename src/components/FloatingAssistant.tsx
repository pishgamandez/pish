import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, MessageSquare, Phone } from 'lucide-react';
import { initialProducts } from '../data/products';
import { companyInfo } from '../data/company';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface FloatingAssistantProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  isOpen: controlledIsOpen,
  onOpenChange
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (next: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(next);
    }
    onOpenChange?.(next);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `سلام! من مشاور هوشمند زراعی شرکت پیشگامان پایدار فلات نیک (برند پرواز نهاده) هستم. در خصوص هر یک از ۱۶ محصول تخصصی، نحوه مصرف در باغات و زراعت، رفع شوری یا کمبود عناصر چه کمکی می‌توانم به شما بکنم؟`,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'برای شوری خاک پسته چی مصرف کنم؟',
    'تفاوت چلنجر با هیومی فارم چیه؟',
    'بهترین زمان مصرف کود آهن ردفول؟',
    'جلوگیری از ریزش گل درختان میوه؟'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Offline intelligent agronomist engine based on the official PDF document
  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('شور') || q.includes('ec') || q.includes('نمک')) {
      return `برای رفع شوری خاک، محصول شماره یک ما «سالت استاپ (Salt Stop)» است. سالت استاپ با فرمولاسیون اختصاصی املاح مضر سدیم را آبشویی کرده و نفوذپذیری خاک را افزایش می‌دهد. همچنین محصول «سول مکس (گوگرد مایع)» به تنظیم pH و شکستن شوری کمک می‌کند. دوز سالت استاپ بسته به EC خاک بین ۵ تا ۱۵ لیتر در هکتار همراه آب آبیاری است. برای مشاوره دقیق‌تر با دکتر رستمی (09128247415) تماس بگیرید.`;
    }

    if (q.includes('پسته')) {
      return `برای باغات پسته، برنامه کودی پیشگامان شامل:
۱. سالت استاپ و سول مکس: در ابتدای فصل جهت رفع شوری و کنترل آفات
۲. فول شارژر (روی + بُر): هنگام تورم جوانه جهت افزایش گرده‌افشانی و جلوگیری از ریزش
۳. تایگر K High (ژل پتاس بالا): در زمان پر شدن مغز و خندان شدن پسته (۵ کیلو در هکتار)
۴. ردفول (کود آهن EDDHA): در صورت مشاهده زردی برگ‌های جوان.`;
    }

    if (q.includes('چلنجر') && q.includes('هیومی فارم')) {
      return `تفاوت چلنجر و هیومی فارم:
• چلنجر: هیومیک اسید پودری ۱۰۰٪ خالص است که علاوه بر هیومیک و فولویک، حاوی عصاره جلبک، آمینواسید، آهن، روی و منگنز بوده و برای اصلاح اسیدیته و افزایش ریشه‌زایی عالی است.
• هیومی فارم: هیومیک مایع غنی‌شده با NPK و مواد آلی فعال است که برای مصرف مستقیم در سیستم‌های آبیاری قطره‌ای و غرقابی جهت توسعه فوری ریشه موئین طراحی شده است.`;
    }

    if (q.includes('ردفول') || q.includes('آهن') || q.includes('زرد')) {
      return `کود آهن ردفول (Red Full) دارای کلات ویژه EDDHA است که حتی در خاک‌های شدیداً قلیایی و آهکی (تا pH 9) پایدار مانده و رسوب نمی‌کند.
میزان مصرف: در باغات ۵ تا ۶ کیلو در هکتار (یا ۲۰ تا ۵۰ گرم چالکود برای هر درخت) و در صیفی‌جات ۲ کیلو در هکتار به صورت کودآبیاری است. سریعاً زردی و کلروز را برطرف می‌کند.`;
    }

    if (q.includes('ریزش گل') || q.includes('فول شارژر') || q.includes('گرده')) {
      return `برای جلوگیری از ریزش گل و افزایش تبدیل گل به میوه، «فول شارژر (Full Charger)» بهترین گزینه است. این محلول غلیظ روی و بُر به همراه ازت است که هورمون‌های گیاهی و اسیدآمینه تریپتوفان را فعال کرده و گرده‌افشانی را تقویت می‌کند. دوز مصرف: ۱.۵ تا ۲ لیتر در ۱۰۰۰ لیتر آب محلول‌پاشی بهاره.`;
    }

    if (q.includes('پتاس') || q.includes('تایگر') || q.includes('رنگ') || q.includes('سایز')) {
      return `برای رنگ‌آوری، درشت شدن میوه و پر شدن دانه، دو محصول فوق‌العاده داریم:
۱. تایگر K High: ژل پتاسیم بالا بدون کلر، صد در صد محلول و بدون کریستاله شدن
۲. دوپینگ (Doping): آمینواسید رنگ‌آور غنی از جلبک دریایی و بُر که شاخص قند (بریکس) و سایز میوه را جهش می‌دهد.`;
    }

    if (q.includes('قیمت') || q.includes('خرید') || q.includes('تماس') || q.includes('سفارش')) {
      return `برای استعلام قیمت روز محصولات، خرید عمده و خرده، و دریافت نمایندگی در استان‌ها، لطفاً مستقیم با مدیریت محترم شرکت، دکتر راستین رستمی تماس بگیرید:
تلفن: 09128247415 (تماس مستقیم یا واتساپ).`;
    }

    // Default expert response
    return `شرکت پیشگامان پایدار فلات نیک با ۱۶ محصول اختصاصی (سالت استاپ، چلنجر، هیومی فارم، ردفول، تایگر، فول شارژر، سول مکس، فیکشن، آنجلا، سیلیگارد، استورمی و...) پاسخگوی تمامی نیازهای زراعی است.
برای دریافت نسخه کودی اختصاصی متناسب با خاک زمین‌تان، می‌توانید مشخصات مزرعه را در فرم مشاوره ثبت کنید یا با شماره مستقیم 09128247415 تماس حاصل فرمایید.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || generateOfflineResponse(query),
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // Offline fallback
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: generateOfflineResponse(query),
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-full shadow-2xl hover:shadow-emerald-900/50 hover:scale-105 transition-all duration-300 border border-emerald-500/40 cursor-pointer active:scale-95"
          aria-label="مشاور هوش مصنوعی کشاورزی"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-black">مشاور هوشمند زراعی</span>
            <span className="block text-[10px] text-emerald-300 font-mono">Pishgaman AI</span>
          </div>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px] max-h-[82vh] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-l from-emerald-900 to-stone-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold leading-tight">مشاور هوش مصنوعی پیشگامان</h4>
                <span className="text-[10px] text-emerald-300 font-light">پاسخگویی بر اساس ۱۶ محصول پرواز نهاده</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <a
                href={companyInfo.callUrl}
                className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px]"
                title={`تماس مستقیم: ${companyInfo.phoneFormatted}`}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xs:inline text-[10px]">تماس</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="بستن گفتگو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50 text-right text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white ${
                    msg.sender === 'user' ? 'bg-stone-800' : 'bg-emerald-800'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      msg.sender === 'user' ? 'text-stone-400' : 'text-stone-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-500 text-[11px] bg-white p-2.5 rounded-xl border border-stone-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>در حال تحلیل و تنظیم پاسخ زراعی...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="p-2 bg-stone-100 border-t border-stone-200 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 rounded-lg px-2.5 py-1 whitespace-nowrap cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 relative z-20">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="سوال خود درباره محصولات یا خاک..."
              className="flex-1 min-w-0 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-right"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="w-10 h-10 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center shrink-0"
              title="ارسال سوال"
              aria-label="ارسال پیام"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
