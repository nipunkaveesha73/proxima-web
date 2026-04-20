import { useMemo, useState, useEffect, useCallback } from 'react';
import { Movie } from '../../types';
import MovieCard from '../MovieCard';
import { Search, Tv, Film, Loader } from 'lucide-react';
import { apiManager } from '../../api/manager';

interface SearchContentProps {
  items: Movie[];
  onMovieClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
}

const typeOptions = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
] as const;

export default function SearchContent({ items, onMovieClick, favorites, onToggleFavorite }: SearchContentProps) {
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const favoriteIds = useMemo(() => new Set(favorites.map((movie) => movie.id)), [favorites]);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await apiManager.searchAcrossAllApis(query);
          console.log(`Search results for "${query}":`, results.length, 'items found');
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else if (query.trim().length === 0) {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300); // 300ms debounce - faster response

    return () => clearTimeout(timer);
  }, [query]);

  // Determine which items to display (search results or browseable items)
  const displayItems = query.trim().length > 0 ? searchResults : items;

  const genres = useMemo(
    () => Array.from(new Set(displayItems.flatMap((item) => item.genre))).slice(0, 12),
    [displayItems]
  );

  const years = useMemo(
    () => Array.from(new Set(displayItems.map((item) => item.year))).sort((a, b) => b.localeCompare(a)),
    [displayItems]
  );

  const filteredItems = useMemo(() => {
    return displayItems.filter((item) => {
      if (mediaType !== 'all' && item.mediaType !== mediaType) {
        return false;
      }

      if (selectedGenre && !item.genre.includes(selectedGenre)) {
        return false;
      }

      if (selectedYear && item.year !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [displayItems, mediaType, selectedGenre, selectedYear]);

  return (
    <div className="flex-grow px-6 md:px-12">
      <div className="mb-12 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-3">Search the catalog</h1>
            <p className="text-on-surface-variant max-w-2xl">Searchfor movies & TV shows, then save the ones you love. Limited to 40 top-rated results.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMediaType(option.value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${mediaType === option.value ? 'bg-primary text-black' : 'bg-surface-container text-on-surface-variant hover:bg-surface-bright'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl bg-surface-container-high border border-white/10 p-4 shadow-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          {isSearching && (
            <Loader size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant animate-spin" />
          )}
          <input
            className="w-full bg-transparent pl-12 pr-12 py-3 text-white placeholder:text-on-surface-variant outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search... (min 2 characters)"
          />
        </div>

        {query.trim().length > 0 && (
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 8).map((genre) => (
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
            {years.slice(0, 6).map((year) => (
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
        )}
      </div>

      <div className="mb-8 flex items-center justify-between gap-4 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{filteredItems.length}</span>
          results found {query.trim().length > 0 && ' (from TMDb)'}
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-on-surface-variant">
          <span className="inline-flex items-center gap-1"><Film size={12} /> {mediaType === 'all' ? 'All' : mediaType === 'movie' ? 'Movies' : 'TV'}</span>
          <span className="inline-flex items-center gap-1"><Tv size={12} /> {query ? 'Searching' : 'Browse'}</span>
        </div>
      </div>

      {isSearching && query.trim().length > 0 ? (
        <div className="rounded-3xl border border-white/10 bg-surface-container p-12 text-center">
          <Loader className="inline-block animate-spin text-primary mb-4" size={32} />
          <p className="text-on-surface-variant">Searching...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-surface-container p-12 text-center text-on-surface-variant">
          {query.trim().length > 0
            ? 'No matching titles. Try another search term or filter.'
            : 'Type at least 2 characters to search.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MovieCard
              key={`${item.mediaType}-${item.id}`}
              movie={item}
              onClick={onMovieClick}
              isFavorite={favoriteIds.has(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
