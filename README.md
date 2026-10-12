# Our Little Love Universe ❤️ (আমাদের ছোট্ট ভালোবাসার জগৎ)

A romantic, personalized, interactive love surprise web application handcrafted for your most beloved person. Built with React 19, TypeScript, Vite, Tailwind CSS, Motion, and the Web Audio API.

---

## ✨ Features Included

1. **Magical Welcome Screen (প্রথম জাদুকরী মুহূর্ত)**:
   - Soft pink-to-lavender gradient with floating particles and pulsing heart
   - Animated interactive gift envelope with sound effects and confetti shower
   - Heartfelt Bengali greeting: *"এই যে আমার সবচেয়ে প্রিয় মানুষটা... ❤️"*
   - Personalized name & nickname reveal with smooth entry transition

2. **Cute Love Dashboard (ভালোবাসার ড্যাশবোর্ড)**:
   - Floating interactive heart illustration with romantic dedication
   - Live progress indicator tracking all 8 surprise sections explored
   - 8 interactive pastel glassmorphism cards with smooth hover & touch interactions

3. **Echoes of My Heart (ভালোবাসার অনুভূতিমালা)**:
   - 5 deeply emotional sequential love messages in Bengali and English
   - Typing and smooth fade transitions
   - Interactive heart counter reaction and replay controls

4. **Cherished Photo Memories (আমাদের মিষ্টি স্মৃতির কোণ)**:
   - Pastel photo frames with captions, date, and location labels
   - Responsive masonry/grid layout
   - Fullscreen cinematic Lightbox with keyboard navigation (`←`, `→`, `Esc`)
   - Slideshow mode with auto-advancing photos
   - In-app **"Add New Memory"** uploader allowing custom photos straight from the phone/computer
   - Graceful fallback for missing assets

5. **Interactive Love Letter (তোমার জন্য চিঠি 💌)**:
   - Animated envelope with wax heart seal
   - Seal-breaking & letter sliding animation
   - Complete touching Bengali love letter with sender signature
   - One-click copy letter and replay folding animation

6. **Blooming Rose Garden (ফোটা গোলাপ বাগান 🌹)**:
   - Interactive SVG blooming rose with realistic petal spread
   - Petal shower & tiny heart sparkles on bloom
   - *"আরও একটা গোলাপ চাই 🌹"* button cycling through 5 varieties:
     - Crimson Red (গভীর ভালোবাসার লাল গোলাপ)
     - Blush Pink (স্নিগ্ধ মায়াবী গোলাপি গোলাপ)
     - Pure White (পবিত্র অনুরাগের সাদা গোলাপ)
     - Golden Sun (উজ্জ্বল আনন্দের সোনালী গোলাপ)
     - Enchanted Lavender (স্বপ্নের মতো ল্যাভেন্ডার গোলাপ)

7. **Playful Love Question (মিষ্টি কথোপকথন 💭)**:
   - *"তুমি কি জানো, তুমি আমার কাছে কতটা স্পেশাল?"*
   - *"হ্যাঁ, জানি ❤️"* & *"আরও শুনতে চাই 💗"*
   - Both choices lead to heartwarming, affectionate responses
   - Additional sweet randomized mini-questions

8. **Special Milestones & Countdown (আমাদের বিশেষ দিন ⏳)**:
   - Anniversary, First Meeting Date, and Birthday counters
   - Displays days, hours, minutes, and seconds
   - Past dates calculate days together; future dates count down
   - Bengali numerical formatting and celebration confetti

9. **Secret Surprises & Easter Eggs (লুকানো জাদুর বাক্স 🪄)**:
   - **Secret Heart**: Hidden romantic dream note
   - **Moonlight Wish**: Tender prayer under the moon
   - **Hidden Petal Note**: Secret love whisper
   - **Random Compliment Generator**: 25+ curated heartwarming Bengali & English compliments
   - **Surprise Gift Box**: Customizable gift opening

10. **The Grand Finale Surprise (চূড়ান্ত সারপ্রাইজ 🌟)**:
    - Dedicated 6-phase cinematic experience:
      - **Phase 1: The Glow** (Dreamy starry night transition)
      - **Phase 2: The Heartbeat** (Pulsing central heart)
      - **Phase 3: The Magic** (Luminous particle heart formation)
      - **Phase 4: The Message** (Sequential romantic Bengali thoughts)
      - **Phase 5: Personalized Reveal** (*"[Recipient Nickname], তুমি আমার কাছে ভীষণ স্পেশাল। ❤️"*)
      - **Phase 6: Grand Finale** (*"আবারও তোমাকে ভালোবাসি ❤️"* button with heart shower)

11. **Bilingual System (বাংলা / English)**:
    - Real-time bilingual toggle (`বাং` / `EN`) with instantaneous dictionary updates

12. **Romantic Audio & Voice Player (মিউজিক ও ভয়েস বার্তা 🎶)**:
    - Floating playback widget with play/pause, volume slider, and animated equalizer
    - Built-in Web Audio API synthesizer chime loop so music works **out-of-the-box** with zero audio missing errors!
    - Support for custom background music (`/public/audio/romantic-music.mp3`)
    - Support for personal voice recording (`/public/audio/voice-message.mp3`)

13. **Live Customizer Panel**:
    - Sender can edit names, nickname, dates, and toggle features directly in the browser via the "কাস্টমাইজ" button
    - Changes persist in browser `localStorage`
    - One-click "Copy Config Code" to paste into `src/config/loveConfig.ts`

---

## 🛠️ Personalization Guide

### 1. Changing Names, Nicknames, and Dates

Edit `src/config/loveConfig.ts` or click the **"কাস্টমাইজ" (Customize)** button in the top navigation bar:

```typescript
export const loveConfig = {
  recipientName: "প্রিয় মানুষ", // Full name
  recipientNickname: "জানপাখি", // Pet name / Endearment
  senderName: "তোমার মানুষ", // Your name
  websiteTitle: "Our Little Love Universe",
  defaultLanguage: "bn", // 'bn' or 'en'
  theme: "cute-sweet",
  anniversaryDate: "2024-02-14", // YYYY-MM-DD
  firstMeetingDate: "2023-11-20",
  birthdayDate: "2026-11-05",
  enableBackgroundMusic: true,
  enableSoundEffects: true,
  enablePetalAnimation: true,
  enableSecretSurprises: true,
  enableCountdown: true,
  showPhotoGallery: true,
  showVoiceMessage: true
};
```

### 2. Adding Personal Photographs

1. Place your pictures in `public/images/gallery/` (e.g., `photo-1.jpg`, `photo-2.jpg`).
2. Update the `defaultPhotoMemories` array in `src/config/loveConfig.ts` with your image paths and captions.
3. Or, on the live website, click **"নতুন স্মৃতি যোগ করুন"** in the Photo Gallery to upload directly from your device!

### 3. Adding Background Music & Voice Message

1. **Background Music**: Place an MP3 file at `public/audio/romantic-music.mp3`.
2. **Personal Voice Recording**: Place an MP3 file at `public/audio/voice-message.mp3`.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

---

## 📦 Production Build & Deployment

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploying to Netlify / Vercel
- **Build command**: `npm run build`
- **Output directory**: `dist`

---

## 💝 Designed with Love
Handcrafted to create unforgettable smiles, tender tears of joy, and a digital keepsake for your favorite person.
