/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  mediaType?: 'movie' | 'tv';
}

export default function VideoPlayer({ movie, isOpen, onClose, mediaType = 'movie' }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // Build vidsrc URL based on media type
  const getVideoUrl = () => {
    if (mediaType === 'tv') {
      return `https://vidsrc.xyz/embed/tv/${movie.id}/${season}/${episode}`;
    }
    return `https://vidsrc.xyz/embed/movie/${movie.id}`;
  };

  const videoUrl = getVideoUrl();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [videoUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Unable to load video. The video might not be available.');
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-surface-dim rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-surface-container-high p-4 md:p-6 flex items-center justify-between border-b border-outline-variant/20">
            <h2 className="text-lg md:text-xl font-bold truncate">{movie.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors"
              aria-label="Close player"
            >
              <X size={24} />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative bg-black aspect-video md:aspect-[16/9]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Loader size={40} className="text-primary" />
                </motion.div>
              </div>
            )}

            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <p className="text-white text-center max-w-sm">{error}</p>
                <p className="text-zinc-400 text-sm text-center max-w-sm">
                  Try refreshing or selecting a different episode
                </p>
              </div>
            ) : (
              <iframe
                key={videoUrl}
                src={videoUrl}
                title={`${movie.title} Player`}
                className="w-full h-full border-none"
                allowFullScreen
                allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            )}
          </div>

          {/* Controls for TV Shows */}
          {mediaType === 'tv' && (
            <div className="bg-surface-container-high p-4 md:p-6 border-t border-outline-variant/20 space-y-4">
              <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                    Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setIsLoading(true);
                      setError(null);
                    }}
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm font-medium hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white"
                  >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s} className="bg-surface-dim text-white">
                        Season {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                    Episode
                  </label>
                  <select
                    value={episode}
                    onChange={(e) => {
                      setEpisode(Number(e.target.value));
                      setIsLoading(true);
                      setError(null);
                    }}
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm font-medium hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((e) => (
                      <option key={e} value={e} className="bg-surface-dim text-white">
                        Episode {e}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant italic">
                Season {season}, Episode {episode}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="px-4 md:px-6 py-4 bg-surface-container-low border-t border-outline-variant/20 text-sm text-on-surface-variant space-y-2">
            <p>🎬 Powered by <span className="font-semibold text-primary">vidsrc</span></p>
            <p className="text-xs">If the video fails to load, try refreshing the page or switching episodes.</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
