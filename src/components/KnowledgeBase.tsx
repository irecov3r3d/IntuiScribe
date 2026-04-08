import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, BookOpen, AlertCircle, Loader2, Link as LinkIcon, Download } from 'lucide-react';
import { Document } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function KnowledgeBase() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [entryMode, setEntryMode] = useState<'manual' | 'url'>('manual');
  const [newDoc, setNewDoc] = useState({ title: '', content: '', type: 'belief' });
  const [importUrl, setImportUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error('Failed to fetch docs', err);
    }
  };

  const handleFetchUrl = async () => {
    if (!importUrl) return;
    setIsFetchingUrl(true);
    setError(null);
    try {
      const res = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });
      
      if (!res.ok) throw new Error('Failed to fetch URL content');
      
      const data = await res.json();
      setNewDoc(prev => ({
        ...prev,
        title: data.title || importUrl,
        content: data.content || '',
      }));
      setEntryMode('manual'); // Switch to manual to let user review/edit
    } catch (err) {
      console.error('Failed to fetch URL', err);
      setError('Could not extract content from that URL. Please try another or enter manually.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleAdd = async () => {
    if (!newDoc.title || !newDoc.content) return;
    setIsLoading(true);
    try {
      await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
      setNewDoc({ title: '', content: '', type: 'belief' });
      setImportUrl('');
      setIsAdding(false);
      fetchDocs();
    } catch (err) {
      console.error('Failed to add doc', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/docs/${id}`, { method: 'DELETE' });
      fetchDocs();
    } catch (err) {
      console.error('Failed to delete doc', err);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-emerald-400 italic">Knowledge Base</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">User Beliefs & Therapeutic Manuals</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 border-4 border-black px-6 py-3 rounded-2xl font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none uppercase text-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Document</>}
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800 border-4 border-slate-700 rounded-3xl p-6 space-y-6 overflow-hidden shadow-xl"
          >
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border-2 border-slate-700 w-fit">
              <button
                onClick={() => setEntryMode('manual')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  entryMode === 'manual' ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setEntryMode('url')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  entryMode === 'url' ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Import from URL
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/20 border-2 border-rose-500 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {entryMode === 'url' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Website URL</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleFetchUrl}
                      disabled={isFetchingUrl || !importUrl}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-3 rounded-xl border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      {isFetchingUrl ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                      Fetch
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">The system will attempt to extract the main text content from the provided URL.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
                    <input
                      type="text"
                      value={newDoc.title}
                      onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                      placeholder="e.g., My Core Beliefs"
                      className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
                    <select
                      value={newDoc.type}
                      onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                      className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="belief">User Belief</option>
                      <option value="manual">Therapy Manual</option>
                      <option value="history">Personal History</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content</label>
                  <textarea
                    value={newDoc.content}
                    onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                    placeholder="Paste your document content here..."
                    rows={6}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={isLoading || !newDoc.title || !newDoc.content}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-4 rounded-xl border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save to Memory'}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.length === 0 ? (
          <div className="col-span-full p-12 border-4 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">No documents found</p>
            <p className="text-xs font-bold mt-2">Add your first belief or manual to start RAG therapy.</p>
          </div>
        ) : (
          docs.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border-4 border-slate-700 rounded-3xl p-6 relative group hover:border-emerald-500/50 transition-colors shadow-lg flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${doc.type === 'belief' ? 'bg-amber-600/20 text-amber-400' : 'bg-indigo-600/20 text-indigo-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-sm text-slate-100">{doc.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{doc.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 line-clamp-4 font-medium leading-relaxed">
                  {doc.content}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-slate-700 flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  Added {new Date(doc.createdAt).toLocaleDateString()}
                </span>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                  View Full
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
