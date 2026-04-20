/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onError?: (error: string) => void;
}

export default function Header({ currentView, onNavigate, onError }: HeaderProps) {
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  const handleSettingsClick = async () => {
    try {
      setIsSettingsLoading(true);
      // Ensure we can navigate to settings even if APIs are slow
      setTimeout(() => {
        onNavigate('settings');
        setIsSettingsLoading(false);
      }, 100);
    } catch (error) {
      setIsSettingsLoading(false);
      onError?.(`Failed to open settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/70 backdrop-blur-3xl shadow-2xl shadow-black/50 flex justify-between items-center px-6 md:px-12 py-5 font-sans antialiased tracking-tight">
      <div className="flex items-center gap-12">
        <motion.div 
          className="text-3xl font-black tracking-tighter cursor-pointer bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
        >
          Proxima
        </motion.div>
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: 'Home', view: 'home' },
            { label: 'Movies', view: 'browse' },
            { label: 'TV Shows', view: 'tv' },
            { label: 'My List', view: 'list' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`text-sm font-medium transition-all duration-300 ${
                currentView === item.view
                  ? 'text-primary'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('search')}
          className={`text-on-surface-variant hover:text-white transition-colors duration-300 active:scale-95 ${currentView === 'search' ? 'text-primary' : ''}`}
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <button 
          className="text-on-surface-variant hover:text-white transition-colors duration-300 active:scale-95"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <motion.button 
          className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-surface cursor-pointer flex items-center justify-center relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSettingsClick}
          disabled={isSettingsLoading}
          aria-label="Settings"
        >
          <img 
            alt="User Profile Avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTFNFkyE7bA0Wh_kWdPUtBD-067E0dKYqh7yIFODcTmbn6PXTXFqpnzzxzUX0pkiqhKT3I3ARxNzuij9ZQTFEnditTRtKzzfSx4OVNzkzCRoJqlS1IudKRtCSYXrbqgJ7-a3YaVV-eg0S0r9V1TpdEFtOl6yl9XqP74xhZB_w2AXy-Zj1n2oCL5VK_5hSOD663yTccN1ULbA1jCqkSXosjWZt70a4uhTVkZKArgenTnPHxnfyqBhcRtPN2rch2poN-uv2EWk62KBnL"
            referrerPolicy="no-referrer"
          />
          {isSettingsLoading && (
            <motion.div 
              className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Settings size={16} />
            </motion.div>
          )}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-high px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Settings
          </div>
        </motion.button>
      </div>
    </header>
  );
}
