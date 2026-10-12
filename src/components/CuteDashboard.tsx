import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, BookOpen, Image, Mail, Flower2, HelpCircle, Calendar, Gift, Star, ArrowRight } from 'lucide-react';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface CuteDashboardProps {
  config: LoveConfig;
  language: Language;
  onNavigate: (sectionId: string) => void;
  visitedSections: Set<string>;
}

export const CuteDashboard: React.FC<CuteDashboardProps> = ({
  config,
  language,
  onNavigate,
  visitedSections,
}) => {
  const t = translations[language];

  const displayName = config.recipientNickname?.trim()
    ? config.recipientNickname
    : config.recipientName?.trim()
    ? config.recipientName
    : language === 'bn'
    ? 'প্রিয় মানুষ'
    : 'Beloved';

  const cards = [
    {
      id: 'story',
      title: t.dashboardCards.story.title,
      desc: t.dashboardCards.story.desc,
      icon: BookOpen,
      gradient: 'from-[#FFD6E7] to-[#FFB6D5]',
      accent: '#FF6FAE',
      badge: '01',
    },
    {
      id: 'memories',
      title: t.dashboardCards.memories.title,
      desc: t.dashboardCards.memories.desc,
      icon: Image,
      gradient: 'from-[#FFF0F5] to-[#FFD6E7]',
      accent: '#E84369',
      badge: '02',
    },
    {
      id: 'letter',
      title: t.dashboardCards.letter.title,
      desc: t.dashboardCards.letter.desc,
      icon: Mail,
      gradient: 'from-[#FFEBF2] to-[#FFD6E7]',
      accent: '#FF6FAE',
      badge: '03',
    },
    {
      id: 'roses',
      title: t.dashboardCards.roses.title,
      desc: t.dashboardCards.roses.desc,
      icon: Flower2,
      gradient: 'from-[#F3E8FF] to-[#E8DCFF]',
      accent: '#A855F7',
      badge: '04',
    },
    {
      id: 'questions',
      title: t.dashboardCards.question.title,
      desc: t.dashboardCards.question.desc,
      icon: HelpCircle,
      gradient: 'from-[#FFF5EB] to-[#FFE4D6]',
      accent: '#F97316',
      badge: '05',
    },
    {
      id: 'countdown',
      title: t.dashboardCards.countdown.title,
      desc: t.dashboardCards.countdown.desc,
      icon: Calendar,
      gradient: 'from-[#FEF9C3] to-[#FDE68A]',
      accent: '#CA8A04',
      badge: '06',
    },
    {
      id: 'secrets',
      title: t.dashboardCards.secrets.title,
      desc: t.dashboardCards.secrets.desc,
      icon: Gift,
      gradient: 'from-[#ECFCCB] to-[#D9F99D]',
      accent: '#65A30D',
      badge: '07',
    },
    {
      id: 'final',
      title: t.dashboardCards.final.title,
      desc: t.dashboardCards.final.desc,
      icon: Star,
      gradient: 'from-[#FFD6E7] via-[#FFB6D5] to-[#E8DCFF]',
      accent: '#E84369',
      badge: '08',
      highlight: true,
    },
  ];

  const totalSections = cards.length;
  const completedCount = cards.filter((c) => visitedSections.has(c.id)).length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  const handleCardClick = (id: string) => {
    if (config.enableSoundEffects) {
      soundEngine.playChime(523.25 + (cards.findIndex((c) => c.id === id) * 40));
    }
    onNavigate(id);
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 py-3 sm:py-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFD6E7]/80 via-[#FFF9F5] to-[#E8DCFF]/70 border border-[#FFB6D5]/60 p-4 sm:p-7 md:p-10 shadow-xs overflow-hidden">
        {/* Decorative Floating Elements */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-2xl sm:text-3xl animate-float-slow select-none opacity-80">🌸</div>
        <div className="absolute bottom-2 left-3 sm:bottom-4 sm:left-6 text-xl sm:text-2xl animate-float-gentle select-none opacity-80">✨</div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10">
          <div className="text-center md:text-left space-y-2.5 sm:space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#FFD6E7] text-xs font-semibold text-[#E84369] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F4D58D]" />
              <span>{t.dashboardTagline}</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#35172F] tracking-tight leading-tight">
              {language === 'bn' ? 'ভালোবাসি তোমাকে,' : 'Endlessly Adoring,'}{' '}
              <span className="text-[#E84369] font-romantic text-3xl xs:text-4xl sm:text-5xl md:text-6xl block sm:inline">
                {displayName}
              </span>{' '}
              ❤️
            </h1>

            <p className="text-[#35172F]/80 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              {language === 'bn'
                ? `আজকের এই ছোট্ট উপহারটি তোমার মুখের এক ফালি সুন্দর হাসির জন্য। নিচে প্রতিটি সারপ্রাইজ অপেক্ষা করছে তোমার স্পর্শের জন্য।`
                : `This little digital sanctuary was handcrafted to bring a tender smile to your face. Each surprise below is waiting just for you.`}
            </p>
          </div>

          {/* Floating animated heart illustration */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-[#FF6FAE]/20 to-[#FFD6E7]/50 blur-xl animate-shimmer-glow absolute" />
            <motion.div
              animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#FF6FAE] via-[#E84369] to-[#FFB6D5] p-1 shadow-lg sm:shadow-xl flex items-center justify-center cursor-pointer"
              onClick={() => handleCardClick('story')}
            >
              <div className="w-full h-full bg-white rounded-[14px] sm:rounded-[22px] flex flex-col items-center justify-center text-center p-2">
                <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-[#E84369] fill-[#E84369] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#35172F] mt-1 max-w-[90px] truncate">
                  {config.senderName || (language === 'bn' ? 'তোমার মানুষ' : 'Yours Always')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar for the Surprises */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#FFD6E7]/70">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#35172F] mb-1.5 sm:mb-2">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E84369]" />
              <span>{t.dashboardProgress}</span>
            </span>
            <span className="text-[#E84369] text-xs sm:text-sm">
              {completedCount} / {totalSections} {t.dashboardCompleted} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-white/80 rounded-full overflow-hidden border border-[#FFD6E7]/80">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#FF6FAE] via-[#E84369] to-[#F4D58D] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Grid of the 8 Interactive Surprise Cards: Responsive Mobile (1 col), Tablet (2-3 col), Desktop (4 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isVisited = visitedSections.has(card.id);

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.35 }}
              onClick={() => handleCardClick(card.id)}
              className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between group border transition-all min-h-[140px] sm:min-h-[160px] ${
                card.highlight
                  ? 'border-[#E84369]/50 shadow-md ring-2 ring-[#FF6FAE]/20'
                  : 'border-[#FFD6E7]'
              }`}
            >
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: card.accent }} />
                </div>
                <div className="flex items-center gap-1.5">
                  {isVisited && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      ✓
                    </span>
                  )}
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#35172F]/40">
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-3 flex-1">
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#35172F] group-hover:text-[#E84369] transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#35172F]/70 line-clamp-2">
                  {card.desc}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#FFD6E7]/50 text-xs font-semibold text-[#E84369]">
                <span>{language === 'bn' ? 'অন্বেষণ করো' : 'Explore'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
