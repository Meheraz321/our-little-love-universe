export type Language = 'bn' | 'en';

export interface PhotoMemory {
  id: string;
  src: string;
  captionBn: string;
  captionEn: string;
  date?: string;
  location?: string;
}

export interface LoveConfig {
  recipientName: string;
  recipientNickname: string;
  senderName: string;
  websiteTitle: string;
  defaultLanguage: Language;
  theme: string;
  anniversaryDate: string; // YYYY-MM-DD
  firstMeetingDate: string; // YYYY-MM-DD
  birthdayDate: string; // YYYY-MM-DD
  customSpecialDateTitleBn?: string;
  customSpecialDateTitleEn?: string;
  enableBackgroundMusic: boolean;
  enableSoundEffects: boolean;
  enablePetalAnimation: boolean;
  enableSecretSurprises: boolean;
  enableCountdown: boolean;
  showPhotoGallery: boolean;
  showVoiceMessage: boolean;
  musicAudioUrl?: string;
  voiceAudioUrl?: string;
  secretGiftMessageBn?: string;
  secretGiftMessageEn?: string;
}

export interface LoveJourneyMessage {
  id: number;
  bn: string;
  en: string;
  subtextBn?: string;
  subtextEn?: string;
}

export interface RomanticCompliment {
  id: number;
  bn: string;
  en: string;
}

export interface RoseVariant {
  id: string;
  nameBn: string;
  nameEn: string;
  color: string;
  petalColor: string;
  stemColor: string;
  messageBn: string;
  messageEn: string;
}
