'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Loading Inventory</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic tracking-wide text-[var(--color-primary)] mb-2">Inventory</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Manage your boutique products</p>
        </div>
        <Link href="/admin/products/new" className="bg-[var(--color-primary)] text-[var(--color-background)] px-6 py-3 rounded-sm flex items-center hover:bg-[var(--color-accent)] hover:shadow-[0_4px_20px_rgba(194,155,87,0.3)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.15em]">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </header>

      <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl rounded-sm border border-[var(--color-border)]/50 shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface)]/80 border-b border-[var(--color-border)]/50 text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">
              <th className="p-6">Product Name</th>
              <th className="p-6">Collection</th>
              <th className="p-6">Price</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/30">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-serif italic">No products found.</td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id} className="hover:bg-[var(--color-surface)]/60 transition-colors duration-300">
                  <td className="p-6 font-serif text-lg text-[var(--color-text)]">{product.name}</td>
                  <td className="p-6 text-[10px] uppercase tracking-[0.1em] text-[var(--color-primary)]">{product.category}</td>
                  <td className="p-6 font-sans tracking-wider text-[var(--color-text)]">Rs. {product.price.toLocaleString()}</td>
                  <td className="p-6 text-right flex justify-end space-x-4">
                    <Link href={`/admin/products/edit/${product._id}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteProduct(product._id)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
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
