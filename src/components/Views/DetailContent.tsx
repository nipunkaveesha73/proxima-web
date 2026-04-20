import { useState, useEffect } from 'react';
import { Movie, CastMember } from '../../types';
import { motion } from 'motion/react';
import { Play, Plus, Star } from 'lucide-react';
import VideoPlayer from '../VideoPlayer';

interface DetailContentProps {
  movie: Movie;
  cast: CastMember[];
  similarMovies: Movie[];
  onMovieClick: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export default function DetailContent({ movie, cast, similarMovies, onMovieClick, isFavorite, onToggleFavorite }: DetailContentProps) {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const relatedMovies = similarMovies.filter((m) => m.id !== movie.id).slice(0, 3);

  useEffect(() => {
    // Scroll down slightly when page loads to avoid header overlap
    window.scrollBy({ top: 100, behavior: 'smooth' });
  }, [movie.id]);

  return (
    <div className="min-h-screen">
      <section className="relative w-full overflow-hidden">
        {movie.trailerUrl ? (
          <div className="relative w-full aspect-video overflow-hidden">
            <iframe
              className={`absolute inset-0 w-full h-full border-none transition-opacity duration-300 scale-y-[1.12] ${isVideoPlayerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              src={isVideoPlayerOpen ? '' : `${movie.trailerUrl}&controls=0&cc_load_policy=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${movie.title} Trailer`}
            />
            {isVideoPlayerOpen && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-surface-container overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              alt={movie.title} 
              className="absolute inset-0 w-full h-full object-cover" 
              src={movie.image}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16 md:pb-24 z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                {movie.mediaType === 'tv' ? 'Premium Series' : 'Premium Original'}
              </span>
              <span className="text-on-surface-variant text-sm font-medium">{movie.is4K ? '4K HDR' : 'HD'} • {movie.year} • {movie.duration}</span>
            </div>
            <motion.h1 
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {movie.title}
            </motion.h1>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              {movie.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsVideoPlayerOpen(true)}
                className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all active:scale-95 duration-200">
                <Play size={20} fill="currentColor" />
                Watch Now
              </button>
              <button
                className={`glass-panel px-8 py-4 rounded-lg font-bold border border-white/10 transition-all active:scale-95 ${isFavorite ? 'bg-primary text-black hover:bg-primary/90' : 'text-white hover:bg-white/10'}`}
                onClick={() => onToggleFavorite(movie)}
              >
                <Plus size={20} className="inline mr-2" />
                {isFavorite ? 'Remove from My List' : 'Add to My List'}
              </button>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 min-w-[240px]">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Rating</span>
              <span className="text-primary font-black">IMDB {movie.rating}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Director</span>
              <span className="text-white text-sm font-semibold">{movie.director || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Genre</span>
              <span className="text-white text-sm font-semibold">{movie.genre.join(', ')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-surface-dim">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Overview</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">{movie.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Production Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface-container-high rounded-lg p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">Type</p>
                  <p className="font-semibold">{movie.mediaType === 'tv' ? 'TV Series' : 'Film'}</p>
                </div>
                <div className="bg-surface-container-high rounded-lg p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">Release Year</p>
                  <p className="font-semibold">{movie.year}</p>
                </div>
                <div className="bg-surface-container-high rounded-lg p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">Duration</p>
                  <p className="font-semibold">{movie.duration}</p>
                </div>
                <div className="bg-surface-container-high rounded-lg p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">Quality</p>
                  <p className="font-semibold">{movie.is4K ? '4K HDR' : 'Full HD'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <span key={g} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-sm font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-8">Cast & Crew</h2>
              {cast.length > 0 ? (
                <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                  {cast.map((member) => (
                    <motion.div key={member.id} className="flex-none group" whileHover={{ y: -5 }}>
                      <div className="w-32 h-32 rounded-lg overflow-hidden mb-3 bg-surface-container-high shadow-lg">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <p className="text-xs text-on-surface-variant italic">{member.role}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant">Cast information is not available for this title.</p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Similar Titles</h2>
            <div className="space-y-6">
              {relatedMovies.map((m) => (
                <div 
                  key={m.id} 
                  className="flex gap-4 group cursor-pointer p-3 rounded-xl hover:bg-surface-container transition-all"
                  onClick={() => onMovieClick(m)}
                >
                  <div className="w-24 h-36 rounded-lg overflow-hidden flex-none bg-surface-container-highest shadow-md">
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{m.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-2">{m.genre[0]} • {m.year}</p>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-primary" fill="currentColor" />
                      <span className="text-xs font-bold">{m.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <VideoPlayer 
        movie={movie}
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
        mediaType={movie.mediaType || 'movie'}
      />
    </div>
  );
}
