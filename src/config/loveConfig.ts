import { LoveConfig, PhotoMemory } from '../types';

export const defaultLoveConfig: LoveConfig = {
  recipientName: "প্রিয় মানুষ",
  recipientNickname: "জানপাখি",
  senderName: "তোমার মানুষ",
  websiteTitle: "Our Little Love Universe",
  defaultLanguage: "bn",
  theme: "cute-sweet",
  anniversaryDate: "2024-02-14",
  firstMeetingDate: "2023-11-20",
  birthdayDate: "2026-11-05",
  customSpecialDateTitleBn: "আমাদের প্রথম দেখা",
  customSpecialDateTitleEn: "Our First Meeting",
  enableBackgroundMusic: true,
  enableSoundEffects: true,
  enablePetalAnimation: true,
  enableSecretSurprises: true,
  enableCountdown: true,
  showPhotoGallery: true,
  showVoiceMessage: true,
  musicAudioUrl: "/audio/romantic-music.mp3",
  voiceAudioUrl: "/audio/voice-message.mp3",
  secretGiftMessageBn: "তুমি আমার জীবনের সবচেয়ে মূল্যবান উপহার! প্রতিটি দিন তোমার সাথে যেন একটি রূপকথা। ভালোবাসি তোমাকে অনন্তকাল! 🎁💖",
  secretGiftMessageEn: "You are the most precious gift of my life! Every single day with you feels like a fairytale. Love you endlessly! 🎁💖"
};

const STORAGE_KEY = "our_little_love_universe_config_v1";
const PHOTOS_STORAGE_KEY = "our_little_love_universe_photos_v1";

// Helper to get saved config or default
export function getStoredLoveConfig(): LoveConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultLoveConfig, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Could not load config from localStorage", e);
  }
  return defaultLoveConfig;
}

// Helper to save updated config
export function saveStoredLoveConfig(config: LoveConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn("Could not save config to localStorage", e);
  }
}

// Default photo memories with romantic SVG placeholders & captions
export const defaultPhotoMemories: PhotoMemory[] = [
  {
    id: "memory-1",
    src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    captionBn: "এই মুহূর্তটা আমার খুব প্রিয়। তোমার হাসির মধ্যে অদ্ভুত এক শান্তি আছে। ❤️",
    captionEn: "One of my favorite moments. There is a magical peace in your smile. ❤️",
    date: "স্মরণীয় দিন",
    location: "আমাদের প্রিয় স্থান"
  },
  {
    id: "memory-2",
    src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
    captionBn: "তোমার হাত ধরে হেঁটে চলার অনুভূতি যে কতটা স্পেশাল, তা শুধু আমি জানি। 🌸",
    captionEn: "Walking hand in hand with you is a feeling so precious words can't capture. 🌸",
    date: "বৃষ্টিভেজা সন্ধ্যা",
    location: "নদীর পাড়"
  },
  {
    id: "memory-3",
    src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    captionBn: "তোমার সাথে কাটানো প্রতিটি সাধারণ মুহূর্তও স্মৃতি হয়ে উজ্জ্বল থাকে। ✨",
    captionEn: "Every simple moment spent with you shines brightly in my memories. ✨",
    date: "মিষ্টি বিকেল",
    location: "আমাদের গোপন কোণ"
  },
  {
    id: "memory-4",
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    captionBn: "তোমার চোখের দিকে তাকালে সারা পৃথিবীর কোলাহল থেমে যায়। 💖",
    captionEn: "Looking into your eyes makes the whole chaotic world quiet down. 💖",
    date: "প্রথম দেখার স্মৃতি",
    location: "ক্যাফেটেরিয়া"
  },
  {
    id: "memory-5",
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    captionBn: "তুমি হাসলে মনে হয় চারিদিকে বসন্তের ফুল ফুটে উঠেছে। 🌹",
    captionEn: "When you smile, it feels like spring flowers blooming everywhere. 🌹",
    date: "রোদের মিষ্টি আলো",
    location: "খোলা আকাশ"
  },
  {
    id: "memory-6",
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80",
    captionBn: "একসাথে কাটানো আরও হাজার বছর যেন এভাবেই ভালোবেসে চলে যায়। 💫",
    captionEn: "May a thousand years together be as deeply cherished and loving as today. 💫",
    date: "আমাদের স্বপ্ন",
    location: "অনন্ত ভালোবাসা"
  }
];

export function getStoredPhotoMemories(): PhotoMemory[] {
  try {
    const saved = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load photos from localStorage", e);
  }
  return defaultPhotoMemories;
}

export function saveStoredPhotoMemories(photos: PhotoMemory[]): void {
  try {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.warn("Could not save photos to localStorage", e);
  }
}
