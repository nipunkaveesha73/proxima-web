import type { Movie, CastMember } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMovieResult {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
}

interface TmdbTvResult {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
}

interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: TmdbGenre[];
  poster_path: string | null;
  runtime: number | null;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      job: string;
      name: string;
    }>;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
}

interface TmdbTvDetails {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genres: TmdbGenre[];
  poster_path: string | null;
  episode_run_time: number[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      job: string;
      name: string;
    }>;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
}

interface TmdbPopularResponse<T> {
  results: T[];
}

interface TmdbGenreResponse {
  genres: TmdbGenre[];
}

const movieGenreCache = new Map<number, string>();
const tvGenreCache = new Map<number, string>();

function assertApiKey() {
  if (!API_KEY) {
    throw new Error('TMDb API key is missing. Set VITE_TMDB_API_KEY in your .env file.');
  }
}

function buildImageUrl(path: string | null, size = 'w780') {
  return path ? `${IMAGE_BASE_URL}${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
}

async function fetchGenreMap(mediaType: 'movie' | 'tv') {
  const cache = mediaType === 'movie' ? movieGenreCache : tvGenreCache;
  if (cache.size > 0) {
    return cache;
  }

  assertApiKey();
  const response = await fetch(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}&language=en-US`);
  if (!response.ok) {
    throw new Error(`Failed to fetch TMDb ${mediaType} genre list.`);
  }

  const data: TmdbGenreResponse = await response.json();
  data.genres.forEach((genre) => cache.set(genre.id, genre.name));
  return cache;
}

function mapTmdbItem(result: TmdbMovieResult | TmdbTvResult | TmdbMovieDetails | TmdbTvDetails, mediaType: 'movie' | 'tv'): Movie {
  const genreIds = 'genre_ids' in result ? result.genre_ids : result.genres.map((genre) => genre.id);
  const genreCache = mediaType === 'movie' ? movieGenreCache : tvGenreCache;
  const genreNames = Array.from(genreCache.entries())
    .filter(([id]) => genreIds.includes(id))
    .map(([, name]) => name);

  const releaseYear = 'release_date' in result ? result.release_date.slice(0, 4) : ('first_air_date' in result && result.first_air_date ? result.first_air_date.slice(0, 4) : 'Unknown');
  const runtime = 'runtime' in result ? result.runtime : 'episode_run_time' in result ? result.episode_run_time[0] : null;
  const duration = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : mediaType === 'tv' ? 'Seasonal' : '2h 10m';
  const director = 'credits' in result && result.credits ? result.credits.crew.find((member) => member.job === 'Director')?.name : 'Unknown';
  const title = 'title' in result ? result.title : result.name;

  return {
    id: String(result.id),
    title,
    description: result.overview || 'No description available.',
    year: releaseYear,
    duration,
    rating: result.vote_average ? result.vote_average.toFixed(1) : 'N/A',
    genre: genreNames.length > 0 ? genreNames : [mediaType === 'tv' ? 'TV' : 'Movie'],
    image: buildImageUrl(result.poster_path, 'w780'),
    mediaType,
    isOriginal: false,
    is4K: false,
    director,
    trailerUrl: 'videos' in result ? getTrailerUrl(result.videos) : undefined,
  };
}

function mapCastMember(item: { id: number; name: string; character: string; profile_path: string | null }): CastMember {
  return {
    id: String(item.id),
    name: item.name,
    role: item.character || 'Cast',
    image: buildImageUrl(item.profile_path, 'w185'),
  };
}

function getTrailerUrl(videos?: { results: Array<{ key: string; site: string; type: string; name: string }> }): string | undefined {
  if (!videos?.results || videos.results.length === 0) {
    return undefined;
  }

  // Priority 1: Official Trailer (highest quality match)
  let trailer = videos.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.name.toLowerCase().includes('official')
  );

  // Priority 2: Regular Trailer
  if (!trailer) {
    trailer = videos.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer');
  }

  // Priority 3: Teaser
  if (!trailer) {
    trailer = videos.results.find((video) => video.site === 'YouTube' && video.type === 'Teaser');
  }

  // Priority 4: Clip (last resort if truly no trailer available)
  if (!trailer) {
    trailer = videos.results.find((video) => video.site === 'YouTube' && video.type === 'Clip');
  }

  if (trailer) {
    console.log('[TMDb] Found trailer:', trailer.name, '(', trailer.type, ')');
    return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0&fs=1&iv_load_policy=3`;
  }

  console.log('[TMDb] No suitable YouTube video found. Available:', videos.results.map((v) => `${v.type}: ${v.name}`).join(' | '));
  return undefined;
}

export async function fetchPopularMovies(page = 1): Promise<Movie[]> {
  assertApiKey();
  await fetchGenreMap('movie');

  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  if (!response.ok) {
    throw new Error(`TMDb popular movies request failed: ${response.statusText}`);
  }

  const data: TmdbPopularResponse<TmdbMovieResult> = await response.json();
  return data.results.map((result) => mapTmdbItem(result, 'movie'));
}

export async function fetchPopularTVShows(page = 1): Promise<Movie[]> {
  assertApiKey();
  await fetchGenreMap('tv');

  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  if (!response.ok) {
    throw new Error(`TMDb popular TV request failed: ${response.statusText}`);
  }

  const data: TmdbPopularResponse<TmdbTvResult> = await response.json();
  return data.results.map((result) => mapTmdbItem(result, 'tv'));
}

export async function fetchMovieDetails(movieId: number): Promise<{ movie: Movie; cast: CastMember[] }> {
  assertApiKey();
  await fetchGenreMap('movie');

  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
  );

  if (!response.ok) {
    throw new Error(`TMDb movie details request failed: ${response.statusText}`);
  }

  const data: TmdbMovieDetails = await response.json();
  const movie = mapTmdbItem(data, 'movie');
  const cast = data.credits?.cast.slice(0, 8).map(mapCastMember) ?? [];
  return { movie, cast };
}

export async function fetchTVDetails(tvId: number): Promise<{ movie: Movie; cast: CastMember[] }> {
  assertApiKey();
  await fetchGenreMap('tv');

  const response = await fetch(
    `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
  );

  if (!response.ok) {
    throw new Error(`TMDb TV details request failed: ${response.statusText}`);
  }

  const data: TmdbTvDetails = await response.json();
  const movie = mapTmdbItem(data, 'tv');
  const cast = data.credits?.cast.slice(0, 8).map(mapCastMember) ?? [];
  return { movie, cast };
}

export async function search(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  
  assertApiKey();
  await fetchGenreMap('movie');
  await fetchGenreMap('tv');

  try {
    console.log(`[TMDb] Searching for: "${query}"`);
    
    const movieResponse = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );

    if (!movieResponse.ok) {
      throw new Error(`TMDb search failed: ${movieResponse.statusText}`);
    }

    const data: any = await movieResponse.json();
    console.log(`[TMDb] Raw response:`, data);
    
    const results = (data.results || [])
      .filter((result: any) => result.media_type === 'movie' || result.media_type === 'tv')
      .slice(0, 40)
      .map((result: any) => {
        const mediaType = result.media_type === 'tv' ? 'tv' : 'movie';
        return mapTmdbItem(result, mediaType);
      });

    console.log(`[TMDb] Returning ${results.length} results for "${query}"`);
    return results;
  } catch (error) {
    console.error('[TMDb] Search error:', error);
    return [];
  }
}
