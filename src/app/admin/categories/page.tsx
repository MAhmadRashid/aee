'use client';
import { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaultCategories = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed-categories', { method: 'POST' });
      if (res.ok) {
        showToast('All 10 boutique collections seeded successfully!');
        await fetchCategories();
      } else {
        showToast('Seed failed. Please check admin authorization.');
      }
    } catch (err) {
      console.error('Seeding error:', err);
      showToast('Error seeding collections.');
    } finally {
      setSeeding(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await fetch(`/api/admin/categories/${deleteCandidate.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev: any) => prev.filter((c: any) => c.id !== deleteCandidate.id));
        showToast(`Collection "${deleteCandidate.name}" removed.`);
      } else {
        showToast('Failed to delete collection.');
      }
    } catch (error) {
      console.error('Delete collection error:', error);
      showToast('Error during deletion.');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim(), description: newCategoryDesc.trim() })
      });
      if (res.ok) {
        setNewCategoryName('');
        setNewCategoryDesc('');
        setShowAddForm(false);
        showToast(`Collection "${newCategoryName}" created.`);
        fetchCategories();
      } else {
        showToast('Failed to add collection.');
      }
    } catch (error) {
      console.error("Add collection error:", error);
      showToast('Error creating collection.');
    }
  };

  return (
    <div className="space-y-8 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] border border-[#D4AF37]/40 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-sans tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-white">Delete Collection?</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you wish to delete <span className="text-white font-semibold">{deleteCandidate.name}</span>? Existing products in this collection will not be deleted.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-neutral-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteCategory}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white uppercase tracking-wider transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">
            Collections & Categories
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            Organize olfactory families, concentrations, and gift sets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedDefaultCategories}
            disabled={seeding}
            className="border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 px-5 py-3 rounded-lg flex items-center justify-center transition-all text-[10px] uppercase font-bold tracking-[0.2em] cursor-pointer disabled:opacity-50"
            title="Seed all 10 curated boutique categories"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Seeding...' : 'Seed 10 Collections'}
          </button>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-6 py-3 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} /> {showAddForm ? 'Close Form' : 'Add Collection'}
          </button>
        </div>
      </header>

      {showAddForm && (
        <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8 mb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <h2 className="text-lg font-serif text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Create New Olfactory Collection</span>
          </h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Collection Title</label>
                <input 
                  type="text" 
                  required 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Rare Attar Extraits"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-serif text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Punchline / Tagline</label>
                <input 
                  type="text" 
                  value={newCategoryDesc} 
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="e.g. Pure concentrated perfume oils without alcohol..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#fcdca0] transition-colors cursor-pointer shadow-lg"
              >
                Publish Collection
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-5 pl-6 font-sans">Collection Name</th>
                <th className="p-5 font-sans">Description</th>
                <th className="p-5 font-sans">Slug / Key</th>
                <th className="p-5 pr-6 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-5 pl-6"><div className="w-32 h-5 bg-white/10 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-48 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5 pr-6 flex justify-end">
                      <div className="w-7 h-7 bg-white/5 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-0">
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-4 shadow-inner">
                        <Layers className="w-7 h-7 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">No collections in database yet.</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mb-6">
                        You can seed all 10 curated boutique collections with one click.
                      </p>
                      <button 
                        onClick={handleSeedDefaultCategories} 
                        disabled={seeding}
                        className="bg-[#D4AF37] text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition cursor-pointer"
                      >
                        {seeding ? 'Seeding...' : 'Seed 10 Curated Collections'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat: any) => (
                  <tr key={cat.id || cat.name} className="hover:bg-white/5 transition-colors duration-200 group">
                    <td className="p-5 pl-6">
                      <span className="font-serif italic text-base text-neutral-200 group-hover:text-white transition-colors block">
                        {cat.name}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-xs text-neutral-400 max-w-md line-clamp-1">{cat.description || 'Artisanal collection'}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                        {cat.slug || cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      </span>
                    </td>
                    <td className="p-5 pr-6 text-right">
                      <button 
                        onClick={() => setDeleteCandidate(cat)}
                        className="text-neutral-500 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-md transition-colors cursor-pointer"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
