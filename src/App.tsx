/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar, { MobileNav } from './components/Sidebar';
import HomeContent from './components/Views/HomeContent';
import BrowseContent from './components/Views/BrowseContent';
import DetailContent from './components/Views/DetailContent';
import SearchContent from './components/Views/SearchContent';
import MyListContent from './components/Views/MyListContent';
import SettingsContent from './components/Views/SettingsContent';
import { Movie, CastMember } from './types';
import { apiManager } from './api/manager';
import { motion, AnimatePresence } from 'motion/react';

type ViewMode = 'home' | 'browse' | 'tv' | 'search' | 'detail' | 'settings' | 'list';
const FAVORITES_STORAGE_KEY = 'proxima-favorites-v1';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedCast, setSelectedCast] = useState<CastMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    Promise.all([apiManager.fetchPopularMovies(), apiManager.fetchPopularTVShows()])
      .then(([movieList, tvList]) => {
        if (active) {
          setMovies(movieList);
          setTvShows(tvList);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Unable to load data.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const toggleFavorite = useCallback((item: Movie) => {
    setFavorites((current) => {
      const isAlreadyFavorite = current.some((favorite) => favorite.id === item.id);
      if (isAlreadyFavorite) {
        return current.filter((favorite) => favorite.id !== item.id);
      }
      return [...current, item];
    });
  }, []);

  const navigateToDetail = useCallback(async (item: Movie) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const details = item.mediaType === 'tv'
        ? await apiManager.fetchTVDetails(item.id)
        : await apiManager.fetchMovieDetails(item.id);

      setSelectedMovie(details.movie);
      setSelectedCast(details.cast);
    } catch {
      setSelectedMovie(item);
      setSelectedCast([]);
    }

    setCurrentView('detail');
  }, []);

  const handleNavigate = useCallback((view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] text-white text-lg">
          Loading TMDb content...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] text-red-400 text-lg px-6 text-center">
          {error}
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomeContent
              movies={movies}
              favorites={favorites}
              onMovieClick={navigateToDetail}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {currentView === 'browse' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 md:px-12 max-w-[1600px] mx-auto flex gap-12"
          >
            <Sidebar onNavigate={handleNavigate} currentView={currentView} />
            <BrowseContent
              mediaType="movie"
              movies={movies}
              favorites={favorites}
              onMovieClick={navigateToDetail}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {currentView === 'tv' && (
          <motion.div
            key="tv"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 md:px-12 max-w-[1600px] mx-auto flex gap-12"
          >
            <Sidebar onNavigate={handleNavigate} currentView={currentView} />
            <BrowseContent
              mediaType="tv"
              movies={tvShows}
              favorites={favorites}
              onMovieClick={navigateToDetail}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {currentView === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SearchContent
              items={[...movies, ...tvShows]}
              favorites={favorites}
              onMovieClick={navigateToDetail}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {currentView === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MyListContent
              favorites={favorites}
              onMovieClick={navigateToDetail}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {currentView === 'detail' && selectedMovie && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DetailContent
              movie={selectedMovie}
              cast={selectedCast}
              similarMovies={selectedMovie.mediaType === 'tv' ? tvShows : movies}
              onMovieClick={navigateToDetail}
              isFavorite={favoriteIds.has(selectedMovie.id)}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {currentView === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SettingsContent />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate}
        onError={(errorMsg) => {
          console.error('Navigation Error:', errorMsg);
          // Still navigate even if there's an error
          if (errorMsg.includes('settings')) {
            handleNavigate('settings');
          }
        }}
      />

      <main className="flex-grow pt-24 pb-32">
        {renderContent()}
      </main>

      <MobileNav onNavigate={handleNavigate} currentView={currentView} />
    </div>
  );
}
