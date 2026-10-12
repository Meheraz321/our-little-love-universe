import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Heart, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { playfulQuestions } from '../data/loveMessages';
import { soundEngine } from '../utils/soundEffects';

interface LoveQuestionProps {
  config: LoveConfig;
  language: Language;
}

export const LoveQuestion: React.FC<LoveQuestionProps> = ({ config, language }) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const t = translations[language];

  const currentQ = playfulQuestions[questionIdx];

  const handleSelectOption = (choice: 'A' | 'B') => {
    if (config.enableSoundEffects) {
      soundEngine.playBloomSound();
    }

    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.65 },
        colors: ['#FF6FAE', '#FFB6D5', '#E84369', '#FFF9F5'],
      });
    } catch {
      // safe
    }

    setSelectedAnswer(choice);
  };

  const handleNextQuestion = () => {
    if (config.enableSoundEffects) {
      soundEngine.playChime(523.25);
    }
    setSelectedAnswer(null);
    setQuestionIdx((prev) => (prev + 1) % playfulQuestions.length);
  };

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-xl mx-auto text-center px-1 sm:px-2">
      {/* Header */}
      <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.questionTitle}</span>
        </div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#35172F]">
          {language === 'bn' ? currentQ.promptBn : currentQ.promptEn}
        </h2>
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#FFB6D5] shadow-xl relative overflow-hidden">
        {/* Animated Heart Accent */}
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4 sm:mb-6">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#E84369] fill-[#E84369] animate-bounce" />
        </div>

        {/* The Question */}
        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-[#35172F] leading-snug mb-6 sm:mb-8 font-bengali">
          {language === 'bn' ? currentQ.questionBn : currentQ.questionEn}
        </h3>

        {/* Option Buttons: Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectOption('A')}
            className={`py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl font-semibold text-xs sm:text-sm md:text-base border-2 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px] ${
              selectedAnswer === 'A'
                ? 'bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white border-transparent shadow-lg shadow-[#E84369]/20'
                : 'bg-white hover:bg-pink-50/80 text-[#35172F] border-[#FFB6D5]'
            }`}
          >
            <span>{language === 'bn' ? currentQ.optABn : currentQ.optAEn}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectOption('B')}
            className={`py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl font-semibold text-xs sm:text-sm md:text-base border-2 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px] ${
              selectedAnswer === 'B'
                ? 'bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white border-transparent shadow-lg shadow-[#E84369]/20'
                : 'bg-white hover:bg-pink-50/80 text-[#35172F] border-[#FFB6D5]'
            }`}
          >
            <span>{language === 'bn' ? currentQ.optBBn : currentQ.optBEn}</span>
          </motion.button>
        </div>

        {/* Answer Response Reveal */}
        <AnimatePresence>
          {selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF0F5] to-[#FFD6E7]/50 border border-[#FFB6D5] space-y-2.5 sm:space-y-3"
            >
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#E84369]">
                <Sparkles className="w-3.5 h-3.5 text-[#F4D58D]" />
                <span>{language === 'bn' ? 'আমার উত্তর' : 'My Response'}</span>
              </div>

              <p className="text-sm sm:text-base md:text-lg font-medium text-[#35172F] leading-relaxed font-bengali">
                {selectedAnswer === 'A'
                  ? language === 'bn'
                    ? currentQ.ansABn
                    : currentQ.ansAEn
                  : language === 'bn'
                  ? currentQ.ansBBn
                  : currentQ.ansBEn}
              </p>

              {/* Next Question Button */}
              <div className="pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#E84369] bg-white border border-[#FFB6D5] hover:bg-pink-50 inline-flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.nextQuestionBtn}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
