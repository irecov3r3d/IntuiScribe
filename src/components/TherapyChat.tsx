import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Send, User, Bot, History, BookOpen, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, Document, HISTORICAL_VOICES, AppSettings, DOCTRINES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function TherapyChat({ settings }: { settings: AppSettings }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter voices based on user's belief system
  const availableVoices = HISTORICAL_VOICES.filter(v => 
    v.belief.includes(settings.belief_system) || v.id === 'system'
  );
  
  const [selectedVoice, setSelectedVoice] = useState(availableVoices[0] || HISTORICAL_VOICES[0]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [docs, setDocs] = useState<Document[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
    fetchDocs();
  }, []);

  useEffect(() => {
    if (availableVoices.length > 0 && !availableVoices.find(v => v.id === selectedVoice.id)) {
      setSelectedVoice(availableVoices[0]);
    }
  }, [settings.belief_system]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error('Failed to fetch docs', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMsg),
      });

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // RAG Context: Include user docs AND core doctrine
      const userContext = docs.map(d => `Document: ${d.title}\nContent: ${d.content}`).join('\n\n');
      const coreDoctrine = DOCTRINES[settings.belief_system]?.find(d => d.id === settings.doctrine);
      const doctrineContext = coreDoctrine ? `CORE DOCTRINE: ${coreDoctrine.name}\n${coreDoctrine.content}` : '';

      const systemInstruction = `
        You are ${selectedVoice.name}, ${selectedVoice.description}.
        Provide therapeutic guidance based on your historical perspective and the user's chosen belief system: ${settings.belief_system}.
        
        ${doctrineContext}
        
        Use the following user-provided documents as additional context for their personal history:
        ${userContext}
        
        STRICT RULES:
        1. Stay in character as ${selectedVoice.name}.
        2. Ground all advice in the CORE DOCTRINE provided above.
        3. Do not introduce secular or conflicting methodologies unless the user explicitly asks.
        4. Be empathetic, insightful, and use the language of the chosen tradition.
      `;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction },
      });

      const response = await chat.sendMessage({ message: input });
      const assistantMsg: Message = { role: 'assistant', content: response.text || '' };
      
      setMessages(prev => [...prev, assistantMsg]);
      
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assistantMsg),
      });

    } catch (err) {
      console.error('Chat Error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] w-full bg-slate-900 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b-4 border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm text-indigo-400">Therapy Convo</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Speaking with {selectedVoice.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedVoice.id}
            onChange={(e) => setSelectedVoice(availableVoices.find(v => v.id === e.target.value) || availableVoices[0])}
            className="bg-slate-900 border-2 border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-300 outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Select therapy voice"
          >
            {availableVoices.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`p-2 rounded-lg border-2 border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${isVoiceEnabled ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500'}`}
            aria-label={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
            title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-slate-800 text-slate-100' : 'bg-slate-700 text-slate-50'}`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              <Loader2 className="w-4 h-4 animate-spin" />
              {selectedVoice.name} is reflecting...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-800 border-t-4 border-slate-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedVoice.name}...`}
            className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Send message"
            title={isLoading ? 'Reflecting...' : (!input.trim() ? 'Type a message to send' : 'Send message')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
