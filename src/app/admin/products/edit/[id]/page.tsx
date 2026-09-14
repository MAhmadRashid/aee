'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Zero To One',
    category: '',
    type: '',
    price: 0,
    originalPrice: 0,
    tagline: '',
    image: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const products = await res.json();
          const product = products.find((p: any) => p._id === params.id);
          if (product) {
            setFormData({
              name: product.name || '',
              brand: product.brand || 'Zero To One',
              category: product.category || '',
              type: product.type || '',
              price: product.price || 0,
              originalPrice: product.originalPrice || 0,
              tagline: product.tagline || '',
              image: product.image || ''
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'originalPrice' ? Number(value) : value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold font-serif mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
          <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" disabled={saving} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
