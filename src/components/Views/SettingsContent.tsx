import { HISTORY } from '../../constants';
import { apiManager } from '../../api/manager';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Settings, CreditCard, History, Palette, Languages, Scale, ChevronRight, Database, Check, Sun, Moon, Monitor } from 'lucide-react';

const SETTINGS_KEY = 'proxima-appearance-settings';

interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  fontSize: string;
}

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('Account');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [fontSize, setFontSize] = useState('medium');

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const settings: AppearanceSettings = JSON.parse(saved);
        setTheme(settings.theme);
        setFontSize(settings.fontSize);

        // Apply theme immediately
        const root = document.documentElement;
        if (settings.theme === 'light') {
          root.classList.add('light-mode');
          root.style.colorScheme = 'light';
        } else if (settings.theme === 'dark') {
          root.classList.remove('light-mode');
          root.style.colorScheme = 'dark';
        }
        root.style.fontSize = { small: '14px', medium: '16px', large: '18px' }[settings.fontSize];
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings: AppearanceSettings = {
      theme,
      fontSize,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [theme, fontSize]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.style.colorScheme = 'light';
    } else if (theme === 'dark') {
      root.classList.remove('light-mode');
      root.style.colorScheme = 'dark';
    } else {
      // system mode
      root.classList.remove('light-mode');
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        root.classList.add('light-mode');
      }
      root.style.colorScheme = 'light dark';
    }

    console.log(`[Theme] Applied ${theme} theme`);
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.fontSize = sizeMap[fontSize as keyof typeof sizeMap];
    console.log(`[FontSize] Applied ${fontSize} font size`);
  }, [fontSize]);

  const tabs = [
    { icon: Settings, label: 'Account' },
    { icon: Database, label: 'Data Sources' },
    { icon: CreditCard, label: 'Subscription' },
    { icon: History, label: 'History' },
    { icon: Palette, label: 'Appearance' },
    { icon: Languages, label: 'Language' },
    { icon: Scale, label: 'Legal' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="md:col-span-3 space-y-2 sticky top-32">
          <div className="p-4 mb-4">
            <h1 className="text-3xl font-black tracking-tighter text-white">Settings</h1>
          </div>
          <nav className="flex flex-col gap-1">
            {tabs.map((item) => (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.label 
                  ? 'bg-surface-container-highest text-primary font-semibold shadow-inner' 
                  : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-9 space-y-10">
          {/* Account Tab */}
          {activeTab === 'Account' && (
            <>
              {/* Profile Card */}
              <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden flex items-center gap-8 group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500 ring-2 ring-primary/20">
                  <img 
                    alt="User Profile Avatar" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmMluAzxfnTDVltcn0tyugPv-4WW7cNHNONlpCw6wI4SCSwRH1zvSGXarY0Qr8EZWmYJ1wmwelbXXp4zEap_pkViFdLsnnsYDfa61XkU12j7MI-4EvY83S2JDbKfpmmZkUDoVoh77iLFneojy5PqsGVNegQBuUUlefTWuZgosHvGnZUCf7IATd2DAKtEqQJjI8DM-XfoFcRpbfSmSHCvbmAhQTA-J-EL9cNlejq3PZWnZtecxmKG7KYWZCEMY84nCfI63dDgrWschs"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold tracking-tight text-white">user@example.com</h2>
                  <p className="text-on-surface-variant text-sm mt-1"> Member • Joined  2026</p>
                  <div className="mt-4 flex gap-3">
                    <button className="px-5 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">Edit Profile</button>
                    <button className="px-5 py-2 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold hover:bg-surface-bright transition-all">Sign Out</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription */}
                <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between border border-white/5">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Subscription</h3>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded uppercase">Active</span>
                    </div>
                    <p className="text-lg font-semibold text-white">Free</p>
                    <p className="text-sm text-on-surface-variant mt-1">Next billing date: none</p>
                  

                  </div>
                  <div className="mt-8 pt-6 border-t border-outline-variant/10">
                    <button className="w-full py-3 rounded-lg bg-surface-container-highest text-sm font-medium hover:text-primary transition-all flex justify-between items-center px-4">
                      Manage Subscription
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Data Sources Tab */}
          {activeTab === 'Data Sources' && (
            <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Data Source</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Proxima uses The Movie Database (TMDb) as its primary data source for movies and TV shows.
              </p>
              <div className="space-y-4">
                {apiManager.getAvailableProviders().map((provider) => (
                  <motion.div
                    key={provider.id}
                    className="p-4 rounded-lg border bg-primary/10 border-primary/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white text-lg">{provider.name}</h4>
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-4">{provider.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">Movies</span>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">TV Shows</span>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">Trailers</span>
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">Search</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-surface-container-highest rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">ℹ</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Why only TMDb?</p>
                    <p className="text-xs text-on-surface-variant">
                      TMDb provides the most reliable and comprehensive movie database with excellent API support. It offers real-time updates, high-quality metadata, and reliable search functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'History' && (
            <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Viewing History</h3>
              <p className="text-sm text-on-surface-variant mb-4">Your recently viewed movies and TV shows will appear here.</p>
              
            </div>
          )}

          {/* Default message for other tabs */}
          {![ 'Data Sources', 'Appearance', 'Legal'].includes(activeTab) && (
            <div className="bg-surface-container-low rounded-xl p-12 text-center border border-white/5">
              <p className="text-on-surface-variant text-lg">{activeTab} settings coming soon...</p>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'Appearance' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
                <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'dark', name: 'Dark', icon: Moon },
                    { id: 'light', name: 'Light', icon: Sun },
                    { id: 'system', name: 'System', icon: Monitor },
                  ].map((themeOption: any) => (
                    <motion.button
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        theme === themeOption.id
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-surface-container border-white/5 hover:bg-surface-container-highest'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <themeOption.icon className="mx-auto mb-2" size={24} />
                      <div className="text-sm font-semibold text-white">{themeOption.name}</div>
                      {theme === themeOption.id && (
                        <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-2"></div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
                <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Font Size</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'small', name: 'Small', size: 'text-sm' },
                    { id: 'medium', name: 'Medium', size: 'text-base' },
                    { id: 'large', name: 'Large', size: 'text-lg' },
                  ].map((sizeOption) => (
                    <motion.button
                      key={sizeOption.id}
                      onClick={() => setFontSize(sizeOption.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        fontSize === sizeOption.id
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-surface-container border-white/5 hover:bg-surface-container-highest'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`${sizeOption.size} font-semibold text-white`}>{sizeOption.name}</div>
                      {fontSize === sizeOption.id && (
                        <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-2"></div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Settings Saved Notification */}
              <motion.div
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">Settings Saved</p>
                    <p className="text-xs text-green-400/70">Your appearance preferences have been saved and will persist across sessions.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Legal Tab */}
          {activeTab === 'Legal' && (
            <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Legal</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Proxima is a personal project and is not affiliated with TMDb or any other api. All movie data is sourced from TMDb's public API and other third-party sources.
              </p>
              <p className="text-sm text-on-surface-variant">
                For any legal inquiries, please contact us at <a href="mailto:legal@proxima.com" className="text-primary hover:underline">
                  legal@proxima.com
                </a>
              </p>

              <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6 mt-12">Privacy Policy</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Proxima does not collect any personal data. All user preferences are stored locally in the browser's localStorage and are not transmitted to any server.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
