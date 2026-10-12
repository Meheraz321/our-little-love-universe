import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface WelcomeScreenProps {
  config: LoveConfig;
  language: Language;
  onEnter: () => void;
  onStartMusicPrompt?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  config,
  language,
  onEnter,
  onStartMusicPrompt
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  const displayName = config.recipientNickname?.trim()
    ? config.recipientNickname
    : config.recipientName?.trim()
    ? config.recipientName
    : language === 'bn'
    ? 'প্রিয় মানুষ'
    : 'Beloved';

  const handleOpenGift = () => {
    if (config.enableSoundEffects) {
      soundEngine.playEnvelopeOpen();
    }
    if (onStartMusicPrompt && config.enableBackgroundMusic) {
      onStartMusicPrompt();
    }

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6FAE', '#FFB6D5', '#E84369', '#F4D58D', '#FFF9F5'],
      });
    } catch {
      // safe fallback
    }

    setIsOpen(true);
  };

  const handleFinish = () => {
    if (config.enableSoundEffects) {
      soundEngine.playChime(659.25);
    }
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gradient-to-br from-[#FFD6E7] via-[#FFF9F5] to-[#E8DCFF] overflow-y-auto"
    >
      {/* Ambient background glowing circles */}
      <div className="absolute w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-[#FFB6D5]/40 blur-3xl -top-20 -left-20 animate-pulse-romantic pointer-events-none" />
      <div className="absolute w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-[#E8DCFF]/50 blur-3xl -bottom-20 -right-20 animate-pulse-romantic pointer-events-none" />

      {/* Floating sparkles background */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-1/4 left-1/6 text-lg sm:text-2xl animate-float-slow">✨</span>
        <span className="absolute top-1/3 right-1/5 text-xl sm:text-2xl animate-float-gentle">🌸</span>
        <span className="absolute bottom-1/4 left-1/5 text-lg sm:text-xl animate-float-gentle">💖</span>
        <span className="absolute bottom-1/3 right-1/6 text-xl sm:text-2xl animate-float-slow">✨</span>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto text-center my-auto">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="gift-closed"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-5 xs:p-7 sm:p-10 rounded-2xl sm:rounded-3xl border border-[#FFB6D5]/60 shadow-xl shadow-[#E84369]/10"
            >
              {/* Cute illustrated Envelope / Gift Box */}
              <div className="relative mx-auto w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 mb-5 sm:mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#FF6FAE] to-[#FFB6D5] opacity-20 blur-xl animate-shimmer-glow" />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#FF6FAE] via-[#E84369] to-[#FFB6D5] p-1 shadow-lg flex items-center justify-center cursor-pointer group"
                  onClick={handleOpenGift}
                >
                  <div className="w-full h-full bg-[#FFF9F5] rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden transition-colors group-hover:bg-[#FFF2F6]">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-[#FF6FAE]" />
                    <Gift className="w-8 h-8 xs:w-10 xs:h-10 text-[#E84369] transition-transform duration-300 group-hover:scale-110" />
                    <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-[#FF6FAE] fill-[#FF6FAE] absolute -top-1 right-2 animate-bounce" />
                  </div>
                </motion.div>
                <div className="absolute -bottom-2">
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#E84369] font-medium bg-[#FFF9F5] px-2.5 sm:px-3 py-1 rounded-full border border-[#FFD6E7] shadow-xs">
                    <Sparkles className="w-3 h-3 animate-spin text-[#F4D58D]" />
                    {language === 'bn' ? 'স্পর্শ করো' : 'Tap to open'}
                  </span>
                </div>
              </div>

              {/* Welcoming Bengali / English text */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#35172F] tracking-tight leading-snug">
                  {t.welcomeGreeting}
                </h1>
                <p className="text-xs xs:text-sm sm:text-base text-[#35172F]/80 font-medium leading-relaxed">
                  {t.welcomeSubtitle}
                </p>
                <p className="text-base xs:text-lg sm:text-xl font-semibold text-[#E84369] animate-pulse">
                  {t.welcomeQuestion}
                </p>
              </div>

              {/* Main Open Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenGift}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#FF6FAE] to-[#E84369] hover:from-[#E84369] hover:to-[#FF6FAE] text-white font-semibold rounded-2xl shadow-lg shadow-[#E84369]/30 transition-all duration-300 flex items-center justify-center gap-2 mx-auto text-base sm:text-lg cursor-pointer min-h-[48px]"
              >
                <span>{t.welcomeButton}</span>
                <Heart className="w-5 h-5 fill-white animate-pulse" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="gift-opened"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="glass-card p-5 xs:p-7 sm:p-10 rounded-2xl sm:rounded-3xl border border-[#FFB6D5] shadow-2xl shadow-[#E84369]/15"
            >
              {/* Floating Heart Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFD6E7] to-[#FFB6D5] flex items-center justify-center mb-4 sm:mb-6 shadow-inner"
              >
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#E84369] fill-[#E84369] animate-pulse-romantic" />
              </motion.div>

              {/* Personalized Greeting */}
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#35172F] mb-3 sm:mb-4">
                {t.welcomeRevealTitle}, <span className="text-[#E84369] font-romantic text-2xl xs:text-3xl sm:text-4xl">{displayName}</span>! ✨
              </h2>

              <p className="text-[#35172F]/85 text-xs xs:text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto whitespace-pre-line font-medium">
                {t.welcomeRevealBody}
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#E84369] to-[#FF6FAE] text-white font-semibold rounded-2xl shadow-lg shadow-[#E84369]/30 transition-all flex items-center justify-center gap-2 mx-auto text-base sm:text-lg cursor-pointer min-h-[48px]"
              >
                <span>{t.welcomeEnterButton}</span>
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
