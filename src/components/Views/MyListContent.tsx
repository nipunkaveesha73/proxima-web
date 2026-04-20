import { Movie } from '../../types';
import MovieCard from '../MovieCard';
import { Star } from 'lucide-react';

interface MyListContentProps {
  favorites: Movie[];
  onMovieClick: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
}

export default function MyListContent({ favorites, onMovieClick, onToggleFavorite }: MyListContentProps) {
  if (!favorites.length) {
    return (
      <div className="flex-grow px-6 md:px-12 py-24 text-center">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-surface-container p-12 shadow-2xl">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
            <Star size={20} />
          </div>
          <h1 className="text-3xl font-black mb-3">Your list is empty</h1>
          <p className="text-on-surface-variant">Save your favourite movies and TV shows by tapping the heart icon while browsing.</p>
        </div>
      </div>
    );
  }

  const movieFavorites = favorites.filter((item) => item.mediaType === 'movie');
  const tvFavorites = favorites.filter((item) => item.mediaType === 'tv');

  return (
    <div className="flex-grow px-6 md:px-12 py-12">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">My List</h1>
          <p className="text-on-surface-variant max-w-2xl">All of your saved movies and TV shows in one place.</p>
        </div>
        <div className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface-variant">
          {favorites.length} saved title{favorites.length === 1 ? '' : 's'}
        </div>
      </div>

      {movieFavorites.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-5">Saved Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {movieFavorites.map((movie) => (
              <MovieCard
                key={`movie-${movie.id}`}
                movie={movie}
                onClick={onMovieClick}
                isFavorite
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {tvFavorites.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-5">Saved TV Shows</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {tvFavorites.map((show) => (
              <MovieCard
                key={`tv-${show.id}`}
                movie={show}
                onClick={onMovieClick}
                isFavorite
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
