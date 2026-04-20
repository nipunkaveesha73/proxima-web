import type { Movie, CastMember } from '../types';
import { MOVIES } from '../constants';

const API_BASE_URL = 'https://imdbapi.dev/api';

interface ImdbMovie {
  id: string;
  title: string;
  description: string;
  image: string;
  contentType: string;
  imdbId: string;
  imdbVotesPercentage: number;
  imdbMetascore: number;
  imdbRating: number;
}

interface ImdbMovieDetails extends ImdbMovie {
  actors?: Array<{
    id: string;
    name: string;
  }>;
  director?: string;
  writers?: string[];
  genreList?: Array<{
    key: string;
    value: string;
  }>;
  runtimeStr?: string;
}

/**
 * Fetch popular movies from IMDb API
 */
export async function fetchPopularMovies(page = 1): Promise<Movie[]> {
  try {
    const searchQuery = 'popular movies'; // IMDb API free tier limitation
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&type=movie`,
      { timeout: 5000 }
    );

    if (!response.ok) throw new Error('Failed to fetch from IMDb API');

    const data = await response.json();
    const results = data.results || [];

    if (!results.length) {
      console.warn('IMDb API returned no results, using fallback data');
      return MOVIES.filter(m => m.mediaType !== 'tv').slice(0, 20);
    }

    return results.slice(0, 20).map((movie: ImdbMovie) => ({
      id: movie.imdbId || movie.id,
      title: movie.title,
      description: movie.description || 'No description available',
      year: '2024', // IMDb API free tier doesn't include year reliably
      duration: '2h 0m',
      rating: String(movie.imdbRating || 7.5),
      genre: ['Action', 'Drama'], // Fallback genres
      image: movie.image || 'https://via.placeholder.com/300x450',
      mediaType: 'movie' as const,
      isOriginal: false,
      is4K: false,
      director: 'Unknown',
      trailerUrl: undefined,
    }));
  } catch (error) {
    console.error('IMDb API Error (Popular Movies):', error);
    // Fallback to built-in data
    return MOVIES.filter(m => m.mediaType !== 'tv').slice(0, 20);
  }
}

/**
 * Fetch popular TV shows from IMDb API
 */
export async function fetchPopularTVShows(page = 1): Promise<Movie[]> {
  try {
    const searchQuery = 'popular tv shows';
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&type=tv`,
      { timeout: 5000 }
    );

    if (!response.ok) throw new Error('Failed to fetch from IMDb API');

    const data = await response.json();
    const results = data.results || [];

    if (!results.length) {
      console.warn('IMDb API returned no results for TV shows, using fallback data');
      return MOVIES.slice(0, 20);
    }

    return results.slice(0, 20).map((show: ImdbMovie) => ({
      id: show.imdbId || show.id,
      title: show.title,
      description: show.description || 'No description available',
      year: '2024',
      duration: '45m',
      rating: String(show.imdbRating || 7.5),
      genre: ['Drama', 'Entertainment'],
      image: show.image || 'https://via.placeholder.com/300x450',
      mediaType: 'tv' as const,
      isOriginal: false,
      is4K: false,
      director: 'Unknown',
      trailerUrl: undefined,
    }));
  } catch (error) {
    console.error('IMDb API Error (Popular TV Shows):', error);
    // Fallback to built-in data
    return MOVIES.slice(0, 20);
  }
}

/**
 * Fetch movie details from IMDb API
 */
export async function fetchMovieDetails(
  movieId: string
): Promise<{ movie: Movie; cast: CastMember[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/title/${movieId}`);

    if (!response.ok) throw new Error('Failed to fetch movie details');

    const data: ImdbMovieDetails = await response.json();

    const movie: Movie = {
      id: data.imdbId || data.id,
      title: data.title,
      description: data.description || 'No description available',
      year: '2024',
      duration: data.runtimeStr || '2h 0m',
      rating: String(data.imdbRating || 7.5),
      genre: data.genreList?.map((g) => g.value) || ['Unknown'],
      image: data.image || 'https://via.placeholder.com/300x450',
      mediaType: 'movie' as const,
      director: data.director || 'Unknown',
      trailerUrl: undefined,
    };

    const cast: CastMember[] = (data.actors || []).slice(0, 10).map((actor, index) => ({
      id: actor.id,
      name: actor.name,
      role: `Cast Member ${index + 1}`,
      image: 'https://via.placeholder.com/100x100',
    }));

    return { movie, cast };
  } catch (error) {
    console.error('IMDb API Error (Movie Details):', error);
    throw new Error('Failed to load movie details from IMDb API');
  }
}

/**
 * Fetch TV show details from IMDb API
 */
export async function fetchTVDetails(
  tvId: string
): Promise<{ movie: Movie; cast: CastMember[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/title/${tvId}`);

    if (!response.ok) throw new Error('Failed to fetch TV details');

    const data: ImdbMovieDetails = await response.json();

    const movie: Movie = {
      id: data.imdbId || data.id,
      title: data.title,
      description: data.description || 'No description available',
      year: '2024',
      duration: data.runtimeStr || '45m',
      rating: String(data.imdbRating || 7.5),
      genre: data.genreList?.map((g) => g.value) || ['Unknown'],
      image: data.image || 'https://via.placeholder.com/300x450',
      mediaType: 'tv' as const,
      director: data.director || 'Unknown',
      trailerUrl: undefined,
    };

    const cast: CastMember[] = (data.actors || []).slice(0, 10).map((actor, index) => ({
      id: actor.id,
      name: actor.name,
      role: `Cast Member ${index + 1}`,
      image: 'https://via.placeholder.com/100x100',
    }));

    return { movie, cast };
  } catch (error) {
    console.error('IMDb API Error (TV Details):', error);
    throw new Error('Failed to load TV details from IMDb API');
  }
}

/**
 * Search for movies and TV shows
 */
export async function search(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  try {
    const movieResponse = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=movie`,
      { timeout: 5000 }
    );

    const tvResponse = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=tv`,
      { timeout: 5000 }
    );

    const results: Movie[] = [];

    if (movieResponse.ok) {
      const data = await movieResponse.json();
      const movies = (data.results || []).slice(0, 20).map((movie: ImdbMovie) => ({
        id: movie.imdbId || movie.id,
        title: movie.title,
        description: movie.description || 'No description available',
        year: '2024',
        duration: '2h 0m',
        rating: String(movie.imdbRating || 7.5),
        genre: ['Action', 'Drama'],
        image: movie.image || 'https://via.placeholder.com/300x450',
        mediaType: 'movie' as const,
        isOriginal: false,
        is4K: false,
        director: 'Unknown',
        trailerUrl: undefined,
      }));
      results.push(...movies);
    }

    if (tvResponse.ok) {
      const data = await tvResponse.json();
      const shows = (data.results || []).slice(0, 20).map((show: ImdbMovie) => ({
        id: show.imdbId || show.id,
        title: show.title,
        description: show.description || 'No description available',
        year: '2024',
        duration: '45m',
        rating: String(show.imdbRating || 7.5),
        genre: ['Drama', 'Entertainment'],
        image: show.image || 'https://via.placeholder.com/300x450',
        mediaType: 'tv' as const,
        isOriginal: false,
        is4K: false,
        director: 'Unknown',
        trailerUrl: undefined,
      }));
      results.push(...shows);
    }

    return results;
  } catch (error) {
    console.error('IMDb API Error (Search):', error);
    return [];
  }
}
