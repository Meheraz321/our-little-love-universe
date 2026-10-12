import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, Moon, Flower2, Sparkles, RefreshCw, X, MessageSquareHeart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { romanticCompliments } from '../data/loveMessages';
import { soundEngine } from '../utils/soundEffects';

interface SecretSurprisesProps {
  config: LoveConfig;
  language: Language;
}

export const SecretSurprises: React.FC<SecretSurprisesProps> = ({ config, language }) => {
  const [complimentIdx, setComplimentIdx] = useState(0);
  const [activeSurprise, setActiveSurprise] = useState<string | null>(null);
  const t = translations[language];

  const handleTriggerSurprise = (id: string, soundType: 'chime' | 'bloom' | 'burst' = 'bloom') => {
    if (config.enableSoundEffects) {
      if (soundType === 'burst') soundEngine.playHeartBurst();
      else if (soundType === 'bloom') soundEngine.playBloomSound();
      else soundEngine.playChime(587.33);
    }

    try {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FF6FAE', '#FFB6D5', '#F4D58D'],
      });
    } catch {
      // safe
    }

    setActiveSurprise(activeSurprise === id ? null : id);
  };

  const handleNextCompliment = () => {
    if (config.enableSoundEffects) soundEngine.playChime(659.25);
    const nextIdx = Math.floor(Math.random() * romanticCompliments.length);
    setComplimentIdx(nextIdx === complimentIdx ? (nextIdx + 1) % romanticCompliments.length : nextIdx);
  };

  const currentCompliment = romanticCompliments[complimentIdx];

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-4xl mx-auto px-1 sm:px-2">
      {/* Header */}
      <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369]">
          <Sparkles className="w-3.5 h-3.5 text-[#F4D58D]" />
          <span>{t.secretsTitle}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#35172F]">
          {language === 'bn' ? 'আমাদের লুকানো মিষ্টি চমক' : 'Our Secret Sweet Surprises'}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#35172F]/70">
          {t.secretsSubtitle}
        </p>
      </div>

      {/* Surprises Grid: Responsive Mobile (1 col), Tablet (2 col), Desktop (3 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Surprise A: Secret Heart */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-[#FFD6E7] flex flex-col justify-between text-center relative overflow-hidden group">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pink-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#E84369] fill-[#E84369]" />
          </div>
          <h3 className="font-bold text-[#35172F] text-sm sm:text-base mb-1.5">
            {language === 'bn' ? 'গোপন হৃদয়' : 'Secret Heart'}
          </h3>
          <p className="text-xs text-[#35172F]/70 mb-3.5">
            {language === 'bn' ? 'হৃদয়ের একটি নরম কোণে লুকানো অনুভূতি' : 'A tender whisper kept in a quiet corner'}
          </p>
          <button
            onClick={() => handleTriggerSurprise('secret-heart', 'bloom')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-pink-50 hover:bg-[#FFD6E7] text-[#E84369] border border-pink-200 transition-colors cursor-pointer min-h-[40px]"
          >
            {activeSurprise === 'secret-heart' ? (language === 'bn' ? 'লুকান' : 'Hide') : t.secretHeartBtn}
          </button>
        </div>

        {/* Surprise B: Moon Message */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-[#FFD6E7] flex flex-col justify-between text-center relative overflow-hidden group">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 fill-indigo-200" />
          </div>
          <h3 className="font-bold text-[#35172F] text-sm sm:text-base mb-1.5">
            {language === 'bn' ? 'চাঁদের আলোতে ইচ্ছা' : 'Moonlight Wish'}
          </h3>
          <p className="text-xs text-[#35172F]/70 mb-3.5">
            {language === 'bn' ? 'রাতের শান্ত আকাশে তোমার জন্য এক ফালি প্রার্থনা' : 'A gentle prayer for you in the quiet night'}
          </p>
          <button
            onClick={() => handleTriggerSurprise('moon', 'chime')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors cursor-pointer min-h-[40px]"
          >
            {activeSurprise === 'moon' ? (language === 'bn' ? 'লুকান' : 'Hide') : t.moonBtn}
          </button>
        </div>

        {/* Surprise C: Hidden Flower Note */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-[#FFD6E7] flex flex-col justify-between text-center relative overflow-hidden group">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <Flower2 className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500" />
          </div>
          <h3 className="font-bold text-[#35172F] text-sm sm:text-base mb-1.5">
            {language === 'bn' ? 'লুকানো ফুলের চিঠি' : 'Hidden Petal Note'}
          </h3>
          <p className="text-xs text-[#35172F]/70 mb-3.5">
            {language === 'bn' ? 'পাপড়ির ভাঁজে লুকিয়ে রাখা মিষ্টি একটি নোট' : 'Folded between soft petals of affection'}
          </p>
          <button
            onClick={() => handleTriggerSurprise('flower-note', 'bloom')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer min-h-[40px]"
          >
            {activeSurprise === 'flower-note' ? (language === 'bn' ? 'লুকান' : 'Hide') : t.flowerNoteBtn}
          </button>
        </div>

        {/* Surprise D: Random Compliment Generator */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-[#FFD6E7] flex flex-col justify-between text-center relative overflow-hidden group sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <MessageSquareHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#35172F]">
                {language === 'bn' ? 'প্রতিদিনের মিষ্টি প্রশংসা' : 'Sweet Love Compliments'}
              </span>
            </div>
            <button
              onClick={handleNextCompliment}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFD6E7] text-[#E84369] hover:bg-[#FFB6D5] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">{t.getNewCompliment}</span>
            </button>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white/80 border border-[#FFD6E7] my-2">
            <p className="text-sm xs:text-base sm:text-lg font-semibold text-[#35172F] leading-relaxed font-bengali">
              "{language === 'bn' ? currentCompliment.bn : currentCompliment.en}"
            </p>
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#35172F]/60 mt-1">
            {language === 'bn' ? 'মোট ২৫টি নির্বাচিত প্রশংসা সংকলিত' : 'Curated collection of 25 sweet compliments'}
          </p>
        </div>

        {/* Surprise F: Secret Gift Box */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-[#FFD6E7] flex flex-col justify-between text-center relative overflow-hidden group">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-[#E84369]" />
          </div>
          <h3 className="font-bold text-[#35172F] text-sm sm:text-base mb-1.5">
            {language === 'bn' ? 'সারপ্রাইজ উপহার' : 'Surprise Gift Box'}
          </h3>
          <p className="text-xs text-[#35172F]/70 mb-3.5">
            {language === 'bn' ? 'খোলো এবং দেখো তোমার জন্য কি উপহার আছে' : 'Unwrap to reveal a personalized token'}
          </p>
          <button
            onClick={() => handleTriggerSurprise('gift-box', 'burst')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white shadow-xs hover:opacity-95 transition-all cursor-pointer min-h-[40px]"
          >
            {activeSurprise === 'gift-box' ? (language === 'bn' ? 'লুকান' : 'Hide') : t.giftBoxBtn}
          </button>
        </div>
      </div>

      {/* Pop-up modal reveal */}
      <AnimatePresence>
        {activeSurprise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="mt-6 glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-[#FFB6D5] shadow-2xl relative text-center"
          >
            <button
              onClick={() => setActiveSurprise(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {activeSurprise === 'secret-heart' && (
              <div className="space-y-2.5 max-w-lg mx-auto py-2">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#E84369] fill-[#E84369] mx-auto animate-pulse" />
                <h4 className="text-base sm:text-lg font-bold text-[#35172F]">
                  {language === 'bn' ? 'তোমাকে নিয়ে আমার ছোট্ট স্বপ্ন...' : 'My Little Dream of You...'}
                </h4>
                <p className="text-sm sm:text-base md:text-lg font-medium text-[#35172F] font-bengali leading-relaxed">
                  {language === 'bn'
                    ? "তোমাকে নিয়ে আমার ছোট্ট ছোট্ট স্বপ্নগুলোও ভীষণ সুন্দর। ❤️"
                    : "Even my tiniest dreams about you are endlessly magnificent. ❤️"}
                </p>
              </div>
            )}

            {activeSurprise === 'moon' && (
              <div className="space-y-2.5 max-w-lg mx-auto py-2">
                <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 fill-indigo-200 mx-auto animate-float-slow" />
                <h4 className="text-base sm:text-lg font-bold text-[#35172F]">
                  {language === 'bn' ? 'চাঁদের আলোতে ফিসফিসানি...' : 'A Whisper in Moonlight...'}
                </h4>
                <p className="text-sm sm:text-base md:text-lg font-medium text-[#35172F] font-bengali leading-relaxed">
                  {language === 'bn'
                    ? "রাত যত গভীরই হোক, তোমার ভালো থাকার প্রার্থনাটা সুন্দর থাকুক। 🌙"
                    : "No matter how deep the night falls, may my prayers for your happiness remain steadfast. 🌙"}
                </p>
              </div>
            )}

            {activeSurprise === 'flower-note' && (
              <div className="space-y-2.5 max-w-lg mx-auto py-2">
                <Flower2 className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 mx-auto animate-spin" />
                <h4 className="text-base sm:text-lg font-bold text-[#35172F]">
                  {language === 'bn' ? 'গোপন ফুলের পাপড়ির কথা...' : 'Secret Words of the Petal...'}
                </h4>
                <p className="text-sm sm:text-base md:text-lg font-medium text-[#35172F] font-bengali leading-relaxed">
                  {language === 'bn'
                    ? "তুমি কাছে থাকলে সময় যেন চোখের পলকে পেরিয়ে যায়, আর তুমি দূরে থাকলে এক মুহূর্তও কাটতে চায় না। অনেক ভালোবাসি তোমাকে! 🌸"
                    : "When you are near, time flies by in the blink of an eye; when you are away, every second feels like an eternity. Love you so much! 🌸"}
                </p>
              </div>
            )}

            {activeSurprise === 'gift-box' && (
              <div className="space-y-2.5 max-w-lg mx-auto py-2">
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-[#E84369] mx-auto animate-bounce" />
                <h4 className="text-lg sm:text-xl font-bold text-[#E84369]">
                  {language === 'bn' ? 'তোমার জন্য বিশেষ বার্তা 🎁' : 'A Token For You 🎁'}
                </h4>
                <p className="text-sm sm:text-base md:text-lg font-medium text-[#35172F] font-bengali leading-relaxed">
                  {language === 'bn'
                    ? config.secretGiftMessageBn || "তুমি আমার জীবনের সবচেয়ে সুন্দর পাওয়া! প্রতিটি দিন তোমার সাথে রূপকথার মতো। 💖"
                    : config.secretGiftMessageEn || "You are the most beautiful treasure of my life! Every day with you is a fairytale. 💖"}
                </p>
                <p className="font-romantic text-xl sm:text-2xl text-[#E84369] mt-2">
                  {config.senderName || '❤️'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
