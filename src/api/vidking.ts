/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/*vidking API Integration
 * vidki provides a simple embed interface for movies and TV shows.
 */

export interface VidkingMediaInfo {
  tmdbId: string;
  title: string;
  type: "movie" | "tv";
  available: boolean;
}

export interface VidkingEpisodeInfo {
  tmdbId: string;
  season: number;
  episode: number;
  available: boolean;
}

export function getMovieEmbedUrl(tmdbId: string): string {
  return `https://www.vidking.net/embed/movie/${tmdbId}`;
}

export function getTVEmbedUrl(
  tmdbId: string,
  season: number,
  episode: number,
): string {
  return `https://www.vidking.net/embed/tv/${tmdbId}/season/${season}/episode/${episode}`;
}

export async function checkMovieAvailability(tmdbId: string): Promise<boolean> {
  try {
    // Try to fetch the embed URL to check if it loads
    const response = await fetch(getMovieEmbedUrl(tmdbId), {
      method: "HEAD",
      mode: "no-cors",
    });
    return true; // If it doesn't throw, assume it's available
  } catch {
    return false;
  }
}

export async function checkEpisodeAvailability(
  tmdbId: string,
  season: number,
  episode: number,
): Promise<boolean> {
  try {
    const response = await fetch(getTVEmbedUrl(tmdbId, season, episode), {
      method: "HEAD",
      mode: "no-cors",
    });
    return true;
  } catch {
    return false;
  }
}

export function getVidsrcSourceInfo(): { name: string; description: string } {
  return {
    name: "Vidking",
    description:
      "Free streaming embed source with multiple video sources fallback",
  };
}
