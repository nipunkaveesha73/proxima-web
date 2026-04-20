import { useMemo } from 'react';
import { Movie } from '../../types';
import MovieCard from '../MovieCard';
import { motion } from 'motion/react';
import { Play, Info, Star, TrendingUp, Clock, Heart, Award, Calendar, Tv } from 'lucide-react';

interface HomeContentProps {
  movies: Movie[];
  favorites: Movie[];
  onMovieClick: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
}

export default function HomeContent({ movies, favorites, onMovieClick, onToggleFavorite }: HomeContentProps) {
  if (!movies.length) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-white text-lg px-6 text-center">
        No movie data available yet.
      </div>
    );
  }

  const favoriteIds = useMemo(() => new Set(favorites.map((movie) => movie.id)), [favorites]);
  const heroMovie = movies[0];
  const trendingMovies = movies.slice(1, 6);
  
  // New sections data
  const topRatedMovies = useMemo(() => 
    [...movies].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5), 
    [movies]
  );
  
  const newReleases = useMemo(() => 
    [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year)).slice(0, 5), 
    [movies]
  );
  
  const actionMovies = useMemo(() => 
    movies.filter(movie => movie.genre.some(g => g.toLowerCase().includes('action'))).slice(0, 5), 
    [movies]
  );
  
  const recentFavorites = favorites.slice(0, 5);
  
  // Quick stats
  const totalMovies = movies.length;
  const totalFavorites = favorites.length;
  const avgRating = useMemo(() => {
    const sum = movies.reduce((acc, movie) => acc + parseFloat(movie.rating), 0);
    return (sum / movies.length).toFixed(1);
  }, [movies]);

  return (
    <div className="flex flex-col -mt-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            alt={heroMovie.title} 
            className="w-full h-full object-cover" 
            src={heroMovie.image}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 hero-gradient"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-6 md:px-12 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-primary/30">
                Premium Original
              </span>
              <span className="text-on-surface-variant text-sm font-medium">
                {heroMovie.is4K ? '4K HDR' : 'HD'} • {heroMovie.year} • {heroMovie.duration}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
              {heroMovie.title}
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl mb-8 max-w-xl font-medium leading-relaxed">
              {heroMovie.description}
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onMovieClick(heroMovie)}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                Play Now
              </button>
              <button 
                onClick={() => onMovieClick(heroMovie)}
                className="bg-surface-container-highest/60 backdrop-blur-xl text-on-surface px-8 py-3 rounded-lg font-bold flex items-center gap-2 border border-outline-variant/10 hover:bg-surface-container-highest transition-all active:scale-95"
              >
                <Info size={20} />
                More Info
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-24 right-12 hidden lg:flex">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 min-w-[240px]"
          >
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Rating</span>
              <span className="text-primary font-black">{heroMovie.rating}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Director</span>
              <span className="text-white text-sm font-semibold">{heroMovie.director || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Genre</span>
              <span className="text-white text-sm font-semibold">{heroMovie.genre.join(', ')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
              isFavorite={favoriteIds.has(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      

      {/* Top Rated Section */}
      <section className="px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Award className="text-yellow-500" size={28} />
            <h2 className="text-2xl font-bold tracking-tight">Top Rated</h2>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topRatedMovies.map((movie) => (
            <MovieCard
              key={`top-${movie.id}`}
              movie={movie}
              onClick={onMovieClick}
              isFavorite={favoriteIds.has(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* New Releases Section */}
      <section className="px-6 md:px-12 py-16 bg-surface-dim">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold tracking-tight">New Releases</h2>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {newReleases.map((movie) => (
            <MovieCard
              key={`new-${movie.id}`}
              movie={movie}
              onClick={onMovieClick}
              isFavorite={favoriteIds.has(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Action Movies Spotlight */}
      {actionMovies.length > 0 && (
        <section className="px-6 md:px-12 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-500 font-bold text-sm">⚡</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Action Spotlight</h2>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {actionMovies.map((movie) => (
              <MovieCard
                key={`action-${movie.id}`}
                movie={movie}
                onClick={onMovieClick}
                isFavorite={favoriteIds.has(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Favorites Section */}
      {recentFavorites.length > 0 && (
        <section className="px-6 md:px-12 py-16 bg-surface-dim">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="text-red-500" size={28} />
              <h2 className="text-2xl font-bold tracking-tight">Your Favorites</h2>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recentFavorites.map((movie) => (
              <MovieCard
                key={`fav-${movie.id}`}
                movie={movie}
                onClick={onMovieClick}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* footer */}
      <div className="px-6 md:px-12 py-8 text-center text-sm text-on-surface-variant">
        &copy; {new Date().getFullYear()} Proxima. All rights reserved. | Project by nk73.
      </div>
      
    </div>
  );
}
