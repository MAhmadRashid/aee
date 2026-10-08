'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, PackageOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p: any) => p._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => 
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-10 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">Inventory</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Manage your boutique products</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-8 py-3.5 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} /> Add Product
        </Link>
      </header>

      {/* Search Bar */}
      <div className="relative w-full md:max-w-md mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          type="text"
          placeholder="Search by name, category, or SKU..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full bg-[#121212] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
      </div>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-6 pl-8 font-sans">Product Name</th>
                <th className="p-6 font-sans">SKU</th>
                <th className="p-6 font-sans">Collection</th>
                <th className="p-6 font-sans">Price</th>
                <th className="p-6 font-sans">Stock</th>
                <th className="p-6 pr-8 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                // Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-6 pl-8"><div className="w-48 h-5 bg-white/10 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-24 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-12 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6 pr-8 flex justify-end space-x-4">
                      <div className="w-5 h-5 bg-white/5 rounded"></div>
                      <div className="w-5 h-5 bg-white/5 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                // Empty State Design
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-6 shadow-inner">
                        <PackageOpen className="w-8 h-8 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-3">No inventory items added yet.</h3>
                      <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mb-8">
                        Begin curating your collection by adding your first signature fragrance to the boutique.
                      </p>
                      <Link 
                        href="/admin/products/new" 
                        className="border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-6 py-3 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      >
                        Add Your First Product
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product: any) => (
                  <tr key={product._id || product.id} className="hover:bg-white/5 transition-colors duration-300 group">
                    <td className="p-6 pl-8">
                      <span className="font-serif text-lg text-neutral-200 group-hover:text-white transition-colors">{product.name}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-mono text-neutral-500">{product.sku || 'N/A'}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1.5 rounded-md">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-6 font-sans text-sm tracking-wider text-neutral-300">
                      Rs. {product.price?.toLocaleString()}
                    </td>
                    <td className="p-6">
                      {product.stock_quantity > 0 ? (
                        <span className="text-xs font-bold text-emerald-500">In Stock ({product.stock_quantity})</span>
                      ) : (
                        <span className="text-xs font-bold text-red-500">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-6 pr-8">
                      <div className="flex items-center justify-end space-x-5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/edit/${product._id || product.id}`} className="text-neutral-400 hover:text-[#D4AF37] transition-colors p-2 hover:bg-[#D4AF37]/10 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deleteProduct(product._id || product.id)} className="text-neutral-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
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
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-white/5 p-4 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-sans ml-4">
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
