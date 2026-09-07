import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import {
  X,
  ExternalLink,
  Github,
  Star,
  Calendar,
  CheckCircle2,
  Award,
  Tag,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onShowToast: (text: string, type?: 'success' | 'info') => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onShowToast }) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Collect all project images (gallery + primary imageUrl deduplicated)
  const images = React.useMemo(() => {
    const list: string[] = [];
    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (project.imageUrl && !list.includes(project.imageUrl)) {
      list.unshift(project.imageUrl);
    }
    return list.length > 0 ? list : [project.imageUrl];
  }, [project]);

  // Keep active index in bounds
  const currentImage = images[activeImageIndex] || images[0] || project.imageUrl;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for clients
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isFullscreen, onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Image Showcase Banner with multi-photo controls */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden shrink-0 bg-slate-950 group select-none">
            <img
              src={currentImage}
              alt={`${project.title} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
              onClick={() => setIsFullscreen(true)}
              title="Click to view full-resolution"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

            {/* Top Bar Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-md">
                {project.category}
              </span>
              {images.length > 1 && (
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-sm flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-indigo-400" />
                  Photo {activeImageIndex + 1} of {images.length}
                </span>
              )}
            </div>

            {/* Top Right Controls (Fullscreen & Close) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="w-9 h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center backdrop-blur-md transition-colors shadow-md focus:outline-none"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center backdrop-blur-md transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Previous / Next Navigation Arrows (if 2+ images) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 focus:outline-none border border-white/10"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 focus:outline-none border border-white/10"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Banner Title & Metrics */}
            <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1 drop-shadow-md">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {project.completionDate}
                </span>
                {project.metrics && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" /> {project.metrics}
                  </span>
                )}
                {images.length > 1 && (
                  <span className="text-indigo-300 text-[11px] font-semibold">
                    ← Use arrow keys to browse designs →
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Gallery Thumbnails Strip (if 2+ images) */}
          {images.length > 1 && (
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-2.5 overflow-x-auto border-b border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>All Designs ({images.length}):</span>
              </span>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`group relative h-12 w-16 sm:w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img src={img} alt={`Shot ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-slate-950/80 text-[9px] font-bold text-white">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                Project Overview & Scope
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.fullDescription || project.shortDescription}
              </p>
            </div>

            {/* Key Highlights Checklist */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                  Key Milestones & Deliverables
                </h3>
                <div className="space-y-2.5">
                  {project.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags / Stack */}
            <div>
              <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                Tools & Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <Tag className="w-3 h-3 text-indigo-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Links */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Open Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>

        {/* Fullscreen Lightbox for high-resolution design inspection */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
            >
              <div className="absolute top-4 right-4 z-70 flex items-center gap-3">
                <span className="text-xs text-white/80 font-medium">
                  {activeImageIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative max-w-6xl max-h-[85vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img
                  src={currentImage}
                  alt="High Resolution Design"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
