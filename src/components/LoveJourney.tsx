import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { LoveConfig, Language } from '../types';
import { loveJourneyMessages } from '../data/loveMessages';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface LoveJourneyProps {
  config: LoveConfig;
  language: Language;
}

export const LoveJourney: React.FC<LoveJourneyProps> = ({ config, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const t = translations[language];

  const currentMsg = loveJourneyMessages[currentIndex];
  const total = loveJourneyMessages.length;

  const handleNext = () => {
    if (currentIndex < total - 1) {
      if (config.enableSoundEffects) soundEngine.playChime(587.33);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (config.enableSoundEffects) soundEngine.playChime(523.25);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReplay = () => {
    if (config.enableSoundEffects) soundEngine.playChime(659.25);
    setCurrentIndex(0);
  };

  const handleHeartReaction = () => {
    if (config.enableSoundEffects) soundEngine.playBloomSound();
    setLikes((prev) => ({
      ...prev,
      [currentMsg.id]: (prev[currentMsg.id] || 0) + 1,
    }));
  };

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-3xl mx-auto px-1 sm:px-2">
      {/* Section Header */}
      <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369]">
          <Heart className="w-3.5 h-3.5 fill-[#E84369]" />
          <span>{t.journeyStep} {currentIndex + 1} / {total}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#35172F]">
          {t.journeyTitle}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#35172F]/70">
          {t.journeySubtitle}
        </p>
      </div>

      {/* Animated Message Card */}
      <div className="relative min-h-[250px] sm:min-h-[290px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMsg.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#FFB6D5] shadow-xl shadow-[#E84369]/10 relative overflow-hidden"
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-[11px] sm:text-xs font-semibold text-[#FF6FAE] tracking-wide uppercase">
                {language === 'bn' ? currentMsg.subtextBn : currentMsg.subtextEn}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleHeartReaction}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-pink-100/90 hover:bg-pink-200 text-[#E84369] text-xs font-bold transition-colors cursor-pointer border border-pink-300/40 min-h-[32px]"
              >
                <Heart className="w-3.5 h-3.5 fill-[#E84369]" />
                <span>{likes[currentMsg.id] || 1}</span>
              </motion.button>
            </div>

            {/* Main Message Typography */}
            <div className="my-4 sm:my-6">
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-[#35172F] leading-relaxed text-center font-bengali">
                "{language === 'bn' ? currentMsg.bn : currentMsg.en}"
              </p>
            </div>

            {/* Romantic signature line */}
            <div className="text-center mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#FFD6E7]/60">
              <span className="font-romantic text-base sm:text-xl text-[#E84369]">
                {config.senderName || (language === 'bn' ? 'তোমার ভালোবাসার মানুষ' : 'Forever Yours')}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators & Controls */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {loveJourneyMessages.map((msg, idx) => (
            <button
              key={msg.id}
              onClick={() => {
                if (config.enableSoundEffects) soundEngine.playChime(523.25);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 sm:w-8 bg-[#E84369]'
                  : 'w-2.5 bg-[#FFD6E7] hover:bg-[#FFB6D5]'
              }`}
              aria-label={`Go to message ${idx + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer min-h-[40px] ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400'
                : 'border-[#FFD6E7] text-[#35172F] hover:bg-pink-50 hover:border-[#FF6FAE]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.prevMessage}</span>
          </button>

          {currentIndex === total - 1 ? (
            <button
              onClick={handleReplay}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white shadow-md flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer min-h-[40px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.replayJourney}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white shadow-md flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer min-h-[40px]"
            >
              <span>{t.nextMessage}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
