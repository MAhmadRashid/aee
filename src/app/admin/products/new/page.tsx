'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, UploadCloud, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const BOUTIQUE_COLLECTIONS = [
  'Classic Perfumes',
  'Premium Perfumes',
  'Oud',
  'Tester Box',
  'Sample Sets',
  'Body Mist',
  'Gift Box',
  'Perfume Wax / Attar',
  'Car Diffusers / Car Perfumes',
  'Home & Space Fragrances'
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Zero to One',
    category: 'Classic Perfumes',
    price: '',
    originalPrice: '',
    stock: 50,
    description: '',
    shortDescription: '',
    image: '/perfumes/1.webp',
    notes: { top: [], heart: [], base: [] }
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? Number(value) : value
    }));
  };

  const handleNotesChange = (type: 'top' | 'heart' | 'base', value: string) => {
    const notesArray = value.split(',').map(n => n.trim()).filter(n => n);
    setFormData({ ...formData, notes: { ...formData.notes, [type]: notesArray } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0,
          originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
          stock: Number(formData.stock) || 50,
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to register product in boutique archives.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('Connection to admin API failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-4 pb-12 max-w-4xl w-full">
      <header className="flex justify-between items-end mb-6">
        <div>
          <Link href="/admin/products" className="text-neutral-400 hover:text-[#D4AF37] transition-colors flex items-center text-[10px] uppercase tracking-widest mb-3">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Inventory
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0]">
            Curate New Fragrance
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Register a luxury olfactory creation into the boutique catalog</p>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-lg flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Fragrance added successfully! Redirecting to catalog...</span>
        </div>
      )}

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Fragrance Title</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange}
                placeholder="e.g. Royal Oud Extrait"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-serif text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Boutique Collection</label>
              <select 
                name="category" 
                required 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none text-xs cursor-pointer"
              >
                {BOUTIQUE_COLLECTIONS.map(cat => (
                  <option key={cat} value={cat} className="bg-[#181818]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Price (Rs.)</label>
              <input 
                type="number" 
                name="price" 
                required 
                value={formData.price} 
                onChange={handleChange}
                placeholder="6499"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Original Price (Rs.)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={formData.originalPrice} 
                onChange={handleChange}
                placeholder="7999"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Initial Inventory Stock</label>
              <input 
                type="number" 
                name="stock" 
                required
                value={formData.stock} 
                onChange={handleChange}
                placeholder="50"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-mono text-sm"
              />
            </div>
          </div>

          {/* Image & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-9 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Product Visual Image URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange}
                  placeholder="/perfumes/1.webp or https://..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors text-xs font-mono"
                />
                <UploadCloud className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              </div>
            </div>
            <div className="md:col-span-3 flex items-center justify-center">
              <div className="w-16 h-20 bg-black border border-white/10 rounded-lg overflow-hidden relative shadow-inner">
                {formData.image ? (
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Short Scent Punchline</label>
            <input 
              type="text" 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleChange}
              placeholder="e.g. Smoky Bulgarian Rose intertwined with Royal Cambodi Oud"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Artisanal Story & Narrative</label>
            <textarea 
              name="description" 
              rows={4}
              value={formData.description} 
              onChange={handleChange}
              placeholder="Detailed olfactive pyramid, longevity notes, and inspiration..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Fragrance Notes */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Olfactory Notes Pyramid</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Top Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bergamot, Saffron"
                  onChange={(e) => handleNotesChange('top', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Heart Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Damask Rose, Amber"
                  onChange={(e) => handleNotesChange('heart', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Base Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pure Agarwood, Musk"
                  onChange={(e) => handleNotesChange('base', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-8 py-3.5 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" strokeWidth={2.5} />
              )}
              {loading ? 'Registering Fragrance...' : 'Save & Publish Fragrance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
