'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Plus, PackageOpen, Search, ChevronLeft, ChevronRight, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Collections');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteCandidate) return;
    const id = deleteCandidate._id || deleteCandidate.id;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter((p: any) => (p._id || p.id) !== id));
        showToast(`"${deleteCandidate.name}" has been removed from the boutique catalog.`);
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      showToast('Error removing product.');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchesSearch = 
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = 
        selectedCategory === 'All Collections' || 
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
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
        <Link 
          href="/admin/products/new" 
          className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-6 py-3.5 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} /> Add Fragrance
        </Link>
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
                Array.from({ length: itemsPerPage }).map((_, idx) => (
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
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-4 shadow-inner">
                        <PackageOpen className="w-7 h-7 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">No fragrances found.</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mb-6">
                        No products match your active search and category filter.
                      </p>
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All Collections'); }}
                        className="text-xs uppercase tracking-widest text-[#D4AF37] underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product: any) => {
                  const stock = product.stock ?? product.stock_quantity ?? 50;
                  const imageSrc = product.image || product.image_url || '/perfumes/1.webp';
                  const isAvailable = stock > 0;

                  return (
                    <tr key={product._id || product.id} className="hover:bg-white/5 transition-colors duration-200 group">
                      <td className="p-5 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-14 bg-black border border-white/10 rounded-md relative overflow-hidden shrink-0">
                            <Image 
                              src={imageSrc} 
                              alt={product.name} 
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
                      </td>
                      <td className="p-5 pr-6">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/admin/products/edit/${product._id || product.id}`} 
                            className="text-neutral-400 hover:text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-md transition-colors"
                            title="Edit Fragrance"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => setDeleteCandidate(product)} 
                            className="text-neutral-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
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
        {!loading && totalPages > 1 && (
          <div className="border-t border-white/5 p-4 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-sans ml-4">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </span>
            <div className="flex space-x-2 mr-4">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded border border-white/10 text-neutral-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-white/10 text-neutral-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
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
