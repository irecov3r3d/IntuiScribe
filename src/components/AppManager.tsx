import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { Settings, Palette, User, Shield, Send, Bot, Loader2, Check, AlertCircle, RefreshCcw, BookOpen, BrainCircuit } from 'lucide-react';
import { AppSettings, BeliefSystem, DOCTRINES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AppManagerProps {
  settings: AppSettings;
  onUpdate: () => void;
}

export default function AppManager({ settings, onUpdate }: AppManagerProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset your onboarding? This will clear your belief settings.')) return;
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { ...settings, onboarding_complete: false, belief_system: 'none', doctrine: 'none' } }),
      });
      onUpdate();
    } catch (err) {
      console.error('Reset failed', err);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updated }),
      });
      onUpdate();
      return "Settings updated successfully.";
    } catch (err) {
      console.error('Failed to update settings', err);
      return "Failed to update settings.";
    }
  };

  const handleAssistantAction = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const updateSettingsTool: FunctionDeclaration = {
        name: "updateSettings",
        description: "Update application settings like theme, user name, belief system, or doctrine.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, enum: ['light', 'dark', 'sepia', 'christian', 'islamic', 'bahai', 'gnostic', 'secular', 'stoic'], description: "The UI theme." },
            user_name: { type: Type.STRING, description: "The user's name." },
            tier: { type: Type.STRING, enum: ['free', 'paid'], description: "The subscription tier." },
            assistant_name: { type: Type.STRING, description: "The assistant's name." },
            belief_system: { type: Type.STRING, enum: ['christian', 'islamic', 'bahai', 'gnostic', 'secular', 'stoic', 'none'], description: "The user's belief system." },
            doctrine: { type: Type.STRING, description: "The core doctrine ID." },
          },
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: `You are ${settings.assistant_name}, the system manager for IntuiScribe. 
          You can modify the app's UI, theme, and user settings. 
          Current settings: ${JSON.stringify(settings)}.
          Available Themes: light, dark, sepia, christian, islamic, bahai, gnostic, secular, stoic.
          Available Beliefs: christian, islamic, bahai, gnostic, secular, stoic, none.
          Available Doctrines for ${settings.belief_system}: ${JSON.stringify(DOCTRINES[settings.belief_system])}.
          If the user wants to change something, use the updateSettings tool.
          Be helpful, efficient, and slightly technical but friendly.`,
          tools: [{ functionDeclarations: [updateSettingsTool] }],
        },
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'updateSettings') {
            const result = await updateSettings(call.args as any);
            setMessages(prev => [...prev, { role: 'assistant', content: result }]);
          }
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm here to help with your app settings." }]);
      }
    } catch (err) {
      console.error('Assistant Error', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error while trying to update your settings." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {/* Settings Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-800 border-4 border-slate-700 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-400 italic flex items-center gap-2">
              <Settings className="w-5 h-5" /> Settings
            </h3>
            <button 
              onClick={handleReset}
              className="p-2 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Visual Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'sepia', 'christian', 'islamic', 'bahai', 'gnostic', 'secular', 'stoic'].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateSettings({ theme: t as any })}
                    className={`px-2 py-2 rounded-xl border-2 font-black uppercase text-[8px] tracking-widest transition-all ${
                      settings.theme === t 
                        ? 'bg-indigo-600 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User className="w-3 h-3" /> Identity
              </label>
              <input
                type="text"
                value={settings.user_name}
                onChange={(e) => updateSettings({ user_name: e.target.value })}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-200 outline-none focus:border-indigo-500"
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Belief & Doctrine
              </label>
              <div className="p-4 bg-slate-950 border-2 border-slate-700 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500">System</span>
                  <span className="text-[10px] font-black uppercase text-indigo-400">{settings.belief_system}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Doctrine</span>
                  <span className="text-[10px] font-black uppercase text-emerald-400">{settings.doctrine}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Shield className="w-3 h-3" /> Subscription
              </label>
              <div className={`p-4 rounded-2xl border-2 border-black flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${settings.tier === 'paid' ? 'bg-amber-600/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${settings.tier === 'paid' ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{settings.tier === 'paid' ? 'Pro Plan' : 'Free Tier'}</p>
                    <p className="text-[9px] font-bold opacity-70">{settings.tier === 'paid' ? 'All features unlocked' : 'Limited features'}</p>
                  </div>
                </div>
                {settings.tier === 'free' && (
                  <button 
                    onClick={() => updateSettings({ tier: 'paid' })}
                    className="text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Chat */}
      <div className="lg:col-span-2 flex flex-col bg-slate-900 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[600px]">
        <div className="p-4 bg-slate-800 border-b-4 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-widest text-sm text-indigo-400">{settings.assistant_name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase">System Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-slate-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-medium text-slate-200">
              Hello {settings.user_name}! I'm {settings.assistant_name}. I can help you customize your experience. Try saying "Change theme to christian" or "Switch my belief to stoic".
            </div>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-medium ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing request...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-slate-800 border-t-4 border-slate-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAssistantAction()}
              placeholder="Ask Scribe to modify the app..."
              className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={handleAssistantAction}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 p-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
