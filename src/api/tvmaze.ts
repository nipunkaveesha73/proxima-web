import type { Movie, CastMember } from '../types';

const BASE_URL = 'https://api.tvmaze.com';

interface TvMazeShow {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average: number | null;
  };
  weight: number;
  network: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    } | null;
  } | null;
  webChannel: {
    id: number;
    name: string;
    country: null;
  } | null;
  dvdCountry: null;
  externals: {
    tvrage: number | null;
    thetvdb: number | null;
    imdb: string | null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string | null;
  updated: number;
  _links: {
    self: { href: string };
    previousepisode?: { href: string };
  };
}

interface TvMazeCast {
  person: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    } | null;
    birthday: string | null;
    deathday: string | null;
    gender: string | null;
    image: {
      medium: string;
      original: string;
    } | null;
    _links: {
      self: { href: string };
    };
  };
  character: {
    id: number;
    name: string;
    image: {
      medium: string;
      original: string;
    } | null;
    _links: {
      self: { href: string };
    };
  };
  self: boolean;
  voice: boolean;
}

interface TvMazeShowDetails extends TvMazeShow {
  _embedded?: {
    cast?: TvMazeCast[];
  };
}

function buildImageUrl(image: { medium: string; original: string } | null) {
  return image ? image.original || image.medium : 'https://via.placeholder.com/500x750?text=No+Image';
}

function mapTvMazeItem(show: TvMazeShow): Movie {
  const premiered = show.premiered ? new Date(show.premiered).getFullYear().toString() : 'Unknown';
  const runtime = show.runtime || show.averageRuntime || 60; // Default to 60 minutes for TV
  const duration = `Seasonal`; // TV shows are seasonal
  const rating = show.rating.average ? show.rating.average.toFixed(1) : 'N/A';

  return {
    id: String(show.id),
    title: show.name,
    description: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No description available.',
    year: premiered,
    duration,
    rating,
    genre: show.genres.length > 0 ? show.genres : ['TV'],
    image: buildImageUrl(show.image),
    mediaType: 'tv',
    isOriginal: false,
    is4K: false,
    director: 'Various', // TV shows have multiple directors
  };
}

function mapCastMembers(cast?: TvMazeCast[]): CastMember[] {
  if (!cast) return [];

  return cast.slice(0, 8).map((castMember) => ({
    id: String(castMember.person.id),
    name: castMember.person.name,
    role: castMember.character.name,
    image: castMember.person.image ? buildImageUrl(castMember.person.image) : 'https://via.placeholder.com/185x278?text=Cast',
  }));
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  // TVMaze doesn't have movies, return empty array
  return [];
}

export async function fetchPopularTVShows(page = 1): Promise<Movie[]> {
  try {
    const response = await fetch(`${BASE_URL}/shows?page=${page - 1}`);
    if (!response.ok) {
      throw new Error(`TVMaze request failed: ${response.statusText}`);
    }

    const data: TvMazeShow[] = await response.json();
    return data.map(mapTvMazeItem);
  } catch (error) {
    console.error('[TVMaze] Error fetching popular TV shows:', error);
    return [];
  }
}

export async function fetchMovieDetails(): Promise<{ movie: Movie; cast: CastMember[] }> {
  throw new Error('TVMaze does not support movie details');
}

export async function fetchTVDetails(tvId: string): Promise<{ movie: Movie; cast: CastMember[] }> {
  const response = await fetch(`${BASE_URL}/shows/${tvId}?embed=cast`);
  if (!response.ok) {
    throw new Error(`TVMaze TV details request failed: ${response.statusText}`);
  }

  const data: TvMazeShowDetails = await response.json();
  const movie = mapTvMazeItem(data);
  const cast = mapCastMembers(data._embedded?.cast);

  return { movie, cast };
}

export async function search(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`TVMaze search failed: ${response.statusText}`);
    }

    const data: Array<{ show: TvMazeShow }> = await response.json();
    return data.map(item => mapTvMazeItem(item.show));
  } catch (error) {
    console.error('[TVMaze] Search error:', error);
    return [];
  }
}