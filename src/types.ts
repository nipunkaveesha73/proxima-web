export interface Movie {
  id: string;
  title: string;
  description: string;
  year: string;
  duration: string;
  rating: string;
  genre: string[];
  image: string;
  mediaType?: 'movie' | 'tv';
  isOriginal?: boolean;
  is4K?: boolean;
  director?: string;
  trailerUrl?: string;
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  image: string;
  remaining: string;
  progress: number;
}
