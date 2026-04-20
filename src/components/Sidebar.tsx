import { motion } from 'motion/react';
import { Home, Search, Download, Film, Section } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export default function Sidebar({ onNavigate, currentView }: SidebarProps) {
  const genres = [
    { name: 'Action', count: 241 },
    { name: 'Sci-Fi', count: 118 },
    { name: 'Drama', count: 402 },
    { name: 'Thriller', count: 89 },
    { name: 'Documentary', count: 56 },
    { name: 'Animation', count: 134 }
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden xl:block">
      <div className="sticky top-32 space-y-10">

        <motion.section
          className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/2 shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm font-medium mb-2 text-white">Proxima Studio</p>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4 italic">we are building a windows application. if you have any feedback on this site, please let us know!</p>
          <button className="w-full py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:shadow-[0_0_20px_rgba(189,157,255,0.3)] transition-all">
            feedback
          </button>
        </motion.section>
        <motion.section
          className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5 shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm font-medium mb-2 text-white">Proxima Studio</p>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4 italic">Get early access to original productions and 8K master cuts.</p>
          <button className="w-full py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:shadow-[0_0_20px_rgba(189,157,255,0.3)] transition-all">
            Upgrade Now
          </button>
        </motion.section>
      </div>
    </aside>
  );
}

export function MobileNav({ onNavigate, currentView }: SidebarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center pb-8 pointer-events-none">
      <div className="glass-panel rounded-2xl w-fit px-8 py-3 shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex gap-10 pointer-events-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center transition-all ${currentView === 'home' ? 'text-primary' : 'text-zinc-500'}`}
        >
          <Home size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
          {currentView === 'home' && <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
        </button>
        <button
          onClick={() => onNavigate('browse')}
          className={`flex flex-col items-center justify-center transition-all ${currentView === 'browse' ? 'text-primary' : 'text-zinc-500'}`}
        >
          <Search size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Explore</span>
          {currentView === 'browse' && <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
        </button>
        <button
          onClick={() => onNavigate('tv')}
          className={`flex flex-col items-center justify-center transition-all ${currentView === 'tv' ? 'text-primary' : 'text-zinc-500'}`}
        >
          <Film size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">TV</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center transition-all ${currentView === 'settings' ? 'text-primary' : 'text-zinc-500'}`}
        >
          <Download size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Studio</span>
        </button>
      </div>
    </div>
  );
}
