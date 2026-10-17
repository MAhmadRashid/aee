import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';

export const dynamic = 'force-dynamic';

const categoryMap: { [key: string]: string } = {
  'premium-perfumes': 'Premium Perfumes',
  'classic-perfumes': 'Classic Perfumes',
  'poetic-perfumes': 'Poetic Perfumes',
  'perfume-wax-attar': 'Perfume Wax / Attar',
  'perfume-wax': 'Perfume Wax / Attar',
  'sample-set': 'Sample Sets',
  'sample-sets': 'Sample Sets',
  'body-mist': 'Body Mist',
  'home-space-fragrances': 'Home & Space Fragrances',
  'home-and-space-fragrances': 'Home & Space Fragrances',
  'perfumes': 'Classic Perfumes',
  'perfume': 'Classic Perfumes',
  'oud': 'Oud',
  'oud-collection': 'Oud',
  'attar': 'Perfume Wax / Attar',
  'gift-box': 'Gift Box',
  'gift-boxes': 'Gift Box',
  'luxury-gift-boxes': 'Gift Box',
  'gifting-packages': 'Gift Box',
  'tester-box': 'Tester Box',
  'tester-boxes': 'Tester Box',
  'car-diffusers-car-perfumes': 'Car Diffusers / Car Perfumes',
  'car-diffusers': 'Car Diffusers / Car Perfumes',
  'car-perfumes': 'Car Diffusers / Car Perfumes',
  'under-2000': 'Under 2000',
  'under-3000': 'Under 3000'
};

function resolveCategoryName(slug: string): string | undefined {
  if (categoryMap[slug]) return categoryMap[slug];
  
  // Try dynamic match against fallback perfumes categories
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const matched = fallbackPerfumes.find(p => {
    const pSlug = (p.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    return pSlug === normalizedSlug;
  });
  
  return matched?.category;
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolveCategoryName(resolvedParams.slug);

  if (!categoryName) {
    return {
      title: 'Category Not Found | Zero To One'
    };
  }

  return {
    title: `${categoryName} | Zero To One`,
    description: `Shop the finest ${categoryName} from Zero To One luxury collection.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryName = resolveCategoryName(slug);
  
  if (!categoryName) {
    notFound();
  }

  let categoryProducts: any[] = [];
  
  if (db && Object.keys(db).length > 0) {
    try {
      let productsRef: any = db.collection('products');
      if (slug !== 'under-2000' && slug !== 'under-3000') {
        productsRef = productsRef.where('category', '==', categoryName);
      }
      
      const snapshot = await productsRef.get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (slug === 'under-2000' && data.price >= 2000) return;
        if (slug === 'under-3000' && data.price > 3000) return;
        
        const serializedData: any = { ...data };
        if (serializedData.createdAt && typeof serializedData.createdAt.toDate === 'function') {
          serializedData.createdAt = serializedData.createdAt.toDate().toISOString();
        }
        if (serializedData.updatedAt && typeof serializedData.updatedAt.toDate === 'function') {
          serializedData.updatedAt = serializedData.updatedAt.toDate().toISOString();
        }
        
        categoryProducts.push({ id: doc.id, ...serializedData });
      });
    } catch (error) {
      console.warn("Firestore category fetch error, will use fallback:", error);
    }
  }

  // Graceful fallback if Firestore returned 0 products
  if (categoryProducts.length === 0) {
    if (slug === 'under-2000') {
      categoryProducts = fallbackPerfumes.filter(p => p.price < 2000);
    } else if (slug === 'under-3000') {
      categoryProducts = fallbackPerfumes.filter(p => p.price <= 3000);
    } else {
      categoryProducts = fallbackPerfumes.filter(
        p => p.category?.toLowerCase() === categoryName.toLowerCase()
      );
    }
  }

  return (
    <CategoryClient 
      categoryName={categoryName} 
      initialProducts={categoryProducts} 
    />
  );
}
