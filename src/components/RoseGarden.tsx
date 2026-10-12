import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flower2, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { roseVariants } from '../data/loveMessages';
import { soundEngine } from '../utils/soundEffects';

interface RoseGardenProps {
  config: LoveConfig;
  language: Language;
}

export const RoseGarden: React.FC<RoseGardenProps> = ({ config, language }) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [isBloomed, setIsBloomed] = useState(false);
  const [bloomedCount, setBloomedCount] = useState(0);
  const t = translations[language];

  const currentVariant = roseVariants[currentVariantIndex];

  const handleBloom = () => {
    if (config.enableSoundEffects) {
      soundEngine.playBloomSound();
    }

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: [currentVariant.color, currentVariant.petalColor, '#FFF9F5', '#FFD6E7'],
      });
    } catch {
      // safe fallback
    }

    setIsBloomed(true);
    setBloomedCount((prev) => prev + 1);
  };

  const handleNextRose = () => {
    if (config.enableSoundEffects) {
      soundEngine.playChime(659.25);
    }
    setIsBloomed(false);
    setTimeout(() => {
      setCurrentVariantIndex((prev) => (prev + 1) % roseVariants.length);
      setIsBloomed(true);
      setBloomedCount((prev) => prev + 1);
      if (config.enableSoundEffects) soundEngine.playBloomSound();
    }, 250);
  };

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-2xl mx-auto text-center px-1 sm:px-2">
      {/* Section Header */}
      <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369]">
          <Flower2 className="w-3.5 h-3.5 text-[#E84369]" />
          <span>
            {bloomedCount} {t.rosesBloomed}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#35172F]">
          {t.roseTitle}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#35172F]/70">
          {t.roseSubtitle}
        </p>
      </div>

      {/* Interactive Rose Container */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#FFB6D5] shadow-xl relative overflow-hidden">
        {/* Glow behind rose */}
        <div
          className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: currentVariant.color,
            top: '20%',
            left: 'calc(50% - 80px)',
          }}
        />

        {/* Illustrated SVG Rose with Bloom Animation */}
        <div
          className="relative mx-auto w-36 h-40 xs:w-44 xs:h-48 sm:w-52 sm:h-56 cursor-pointer flex items-center justify-center group"
          onClick={handleBloom}
        >
          <motion.svg
            viewBox="0 0 200 240"
            className="w-full h-full filter drop-shadow-md"
            animate={{
              scale: isBloomed ? 1.08 : 0.95,
              rotate: isBloomed ? [0, 2, -2, 0] : 0,
            }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            {/* Stem & Leaves */}
            <path
              d="M100 120 C100 160, 95 190, 100 230"
              stroke={currentVariant.stemColor}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <motion.path
              d="M98 160 C75 150, 60 170, 75 185 C90 190, 98 175, 98 160 Z"
              fill={currentVariant.stemColor}
              animate={{ rotate: isBloomed ? -5 : 0 }}
              style={{ originX: '98px', originY: '160px' }}
            />
            {/* Right Leaf */}
            <motion.path
              d="M100 180 C125 170, 140 190, 125 205 C110 210, 100 195, 100 180 Z"
              fill={currentVariant.stemColor}
              animate={{ rotate: isBloomed ? 5 : 0 }}
              style={{ originX: '100px', originY: '180px' }}
            />

            {/* Rose Calyx */}
            <path
              d="M85 125 C95 140, 105 140, 115 125 Z"
              fill={currentVariant.stemColor}
            />

            {/* Rose Outer Petals (Bloom Spread) */}
            <motion.g
              animate={{
                scale: isBloomed ? 1.15 : 0.85,
              }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{ originX: '100px', originY: '100px' }}
            >
              <motion.path
                d="M100 95 C65 60, 55 110, 95 125 Z"
                fill={currentVariant.petalColor}
                opacity={0.9}
                animate={{ rotate: isBloomed ? -12 : 0 }}
                style={{ originX: '100px', originY: '110px' }}
              />
              <motion.path
                d="M100 95 C135 60, 145 110, 105 125 Z"
                fill={currentVariant.petalColor}
                opacity={0.9}
                animate={{ rotate: isBloomed ? 12 : 0 }}
                style={{ originX: '100px', originY: '110px' }}
              />
              <motion.path
                d="M75 90 C100 130, 125 90, 100 120 Z"
                fill={currentVariant.color}
              />
              <circle cx="100" cy="90" r="28" fill={currentVariant.color} />
              <path
                d="M90 85 C90 75, 110 75, 110 85 C110 95, 95 95, 95 90"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
                opacity="0.5"
                strokeLinecap="round"
              />
              <path
                d="M85 92 C85 105, 115 105, 115 92"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
                strokeLinecap="round"
              />
            </motion.g>

            {isBloomed && (
              <g>
                <circle cx="65" cy="70" r="3" fill="#F4D58D" className="animate-ping" />
                <circle cx="135" cy="65" r="2.5" fill="#F4D58D" className="animate-ping" />
                <circle cx="100" cy="45" r="3" fill="#FF6FAE" className="animate-ping" />
              </g>
            )}
          </motion.svg>

          {!isBloomed && (
            <div className="absolute -bottom-1">
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-3 py-1 bg-white rounded-full text-[#E84369] shadow-xs border border-[#FFD6E7]">
                <Sparkles className="w-3 h-3 text-[#F4D58D]" />
                {t.tapToBloom}
              </span>
            </div>
          )}
        </div>

        {/* Rose Variety Name Tag */}
        <div className="mt-4">
          <span className="text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-pink-50 text-[#E84369] border border-pink-100">
            {language === 'bn' ? currentVariant.nameBn : currentVariant.nameEn}
          </span>
        </div>

        {/* Bloomed Message Reveal */}
        <AnimatePresence>
          {isBloomed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-[#FFD6E7]/80 space-y-2.5 sm:space-y-3"
            >
              <p className="text-sm sm:text-base md:text-lg font-medium text-[#35172F] whitespace-pre-line leading-relaxed font-bengali">
                {language === 'bn' ? currentVariant.messageBn : currentVariant.messageEn}
              </p>

              <div className="flex items-center justify-center gap-1.5 pt-1 text-[#E84369]">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span className="font-romantic text-base sm:text-lg">
                  {config.recipientNickname || config.recipientName || '❤️'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Another Rose Button */}
        <div className="mt-6 sm:mt-8 pt-3 sm:pt-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleNextRose}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#E84369]/20 inline-flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
          >
            <span>{t.anotherRoseBtn}</span>
            <Flower2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
