import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';

interface CountdownProps {
  config: LoveConfig;
  language: Language;
  onOpenCustomizer: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ config, language, onOpenCustomizer }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<'anniversary' | 'firstMeeting' | 'birthday'>('anniversary');
  const t = translations[language];

  const getDateValue = () => {
    switch (selectedMilestone) {
      case 'anniversary':
        return config.anniversaryDate;
      case 'firstMeeting':
        return config.firstMeetingDate;
      case 'birthday':
        return config.birthdayDate;
      default:
        return '';
    }
  };

  const getMilestoneTitle = () => {
    if (selectedMilestone === 'anniversary') {
      return language === 'bn' ? 'আমাদের বিশেষ বার্ষিকী' : 'Our Anniversary';
    }
    if (selectedMilestone === 'firstMeeting') {
      return language === 'bn' ? 'প্রথম দেখার দিন' : 'First Meeting Date';
    }
    return language === 'bn' ? 'প্রিয় মানুষের জন্মদিন' : "Beloved's Birthday";
  };

  const dateStr = getDateValue();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    isToday: boolean;
    valid: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    isToday: false,
    valid: false,
  });

  useEffect(() => {
    if (!dateStr || isNaN(Date.parse(dateStr))) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isToday: false, valid: false });
      return;
    }

    const calculate = () => {
      const target = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      const isToday = Math.abs(diff) < 24 * 60 * 60 * 1000 && new Date(target).toDateString() === new Date(now).toDateString();
      const isPast = diff < 0;

      const absDiff = Math.abs(diff);
      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast, isToday, valid: true });

      if (isToday) {
        try {
          confetti({ particleCount: 15, spread: 45, origin: { y: 0.7 } });
        } catch {
          // safe
        }
      }
    };

    calculate();
    const interval = window.setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [dateStr]);

  // Convert numbers to Bengali digits if language is bn
  const formatNumber = (num: number) => {
    if (language !== 'bn') return num.toString().padStart(2, '0');
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .padStart(2, '0')
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-2xl mx-auto text-center px-1">
      {/* Header */}
      <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.countdownTitle}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#35172F]">
          {getMilestoneTitle()}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#35172F]/70">
          {t.countdownSubtitle}
        </p>
      </div>

      {/* Milestone Tabs - responsive wrap for phone & tablet */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
        {[
          { key: 'anniversary' as const, label: language === 'bn' ? 'বার্ষিকী' : 'Anniversary' },
          { key: 'firstMeeting' as const, label: language === 'bn' ? 'প্রথম দেখা' : 'First Meeting' },
          { key: 'birthday' as const, label: language === 'bn' ? 'জন্মদিন' : 'Birthday' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedMilestone(tab.key)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border min-h-[38px] ${
              selectedMilestone === tab.key
                ? 'bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white border-transparent shadow-xs'
                : 'bg-white text-[#35172F] border-[#FFD6E7] hover:bg-pink-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Countdown Display */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-[#FFB6D5] shadow-xl relative overflow-hidden">
        {!timeLeft.valid ? (
          <div className="space-y-4 py-4 sm:py-6">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF6FAE] mx-auto animate-bounce" />
            <p className="text-sm sm:text-base font-semibold text-[#35172F]">
              {language === 'bn'
                ? 'এখানে আমাদের বিশেষ দিনের তারিখ যোগ করো। ❤️'
                : 'Add our special milestone date here. ❤️'}
            </p>
            <button
              onClick={onOpenCustomizer}
              className="px-5 py-2.5 rounded-xl bg-[#E84369] text-white text-xs font-semibold hover:bg-[#d4375b] transition-all cursor-pointer"
            >
              {t.editDate}
            </button>
          </div>
        ) : timeLeft.isToday ? (
          <div className="space-y-4 py-4 sm:py-6">
            <PartyPopper className="w-12 h-12 sm:w-16 sm:h-16 text-[#E84369] mx-auto animate-bounce" />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E84369] font-bengali">
              {t.specialDayArrived}
            </h3>
            <p className="text-sm sm:text-base text-[#35172F]/80">
              {config.recipientNickname || config.recipientName} ❤️
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E84369] mb-4 sm:mb-6">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{timeLeft.isPast ? t.daysTogether : t.timeRemaining}</span>
            </div>

            {/* Responsive 4-Column Time Tiles */}
            <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-4 max-w-lg mx-auto">
              {[
                { label: t.days, val: formatNumber(timeLeft.days) },
                { label: t.hours, val: formatNumber(timeLeft.hours) },
                { label: t.minutes, val: formatNumber(timeLeft.minutes) },
                { label: t.seconds, val: formatNumber(timeLeft.seconds) },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/85 rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-[#FFD6E7] shadow-2xs flex flex-col items-center justify-center"
                >
                  <span className="text-lg xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E84369] font-mono leading-none">
                    {item.val}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#35172F]/70 mt-1 sm:mt-2 truncate w-full">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtext info */}
            <p className="text-xs sm:text-sm text-[#35172F]/65 mt-5 sm:mt-6 font-medium">
              {timeLeft.isPast
                ? language === 'bn'
                  ? 'প্রতিটি দিন তোমার সাথে যেন একটি নতুন আশীর্বাদ ✨'
                  : 'Every single day with you is a cherished blessing ✨'
                : language === 'bn'
                ? 'কাঙ্ক্ষিত দিনটি উদযাপনের অপেক্ষায় হৃদয় 💖'
                : 'Eagerly counting down to celebrate our moment 💖'}
            </p>
          </div>
        )}

        {/* Change Date Button */}
        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#FFD6E7]/60">
          <button
            onClick={onOpenCustomizer}
            className="text-xs font-semibold text-[#E84369] hover:underline cursor-pointer"
          >
            {t.editDate}
          </button>
        </div>
      </div>
    </section>
  );
};
