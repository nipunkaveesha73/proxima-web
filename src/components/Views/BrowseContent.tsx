import { useState, useMemo } from 'react';
import { Movie } from '../../types';
import MovieCard from '../MovieCard';
import { motion } from 'motion/react';
import { LayoutGrid, ListFilter, Search } from 'lucide-react';

interface BrowseContentProps {
  mediaType: 'movie' | 'tv';
  movies: Movie[];
  favorites: Movie[];
  onMovieClick: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
}

export default function BrowseContent({ mediaType, movies, favorites, onMovieClick, onToggleFavorite }: BrowseContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<'popularity' | 'rating' | 'year'>('popularity');

  const title = mediaType === 'tv' ? 'TV Shows' : 'Movies';
  const subtitle = mediaType === 'tv'
    ? 'Binge-worthy series handpicked from the TMDb catalog.'
    : 'Curated collections from the world’s most visionary directors and independent studios.';

  const filterGenres = useMemo(
    () => Array.from(new Set(movies.flatMap((movie) => movie.genre))).slice(0, 8),
    [movies]
  );

  const filterYears = useMemo(
    () => Array.from(new Set(movies.map((movie) => movie.year))).sort((a, b) => b.localeCompare(a)),
    [movies]
  );

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const normalizedTitle = movie.title.toLowerCase();
      const normalizedGenre = movie.genre.join(' ').toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      if (query && !normalizedTitle.includes(query) && !normalizedGenre.includes(query)) {
        return false;
      }

      if (selectedGenre && !movie.genre.includes(selectedGenre)) {
        return false;
      }

      if (selectedYear && movie.year !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [movies, searchQuery, selectedGenre, selectedYear]);

  const sortedMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      if (sortMode === 'rating') {
        return Number(b.rating) - Number(a.rating);
      }
      if (sortMode === 'year') {
        return Number(b.year) - Number(a.year);
      }
      return 0;
    });
  }, [filteredMovies, sortMode]);

  if (!movies.length) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-white text-lg px-6 text-center">
        No {title.toLowerCase()} available yet. Check your TMDb API key in `.env`.
      </div>
    );
  }

  const featuredMovie = movies[0];
  const featuredExtras = movies.slice(1, 3);

  return (
    <div className="flex-grow">
      <header className="mb-12 flex flex-col gap-6">
        <div>
          <motion.h1
            className="text-4xl font-black tracking-tight mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Browse {title}
          </motion.h1>
          <p className="text-on-surface-variant max-w-2xl">{subtitle}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_auto] items-end">
          <div className="relative rounded-2xl border border-white/10 bg-surface-container-high p-4 shadow-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-white outline-none placeholder:text-on-surface-variant"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-end">
            <button
              onClick={() => setSortMode('popularity')}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${sortMode === 'popularity' ? 'bg-primary text-black' : 'bg-surface-container text-on-surface-variant hover:bg-surface-bright'}`}
            >
              Relevance
            </button>
            <button
              onClick={() => setSortMode('rating')}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${sortMode === 'rating' ? 'bg-primary text-black' : 'bg-surface-container text-on-surface-variant hover:bg-surface-bright'}`}
            >
              Rating
            </button>
            <button
              onClick={() => setSortMode('year')}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${sortMode === 'year' ? 'bg-primary text-black' : 'bg-surface-container text-on-surface-variant hover:bg-surface-bright'}`}
            >
              Year
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {filterGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedGenre === genre ? 'bg-primary text-black' : 'bg-surface-container text-on-surface-variant hover:bg-surface-bright'}`}
          >
            {genre}
          </button>
        ))}
        {selectedGenre && (
          <button
            onClick={() => setSelectedGenre(null)}
            className="rounded-full px-4 py-2 text-xs font-semibold text-white bg-red-600/20 hover:bg-red-600/30 transition"
          >
            Clear genre
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {filterYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(selectedYear === year ? null : year)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedYear === year ? 'bg-primary text-black' : 'bg-surface-container text-on-surface-variant hover:bg-surface-bright'}`}
          >
            {year}
          </button>
        ))}
        {selectedYear && (
          <button
            onClick={() => setSelectedYear(null)}
            className="rounded-full px-4 py-2 text-xs font-semibold text-white bg-red-600/20 hover:bg-red-600/30 transition"
          >
            Clear year
          </button>
        )}
      </div>

      <div className="mb-8 text-sm text-on-surface-variant">
        Showing {sortedMovies.length} {title.toLowerCase()} {selectedGenre ? `in “${selectedGenre}”` : ''} {selectedYear ? `• ${selectedYear}` : ''}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-20">
        {sortedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
            isFavorite={favorites.some((favorite) => favorite.id === movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tighter">Featured Picks</h2>
          <span className="text-sm text-on-surface-variant uppercase tracking-[0.2em] font-bold">{title.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[featuredMovie, ...featuredExtras].map((movie) => (
            <motion.div
              key={movie.id}
              className="group relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer min-h-[320px]"
              whileHover={{ scale: 1.01 }}
              onClick={() => onMovieClick(movie)}
            >
              <img
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={movie.image}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">{movie.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
                <h3 className="text-3xl font-black tracking-tight mb-3">{movie.title}</h3>
                <p className="text-sm text-on-surface-variant max-w-xs mb-4 line-clamp-3">{movie.description}</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-on-surface-variant">
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>
                  <span>{movie.rating}/10</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <button className="px-8 py-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors font-semibold text-sm">
          Browse More Titles
        </button>
      </div>
    </div>
  );
}
