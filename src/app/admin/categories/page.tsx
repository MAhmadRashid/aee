'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter((c: any) => c._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: '', slug: '', description: '' });
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Loading Categories</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic tracking-wide text-[var(--color-primary)] mb-2">Collections</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Manage product categories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`px-6 py-3 rounded-sm flex items-center transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.15em] ${showForm ? 'bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]' : 'bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-accent)] hover:shadow-[0_4px_20px_rgba(194,155,87,0.3)]'}`}>
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Collection</>}
        </button>
      </header>

      {showForm && (
        <div className="bg-[var(--color-surface)]/80 backdrop-blur-xl p-8 rounded-sm border border-[var(--color-primary)]/30 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <h2 className="text-lg font-serif italic text-[var(--color-primary)] mb-6 border-b border-[var(--color-border)]/30 pb-4">New Collection</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] mb-2">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] p-3 rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] mb-2">URL Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] p-3 rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-[var(--color-primary)] text-[var(--color-background)] px-8 py-3 rounded-sm text-[10px] uppercase font-bold tracking-[0.15em] hover:bg-[var(--color-accent)] transition-all">Save Collection</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl rounded-sm border border-[var(--color-border)]/50 shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface)]/80 border-b border-[var(--color-border)]/50 text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">
              <th className="p-6">Collection Name</th>
              <th className="p-6">URL Slug</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/30">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-serif italic">No collections found.</td>
              </tr>
            ) : (
              categories.map((category: any) => (
                <tr key={category._id} className="hover:bg-[var(--color-surface)]/60 transition-colors duration-300">
                  <td className="p-6 font-serif text-lg text-[var(--color-text)]">{category.name}</td>
                  <td className="p-6 text-[10px] tracking-wider text-[var(--color-text-muted)]">/{category.slug}</td>
                  <td className="p-6 text-right flex justify-end space-x-4">
                    <button onClick={() => deleteCategory(category._id)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
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
  );
}
