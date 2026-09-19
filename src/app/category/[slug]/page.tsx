import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const categoryMap: { [key: string]: string } = {
  'premium-perfumes': 'Premium Perfumes',
  'classic-perfumes': 'Classic Perfumes',
  'poetic-perfumes': 'Poetic Perfumes',
  'perfume-wax-attar': 'Perfume Wax / Attar',
  'sample-set': 'Sample Sets',
  'sample-sets': 'Sample Sets',
  'body-mist': 'Body Mist',
  'home-space-fragrances': 'Home & Space Fragrances',
  'perfumes': 'Perfumes',
  'perfume': 'Perfumes',
  'oud': 'Oud',
  'attar': 'Perfume Wax / Attar',
  'gift-box': 'Gift Box',
  'gift-boxes': 'Gift Box',
  'gifting-packages': 'Gift Box',
  'tester-box': 'Tester Box',
  'tester-boxes': 'Tester Box',
  'under-2000': 'Under 2000',
  'under-3000': 'Under 3000'
};

// Next.js 15+ proper params typing for Server Components
type Params = Promise<{ slug: string }>;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = categoryMap[resolvedParams.slug];

  if (!categoryName) {
    return {
      title: 'Category Not Found | Zero To One'
    };
  }

  return {
    title: `${categoryName} | Zero To One`,
    description: `Shop the finest ${categoryName} from Zero To One. A pure, minimalist expression of nature.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryName = categoryMap[slug];
  
  if (!categoryName) {
    notFound();
  }

  let categoryProducts: any[] = [];
  try {
    let productsRef: any = db.collection('products');
    if (slug !== 'under-2000' && slug !== 'under-3000') {
      productsRef = productsRef.where('category', '==', categoryName);
    }
    
    const snapshot = await productsRef.get();
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      // Apply client-side filtering for custom price categories if needed
      if (slug === 'under-2000' && data.price >= 2000) return;
      if (slug === 'under-3000' && data.price > 3000) return;
      // Serialize Firestore timestamps to ISO strings or delete them
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
    console.error("Error fetching category products:", error);
  }

  return (
    <CategoryClient 
      categoryName={categoryName} 
      initialProducts={categoryProducts} 
    />
  );
}
