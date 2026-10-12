import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface FinalSurpriseProps {
  config: LoveConfig;
  language: Language;
  onReturnHome: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  config,
  language,
  onReturnHome,
}) => {
  const [phase, setPhase] = useState<number>(0);
  const [messageIdx, setMessageIdx] = useState<number>(0);
  const t = translations[language];

  const displayName = config.recipientNickname?.trim()
    ? config.recipientNickname
    : config.recipientName?.trim()
    ? config.recipientName
    : language === 'bn'
    ? 'প্রিয় মানুষ'
    : 'My Beloved';

  const finaleMessages = [
    {
      bn: "তোমাকে হাসতে দেখলে আমারও ভালো লাগে। ❤️",
      en: "Seeing your smile is what fills my world with genuine bliss. ❤️",
    },
    {
      bn: "তোমার স্বপ্নগুলো সুন্দর হোক, তোমার মনটা ভালো থাকুক। 🌸",
      en: "May all your cherished dreams bloom, and peace rest upon your soul. 🌸",
    },
    {
      bn: "জীবনের ছোট ছোট আনন্দগুলো তুমি মন ভরে উপভোগ করো। ✨",
      en: "May you savor every little joyous wonder life has to offer. ✨",
    },
    {
      bn: "আর আমাদের গল্পে থাকুক অনেক সুন্দর স্মৃতি, যত্ন আর ভালোবাসা। 💖",
      en: "And in our shared story, may there always be warm memories, tenderness, and enduring love. 💖",
    },
  ];

  useEffect(() => {
    let timer: number | null = null;

    if (phase === 1) {
      timer = window.setTimeout(() => setPhase(2), 2200);
    } else if (phase === 2) {
      timer = window.setTimeout(() => setPhase(3), 2500);
    } else if (phase === 3) {
      timer = window.setTimeout(() => setPhase(4), 3000);
    } else if (phase === 4) {
      if (messageIdx < finaleMessages.length - 1) {
        timer = window.setTimeout(() => {
          setMessageIdx((prev) => prev + 1);
        }, 3200);
      } else {
        timer = window.setTimeout(() => setPhase(5), 3500);
      }
    } else if (phase === 5) {
      timer = window.setTimeout(() => {
        setPhase(6);
        try {
          confetti({
            particleCount: 60,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#FF6FAE', '#FFB6D5', '#E84369', '#F4D58D', '#FFF9F5'],
          });
        } catch {
          // safe
        }
      }, 4000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, messageIdx, finaleMessages.length]);

  const handleStartSurprise = () => {
    if (config.enableSoundEffects) soundEngine.playBloomSound();
    setPhase(1);
    setMessageIdx(0);
  };

  const handleLoveAgainClick = () => {
    if (config.enableSoundEffects) soundEngine.playHeartBurst();
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#E84369', '#FF6FAE', '#FFB6D5', '#F4D58D', '#FFFFFF'],
      });
    } catch {
      // safe
    }
  };

  const handleReplay = () => {
    if (config.enableSoundEffects) soundEngine.playChime(523.25);
    setPhase(1);
    setMessageIdx(0);
  };

  return (
    <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[680px] flex items-center justify-center p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl overflow-hidden my-2 sm:my-6">
      {/* Background depending on phase */}
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          <motion.div
            key="bg-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#FFD6E7] via-[#FFF9F5] to-[#E8DCFF] rounded-2xl sm:rounded-3xl border border-[#FFB6D5]"
          />
        ) : (
          <motion.div
            key="bg-night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-b from-[#1A0B2E] via-[#2A1138] to-[#35172F] rounded-2xl sm:rounded-3xl overflow-hidden"
          >
            {/* Dreamy tiny starry sky particles */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    top: `${Math.random() * 95}%`,
                    left: `${Math.random() * 95}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-xl mx-auto text-center px-1">
        {/* PHASE 0: Introductory Screen */}
        {phase === 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 border border-[#FFB6D5] shadow-xl space-y-5 sm:space-y-6"
          >
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-100 flex items-center justify-center">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-[#E84369] fill-[#E84369] animate-pulse" />
            </div>

            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#35172F] leading-snug font-bengali">
              {t.finalBanner}
            </h2>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartSurprise}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#E84369]/30 flex items-center justify-center gap-2 mx-auto cursor-pointer min-h-[48px]"
            >
              <span>{t.finalOpenBtn}</span>
              <Sparkles className="w-5 h-5 text-[#F4D58D]" />
            </motion.button>
          </motion.div>
        )}

        {/* PHASE 1: THE GLOW */}
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-4 sm:space-y-6 text-white py-8 sm:py-12"
          >
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FF6FAE] blur-2xl opacity-60 animate-pulse" />
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF6FAE] fill-[#FF6FAE] relative z-10" />
            </div>
            <p className="text-pink-200 text-xs sm:text-sm tracking-widest uppercase">
              {language === 'bn' ? 'জাদু শুরু হচ্ছে...' : 'The magic awakens...'}
            </p>
          </motion.div>
        )}

        {/* PHASE 2: THE HEARTBEAT */}
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 sm:space-y-6 text-white py-8 sm:py-12"
          >
            <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#E84369] blur-3xl opacity-75 animate-heartbeat" />
              <Heart className="w-18 h-18 sm:w-24 sm:h-24 text-[#E84369] fill-[#E84369] animate-heartbeat relative z-10" />
            </div>
            <p className="text-pink-100 font-romantic text-xl sm:text-2xl">
              {language === 'bn' ? 'প্রতিটি হৃদস্পন্দন তোমার জন্য...' : 'Every heartbeat whispers your name...'}
            </p>
          </motion.div>
        )}

        {/* PHASE 3: THE MAGIC (Particles & Petals gathering) */}
        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 sm:space-y-6 text-white py-8 sm:py-12"
          >
            <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF6FAE] to-[#F4D58D] blur-2xl opacity-80 animate-spin" />
              <Heart className="w-24 h-24 sm:w-32 sm:h-32 text-pink-200 fill-[#FF6FAE] relative z-10 filter drop-shadow-[0_0_20px_#E84369]" />
            </div>
            <p className="text-pink-100 text-base sm:text-lg font-medium">
              {language === 'bn' ? 'ভালোবাসার আলোকমালা একত্র হচ্ছে ✨' : 'Gathering constellations of affection ✨'}
            </p>
          </motion.div>
        )}

        {/* PHASE 4: SEQUENTIAL MESSAGES */}
        {phase === 4 && (
          <div className="py-8 sm:py-12 space-y-6 sm:space-y-8">
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF6FAE] fill-[#E84369] animate-pulse filter drop-shadow-[0_0_15px_#FF6FAE]" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={messageIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-pink-200/20"
              >
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-white leading-relaxed font-bengali">
                  "{language === 'bn' ? finaleMessages[messageIdx].bn : finaleMessages[messageIdx].en}"
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2">
              {finaleMessages.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 sm:h-2.5 rounded-full transition-all ${
                    messageIdx === i ? 'w-6 sm:w-7 bg-[#FF6FAE]' : 'w-2 sm:w-2.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* PHASE 5: PERSONALIZED REVEAL */}
        {phase === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="py-6 sm:py-10 space-y-4 sm:space-y-6 text-white"
          >
            <div className="relative mx-auto w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
              <Heart className="w-14 h-14 sm:w-20 sm:h-20 text-[#FF6FAE] fill-[#E84369] animate-bounce filter drop-shadow-[0_0_25px_#E84369]" />
            </div>

            <div className="space-y-3 sm:space-y-4 max-w-lg mx-auto">
              <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight font-bengali">
                <span className="text-[#FF6FAE] font-romantic text-2xl xs:text-3xl sm:text-4xl md:text-5xl block mb-1 sm:mb-2">
                  {displayName}
                </span>
                {language === 'bn' ? 'তুমি আমার কাছে ভীষণ স্পেশাল। ❤️' : 'You are endlessly precious to me. ❤️'}
              </h3>

              <p className="text-sm sm:text-base md:text-lg text-pink-100 font-medium leading-relaxed font-bengali">
                {language === 'bn'
                  ? 'এই ছোট্ট ওয়েবসাইটটা তোমার জন্য—শুধু তোমার মুখে একটা সুন্দর হাসি দেখার আশায়। 🥹💗'
                  : 'This little world was handcrafted for you—solely to bring a tender smile to your radiant face. 🥹💗'}
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE 6: GRAND FINALE */}
        {phase === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="py-6 sm:py-8 space-y-4 sm:space-y-6 text-white"
          >
            {/* Luminous Center Heart */}
            <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF6FAE] to-[#E84369] blur-2xl opacity-90 animate-pulse" />
              <Heart className="w-18 h-18 sm:w-24 sm:h-24 text-white fill-[#E84369] relative z-10 animate-heartbeat filter drop-shadow-[0_0_30px_#FF6FAE]" />
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-lg mx-auto">
              <h3 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white font-romantic">
                {displayName} ❤️
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-pink-100 font-medium font-bengali leading-relaxed px-2">
                {language === 'bn'
                  ? 'চিরকাল এভাবেই তোমার পাশে থাকতে চাই, তোমার হাত ধরে ভালোবাসা আর যত্নে পথ চলতে চাই।'
                  : 'Forever and always, I wish to stand beside you, holding your hand through love and gentle care.'}
              </p>
              <p className="font-romantic text-xl sm:text-2xl md:text-3xl text-[#FF6FAE] pt-1">
                ~ {config.senderName || (language === 'bn' ? 'তোমার মানুষ' : 'Yours Always')}
              </p>
            </div>

            {/* Final Action Buttons: Responsive Column on mobile, Row on tablet/desktop */}
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLoveAgainClick}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#E84369]/40 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>{t.finalLoveAgainBtn}</span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </motion.button>

              <button
                onClick={handleReplay}
                className="w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.finalReplayBtn}</span>
              </button>

              <button
                onClick={onReturnHome}
                className="w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                <span>{t.finalBackHomeBtn}</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
