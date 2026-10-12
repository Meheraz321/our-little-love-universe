import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Mic, Music, ChevronUp, ChevronDown, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface MusicPlayerProps {
  config: LoveConfig;
  language: Language;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ config, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isUsingSynthesizer, setIsUsingSynthesizer] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Defaults to compact floating bubble on mobile
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceError, setVoiceError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const t = translations[language];

  // Sync volume with soundEngine & audio element
  useEffect(() => {
    soundEngine.setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (voiceRef.current) {
      voiceRef.current.volume = volume;
    }
  }, [volume]);

  // Sync mute
  useEffect(() => {
    soundEngine.setMuted(isMuted);
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (voiceRef.current) {
      voiceRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      if (audioRef.current && !isUsingSynthesizer) {
        audioRef.current.pause();
      }
      soundEngine.stopAmbientSynthesizer();
      setIsPlaying(false);
    } else {
      if (audioRef.current && config.musicAudioUrl && !audioError) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsUsingSynthesizer(false);
          })
          .catch(() => {
            setIsUsingSynthesizer(true);
            soundEngine.startAmbientSynthesizer();
            setIsPlaying(true);
          });
      } else {
        setIsUsingSynthesizer(true);
        soundEngine.startAmbientSynthesizer();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
    if (isPlaying) {
      setIsUsingSynthesizer(true);
      soundEngine.startAmbientSynthesizer();
    }
  };

  const handleToggleVoice = () => {
    if (isVoicePlaying) {
      if (voiceRef.current) voiceRef.current.pause();
      setIsVoicePlaying(false);
    } else {
      if (voiceRef.current) {
        voiceRef.current
          .play()
          .then(() => {
            setIsVoicePlaying(true);
            setVoiceError(false);
          })
          .catch(() => {
            setVoiceError(true);
            soundEngine.playBloomSound();
          });
      }
    }
  };

  return (
    <>
      {/* Hidden HTML5 Audio Elements */}
      <audio
        ref={audioRef}
        src={config.musicAudioUrl || '/audio/romantic-music.mp3'}
        loop
        preload="auto"
        onError={handleAudioError}
      />
      <audio
        ref={voiceRef}
        src={config.voiceAudioUrl || '/audio/voice-message.mp3'}
        preload="auto"
        onError={() => setVoiceError(true)}
        onEnded={() => setIsVoicePlaying(false)}
      />

      {/* Floating Bottom Music Player with Responsive Compact/Expanded States */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40">
        <AnimatePresence mode="wait">
          {isMinimized ? (
            /* Compact Floating Round Badge for Mobile/Tablet */
            <motion.div
              key="minimized-pill"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5 p-1.5 pr-3 bg-white/95 backdrop-blur-md rounded-full border border-[#FFD6E7] shadow-lg shadow-[#E84369]/15 cursor-pointer select-none group"
              onClick={() => setIsMinimized(false)}
              title={isPlaying ? t.musicPause : t.musicPlay}
            >
              <button
                onClick={handleTogglePlay}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-gradient-to-tr from-[#FF6FAE] to-[#E84369] text-white shadow-xs'
                    : 'bg-pink-100 text-[#E84369]'
                }`}
                aria-label={isPlaying ? t.musicPause : t.musicPlay}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <div className="flex items-center gap-1 text-[11px] font-bold text-[#35172F]">
                <Music className="w-3 h-3 text-[#E84369]" />
                <span className="hidden xs:inline sm:inline max-w-[80px] truncate">
                  {isPlaying ? (language === 'bn' ? 'বাজছে' : 'Playing') : (language === 'bn' ? 'সঙ্গীত' : 'Music')}
                </span>
                {isPlaying && (
                  <span className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 bg-[#E84369] rounded-full animate-bounce h-2" />
                    <span className="w-0.5 bg-[#FF6FAE] rounded-full animate-pulse h-2.5" />
                    <span className="w-0.5 bg-[#F4D58D] rounded-full animate-bounce h-1.5" />
                  </span>
                )}
              </div>

              <Maximize2 className="w-3 h-3 text-[#35172F]/50 group-hover:text-[#E84369] ml-1" />
            </motion.div>
          ) : (
            /* Full Expanded Controller for Desktop, Tablet & Phone */
            <motion.div
              key="expanded-bar"
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#FFD6E7] shadow-xl p-2.5 sm:p-3 w-[calc(100vw-24px)] max-w-[320px] sm:max-w-sm flex flex-col gap-2"
            >
              {/* Main Bar Row */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Play/Pause Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTogglePlay}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
                    isPlaying
                      ? 'bg-gradient-to-tr from-[#FF6FAE] to-[#E84369] text-white shadow-pink-200'
                      : 'bg-pink-50 hover:bg-pink-100 text-[#E84369]'
                  }`}
                  title={isPlaying ? t.musicPause : t.musicPlay}
                  aria-label={isPlaying ? t.musicPause : t.musicPlay}
                >
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />}
                </motion.button>

                {/* Track Info & Equalizer */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35172F]">
                    <Music className="w-3.5 h-3.5 text-[#E84369] shrink-0" />
                    <span className="truncate">
                      {isUsingSynthesizer ? (language === 'bn' ? 'মিষ্টি রোমান্টিক সুর ✨' : 'Romantic Chime ✨') : t.romanticMelody}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    {isPlaying ? (
                      <div className="flex items-end gap-1 h-3">
                        <span className="w-1 bg-[#E84369] rounded-full animate-pulse h-2" />
                        <span className="w-1 bg-[#FF6FAE] rounded-full animate-bounce h-3" />
                        <span className="w-1 bg-[#F4D58D] rounded-full animate-pulse h-1.5" />
                        <span className="w-1 bg-[#E84369] rounded-full animate-bounce h-2.5" />
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#35172F]/50 truncate">
                        {language === 'bn' ? 'ট্যাপ করে শুনুন' : 'Tap to play melody'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Voice Message trigger */}
                {config.showVoiceMessage && (
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E84369] flex items-center justify-center transition-colors cursor-pointer border border-[#FFD6E7] shrink-0"
                    title={t.voiceTitle}
                  >
                    <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}

                {/* Expand More Options Toggle */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#35172F]/50 hover:text-[#35172F] p-1 cursor-pointer shrink-0"
                  title="Volume & details"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>

                {/* Minimize to Floating Bubble */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-[#35172F]/50 hover:text-[#E84369] p-1 cursor-pointer shrink-0"
                  title="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Expanded volume & details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pt-2 border-t border-[#FFD6E7]/60 space-y-2 text-xs overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-[#35172F]/70 hover:text-[#E84369] cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-[#E84369] h-1.5 bg-pink-100 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-[#35172F]/70 w-7 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>

                    {isUsingSynthesizer && (
                      <p className="text-[10px] text-[#E84369]/80 font-medium leading-tight">
                        {t.musicMissing}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice Message Dialog */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-sm w-full shadow-2xl border border-[#FFD6E7] text-center space-y-4 sm:space-y-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto text-[#E84369]">
              <Mic className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#35172F]">
                {t.voiceTitle}
              </h3>
              <p className="text-xs text-[#35172F]/70">
                {language === 'bn'
                  ? 'তোমার মানুষটির নিজের কণ্ঠে মিষ্টি অনুভূতি'
                  : 'A personal spoken note straight from the heart'}
              </p>
            </div>

            {/* Voice player button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleToggleVoice}
              className={`w-full py-3 sm:py-3.5 px-5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                isVoicePlaying
                  ? 'bg-gradient-to-r from-[#E84369] to-[#FF6FAE] text-white'
                  : 'bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white'
              }`}
            >
              {isVoicePlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{t.voicePlaying}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t.voiceBtn}</span>
                </>
              )}
            </motion.button>

            {voiceError && (
              <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-left text-xs text-[#35172F]/80 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-[#E84369]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ভয়েস অডিও ফাইল যোগ করার নিয়ম:' : 'How to add your voice recording:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার রেকর্ড করা অডিওটি public/audio/voice-message.mp3 ফাইলে প্রতিস্থাপন করুন।'
                    : 'Place your recorded audio file at public/audio/voice-message.mp3.'}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (isVoicePlaying && voiceRef.current) voiceRef.current.pause();
                setIsVoicePlaying(false);
                setIsVoiceModalOpen(false);
              }}
              className="text-xs font-semibold text-[#35172F]/60 hover:text-[#35172F] cursor-pointer"
            >
              {translations[language].closeLightbox}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
