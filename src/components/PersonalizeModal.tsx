import React, { useState } from 'react';
import { X, Copy, Check, Save, RotateCcw, Sparkles, Sliders } from 'lucide-react';
import { LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { defaultLoveConfig } from '../config/loveConfig';
import { soundEngine } from '../utils/soundEffects';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LoveConfig;
  onSaveConfig: (updated: LoveConfig) => void;
  onResetDefaults: () => void;
  language: Language;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
  language,
}) => {
  const [formData, setFormData] = useState<LoveConfig>(config);
  const [copied, setCopied] = useState(false);
  const t = translations[language];

  if (!isOpen) return null;

  const handleChange = (field: keyof LoveConfig, val: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.enableSoundEffects) soundEngine.playBloomSound();
    onSaveConfig(formData);
    onClose();
  };

  const handleCopyCode = () => {
    const exportCode = `export const loveConfig = ${JSON.stringify(formData, null, 2)};`;
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 max-w-xl w-full shadow-2xl border border-[#FFD6E7] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#FFD6E7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-100 flex items-center justify-center text-[#E84369] shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#35172F]">
                {t.customizeModalTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#35172F]/60">
                {language === 'bn' ? 'ব্যক্তিগত তথ্য ও সেটিংস পরিবর্তন করুন' : 'Edit personal names, dates, and toggles'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-5 pt-3 sm:pt-4">
          {/* Names Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-[#35172F] mb-1">
                {t.recipientNameLabel}
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                placeholder="যেমন: প্রিয় মানুষ"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#35172F] mb-1">
                {t.nicknameLabel}
              </label>
              <input
                type="text"
                value={formData.recipientNickname}
                onChange={(e) => handleChange('recipientNickname', e.target.value)}
                placeholder="যেমন: জানপাখি"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#35172F] mb-1">
              {t.senderNameLabel}
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => handleChange('senderName', e.target.value)}
              placeholder="যেমন: তোমার মানুষ"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
            />
          </div>

          {/* Special Dates Section */}
          <div className="pt-2 border-t border-[#FFD6E7]/60">
            <h4 className="text-xs font-bold text-[#E84369] mb-2 sm:mb-3 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বিশেষ তারিখসমূহ' : 'Special Dates'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#35172F] mb-1">
                  {t.anniversaryLabel}
                </label>
                <input
                  type="date"
                  value={formData.anniversaryDate}
                  onChange={(e) => handleChange('anniversaryDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#35172F] mb-1">
                  {t.firstMeetingLabel}
                </label>
                <input
                  type="date"
                  value={formData.firstMeetingDate}
                  onChange={(e) => handleChange('firstMeetingDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#35172F] mb-1">
                  {t.birthdayLabel}
                </label>
                <input
                  type="date"
                  value={formData.birthdayDate}
                  onChange={(e) => handleChange('birthdayDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="pt-2 border-t border-[#FFD6E7]/60">
            <h4 className="text-xs font-bold text-[#E84369] mb-2 sm:mb-3 uppercase tracking-wider">
              {language === 'bn' ? 'ফিচার চালু / বন্ধ' : 'Feature Toggles'}
            </h4>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-2.5 text-xs text-[#35172F]">
              {[
                { key: 'enableBackgroundMusic' as const, label: language === 'bn' ? 'ব্যাকগ্রাউন্ড মিউজিক' : 'Background Music' },
                { key: 'enableSoundEffects' as const, label: language === 'bn' ? 'শব্দ প্রতিক্রিয়া' : 'Sound Effects' },
                { key: 'enablePetalAnimation' as const, label: language === 'bn' ? 'ভাসমান পাপড়ি' : 'Floating Petals' },
                { key: 'enableCountdown' as const, label: language === 'bn' ? 'কাউন্টডাউন ঘড়ি' : 'Countdown Clock' },
                { key: 'showPhotoGallery' as const, label: language === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery' },
                { key: 'showVoiceMessage' as const, label: language === 'bn' ? 'ভয়েস বার্তা' : 'Voice Message' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer select-none py-0.5">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[item.key])}
                    onChange={(e) => handleChange(item.key, e.target.checked)}
                    className="accent-[#E84369] w-4 h-4 rounded cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 sm:pt-4 border-t border-[#FFD6E7] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-pink-50 text-[#E84369] hover:bg-pink-100 flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                title="Copy configuration code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copiedNotice : t.exportConfigBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData(defaultLoveConfig);
                  onResetDefaults();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#35172F]/60 hover:text-[#E84369] hover:bg-gray-100 flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetDefaults}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold text-[#35172F]/70 hover:bg-gray-100 cursor-pointer min-h-[38px]"
              >
                {t.cancelBtn}
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white text-xs font-semibold shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.saveChangesBtn}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
