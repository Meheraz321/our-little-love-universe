import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Mail, Sparkles, RotateCcw, Copy, Check } from 'lucide-react';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { defaultLoveLetterTextBn, defaultLoveLetterTextEn } from '../data/loveMessages';
import { soundEngine } from '../utils/soundEffects';

interface LoveLetterProps {
  config: LoveConfig;
  language: Language;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ config, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const t = translations[language];

  const letterContent = language === 'bn' ? defaultLoveLetterTextBn : defaultLoveLetterTextEn;
  const senderDisplay = config.senderName?.trim()
    ? config.senderName
    : language === 'bn'
    ? 'তোমার ভালোবাসার মানুষ'
    : 'Your Loving Soul';

  const handleOpenLetter = () => {
    if (config.enableSoundEffects) {
      soundEngine.playEnvelopeOpen();
    }
    setIsOpen(true);
  };

  const handleFoldBack = () => {
    if (config.enableSoundEffects) {
      soundEngine.playChime(523.25);
    }
    setIsOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent + `\n\n${t.letterClosing}\n${senderDisplay}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-2xl mx-auto px-1 sm:px-2">
      {/* Section Header */}
      <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369]">
          <Mail className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'বিশেষ বার্তা' : 'Special Letter'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#35172F]">
          {t.letterHeader}
        </h2>
      </div>

      <div className="relative flex justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Sealed Envelope State */
            <motion.div
              key="sealed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#FFB6D5] shadow-xl text-center space-y-5 sm:space-y-6"
            >
              {/* Envelope illustration */}
              <div className="relative mx-auto w-40 h-28 xs:w-48 xs:h-32 bg-gradient-to-b from-[#FFF0F5] to-[#FFD6E7] rounded-2xl border-2 border-[#FFB6D5] shadow-md flex items-center justify-center overflow-hidden">
                {/* Envelope Flap Lines */}
                <div className="absolute top-0 inset-x-0 h-16 border-b-2 border-r-2 border-[#FFB6D5]/60 -skew-y-12 bg-[#FFE6F0]/60 origin-top-left" />
                <div className="absolute top-0 inset-x-0 h-16 border-b-2 border-l-2 border-[#FFB6D5]/60 skew-y-12 bg-[#FFE6F0]/60 origin-top-right" />

                {/* Wax Seal with Pulsing Heart */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  onClick={handleOpenLetter}
                  className="relative z-10 w-12 h-12 xs:w-14 xs:h-14 rounded-full bg-gradient-to-tr from-[#E84369] to-[#FF6FAE] shadow-lg flex items-center justify-center cursor-pointer"
                >
                  <Heart className="w-6 h-6 xs:w-7 xs:h-7 text-white fill-white animate-pulse" />
                </motion.div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs sm:text-sm font-medium text-[#35172F]/75">
                  {language === 'bn'
                    ? 'হৃদয়ের গভীর ভালোবাসা দিয়ে সিলমোহর করা চিঠি...'
                    : 'A sealed letter holding tender secrets of love...'}
                </p>
              </div>

              {/* Open Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenLetter}
                className="w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#E84369]/25 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
              >
                <span>{t.letterOpenBtn}</span>
                <Sparkles className="w-4 h-4 text-[#F4D58D]" />
              </motion.button>
            </motion.div>
          ) : (
            /* Opened Letter State */
            <motion.div
              key="open-letter"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.45, type: 'spring' }}
              className="w-full bg-[#FFFDFB] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#FFD6E7] shadow-xl relative overflow-hidden"
            >
              {/* Paper Watermark Ornament */}
              <div className="absolute top-4 right-4 text-pink-100 opacity-60 pointer-events-none">
                <Heart className="w-16 h-16 sm:w-24 sm:h-24 fill-current" />
              </div>

              {/* Action Toolbar on Top */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#FFD6E7]/70">
                <span className="text-[11px] sm:text-xs font-semibold text-[#FF6FAE] tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'তোমার উদ্দেশ্যে লেখা' : 'Written For You'}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 sm:px-2.5 rounded-lg text-xs font-medium text-[#35172F]/70 hover:text-[#E84369] hover:bg-pink-50 transition-colors flex items-center gap-1 cursor-pointer min-h-[36px]"
                    title="Copy letter"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                  <button
                    onClick={handleFoldBack}
                    className="p-1.5 sm:px-2.5 rounded-lg text-xs font-medium text-[#35172F]/70 hover:text-[#E84369] hover:bg-pink-50 transition-colors flex items-center gap-1 cursor-pointer min-h-[36px]"
                    title={t.letterFoldBtn}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'মুড়িয়ে রাখুন' : 'Fold'}</span>
                  </button>
                </div>
              </div>

              {/* Letter Content */}
              <div className="prose prose-pink max-w-none space-y-3 sm:space-y-4 text-[#35172F] font-bengali leading-relaxed text-sm sm:text-base md:text-lg">
                <div className="whitespace-pre-line font-medium text-left sm:text-justify leading-relaxed">
                  {letterContent}
                </div>

                {/* Hand-written style Signature */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#FFD6E7]/80 text-right">
                  <p className="text-xs text-[#35172F]/60 font-sans mb-1">{t.letterClosing}</p>
                  <p className="font-romantic text-2xl sm:text-3xl md:text-4xl text-[#E84369] font-bold">
                    {senderDisplay}
                  </p>
                </div>
              </div>

              {/* Replay / Fold back Button at bottom */}
              <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 text-center">
                <button
                  onClick={handleFoldBack}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-[#FFB6D5] text-xs font-semibold text-[#E84369] hover:bg-pink-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.letterFoldBtn}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
