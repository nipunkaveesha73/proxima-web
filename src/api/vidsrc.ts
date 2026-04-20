/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * VidSrc API Integration
 * vidsrc.xyz provides a simple embed interface for movies and TV shows
 * 
 * API Format:
 * - Movies: https://vidsrc.xyz/embed/movie/{tmdb_id}
 * - TV: https://vidsrc.xyz/embed/tv/{tmdb_id}/{season}/{episode}
 */

export interface VidsrcMediaInfo {
  tmdbId: string;
  title: string;
  type: 'movie' | 'tv';
  available: boolean;
}

export interface VidsrcEpisodeInfo {
  tmdbId: string;
  season: number;
  episode: number;
  available: boolean;
}

/**
 * Get the embed URL for a movie on vidsrc.xyz
 */
export function getMovieEmbedUrl(tmdbId: string): string {
  return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
}

/**
 * Get the embed URL for a TV episode on vidsrc.xyz
 */
export function getTVEmbedUrl(tmdbId: string, season: number, episode: number): string {
  return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
}

/**
 * Check if a movie is available on vidsrc (client-side can only verify through iframe load)
 * This is a placeholder as vidsrc doesn't provide an API to check availability
 */
export async function checkMovieAvailability(tmdbId: string): Promise<boolean> {
  try {
    // Try to fetch the embed URL to check if it loads
    const response = await fetch(getMovieEmbedUrl(tmdbId), {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true; // If it doesn't throw, assume it's available
  } catch {
    return false;
  }
}

/**
 * Check if a TV episode is available on vidsrc
 */
export async function checkEpisodeAvailability(
  tmdbId: string,
  season: number,
  episode: number
): Promise<boolean> {
  try {
    const response = await fetch(getTVEmbedUrl(tmdbId, season, episode), {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get vidsrc source information for display
 */
export function getVidsrcSourceInfo(): { name: string; description: string } {
  return {
    name: 'vidsrc.xyz',
    description: 'Free streaming embed source with multiple video sources fallback'
  };
}
