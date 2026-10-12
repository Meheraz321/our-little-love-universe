import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Heart, Home, BookOpen, Image, Mail, Star } from 'lucide-react';
import { Language, LoveConfig, PhotoMemory } from './types';
import {
  getStoredLoveConfig,
  saveStoredLoveConfig,
  getStoredPhotoMemories,
  saveStoredPhotoMemories,
  defaultLoveConfig,
  defaultPhotoMemories,
} from './config/loveConfig';
import { soundEngine } from './utils/soundEffects';

import { HeartParticles } from './components/HeartParticles';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { CuteDashboard } from './components/CuteDashboard';
import { LoveJourney } from './components/LoveJourney';
import { PhotoGallery } from './components/PhotoGallery';
import { LoveLetter } from './components/LoveLetter';
import { RoseGarden } from './components/RoseGarden';
import { LoveQuestion } from './components/LoveQuestion';
import { Countdown } from './components/Countdown';
import { SecretSurprises } from './components/SecretSurprises';
import { FinalSurprise } from './components/FinalSurprise';
import { MusicPlayer } from './components/MusicPlayer';
import { PersonalizeModal } from './components/PersonalizeModal';

export default function App() {
  const [config, setConfig] = useState<LoveConfig>(getStoredLoveConfig);
  const [photos, setPhotos] = useState<PhotoMemory[]>(getStoredPhotoMemories);
  const [language, setLanguage] = useState<Language>(config.defaultLanguage || 'bn');
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(config.enableSoundEffects ?? true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId !== 'dashboard') {
      setVisitedSections((prev) => new Set(prev).add(sectionId));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterUniverse = () => {
    setHasEntered(true);
    setActiveSection('dashboard');
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setMuted(!next);
  };

  const handleSaveConfig = (updated: LoveConfig) => {
    setConfig(updated);
    saveStoredLoveConfig(updated);
    setSoundEnabled(updated.enableSoundEffects);
  };

  const handleResetDefaults = () => {
    setConfig(defaultLoveConfig);
    saveStoredLoveConfig(defaultLoveConfig);
  };

  const handleAddPhotoMemory = (newMemory: PhotoMemory) => {
    const updated = [newMemory, ...photos];
    setPhotos(updated);
    saveStoredPhotoMemories(updated);
  };

  const handleUpdatePhotoMemory = (updatedMemory: PhotoMemory) => {
    const updated = photos.map((p) => (p.id === updatedMemory.id ? updatedMemory : p));
    setPhotos(updated);
    saveStoredPhotoMemories(updated);
  };

  const handleDeletePhotoMemory = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    saveStoredPhotoMemories(updated);
  };

  const handleResetPhotoMemories = () => {
    const resetList = [...defaultPhotoMemories];
    setPhotos(resetList);
    saveStoredPhotoMemories(resetList);
  };

  const sectionOrder = [
    'dashboard',
    'story',
    'memories',
    'letter',
    'roses',
    'questions',
    'countdown',
    'secrets',
    'final',
  ];

  const currentSectionIdx = sectionOrder.indexOf(activeSection);
  const prevSection = currentSectionIdx > 0 ? sectionOrder[currentSectionIdx - 1] : null;
  const nextSection = currentSectionIdx < sectionOrder.length - 1 ? sectionOrder[currentSectionIdx + 1] : null;

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#35172F] selection:bg-[#FFD6E7] selection:text-[#E84369] relative flex flex-col font-bengali">
      {/* Floating Ambient Hearts / Petals */}
      <HeartParticles enabled={config.enablePetalAnimation} count={22} />

      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <WelcomeScreen
            key="welcome"
            config={config}
            language={language}
            onEnter={handleEnterUniverse}
            onStartMusicPrompt={() => {}}
          />
        ) : (
          <div key="main-app" className="relative z-10 flex flex-col min-h-screen pb-16 sm:pb-0">
            {/* Top Navigation */}
            <Navbar
              config={config}
              language={language}
              onLanguageChange={handleLanguageChange}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onOpenCustomizer={() => setIsCustomizerOpen(true)}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />

            {/* Main Content Area */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6 pb-24 sm:pb-20">
              {/* Contextual Sub-bar when viewing a surprise */}
              {activeSection !== 'dashboard' && (
                <div className="flex items-center justify-between py-1.5 sm:py-2 mb-2 sm:mb-4 bg-white/60 backdrop-blur-xs px-2.5 sm:px-4 rounded-xl border border-[#FFD6E7]/60">
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E84369] hover:text-[#d4375b] p-1.5 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer min-h-[36px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{language === 'bn' ? 'মূল পাতা' : 'Dashboard'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {prevSection && prevSection !== 'dashboard' && (
                      <button
                        onClick={() => handleNavigate(prevSection)}
                        className="p-1.5 rounded-lg text-xs font-semibold text-[#35172F]/70 hover:bg-pink-50 hover:text-[#E84369] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
                        title="Previous surprise"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {nextSection && (
                      <button
                        onClick={() => handleNavigate(nextSection)}
                        className="px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#FFD6E7] text-[#E84369] hover:bg-[#FFB6D5] flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                        title="Next surprise"
                      >
                        <span>{language === 'bn' ? 'পরেরটি' : 'Next'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Dynamic Section Renderer */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === 'dashboard' && (
                    <CuteDashboard
                      config={config}
                      language={language}
                      onNavigate={handleNavigate}
                      visitedSections={visitedSections}
                    />
                  )}

                  {activeSection === 'story' && (
                    <LoveJourney config={config} language={language} />
                  )}

                  {activeSection === 'memories' && (
                    <PhotoGallery
                      config={config}
                      language={language}
                      memories={photos}
                      onAddMemory={handleAddPhotoMemory}
                      onUpdateMemory={handleUpdatePhotoMemory}
                      onDeleteMemory={handleDeletePhotoMemory}
                      onResetMemories={handleResetPhotoMemories}
                    />
                  )}

                  {activeSection === 'letter' && (
                    <LoveLetter config={config} language={language} />
                  )}

                  {activeSection === 'roses' && (
                    <RoseGarden config={config} language={language} />
                  )}

                  {activeSection === 'questions' && (
                    <LoveQuestion config={config} language={language} />
                  )}

                  {activeSection === 'countdown' && (
                    <Countdown
                      config={config}
                      language={language}
                      onOpenCustomizer={() => setIsCustomizerOpen(true)}
                    />
                  )}

                  {activeSection === 'secrets' && (
                    <SecretSurprises config={config} language={language} />
                  )}

                  {activeSection === 'final' && (
                    <FinalSurprise
                      config={config}
                      language={language}
                      onReturnHome={() => handleNavigate('dashboard')}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Mobile Bottom Quick Navigation Bar (shown on screens < 768px) */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#FFD6E7] py-1.5 px-3 flex items-center justify-around shadow-lg">
              {[
                { id: 'dashboard', label: language === 'bn' ? 'হোম' : 'Home', icon: Home },
                { id: 'story', label: language === 'bn' ? 'গল্প' : 'Story', icon: BookOpen },
                { id: 'memories', label: language === 'bn' ? 'ছবি' : 'Photos', icon: Image },
                { id: 'letter', label: language === 'bn' ? 'চিঠি' : 'Letter', icon: Mail },
                { id: 'final', label: language === 'bn' ? 'সারপ্রাইজ' : 'Surprise', icon: Star },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.id)}
                    className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all min-w-[50px] cursor-pointer ${
                      isActive ? 'text-[#E84369] font-bold scale-105' : 'text-[#35172F]/60 hover:text-[#E84369]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                    <span className="text-[10px] mt-0.5">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Floating Music Player Widget */}
            {config.enableBackgroundMusic && (
              <MusicPlayer config={config} language={language} />
            )}

            {/* Footer */}
            <footer className="border-t border-[#FFD6E7]/80 py-5 sm:py-6 text-center text-xs text-[#35172F]/60 mt-8 sm:mt-12 bg-white/40 backdrop-blur-xs">
              <div className="max-w-md mx-auto px-4 space-y-1">
                <p className="flex items-center justify-center gap-1.5 font-medium">
                  <span>{language === 'bn' ? 'ভালোবাসা দিয়ে তৈরি' : 'Handcrafted with love for'}</span>
                  <span className="text-[#E84369] font-bold">
                    {config.recipientNickname || config.recipientName}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-[#E84369] fill-[#E84369]" />
                </p>
                <p className="text-[11px] text-[#35172F]/40">
                  {config.websiteTitle} · {new Date().getFullYear()}
                </p>
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>

      {/* Live Customizer Modal */}
      <PersonalizeModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetDefaults={handleResetDefaults}
        language={language}
      />
    </div>
  );
}
