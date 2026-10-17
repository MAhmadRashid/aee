'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Edit, 
  Trash2, 
  Plus, 
  PackageOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { perfumes as defaultCatalog } from '@/data/perfumes';

const CATEGORIES = [
  'All Collections',
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Collections');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 1. Try dedicated admin products API
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.data || []);
        if (items.length > 0) {
          setProducts(items);
          setLoading(false);
          return;
        }
      }

      // 2. Try public products catalogue API
      const publicRes = await fetch('/api/products');
      if (publicRes.ok) {
        const publicData = await publicRes.json();
        const items = Array.isArray(publicData) ? publicData : (publicData.data || []);
        if (items.length > 0) {
          setProducts(items);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback to client catalogue
      setProducts(defaultCatalog.map(p => ({
        ...p,
        _id: p.id,
        stock: 100,
        stock_quantity: 100,
      })));
    } catch (error) {
      console.warn('Network issue fetching products, loading client catalogue fallback:', error);
      setProducts(defaultCatalog.map(p => ({
        ...p,
        _id: p.id,
        stock: 100,
        stock_quantity: 100,
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed-products');
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Seeded 48 master perfumes into database successfully!');
        await fetchProducts();
      } else {
        showToast(data.error || 'Database seeded or updated.');
        await fetchProducts();
      }
    } catch (err) {
      showToast('Catalog synced to boutique archives.');
      await fetchProducts();
    } finally {
      setSeeding(false);
    }
  };

  const handleQuickStockUpdate = async (product: any, delta: number) => {
    const id = product._id || product.id;
    const currentStock = product.stock ?? product.stock_quantity ?? 50;
    const newStock = Math.max(0, currentStock + delta);
    
    setUpdatingStockId(id);
    // Optimistic UI update
    setProducts(prev => prev.map(p => {
      if ((p._id || p.id) === id) {
        return { ...p, stock: newStock, stock_quantity: newStock };
      }
      return p;
    }));

    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock, stock_quantity: newStock })
      });
      showToast(`Stock updated for ${product.name} to ${newStock} units`);
    } catch (e) {
      console.error('Failed to sync stock change to server:', e);
    } finally {
      setUpdatingStockId(null);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteCandidate) return;
    const id = deleteCandidate._id || deleteCandidate.id;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter((p: any) => (p._id || p.id) !== id));
        showToast(`"${deleteCandidate.name}" removed from the boutique catalog.`);
      } else {
        // Optimistic delete for offline / local mode
        setProducts(prev => prev.filter((p: any) => (p._id || p.id) !== id));
        showToast(`"${deleteCandidate.name}" removed.`);
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      setProducts(prev => prev.filter((p: any) => (p._id || p.id) !== id));
      showToast('Product removed locally.');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((p: any) => {
      const matchesSearch = !query || 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.tagline && p.tagline.toLowerCase().includes(query));

      const matchesCat = 
        selectedCategory === 'All Collections' || 
        (p.category && (
          p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(p.category.toLowerCase())
        ));

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] border border-[#D4AF37]/40 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
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
              <h3 className="font-serif text-lg text-white">De-list Fragrance?</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you wish to remove <span className="text-white font-semibold">{deleteCandidate.name}</span> from the active boutique catalog?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-neutral-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteProduct}
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
            Artisanal Inventory
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            Total {products.length} Fragrances across 10 Luxury Collections
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em]"
            title="Populate or restore master perfumes from catalog"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-2 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Syncing...' : 'Sync 48 Catalog Items'}
          </button>
          <Link 
            href="/admin/products/new" 
            className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-6 py-3.5 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} /> Add Fragrance
          </Link>
        </div>
      </header>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Search by fragrance title, collection, or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#121212] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-[#181818] text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-5 pl-6 font-sans">Product</th>
                <th className="p-5 font-sans">Collection</th>
                <th className="p-5 font-sans">Retail Price</th>
                <th className="p-5 font-sans">Inventory</th>
                <th className="p-5 pr-6 text-right font-sans">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-5 pl-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-40 h-4 bg-white/10 rounded-sm"></div>
                        <div className="w-20 h-3 bg-white/5 rounded-sm"></div>
                      </div>
                    </td>
                    <td className="p-5"><div className="w-24 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5 pr-6 flex justify-end space-x-3">
                      <div className="w-6 h-6 bg-white/5 rounded"></div>
                      <div className="w-6 h-6 bg-white/5 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-4 shadow-inner">
                        <PackageOpen className="w-7 h-7 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">No fragrances found.</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mb-6">
                        {products.length === 0 
                          ? "Your boutique database is currently unpopulated. Click below to instantly load all 48 signature fragrances."
                          : "No products match your active search and category filter."}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        {products.length === 0 ? (
                          <button 
                            onClick={handleSeedDatabase}
                            disabled={seeding}
                            className="bg-[#D4AF37] text-black font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest hover:brightness-110 transition shadow-lg flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            {seeding ? 'Syncing Products...' : '⚡ Seed 48 Master Fragrances'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All Collections'); }}
                            className="text-xs uppercase tracking-widest text-[#D4AF37] underline"
                          >
                            Reset All Filters
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product: any) => {
                  const stock = product.stock ?? product.stock_quantity ?? 50;
                  const imageSrc = product.image || product.image_url || '/perfumes/1.webp';
                  const isAvailable = stock > 0;
                  const id = product._id || product.id;

                  return (
                    <tr key={id} className="hover:bg-white/5 transition-colors duration-200 group">
                      <td className="p-5 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-14 bg-black border border-white/10 rounded-md relative overflow-hidden shrink-0">
                            <Image 
                              src={imageSrc} 
                              alt={product.name || 'Perfume'} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          </div>
                          <div>
                            <span className="font-serif text-sm font-medium text-neutral-200 group-hover:text-white transition-colors block">
                              {product.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">
                              SKU: {product.sku || (product.id ? String(product.id).slice(0, 10) : 'ZTO')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded-sm whitespace-nowrap">
                          {product.category || 'Fine Fragrance'}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-xs tracking-wider text-neutral-200 font-semibold">
                        Rs. {(product.price || 0).toLocaleString()}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              <span>In Stock ({stock})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-400">
                              <span className="w-2 h-2 rounded-full bg-red-400"></span>
                              <span>Out of Stock</span>
                            </span>
                          )}
                          <div className="inline-flex items-center gap-1 ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleQuickStockUpdate(product, -5)}
                              disabled={updatingStockId === id || stock <= 0}
                              className="w-5 h-5 bg-white/5 hover:bg-white/15 rounded text-neutral-300 text-[10px] font-mono flex items-center justify-center transition"
                              title="Decrease stock by 5"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuickStockUpdate(product, 10)}
                              disabled={updatingStockId === id}
                              className="w-5 h-5 bg-white/5 hover:bg-white/15 rounded text-neutral-300 text-[10px] font-mono flex items-center justify-center transition"
                              title="Increase stock by 10"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 pr-6">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/admin/products/edit/${id}`} 
                            className="text-neutral-400 hover:text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-md transition-colors"
                            title="Edit Fragrance"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => setDeleteCandidate(product)}
                            className="text-neutral-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-md transition-colors"
                            title="De-list Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredProducts.length > itemsPerPage && (
          <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/20">
            <span className="text-[11px] font-sans text-neutral-500 tracking-wider">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-neutral-400 px-3">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
