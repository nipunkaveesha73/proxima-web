import type { Movie, CastMember } from '../types';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

interface OmdbMovieResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot?: string;
  imdbRating?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
}

interface OmdbSearchResponse {
  Search?: OmdbMovieResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface OmdbDetailsResponse extends OmdbMovieResult {
  Response: string;
  Error?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Country?: string;
  Language?: string;
  Awards?: string;
}

function assertApiKey() {
  if (!API_KEY) {
    throw new Error('OMDb API key is missing. Set VITE_OMDB_API_KEY in your .env file.');
  }
}

function buildImageUrl(poster: string) {
  return poster && poster !== 'N/A' ? poster : 'https://via.placeholder.com/500x750?text=No+Image';
}

function mapOmdbItem(result: OmdbMovieResult | OmdbDetailsResponse, mediaType: 'movie' | 'tv'): Movie {
  const title = 'Title' in result ? result.Title : 'Unknown';
  const year = 'Year' in result ? result.Year : 'Unknown';
  const poster = 'Poster' in result ? result.Poster : '';
  const plot = 'Plot' in result ? result.Plot : 'No description available.';
  const rating = 'imdbRating' in result && result.imdbRating !== 'N/A' ? result.imdbRating : 'N/A';
  const runtime = 'Runtime' in result && result.Runtime !== 'N/A' ? result.Runtime : (mediaType === 'tv' ? 'Seasonal' : '2h 10m');
  const genre = 'Genre' in result && result.Genre !== 'N/A' ? result.Genre.split(', ') : [mediaType === 'tv' ? 'TV' : 'Movie'];
  const director = 'Director' in result && result.Director !== 'N/A' ? result.Director : 'Unknown';

  return {
    id: 'imdbID' in result ? result.imdbID : String(Math.random()),
    title,
    description: plot,
    year,
    duration: runtime,
    rating,
    genre,
    image: buildImageUrl(poster),
    mediaType,
    isOriginal: false,
    is4K: false,
    director,
  };
}

function mapCastMembers(actors?: string): CastMember[] {
  if (!actors || actors === 'N/A') return [];

  return actors.split(', ').slice(0, 8).map((actor, index) => ({
    id: String(index),
    name: actor.trim(),
    role: 'Actor',
    image: 'https://via.placeholder.com/185x278?text=Cast',
  }));
}

export async function fetchPopularMovies(page = 1): Promise<Movie[]> {
  assertApiKey();

  // OMDB doesn't have a "popular" endpoint, so we'll search for some popular movies
  const popularQueries = ['batman', 'avengers', 'star wars', 'harry potter', 'lord of the rings'];

  try {
    const results: Movie[] = [];

    for (const query of popularQueries.slice((page - 1) * 2, page * 2)) {
      const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
      if (!response.ok) continue;

      const data: OmdbSearchResponse = await response.json();
      if (data.Search) {
        // Get detailed info for first result
        const detailResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${data.Search[0].imdbID}&plot=short`);
        if (detailResponse.ok) {
          const detailData: OmdbDetailsResponse = await detailResponse.json();
          if (detailData.Response === 'True') {
            results.push(mapOmdbItem(detailData, 'movie'));
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error('[OMDb] Error fetching popular movies:', error);
    return [];
  }
}

export async function fetchPopularTVShows(page = 1): Promise<Movie[]> {
  assertApiKey();

  // Search for popular TV shows
  const popularQueries = ['breaking bad', 'game of thrones', 'stranger things', 'the office', 'friends'];

  try {
    const results: Movie[] = [];

    for (const query of popularQueries.slice((page - 1) * 2, page * 2)) {
      const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=series`);
      if (!response.ok) continue;

      const data: OmdbSearchResponse = await response.json();
      if (data.Search) {
        // Get detailed info for first result
        const detailResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${data.Search[0].imdbID}&plot=short`);
        if (detailResponse.ok) {
          const detailData: OmdbDetailsResponse = await detailResponse.json();
          if (detailData.Response === 'True') {
            results.push(mapOmdbItem(detailData, 'tv'));
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error('[OMDb] Error fetching popular TV shows:', error);
    return [];
  }
}

export async function fetchMovieDetails(movieId: string): Promise<{ movie: Movie; cast: CastMember[] }> {
  assertApiKey();

  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`);
  if (!response.ok) {
    throw new Error(`OMDb movie details request failed: ${response.statusText}`);
  }

  const data: OmdbDetailsResponse = await response.json();
  if (data.Response !== 'True') {
    throw new Error(data.Error || 'Movie not found');
  }

  const movie = mapOmdbItem(data, 'movie');
  const cast = mapCastMembers(data.Actors);

  return { movie, cast };
}

export async function fetchTVDetails(tvId: string): Promise<{ movie: Movie; cast: CastMember[] }> {
  assertApiKey();

  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${tvId}&plot=full`);
  if (!response.ok) {
    throw new Error(`OMDb TV details request failed: ${response.statusText}`);
  }

  const data: OmdbDetailsResponse = await response.json();
  if (data.Response !== 'True') {
    throw new Error(data.Error || 'TV show not found');
  }

  const movie = mapOmdbItem(data, 'tv');
  const cast = mapCastMembers(data.Actors);

  return { movie, cast };
}

export async function search(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  
  assertApiKey();

  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=1`);
    if (!response.ok) {
      throw new Error(`OMDb search failed: ${response.statusText}`);
    }

    const data: OmdbSearchResponse = await response.json();
    if (data.Response !== 'True' || !data.Search) {
      return [];
    }

    const results: Movie[] = [];
    
    for (const item of data.Search) {
      try {
        const detailResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${item.imdbID}&plot=short`);
        if (detailResponse.ok) {
          const detailData: OmdbDetailsResponse = await detailResponse.json();
          if (detailData.Response === 'True') {
            results.push(mapOmdbItem(detailData, item.Type === 'series' ? 'tv' : 'movie'));
          }
        }
      } catch (e) {
        console.error('[OMDb] Error fetching detail for:', item.imdbID, e);
      }
    }

    return results;
  } catch (error) {
    console.error('[OMDb] Search error:', error);
    return [];
  }
}