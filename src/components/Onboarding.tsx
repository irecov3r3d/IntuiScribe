import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Shield, BookOpen, User, Check, ArrowRight } from 'lucide-react';
import { BeliefSystem, DOCTRINES } from '../types';

interface OnboardingProps {
  onComplete: (settings: { user_name: string, belief_system: BeliefSystem, doctrine: string }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [belief, setBelief] = useState<BeliefSystem>('none');
  const [doctrine, setDoctrine] = useState('');

  const beliefs: { id: BeliefSystem, name: string, icon: string, description: string }[] = [
    { id: 'christian', name: 'Christianity', icon: '✝️', description: 'Faith in Christ, Scripture, and Grace.' },
    { id: 'islamic', name: 'Islam', icon: '🌙', description: 'Submission to the Divine, Balance, and Reflection.' },
    { id: 'stoic', name: 'Stoicism', icon: '🏛️', description: 'Virtue, Reason, and Emotional Resilience.' },
    { id: 'gnostic', name: 'Gnosticism', icon: '✨', description: 'Inner Light, Knowledge, and Spiritual Ascent.' },
    { id: 'bahai', name: 'Baha\'i', icon: '🌸', description: 'Unity of Humanity, Religion, and God.' },
    { id: 'secular', name: 'Secular / Universal', icon: '🌍', description: 'Humanist values and evidence-based therapy.' },
  ];

  const handleNext = () => {
    if (step === 1 && userName.trim()) setStep(2);
    else if (step === 2 && belief !== 'none') {
      if (DOCTRINES[belief].length > 0) setStep(3);
      else onComplete({ user_name: userName, belief_system: belief, doctrine: 'none' });
    }
    else if (step === 3 && doctrine) {
      onComplete({ user_name: userName, belief_system: belief, doctrine });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-indigo-600 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white">Welcome to IntuiScribe</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Let's start with your name</p>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-slate-950 border-4 border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-lg font-black text-white outline-none focus:border-indigo-600 transition-colors"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white">Choose Your Foundation</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">This locks in the RAG memory and therapeutic voice</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {beliefs.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBelief(b.id)}
                    className={`p-4 rounded-2xl border-4 text-left transition-all relative group ${
                      belief === b.id 
                        ? 'bg-indigo-600 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{b.icon}</span>
                      <h3 className={`font-black uppercase tracking-widest text-sm ${belief === b.id ? 'text-white' : 'text-slate-300'}`}>{b.name}</h3>
                    </div>
                    <p className={`text-[10px] font-bold leading-relaxed ${belief === b.id ? 'text-indigo-100' : 'text-slate-500'}`}>{b.description}</p>
                    {belief === b.id && <Check className="absolute top-4 right-4 w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white">Select Core Doctrine</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">This prevents unwanted methodology and ensures alignment</p>
              </div>
              <div className="space-y-4">
                {DOCTRINES[belief].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDoctrine(d.id)}
                    className={`w-full p-4 rounded-2xl border-4 text-left transition-all relative ${
                      doctrine === d.id 
                        ? 'bg-emerald-600 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <BookOpen className={`w-5 h-5 ${doctrine === d.id ? 'text-white' : 'text-emerald-500'}`} />
                      <h3 className={`font-black uppercase tracking-widest text-sm ${doctrine === d.id ? 'text-white' : 'text-slate-300'}`}>{d.name}</h3>
                    </div>
                    <p className={`text-[10px] font-bold leading-relaxed ${doctrine === d.id ? 'text-emerald-100' : 'text-slate-500'}`}>{d.content}</p>
                    {doctrine === d.id && <Check className="absolute top-4 right-4 w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all ${step === s ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`} />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={(step === 1 && !userName) || (step === 2 && belief === 'none') || (step === 3 && !doctrine)}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 || (step === 2 && DOCTRINES[belief].length === 0) ? 'Finish' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
