import { Movie } from '../types';
import { motion } from 'motion/react';
import { Play, Heart } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick, isFavorite = false, onToggleFavorite }: MovieCardProps) {
  return (
    <motion.div 
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] rounded-xl overflow-hidden mb-4 bg-surface-container-low relative shadow-2xl transition-transform duration-500">
        <img 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
          src={movie.image}
          alt={movie.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(movie);
            }}
            className="rounded-full bg-black/50 p-2 text-white transition hover:bg-primary"
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-primary' : 'text-white'} />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
          <button className="w-full py-3 bg-white text-black font-bold rounded-lg text-sm mb-3 flex items-center justify-center gap-2">
            <Play size={16} fill="currentColor" />
            Watch Now
          </button>
          <button className="w-full py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-lg text-sm">Preview</button>
        </div>
        {movie.is4K && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-tighter">4K HDR</div>
        )}
      </div>
      <h4 className="font-bold text-base group-hover:text-primary transition-colors">{movie.title}</h4>
      <p className="text-xs text-on-surface-variant mt-1 font-medium italic">
        {movie.genre.join(' • ')} • {movie.year}
      </p>
    </motion.div>
  );
}
