import type { Movie, CastMember } from '../types';

export type ApiProvider = 'tmdb';

export interface ApiConfig {
  provider: ApiProvider;
  apiKey?: string;
  baseUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// API Manager Class
export class ApiManager {
  private currentProvider: ApiProvider = 'tmdb';
  private configs: Record<ApiProvider, ApiConfig> = {
    tmdb: {
      provider: 'tmdb',
      baseUrl: 'https://api.themoviedb.org/3',
    },
  };

  constructor() {
    // TMDB is the only provider
    this.currentProvider = 'tmdb';
  }

  setProvider(provider: ApiProvider) {
    this.currentProvider = provider;
    localStorage.setItem('proxima-api-provider', provider);
  }

  getCurrentProvider(): ApiProvider {
    return this.currentProvider;
  }

  getAvailableProviders(): { id: ApiProvider; name: string; description: string }[] {
    return [
      {
        id: 'tmdb',
        name: 'The Movie Database (TMDb)',
        description: 'Comprehensive movie and TV database with rich metadata'
      },
    ];
  }

  async fetchPopularMovies(page = 1): Promise<Movie[]> {
    return await import('./tmdb').then(m => m.fetchPopularMovies(page));
  }

  async fetchPopularTVShows(page = 1): Promise<Movie[]> {
    return await import('./tmdb').then(m => m.fetchPopularTVShows(page));
  }

  async fetchMovieDetails(movieId: string): Promise<{ movie: Movie; cast: CastMember[] }> {
    return await import('./tmdb').then(m => m.fetchMovieDetails(Number(movieId)));
  }

  async fetchTVDetails(tvId: string): Promise<{ movie: Movie; cast: CastMember[] }> {
    return await import('./tmdb').then(m => m.fetchTVDetails(Number(tvId)));
  }

  // Video Player Integration with vidsrc.xyz
  getVidsrcMovieUrl(tmdbId: string): string {
    return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
  }

  getVidsrcTVUrl(tmdbId: string, season: number, episode: number): string {
    return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
  }

  async searchAcrossAllApis(query: string): Promise<Movie[]> {
    if (!query.trim()) return [];

    try {
      // Currently using TMDB only - other APIs need fixes
      const tmdbResults = await import('./tmdb').then(m => m.search(query));

      // Sort by rating (highest first) and limit to 40
      return tmdbResults
        .sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        })
        .slice(0, 40);
    } catch (error) {
      console.error('Error searching TMDB:', error);
      return [];
    }
  }
}

// Export singleton instance
export const apiManager = new ApiManager();