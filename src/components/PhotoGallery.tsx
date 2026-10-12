import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ChevronLeft, ChevronRight, Play, Pause, Plus, Image as ImageIcon, Calendar, MapPin, Sparkles, Edit3, Trash2, RotateCcw, Upload, Link as LinkIcon } from 'lucide-react';
import { PhotoMemory, LoveConfig, Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/soundEffects';

interface PhotoGalleryProps {
  config: LoveConfig;
  language: Language;
  memories: PhotoMemory[];
  onAddMemory: (newMemory: PhotoMemory) => void;
  onUpdateMemory: (updatedMemory: PhotoMemory) => void;
  onDeleteMemory: (id: string) => void;
  onResetMemories: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  config,
  language,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onResetMemories,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);

  // State for Adding a new memory
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCaptionBn, setNewCaptionBn] = useState('');
  const [newCaptionEn, setNewCaptionEn] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // State for Editing/Replacing an existing photo
  const [editingPhoto, setEditingPhoto] = useState<PhotoMemory | null>(null);
  const [editCaptionBn, setEditCaptionBn] = useState('');
  const [editCaptionEn, setEditCaptionEn] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageUrlInput, setEditImageUrlInput] = useState('');

  const t = translations[language];

  // Slideshow timer
  useEffect(() => {
    let timer: number | null = null;
    if (isSlideshowPlaying && memories.length > 0) {
      timer = window.setInterval(() => {
        setSelectedPhotoIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % memories.length;
        });
      }, 3500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSlideshowPlaying, memories.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
        setIsSlideshowPlaying(false);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % memories.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + memories.length) % memories.length : memories.length - 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, memories.length]);

  const handleOpenPhoto = (idx: number) => {
    if (config.enableSoundEffects) soundEngine.playChime(523.25);
    setSelectedPhotoIndex(idx);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
    setIsSlideshowPlaying(false);
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (config.enableSoundEffects) soundEngine.playChime(587.33);
    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % memories.length : 0));
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (config.enableSoundEffects) soundEngine.playChime(493.88);
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev - 1 + memories.length) % memories.length : memories.length - 1
    );
  };

  const handleToggleSlideshow = () => {
    if (!isSlideshowPlaying && selectedPhotoIndex === null && memories.length > 0) {
      setSelectedPhotoIndex(0);
    }
    setIsSlideshowPlaying(!isSlideshowPlaying);
    if (config.enableSoundEffects) soundEngine.playChime(659.25);
  };

  // Add Memory Handlers
  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
        setNewImageUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = newImagePreview || newImageUrlInput.trim();
    if (!finalSrc) return;

    const newMem: PhotoMemory = {
      id: `memory-${Date.now()}`,
      src: finalSrc,
      captionBn: newCaptionBn || 'আমাদের অন্যতম সেরা মুহূর্ত ❤️',
      captionEn: newCaptionEn || 'One of our most cherished moments ❤️',
      date: newDate || (language === 'bn' ? 'মধুর মুহূর্ত' : 'Special Moment'),
      location: newLocation || (language === 'bn' ? 'আমাদের ভালোবাসার জগৎ' : 'Our Haven'),
    };

    onAddMemory(newMem);
    setIsAddModalOpen(false);
    setNewImagePreview(null);
    setNewImageUrlInput('');
    setNewCaptionBn('');
    setNewCaptionEn('');
    setNewDate('');
    setNewLocation('');
    if (config.enableSoundEffects) soundEngine.playBloomSound();
  };

  // Edit / Replace Photo Handlers
  const handleStartEdit = (photo: PhotoMemory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (config.enableSoundEffects) soundEngine.playChime(587.33);
    setEditingPhoto(photo);
    setEditImagePreview(photo.src);
    setEditImageUrlInput('');
    setEditCaptionBn(photo.captionBn);
    setEditCaptionEn(photo.captionEn);
    setEditDate(photo.date || '');
    setEditLocation(photo.location || '');
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
        setEditImageUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const finalSrc = editImagePreview || editImageUrlInput.trim() || editingPhoto.src;

    const updated: PhotoMemory = {
      ...editingPhoto,
      src: finalSrc,
      captionBn: editCaptionBn.trim() || editingPhoto.captionBn,
      captionEn: editCaptionEn.trim() || editingPhoto.captionEn,
      date: editDate.trim(),
      location: editLocation.trim(),
    };

    onUpdateMemory(updated);
    setEditingPhoto(null);
    if (config.enableSoundEffects) soundEngine.playBloomSound();
  };

  const handleDelete = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(
      language === 'bn'
        ? 'আপনি কি নিশ্চিত যে এই ছবিটি মুছে ফেলতে চান?'
        : 'Are you sure you want to delete this photo?'
    );
    if (confirmed) {
      onDeleteMemory(photoId);
      if (selectedPhotoIndex !== null) setSelectedPhotoIndex(null);
      if (config.enableSoundEffects) soundEngine.playChime(440);
    }
  };

  return (
    <section className="py-4 sm:py-8 md:py-10 max-w-5xl mx-auto px-1 sm:px-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 text-center sm:text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD6E7]/60 text-xs font-semibold text-[#E84369] mb-1.5 sm:mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#E84369]" />
            <span>
              {memories.length} {language === 'bn' ? 'টি প্রিয় স্মৃতি' : 'Cherished Memories'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#35172F]">
            {t.galleryTitle}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#35172F]/70 mt-1">
            {language === 'bn'
              ? 'যেকোনো ছবির উপর "ছবি পরিবর্তন" বাটনে ক্লিক করে আপনার নিজের ছবি যোগ করুন ❤️'
              : 'Click "Change / Edit" on any photo to replace it with your own pictures ❤️'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
          {memories.length > 0 && (
            <button
              onClick={handleToggleSlideshow}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer border min-h-[40px] ${
                isSlideshowPlaying
                  ? 'bg-[#E84369] text-white border-[#E84369]'
                  : 'bg-white text-[#35172F] border-[#FFD6E7] hover:bg-pink-50'
              }`}
            >
              {isSlideshowPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{t.slideshowPause}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#E84369]" />
                  <span>{t.slideshowPlay}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white flex items-center gap-1.5 sm:gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMemoryBtn}</span>
          </button>

          <button
            onClick={onResetMemories}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-[#35172F]/60 hover:text-[#E84369] hover:bg-pink-50 border border-[#FFD6E7]/60 transition-colors flex items-center gap-1 cursor-pointer min-h-[40px]"
            title={language === 'bn' ? 'ডিফল্ট ছবি ফিরিয়ে আনুন' : 'Reset default photos'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'bn' ? 'ডিফল্ট ছবি' : 'Reset'}
            </span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {memories.length === 0 ? (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto text-[#E84369]">
            <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#35172F]">{t.emptyGallery}</h3>
          <p className="text-xs sm:text-sm text-[#35172F]/70">{t.emptyGalleryHelp}</p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#E84369] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMemoryBtn}</span>
            </button>
            <button
              onClick={onResetMemories}
              className="px-4 py-2 rounded-xl border border-[#FFD6E7] bg-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer text-[#35172F]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'bn' ? 'ডিফল্ট ছবি আনুন' : 'Load Default Photos'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Responsive Photo Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {memories.map((photo, idx) => (
            <motion.div
              key={photo.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleOpenPhoto(idx)}
              className="glass-card rounded-2xl overflow-hidden border border-[#FFD6E7] shadow-xs hover:shadow-xl hover:shadow-[#E84369]/10 cursor-pointer group flex flex-col relative"
            >
              {/* Photo Image with Quick Action Controls */}
              <div className="relative aspect-4/3 w-full bg-pink-50 overflow-hidden">
                <img
                  src={photo.src}
                  alt={language === 'bn' ? photo.captionBn : photo.captionEn}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Top Action Buttons (Edit & Delete) - Always readily accessible */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  <button
                    onClick={(e) => handleStartEdit(photo, e)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#E84369] hover:text-[#d4375b] text-xs font-bold shadow-md flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer border border-[#FFD6E7]"
                    title={language === 'bn' ? 'ছবি পরিবর্তন / এডিট করুন' : 'Change / Edit Photo'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(photo.id, e)}
                    className="p-1.5 rounded-lg bg-white/85 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow-md transition-all cursor-pointer border border-[#FFD6E7]"
                    title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Lightbox hint on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
                  <span className="text-white text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4D58D]" />
                    {t.openLightbox}
                  </span>
                </div>
              </div>

              {/* Photo Caption & Metadata */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs sm:text-sm font-medium text-[#35172F] leading-snug line-clamp-2">
                  {language === 'bn' ? photo.captionBn : photo.captionEn}
                </p>

                {(photo.date || photo.location) && (
                  <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-[#35172F]/60 pt-2 border-t border-[#FFD6E7]/50">
                    {photo.date && (
                      <span className="flex items-center gap-1 truncate">
                        <Calendar className="w-3 h-3 text-[#FF6FAE] shrink-0" />
                        <span className="truncate">{photo.date}</span>
                      </span>
                    )}
                    {photo.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#FF6FAE] shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={handleCloseLightbox}
          >
            <div
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Top Bar */}
              <div className="w-full flex items-center justify-between pb-2 px-1 text-white">
                <span className="text-xs font-semibold text-white/70">
                  {selectedPhotoIndex + 1} / {memories.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const photo = memories[selectedPhotoIndex];
                      handleStartEdit(photo);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Photo'}</span>
                  </button>

                  <button
                    onClick={handleCloseLightbox}
                    className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label={t.closeLightbox}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative w-full max-h-[62vh] sm:max-h-[72vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/50">
                <motion.img
                  key={memories[selectedPhotoIndex].id}
                  src={memories[selectedPhotoIndex].src}
                  alt={
                    language === 'bn'
                      ? memories[selectedPhotoIndex].captionBn
                      : memories[selectedPhotoIndex].captionEn
                  }
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="max-h-[60vh] sm:max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
                />

                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Caption in Lightbox */}
              <div className="w-full text-center mt-3 sm:mt-4 px-2 sm:px-4 text-white">
                <p className="text-sm sm:text-base md:text-lg font-medium text-pink-100 max-w-2xl mx-auto leading-relaxed">
                  {language === 'bn'
                    ? memories[selectedPhotoIndex].captionBn
                    : memories[selectedPhotoIndex].captionEn}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-white/60 mt-1">
                  {memories[selectedPhotoIndex].date && (
                    <span>· {memories[selectedPhotoIndex].date}</span>
                  )}
                  {memories[selectedPhotoIndex].location && (
                    <span>· {memories[selectedPhotoIndex].location}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT / REPLACE PHOTO MODAL (ছবি পরিবর্তন / এডিট করুন) */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl border border-[#FFD6E7] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FFD6E7]">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#35172F] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#E84369]" />
                  <span>{language === 'bn' ? 'ছবি ও ক্যাপশন পরিবর্তন করুন' : 'Change / Replace Photo'}</span>
                </h3>
                <p className="text-xs text-[#35172F]/60">
                  {language === 'bn' ? 'আপনার নিজের ছবি আপলোড করুন অথবা লিঙ্ক দিন' : 'Upload your own picture or paste link'}
                </p>
              </div>
              <button
                onClick={() => setEditingPhoto(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Photo Preview */}
              <div>
                <label className="block text-xs font-bold text-[#35172F] mb-1.5">
                  {language === 'bn' ? 'বর্তমান ছবির প্রিভিউ:' : 'Photo Preview:'}
                </label>
                <div className="relative aspect-16/10 rounded-xl overflow-hidden border-2 border-[#FFD6E7] bg-pink-50">
                  <img
                    src={editImagePreview || editImageUrlInput || editingPhoto.src}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Upload New Photo from Device */}
              <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-200/80 space-y-2">
                <label className="block text-xs font-bold text-[#E84369] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '১. ডিভাইস থেকে নতুন ছবি আপলোড করুন:' : '1. Upload picture from your device:'}</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="block w-full text-xs text-[#35172F] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E84369] file:text-white hover:file:bg-[#d4375b] cursor-pointer"
                />
              </div>

              {/* Or Paste Image URL */}
              <div>
                <label className="block text-xs font-semibold text-[#35172F] mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#FF6FAE]" />
                  <span>{language === 'bn' ? 'অথবা সরাসরি ছবির লিঙ্ক (URL) দিন:' : 'Or enter Image URL:'}</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={editImageUrlInput}
                  onChange={(e) => {
                    setEditImageUrlInput(e.target.value);
                    if (e.target.value.trim()) {
                      setEditImagePreview(e.target.value.trim());
                    }
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>

              {/* Edit Caption BN */}
              <div>
                <label className="block text-xs font-semibold text-[#35172F] mb-1">
                  {language === 'bn' ? 'ক্যাপশন (বাংলা):' : 'Caption (Bengali):'}
                </label>
                <textarea
                  rows={2}
                  value={editCaptionBn}
                  onChange={(e) => setEditCaptionBn(e.target.value)}
                  placeholder="তোমার সাথে কাটানো প্রিয় মুহূর্ত ❤️"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369] resize-none"
                />
              </div>

              {/* Edit Caption EN */}
              <div>
                <label className="block text-xs font-semibold text-[#35172F] mb-1">
                  {language === 'bn' ? 'ক্যাপশন (ইংরেজি):' : 'Caption (English):'}
                </label>
                <textarea
                  rows={2}
                  value={editCaptionEn}
                  onChange={(e) => setEditCaptionEn(e.target.value)}
                  placeholder="One of our most cherished moments ❤️"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369] resize-none"
                />
              </div>

              {/* Edit Date & Location */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#35172F] mb-1">
                    {language === 'bn' ? 'তারিখ / দিন:' : 'Date:'}
                  </label>
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    placeholder="স্মরণীয় দিন"
                    className="w-full px-2.5 py-2 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#35172F] mb-1">
                    {language === 'bn' ? 'জায়গা / স্থান:' : 'Location:'}
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="আমাদের প্রিয় স্থান"
                    className="w-full px-2.5 py-2 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#FFD6E7] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(editingPhoto.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ছবি মুছুন' : 'Delete'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#35172F]/70 hover:bg-gray-100 cursor-pointer"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6FAE] to-[#E84369] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
                  >
                    {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW MEMORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl border border-[#FFD6E7] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#FFD6E7]">
              <h3 className="text-lg sm:text-xl font-bold text-[#35172F] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#E84369]" />
                <span>{language === 'bn' ? 'নতুন ভালোবাসার স্মৃতি যোগ করুন' : 'Add A New Love Memory'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMemory} className="space-y-3.5 sm:space-y-4">
              <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-200/80 space-y-2">
                <label className="block text-xs font-bold text-[#E84369] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '১. ডিভাইস থেকে ছবি নির্বাচন করুন:' : '1. Choose Photo from device:'}</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewImageUpload}
                  className="block w-full text-xs text-[#35172F] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E84369] file:text-white hover:file:bg-[#d4375b] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#35172F] mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#FF6FAE]" />
                  <span>{language === 'bn' ? 'অথবা ছবির লিঙ্ক দিন:' : 'Or enter Image URL:'}</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={newImageUrlInput}
                  onChange={(e) => setNewImageUrlInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>

              {(newImagePreview || newImageUrlInput) && (
                <div className="aspect-16/9 rounded-xl overflow-hidden border border-[#FFD6E7]">
                  <img
                    src={newImagePreview || newImageUrlInput}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#35172F] mb-1">
                  {language === 'bn' ? 'ক্যাপশন (বাংলা):' : 'Caption (Bengali):'}
                </label>
                <input
                  type="text"
                  placeholder="তোমার সাথে কাটানো সুন্দর সময় ❤️"
                  value={newCaptionBn}
                  onChange={(e) => setNewCaptionBn(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#35172F] mb-1">
                  {language === 'bn' ? 'ক্যাপশন (ইংরেজি):' : 'Caption (English):'}
                </label>
                <input
                  type="text"
                  placeholder="A lovely moment with you ❤️"
                  value={newCaptionEn}
                  onChange={(e) => setNewCaptionEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#35172F] mb-1">
                    {language === 'bn' ? 'তারিখ:' : 'Date:'}
                  </label>
                  <input
                    type="text"
                    placeholder="১৪ ফেব্রুয়ারি"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#35172F] mb-1">
                    {language === 'bn' ? 'স্থান:' : 'Location:'}
                  </label>
                  <input
                    type="text"
                    placeholder="আমাদের স্থান"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-[#FFD6E7] rounded-xl focus:outline-[#E84369]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#35172F]/70 hover:bg-gray-100 cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={!newImagePreview && !newImageUrlInput.trim()}
                  className="px-4.5 py-2 rounded-xl bg-[#E84369] text-white text-xs font-bold disabled:opacity-50 hover:bg-[#d4375b] transition-colors cursor-pointer"
                >
                  {t.saveChangesBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
