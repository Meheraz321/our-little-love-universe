import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Globe, SlidersHorizontal, Menu, X, BookOpen, Image, Mail, Flower2, HelpCircle, Calendar, Gift, Star } from 'lucide-react';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface NavbarProps {
  config: LoveConfig;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCustomizer: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  language,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenCustomizer,
  soundEnabled,
  onToggleSound
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.home, icon: Heart },
    { id: 'story', label: t.ourStory, icon: BookOpen },
    { id: 'memories', label: t.memories, icon: Image },
    { id: 'letter', label: t.loveLetter, icon: Mail },
    { id: 'roses', label: t.roses, icon: Flower2 },
    { id: 'questions', label: t.questions, icon: HelpCircle },
    { id: 'countdown', label: t.countdown, icon: Calendar },
    { id: 'secrets', label: t.secrets, icon: Gift },
    { id: 'final', label: t.finalSurprise, icon: Star },
  ];

  const handleNavClick = (id: string) => {
    if (soundEnabled) {
      soundEngine.playChime(587.33);
    }
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleToggleLang = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    if (soundEnabled) soundEngine.playChime(659.25);
    onLanguageChange(nextLang);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-[#FFD6E7]/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Logo / Brand */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-1.5 sm:gap-2 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6FAE] rounded-lg p-0.5 sm:p-1 shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#FF6FAE] to-[#E84369] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          </div>
          <div className="max-w-[125px] xs:max-w-[170px] sm:max-w-none">
            <span className="font-bold text-xs sm:text-base text-[#35172F] tracking-tight block leading-tight truncate">
              {language === 'bn' ? 'আমাদের ভালোবাসার জগৎ' : 'Our Love Universe'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#E84369] font-medium block truncate">
              {config.recipientNickname || config.recipientName || '❤️'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links (>= 1024px) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm font-medium text-[#35172F]/80">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#E84369] font-semibold bg-[#FFD6E7]/50'
                    : 'hover:text-[#E84369] hover:bg-pink-50/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Sound / Effects Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? t.soundOff : t.soundOn}
            title={soundEnabled ? t.soundOff : t.soundOn}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-[#35172F]/80 hover:text-[#E84369] hover:bg-pink-50/80 transition-colors cursor-pointer border border-[#FFD6E7]/60"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E84369]" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />}
          </button>

          {/* Language Switch Button */}
          <button
            onClick={handleToggleLang}
            title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            className="h-8 px-2 sm:h-9 sm:px-2.5 rounded-xl flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#35172F]/80 hover:text-[#E84369] hover:bg-pink-50/80 transition-colors cursor-pointer border border-[#FFD6E7]/60"
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF6FAE]" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Customize / Settings Button */}
          <button
            onClick={onOpenCustomizer}
            title={t.customize}
            className="h-8 px-2 sm:h-9 sm:px-2.5 rounded-xl flex items-center gap-1 text-[11px] sm:text-xs font-semibold bg-[#FFD6E7]/50 hover:bg-[#FFD6E7] text-[#E84369] transition-all cursor-pointer border border-[#FF6FAE]/30 shadow-2xs"
          >
            <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{t.customize}</span>
          </button>

          {/* Mobile & Tablet Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-[#35172F] hover:bg-pink-50 transition-colors cursor-pointer border border-[#FFD6E7]/60"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#E84369]" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#FFD6E7] px-3 sm:px-6 py-3 shadow-lg animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#FFD6E7] text-[#E84369] font-bold shadow-2xs'
                      : 'text-[#35172F] hover:bg-pink-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E84369]' : 'text-[#FF6FAE]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
