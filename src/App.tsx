import { useState, useEffect } from 'react';
import { 
  AudioLines, 
  Hand, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Activity, 
  Menu, 
  X, 
  Zap,
  Shield,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import VibeVizTab from './components/VibeVizTab';
import CustomAnalyticsTab from './components/CustomAnalyticsTab';
import TherapyChat from './components/TherapyChat';
import KnowledgeBase from './components/KnowledgeBase';
import AppManager from './components/AppManager';
import LivePanel from './components/LivePanel';
import Onboarding from './components/Onboarding';
import { AppSettings, BeliefSystem } from './types';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'vibeviz' | 'sign' | 'chat' | 'knowledge' | 'manager' | 'live';

const THEMES: Record<string, string> = {
  dark: 'bg-slate-950 text-slate-100',
  light: 'bg-slate-50 text-slate-900',
  sepia: 'bg-[#f4ecd8] text-[#5b4636]',
  christian: 'bg-[#FDFCF0] text-[#1A2A3A]', // The Luminal Path
  islamic: 'bg-[#F9F6F0] text-[#1A202C]', // Al-Mizan
  bahai: 'bg-[#F7F9FA] text-[#1C1E21]', // Radiant Unity
  gnostic: 'bg-[#0A0A0B] text-[#F8F9FA]', // Gnostic Ascent
  secular: 'bg-[#fcfcfc] text-slate-900', // Digital Diary / Secular
  stoic: 'bg-[#07080D] text-[#E8E4DC]', // Sanctuary
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleOnboardingComplete = async (newSettings: { user_name: string, belief_system: BeliefSystem, doctrine: string }) => {
    try {
      const updated = {
        ...settings,
        ...newSettings,
        onboarding_complete: true,
        theme: newSettings.belief_system // Auto-set theme based on belief
      };
      
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updated }),
      });
      
      setSettings(updated as AppSettings);
    } catch (err) {
      console.error('Onboarding failed', err);
    }
  };

  if (!settings) return <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-widest">Initialising Sanctuary...</div>;

  if (!settings.onboarding_complete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const currentThemeClass = THEMES[settings.theme] || THEMES.dark;

  const navItems = [
    { id: 'chat', label: 'Therapy Chat', icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-600' },
    { id: 'vibeviz', label: 'Emotion Mesh', icon: AudioLines, color: 'text-rose-400', bg: 'bg-rose-600' },
    { id: 'sign', label: 'Sign Language', icon: Hand, color: 'text-emerald-400', bg: 'bg-emerald-600' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-600' },
    { id: 'live', label: 'Live Panel', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-600', premium: true },
    { id: 'manager', label: 'App Manager', icon: Settings, color: 'text-slate-400', bg: 'bg-slate-600' },
  ];

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-700 ${currentThemeClass}`}>
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={`fixed left-0 top-0 h-full border-r-4 border-black/10 z-50 flex flex-col transition-colors duration-500 ${settings.theme === 'dark' || settings.theme === 'gnostic' || settings.theme === 'stoic' ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-xl`}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.h1 
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2 text-indigo-500"
              >
                <Sparkles className="w-8 h-8" />
                IntuiScribe
              </motion.h1>
            ) : (
              <motion.div 
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <Sparkles className="w-8 h-8 text-indigo-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all group relative ${
                activeTab === item.id 
                  ? `${item.bg} text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black -translate-y-0.5` 
                  : 'text-current/60 hover:bg-black/5'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : item.color}`} />
              {isSidebarOpen && (
                <span className="flex-1 text-left flex items-center justify-between">
                  {item.label}
                  {item.premium && settings.tier === 'free' && <Shield className="w-3 h-3 text-amber-500" />}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-black/5">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-black/5 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} p-8 flex flex-col items-center`}>
        <header className="mb-12 text-center w-full max-w-7xl flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-indigo-500">
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">
                {settings.belief_system} Foundation // {settings.doctrine} Doctrine
              </p>
            </div>
          </div>
        </header>

        <div className="w-full max-w-7xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {activeTab === 'vibeviz' && <VibeVizTab />}
              {activeTab === 'sign' && <CustomAnalyticsTab />}
              {activeTab === 'chat' && <TherapyChat settings={settings} />}
              {activeTab === 'knowledge' && <KnowledgeBase />}
              {activeTab === 'manager' && <AppManager settings={settings} onUpdate={fetchSettings} />}
              {activeTab === 'live' && <LivePanel tier={settings.tier} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
