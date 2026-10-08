'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Zero to One',
    category: '',
    price: '',
    description: '',
    shortDescription: '',
    image: '',
    notes: { top: [], heart: [], base: [] }
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNotesChange = (type: 'top' | 'heart' | 'base', value: string) => {
    const notesArray = value.split(',').map(n => n.trim()).filter(n => n);
    setFormData({ ...formData, notes: { ...formData.notes, [type]: notesArray } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0
        })
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-4 pb-12 max-w-4xl w-full">
      <header className="flex justify-between items-end mb-10">
        <div>
          <Link href="/admin/products" className="text-neutral-500 hover:text-[#D4AF37] transition-colors flex items-center text-[10px] uppercase tracking-widest mb-4">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Inventory
          </Link>
          <h1 className="text-4xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] drop-shadow-md">New Product</h1>
        </div>
      </header>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Product Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange}
                placeholder="e.g. Royal Oud"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-serif"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Category</label>
              <select 
                name="category" 
                required 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
              >
                <option value="" disabled className="bg-[#121212]">Select Collection</option>
                <option value="Premium Perfumes" className="bg-[#121212]">Premium Perfumes</option>
                <option value="Classic Perfumes" className="bg-[#121212]">Classic Perfumes</option>
                <option value="Oud Collection" className="bg-[#121212]">Oud Collection</option>
                <option value="Perfume Wax" className="bg-[#121212]">Perfume Wax</option>
                <option value="Luxury Gift Boxes" className="bg-[#121212]">Luxury Gift Boxes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Price (Rs.)</label>
              <input 
                type="number" 
                name="price" 
                required 
                value={formData.price} 
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans tracking-widest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Image URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange}
                  placeholder="/images/products/royal-oud.jpg"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <UploadCloud className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Short Description</label>
            <input 
              type="text" 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleChange}
              placeholder="A brief punchline for the product card..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Detailed Description</label>
            <textarea 
              name="description" 
              rows={4}
              value={formData.description} 
              onChange={handleChange}
              placeholder="Full product story and details..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors custom-scrollbar"
            />
          </div>

          <hr className="border-white/5 my-8" />

          {/* Fragrance Notes */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Fragrance Notes</h3>
            <p className="text-[10px] text-neutral-500 mt-[-10px]">Separate notes with commas (e.g. Bergamot, Lemon, Rose)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Top Notes</label>
                <input 
                  type="text" 
                  onChange={(e) => handleNotesChange('top', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Heart Notes</label>
                <input 
                  type="text" 
                  onChange={(e) => handleNotesChange('heart', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Base Notes</label>
                <input 
                  type="text" 
                  onChange={(e) => handleNotesChange('base', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-8 py-3.5 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" strokeWidth={2.5} />
              )}
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
