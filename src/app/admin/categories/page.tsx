'use client';
import { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDesc })
      });
      if (res.ok) {
        setNewCategoryName('');
        setNewCategoryDesc('');
        setShowAddForm(false);
        fetchCategories(); // Refresh list
      } else {
        alert("Failed to add collection.");
      }
    } catch (error) {
      console.error("Add collection error:", error);
    }
  };

  return (
    <div className="space-y-10 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      <header className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">Collections</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Manage your fragrance categories</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-6 py-3 rounded-full flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} /> {showAddForm ? 'Cancel' : 'Add Collection'}
        </button>
      </header>

      {showAddForm && (
        <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-serif text-white mb-6 uppercase tracking-widest">Create New Collection</h2>
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Collection Name</label>
                <input 
                  type="text" 
                  required 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Premium Ouds"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Description (Optional)</label>
                <input 
                  type="text" 
                  value={newCategoryDesc} 
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="A short punchline..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#fcdca0] transition-colors"
              >
                Save Collection
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
                <th className="p-6 pl-8 font-sans">Name</th>
                <th className="p-6 font-sans">Description</th>
                <th className="p-6 font-sans">Date Added</th>
                <th className="p-6 pr-8 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-6 pl-8"><div className="w-32 h-5 bg-white/10 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-48 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6 pr-8 flex justify-end">
                      <div className="w-8 h-8 bg-white/5 rounded-lg mr-2"></div>
                      <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-0">
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-6 shadow-inner">
                        <Layers className="w-8 h-8 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-3">No collections found.</h3>
                      <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mb-8">
                        Organize your store by creating your first fragrance category.
                      </p>
                      <button onClick={() => setShowAddForm(true)} className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                        + Add Collection
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors duration-300 group">
                    <td className="p-6 pl-8">
                      <span className="font-serif italic text-lg text-neutral-200 group-hover:text-white transition-colors">{cat.name}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm text-neutral-400">{cat.description || '-'}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-xs text-neutral-500">
                        {(() => {
                          if (!cat.createdAt) return 'Just now';
                          const time = cat.createdAt._seconds ? cat.createdAt._seconds * 1000 
                                     : cat.createdAt.seconds ? cat.createdAt.seconds * 1000 
                                     : cat.createdAt;
                          const d = new Date(time);
                          return isNaN(d.getTime()) ? 'Unknown Date' : d.toLocaleDateString();
                        })()}
                      </span>
                    </td>
                    <td className="p-6 pr-8">
                      <div className="flex items-center justify-end space-x-3 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-neutral-400 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
