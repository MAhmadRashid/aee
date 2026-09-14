import { perfumes } from '../../../data/perfumes';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

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

  let categoryProducts;
  if (slug === 'under-2000') {
    categoryProducts = perfumes.filter(p => p.price < 2000);
  } else if (slug === 'under-3000') {
    categoryProducts = perfumes.filter(p => p.price <= 3000);
  } else {
    categoryProducts = perfumes.filter(p => p.category === categoryName);
  }

  // Force recompile to pick up latest perfumes.ts
  return (
    <CategoryClient 
      categoryName={categoryName} 
      initialProducts={categoryProducts} 
    />
  );
}
