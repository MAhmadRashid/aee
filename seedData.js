const perfumes = [
  // Existing Products
  {
    id: 'santal-blanc',
    name: 'Floral Duo',
    brand: 'Zero To One',
    category: 'Gifting',
    type: 'Fresh floral perfume for girls',
    tagline: 'A pure, minimalist expression of nature.',
    price: 8461,
    originalPrice: 10394,
    rating: 4.8,
    reviews: 120,
    baseColor: '#e8eed2',
    liquidColor: '#d4ebd0',
    capColor: '#c5a880',
    shapes: { bottle: 'round', cap: 'sphere' },
    qualities: { longevity: '8+ Hours', sillage: 'Moderate', season: 'Summer' },
    scentNotes: { top: ['Fig Leaf', 'Cardamom'], middle: ['White Iris', 'Violet'], base: ['Australian Sandalwood', 'Musk'] },
    sizeVariants: [
      { size: '30ml', price: 8339, originalPrice: 12177, stock: 15 },
      { size: '50ml', price: 11056, originalPrice: 14897, stock: 5 },
      { size: '100ml', price: 21260, originalPrice: 21736, stock: 0 }
    ],
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop' // original
  },
  {
    id: 'oud-majestic',
    name: 'CEO Bundle - For Him',
    brand: 'Zero To One',
    category: 'Gifting',
    type: 'Catch 22 + Smash My Head',
    tagline: 'Deep, resinous, and unapologetically bold.',
    price: 10333,
    originalPrice: 14949,
    rating: 4.9,
    reviews: 310,
    baseColor: '#2b1f16',
    liquidColor: '#4a3320',
    capColor: '#ffd700',
    shapes: { bottle: 'square', cap: 'cylinder' },
    qualities: { longevity: '14+ Hours', sillage: 'Enormous', season: 'Winter' },
    scentNotes: { top: ['Italian Bergamot', 'Saffron'], middle: ['Taif Rose', 'Jasmine'], base: ['Cambodian Oud', 'Amber'] },
    sizeVariants: [
      { size: '50ml', price: 15619, originalPrice: 22265, stock: 2 },
      { size: '100ml', price: 29682, originalPrice: 34753, stock: 10 }
    ],
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'velvet-rose',
    name: 'Cool Breeze Duo',
    brand: 'Zero To One',
    category: 'Gifting',
    type: 'Two scents. One cool vibe.',
    tagline: 'A seductive blend of dark rose and spices.',
    price: 9070,
    originalPrice: 12346,
    rating: 4.7,
    reviews: 85,
    baseColor: '#4a1525',
    liquidColor: '#b03a5b',
    capColor: '#1a1a1a',
    shapes: { bottle: 'tall', cap: 'cylinder' },
    qualities: { longevity: '10+ Hours', sillage: 'Strong', season: 'All Year' },
    scentNotes: { top: ['Clove', 'Pink Pepper'], middle: ['Damask Rose', 'Praline'], base: ['Agarwood', 'Vanilla'] },
    sizeVariants: [
      { size: '30ml', price: 8974, originalPrice: 13080, stock: 0 },
      { size: '100ml', price: 18788, originalPrice: 22966, stock: 0 }
    ],
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'summer-story',
    name: 'Summer Story',
    brand: 'Zero To One',
    category: 'Executive Range',
    type: 'Executive Range | 100ml Perfume',
    tagline: 'A crisp, energetic burst of sunshine.',
    price: 11946,
    originalPrice: 12141,
    rating: 4.5,
    reviews: 3,
    baseColor: '#e0c097',
    liquidColor: '#f1d18a',
    capColor: '#b8860b',
    shapes: { bottle: 'square', cap: 'ornate' },
    qualities: { longevity: '6+ Hours', sillage: 'Moderate', season: 'Summer' },
    scentNotes: { top: ['Citrus Zest', 'Bergamot'], middle: ['Neroli', 'Orange Blossom'], base: ['White Musk', 'Cedarwood'] },
    sizeVariants: [
      { size: '50ml', price: 9968, originalPrice: 12367, stock: 25 },
      { size: '100ml', price: 19077, originalPrice: 21518, stock: 12 }
    ],
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'catch-22',
    name: 'Catch 22',
    brand: 'Zero To One',
    category: 'Executive Range',
    type: 'Executive Range',
    tagline: 'Daring and charismatic.',
    price: 9710,
    originalPrice: 11398,
    rating: 5.0,
    reviews: 629,
    baseColor: '#1a1a1a',
    liquidColor: '#ffd700',
    capColor: '#111111',
    shapes: { bottle: 'square', cap: 'cylinder' },
    qualities: { longevity: '12+ Hours', sillage: 'Strong', season: 'Winter' },
    scentNotes: { top: ['Black Pepper', 'Bergamot'], middle: ['Leather', 'Saffron'], base: ['Vetiver', 'Amber'] },
    sizeVariants: [
      { size: '30ml', price: 9610, originalPrice: 11154, stock: 18 },
      { size: '50ml', price: 14656, originalPrice: 18528, stock: 8 },
      { size: '100ml', price: 20642, originalPrice: 26814, stock: 4 }
    ],
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'iqbal',
    name: 'Iqbal',
    brand: 'Zero To One',
    category: 'Poetic Range',
    type: 'Poetic Range',
    tagline: 'Best Fragrances For Men',
    price: 7402,
    originalPrice: 9322,
    rating: 4.6,
    reviews: 70,
    baseColor: '#ffffff',
    liquidColor: '#e0e0e0',
    capColor: '#111111',
    shapes: { bottle: 'tall', cap: 'sphere' },
    qualities: { longevity: '10+ Hours', sillage: 'Moderate', season: 'All Year' },
    scentNotes: { top: ['Mint', 'Green Apple'], middle: ['Lavender', 'Geranium'], base: ['Cedarwood', 'Tonka Bean'] },
    sizeVariants: [
      { size: '30ml', price: 7428, originalPrice: 10381, stock: 40 },
      { size: '50ml', price: 10449, originalPrice: 14125, stock: 15 }
    ],
    image: 'https://images.unsplash.com/photo-1523293115678-cbfa3a3ccce3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'urwan',
    name: 'Urwan',
    brand: 'Zero To One',
    category: 'Poetic Range',
    type: 'Poetic Range',
    tagline: 'Best Fragrance',
    price: 12560,
    originalPrice: 14507,
    rating: 4.8,
    reviews: 22,
    baseColor: '#fdfdfd',
    liquidColor: '#fdfdfd',
    capColor: '#c5a880',
    shapes: { bottle: 'round', cap: 'ornate' },
    qualities: { longevity: '12+ Hours', sillage: 'Strong', season: 'All Year' },
    scentNotes: { top: ['Apple', 'Plum'], middle: ['Geranium', 'Rose'], base: ['Patchouli', 'Vanilla'] },
    sizeVariants: [
      { size: '50ml', price: 12783, originalPrice: 16915, stock: 9 },
      { size: '100ml', price: 17529, originalPrice: 22933, stock: 3 }
    ],
    image: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=600&auto=format&fit=crop'
  },
  
  // PERFUME WAX
  {
    id: 'wax-amber', name: 'Amber Wax Balm', brand: 'Zero To One', category: 'Perfume Wax',
    type: 'Solid Perfume', tagline: 'Warm and inviting amber.',
    price: 1867, originalPrice: 4831, rating: 4.5, reviews: 12,
    baseColor: '#8b4513', liquidColor: '#d2b48c', capColor: '#111111', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Vanilla'], middle: ['Amber'], base: ['Musk'] },
    sizeVariants: [{ size: '15g', price: 1828, originalPrice: 4211, stock: 50 }],
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wax-rose', name: 'Rose Solid Perfume', brand: 'Zero To One', category: 'Perfume Wax',
    type: 'Solid Perfume', tagline: 'Delicate floral essence.',
    price: 1803, originalPrice: 4987, rating: 4.8, reviews: 45,
    baseColor: '#ffb6c1', liquidColor: '#ff69b4', capColor: '#ffd700', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Rose Petals'], middle: ['Geranium'], base: ['Sandalwood'] },
    sizeVariants: [{ size: '15g', price: 1825, originalPrice: 5308, stock: 30 }],
    image: 'https://images.unsplash.com/photo-1600180735398-356aeb7f8642?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wax-oud', name: 'Oud Wax Stick', brand: 'Zero To One', category: 'Perfume Wax',
    type: 'Solid Perfume', tagline: 'Rich woody depth on the go.',
    price: 5046, originalPrice: 6610, rating: 4.9, reviews: 88,
    baseColor: '#2b1f16', liquidColor: '#4a3320', capColor: '#111111', shapes: { bottle: 'square', cap: 'cylinder' },
    scentNotes: { top: ['Saffron'], middle: ['Oud'], base: ['Leather'] },
    sizeVariants: [{ size: '20g', price: 5951, originalPrice: 6331, stock: 15 }],
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wax-vanilla', name: 'Vanilla Cream Wax', brand: 'Zero To One', category: 'Perfume Wax',
    type: 'Solid Perfume', tagline: 'Sweet and creamy indulgence.',
    price: 1848, originalPrice: 4338, rating: 4.6, reviews: 34,
    baseColor: '#f5deb3', liquidColor: '#fff8dc', capColor: '#c5a880', shapes: { bottle: 'round', cap: 'sphere' },
    scentNotes: { top: ['Sugar'], middle: ['Vanilla Bean'], base: ['Tonka'] },
    sizeVariants: [{ size: '15g', price: 1949, originalPrice: 4390, stock: 60 }],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wax-citrus', name: 'Citrus Solid Cologne', brand: 'Zero To One', category: 'Perfume Wax',
    type: 'Solid Perfume', tagline: 'Bright and energetic.',
    price: 1881, originalPrice: 2008, rating: 4.4, reviews: 19,
    baseColor: '#ffa500', liquidColor: '#ff8c00', capColor: '#111111', shapes: { bottle: 'square', cap: 'cylinder' },
    scentNotes: { top: ['Lemon'], middle: ['Bergamot'], base: ['Cedar'] },
    sizeVariants: [{ size: '15g', price: 1949, originalPrice: 2436, stock: 25 }],
    image: 'https://images.unsplash.com/photo-1583445013765-4675cebba438?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wax-lavender', name: 'Sandalwood Balm', brand: 'Zero To One', category: 'Perfume Wax',
    type: 'Solid Perfume', tagline: 'Calming woody aroma.',
    price: 1834, originalPrice: 5004, rating: 4.7, reviews: 56,
    baseColor: '#8b4513', liquidColor: '#a0522d', capColor: '#1a1a1a', shapes: { bottle: 'round', cap: 'sphere' },
    scentNotes: { top: ['Lavender'], middle: ['Sandalwood'], base: ['Musk'] },
    sizeVariants: [{ size: '15g', price: 1923, originalPrice: 4608, stock: 45 }],
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop'
  },

  // SAMPLE SET
  {
    id: 'sample-discovery', name: 'Discovery Set - 5 Scents', brand: 'Zero To One', category: 'Sample Set',
    type: 'Gift Box', tagline: 'Find your signature scent.',
    price: 7755, originalPrice: 10166, rating: 4.9, reviews: 210,
    baseColor: '#f0f0f0', liquidColor: '#ffffff', capColor: '#111111', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Various'], middle: ['Various'], base: ['Various'] },
    sizeVariants: [{ size: '5x5ml', price: 8510, originalPrice: 9435, stock: 100 }],
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sample-oud', name: 'Mini Oud Collection', brand: 'Zero To One', category: 'Sample Set',
    type: 'Gift Box', tagline: 'A journey through the Middle East.',
    price: 10464, originalPrice: 14245, rating: 5.0, reviews: 156,
    baseColor: '#2b1f16', liquidColor: '#4a3320', capColor: '#ffd700', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Oud'], middle: ['Rose'], base: ['Amber'] },
    sizeVariants: [{ size: '3x10ml', price: 9126, originalPrice: 14458, stock: 40 }],
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sample-tryme', name: 'Try-Me Bundle', brand: 'Zero To One', category: 'Sample Set',
    type: 'Gift Box', tagline: 'Top sellers in travel sizes.',
    price: 5524, originalPrice: 8090, rating: 4.6, reviews: 89,
    baseColor: '#ffffff', liquidColor: '#e8eed2', capColor: '#111111', shapes: { bottle: 'square', cap: 'sphere' },
    scentNotes: { top: ['Citrus'], middle: ['Floral'], base: ['Woody'] },
    sizeVariants: [{ size: '4x5ml', price: 5182, originalPrice: 7279, stock: 75 }],
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sample-floral', name: 'Signature Sampler', brand: 'Zero To One', category: 'Sample Set',
    type: 'Gift Box', tagline: 'A blooming bouquet.',
    price: 6431, originalPrice: 7727, rating: 4.8, reviews: 112,
    baseColor: '#ffb6c1', liquidColor: '#ff69b4', capColor: '#c5a880', shapes: { bottle: 'round', cap: 'ornate' },
    scentNotes: { top: ['Rose'], middle: ['Jasmine'], base: ['Vanilla'] },
    sizeVariants: [{ size: '6x10ml', price: 6899, originalPrice: 8091, stock: 35 }],
    image: 'https://images.unsplash.com/photo-1595535373192-fc8938babfa4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sample-summer', name: 'Summer Fresh Kit', brand: 'Zero To One', category: 'Sample Set',
    type: 'Gift Box', tagline: 'Keep cool everywhere.',
    price: 4995, originalPrice: 6649, rating: 4.5, reviews: 45,
    baseColor: '#e0c097', liquidColor: '#f1d18a', capColor: '#b8860b', shapes: { bottle: 'square', cap: 'cylinder' },
    scentNotes: { top: ['Bergamot'], middle: ['Neroli'], base: ['Musk'] },
    sizeVariants: [{ size: '4x5ml', price: 5270, originalPrice: 6883, stock: 90 }],
    image: 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sample-executive', name: 'Executive Miniatures', brand: 'Zero To One', category: 'Sample Set',
    type: 'Gift Box', tagline: 'Power in small packages.',
    price: 8122, originalPrice: 12702, rating: 4.9, reviews: 67,
    baseColor: '#1a1a1a', liquidColor: '#ffd700', capColor: '#111111', shapes: { bottle: 'tall', cap: 'sphere' },
    scentNotes: { top: ['Pepper'], middle: ['Leather'], base: ['Vetiver'] },
    sizeVariants: [{ size: '3x10ml', price: 8510, originalPrice: 13092, stock: 20 }],
    image: 'https://images.unsplash.com/photo-1563170351-be82bc88ea6d?q=80&w=600&auto=format&fit=crop'
  },

  // BODY MIST
  {
    id: 'mist-citrus', name: 'Citrus Splash Mist', brand: 'Zero To One', category: 'Body Mist',
    type: 'Body Spray', tagline: 'Instant refreshing aura.',
    price: 1901, originalPrice: 2376, rating: 4.4, reviews: 330,
    baseColor: '#fffacd', liquidColor: '#ffebcd', capColor: '#111111', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Lemon', 'Lime'], middle: ['Mint'], base: ['White Musk'] },
    sizeVariants: [{ size: '150ml', price: 1827, originalPrice: 2318, stock: 150 }],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mist-floral', name: 'Floral Fresh Mist', brand: 'Zero To One', category: 'Body Mist',
    type: 'Body Spray', tagline: 'Light spring garden scent.',
    price: 1855, originalPrice: 1895, rating: 4.6, reviews: 245,
    baseColor: '#ffe4e1', liquidColor: '#ffb6c1', capColor: '#c5a880', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Peony'], middle: ['Rose Water'], base: ['Sandalwood'] },
    sizeVariants: [{ size: '150ml', price: 1819, originalPrice: 2328, stock: 80 }],
    image: 'https://images.unsplash.com/photo-1601618360667-0c25a0a38612?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mist-vanilla', name: 'Vanilla Musk Mist', brand: 'Zero To One', category: 'Body Mist',
    type: 'Body Spray', tagline: 'Comforting and warm.',
    price: 1871, originalPrice: 1885, rating: 4.8, reviews: 412,
    baseColor: '#fdf5e6', liquidColor: '#faebd7', capColor: '#111111', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Vanilla Extract'], middle: ['White Musk'], base: ['Amber'] },
    sizeVariants: [{ size: '150ml', price: 1821, originalPrice: 2377, stock: 200 }],
    image: 'https://images.unsplash.com/photo-1605703903273-085e49fcc0be?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mist-ocean', name: 'Ocean Breeze Mist', brand: 'Zero To One', category: 'Body Mist',
    type: 'Body Spray', tagline: 'Crisp aquatic energy.',
    price: 1847, originalPrice: 2040, rating: 4.5, reviews: 178,
    baseColor: '#e0ffff', liquidColor: '#afeeee', capColor: '#1a1a1a', shapes: { bottle: 'tall', cap: 'sphere' },
    scentNotes: { top: ['Sea Salt'], middle: ['Water Lily'], base: ['Driftwood'] },
    sizeVariants: [{ size: '150ml', price: 1885, originalPrice: 1920, stock: 120 }],
    image: 'https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mist-berry', name: 'Wild Berry Mist', brand: 'Zero To One', category: 'Body Mist',
    type: 'Body Spray', tagline: 'Sweet and vibrant.',
    price: 1928, originalPrice: 2410, rating: 4.3, reviews: 90,
    baseColor: '#e6e6fa', liquidColor: '#dda0dd', capColor: '#111111', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Blackberry'], middle: ['Raspberry'], base: ['Vanilla'] },
    sizeVariants: [{ size: '150ml', price: 1866, originalPrice: 2438, stock: 60 }],
    image: 'https://images.unsplash.com/photo-1615160455808-fc7b22ffc0e5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mist-oud', name: 'Oud Sheer Mist', brand: 'Zero To One', category: 'Body Mist',
    type: 'Body Spray', tagline: 'A lighter take on rich oud.',
    price: 1932, originalPrice: 5502, rating: 4.7, reviews: 130,
    baseColor: '#d2b48c', liquidColor: '#cd853f', capColor: '#ffd700', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Bergamot'], middle: ['Light Oud'], base: ['Musk'] },
    sizeVariants: [{ size: '150ml', price: 1892, originalPrice: 5359, stock: 45 }],
    image: 'https://images.unsplash.com/photo-1606323136209-66c888e2285f?q=80&w=600&auto=format&fit=crop'
  },

  // AIR CARE
  {
    id: 'air-oud', name: 'Reed Diffuser - Oud', brand: 'Zero To One', category: 'Air Care',
    type: 'Home Fragrance', tagline: 'Transform your space.',
    price: 8725, originalPrice: 9906, rating: 4.8, reviews: 67,
    baseColor: '#2b1f16', liquidColor: '#4a3320', capColor: '#ffd700', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Saffron'], middle: ['Oud'], base: ['Amber'] },
    sizeVariants: [{ size: '200ml', price: 7279, originalPrice: 10730, stock: 25 }],
    image: 'https://images.unsplash.com/photo-1590156172600-47b293671fc2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'air-linen', name: 'Room Spray - Fresh Linen', brand: 'Zero To One', category: 'Air Care',
    type: 'Home Fragrance', tagline: 'Crisp, clean, and airy.',
    price: 1810, originalPrice: 5436, rating: 4.6, reviews: 112,
    baseColor: '#ffffff', liquidColor: '#f0f8ff', capColor: '#111111', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Cotton'], middle: ['White Floral'], base: ['Musk'] },
    sizeVariants: [{ size: '250ml', price: 1901, originalPrice: 6158, stock: 80 }],
    image: 'https://images.unsplash.com/photo-1592945403408-21d1981e4baf?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'air-candle-amber', name: 'Scented Candle - Amber', brand: 'Zero To One', category: 'Air Care',
    type: 'Home Fragrance', tagline: 'Warm glowing ambiance.',
    price: 5721, originalPrice: 6852, rating: 4.9, reviews: 204,
    baseColor: '#d2b48c', liquidColor: '#cd853f', capColor: '#111111', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Vanilla'], middle: ['Amber'], base: ['Sandalwood'] },
    sizeVariants: [{ size: '300g', price: 5590, originalPrice: 7349, stock: 40 }],
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'air-lavender', name: 'Car Diffuser - Citrus', brand: 'Zero To One', category: 'Air Care',
    type: 'Home Fragrance', tagline: 'Constant calming presence.',
    price: 1905, originalPrice: 5964, rating: 4.7, reviews: 88,
    baseColor: '#e6e6fa', liquidColor: '#d8bfd8', capColor: '#1a1a1a', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Lavender'], middle: ['Chamomile'], base: ['Cedar'] },
    sizeVariants: [{ size: '200ml', price: 1822, originalPrice: 5641, stock: 30 }],
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc600b874?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'air-citrus', name: 'Room Spray - Citrus Grove', brand: 'Zero To One', category: 'Air Care',
    type: 'Home Fragrance', tagline: 'Instantly uplift any room.',
    price: 1938, originalPrice: 5822, rating: 4.5, reviews: 95,
    baseColor: '#ffffe0', liquidColor: '#fafad2', capColor: '#b8860b', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Lemon', 'Orange'], middle: ['Grapefruit'], base: ['White Musk'] },
    sizeVariants: [{ size: '250ml', price: 1977, originalPrice: 6197, stock: 65 }],
    image: 'https://images.unsplash.com/photo-1612450896001-f2f644265b70?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'air-candle-rose', name: 'Scented Candle - Rose', brand: 'Zero To One', category: 'Air Care',
    type: 'Home Fragrance', tagline: 'Romantic floral glow.',
    price: 5612, originalPrice: 7509, rating: 4.8, reviews: 145,
    baseColor: '#ffb6c1', liquidColor: '#ff69b4', capColor: '#c5a880', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Rose Petals'], middle: ['Peony'], base: ['Vanilla'] },
    sizeVariants: [{ size: '300g', price: 6166, originalPrice: 8319, stock: 20 }],
    image: 'https://images.unsplash.com/photo-1602888258673-82ffb1d9bf84?q=80&w=600&auto=format&fit=crop'
  },
  
  // AFFORDABLE PERFUMES (< 5000)
  {
    id: 'aff-perfume-1', name: 'Blush Peony', brand: 'Zero To One', category: 'Perfumes',
    type: 'Eau de Parfum', tagline: 'Soft floral everyday scent.',
    price: 4556, originalPrice: 9555, rating: 4.6, reviews: 88,
    baseColor: '#ffe4e1', liquidColor: '#ffb6c1', capColor: '#ffd700', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Peony'], middle: ['Rose'], base: ['White Musk'] },
    sizeVariants: [{ size: '50ml', price: 4094, originalPrice: 9788, stock: 40 }],
    image: '/images/blush_peony.jpg'
  },
  {
    id: 'aff-perfume-2', name: 'Midnight Blue', brand: 'Zero To One', category: 'Perfumes',
    type: 'Eau de Toilette', tagline: 'Fresh and deeply aquatic.',
    price: 4222, originalPrice: 8820, rating: 4.5, reviews: 142,
    baseColor: '#e0ffff', liquidColor: '#add8e6', capColor: '#111111', shapes: { bottle: 'square', cap: 'cylinder' },
    scentNotes: { top: ['Sea Salt'], middle: ['Lotus'], base: ['Cedar'] },
    sizeVariants: [{ size: '50ml', price: 4645, originalPrice: 9458, stock: 65 }],
    image: '/images/midnight_blue.jpg'
  },
  {
    id: 'aff-perfume-3', name: 'Golden Vanilla', brand: 'Zero To One', category: 'Perfumes',
    type: 'Eau de Parfum', tagline: 'Sweet, rich, and comforting.',
    price: 4586, originalPrice: 12071, rating: 4.8, reviews: 312,
    baseColor: '#fff8dc', liquidColor: '#f5deb3', capColor: '#c5a880', shapes: { bottle: 'tall', cap: 'sphere' },
    scentNotes: { top: ['Vanilla Bean'], middle: ['Caramel'], base: ['Sandalwood'] },
    sizeVariants: [{ size: '50ml', price: 4407, originalPrice: 11473, stock: 20 }],
    image: '/images/golden_vanilla.jpg'
  },
  {
    id: 'aff-perfume-4', name: 'Green Tea Splash', brand: 'Zero To One', category: 'Perfumes',
    type: 'Eau de Toilette', tagline: 'Light, crisp, and revitalizing.',
    price: 4302, originalPrice: 6353, rating: 4.3, reviews: 54,
    baseColor: '#f0fff0', liquidColor: '#98fb98', capColor: '#1a1a1a', shapes: { bottle: 'round', cap: 'cylinder' },
    scentNotes: { top: ['Green Tea'], middle: ['Mint'], base: ['Lemon'] },
    sizeVariants: [{ size: '100ml', price: 3867, originalPrice: 7393, stock: 80 }],
    image: '/images/green_tea_splash.jpg'
  },
  {
    id: 'aff-perfume-5', name: 'Velvet Orchid', brand: 'Zero To One', category: 'Perfumes',
    type: 'Eau de Parfum', tagline: 'Mysterious floral elegance.',
    price: 3520, originalPrice: 14651, rating: 4.7, reviews: 209,
    baseColor: '#e6e6fa', liquidColor: '#d8bfd8', capColor: '#111111', shapes: { bottle: 'square', cap: 'ornate' },
    scentNotes: { top: ['Black Orchid'], middle: ['Plum'], base: ['Patchouli'] },
    sizeVariants: [{ size: '50ml', price: 4861, originalPrice: 12698, stock: 15 }],
    image: '/images/velvet_orchid.jpg'
  },

  // AFFORDABLE OUD (< 5000)
  {
    id: 'aff-oud-1', name: 'Desert Night Oud', brand: 'Zero To One', category: 'Oud',
    type: 'Extrait de Parfum', tagline: 'Smoky, dry, and intense.',
    price: 3591, originalPrice: 13631, rating: 4.9, reviews: 430,
    baseColor: '#2b1f16', liquidColor: '#4a3320', capColor: '#ffd700', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Saffron'], middle: ['Dry Wood'], base: ['Oud'] },
    sizeVariants: [{ size: '30ml', price: 3616, originalPrice: 14482, stock: 10 }],
    image: '/images/desert_night_oud.jpg'
  },
  {
    id: 'aff-oud-2', name: 'Oud Rosewood', brand: 'Zero To One', category: 'Oud',
    type: 'Eau de Parfum', tagline: 'Classic oud paired with rich rose.',
    price: 3893, originalPrice: 12503, rating: 4.8, reviews: 215,
    baseColor: '#4a1525', liquidColor: '#8b0000', capColor: '#111111', shapes: { bottle: 'square', cap: 'cylinder' },
    scentNotes: { top: ['Rose'], middle: ['Oud'], base: ['Sandalwood'] },
    sizeVariants: [{ size: '50ml', price: 4680, originalPrice: 11803, stock: 30 }],
    image: '/images/oud_rosewood.jpg'
  },
  {
    id: 'aff-oud-3', name: 'Spicy Agarwood', brand: 'Zero To One', category: 'Oud',
    type: 'Eau de Parfum', tagline: 'Warm spices meet deep woods.',
    price: 3659, originalPrice: 11570, rating: 4.6, reviews: 134,
    baseColor: '#d2b48c', liquidColor: '#cd853f', capColor: '#c5a880', shapes: { bottle: 'round', cap: 'sphere' },
    scentNotes: { top: ['Cardamom'], middle: ['Clove'], base: ['Agarwood'] },
    sizeVariants: [{ size: '50ml', price: 3776, originalPrice: 11882, stock: 45 }],
    image: '/images/spicy_agarwood.jpg'
  },
  {
    id: 'aff-oud-4', name: 'Vanilla Oud', brand: 'Zero To One', category: 'Oud',
    type: 'Eau de Parfum', tagline: 'Sweetened, approachable oud.',
    price: 4587, originalPrice: 9943, rating: 4.5, reviews: 180,
    baseColor: '#f5deb3', liquidColor: '#deb887', capColor: '#1a1a1a', shapes: { bottle: 'tall', cap: 'cylinder' },
    scentNotes: { top: ['Vanilla'], middle: ['Amber'], base: ['Oud'] },
    sizeVariants: [{ size: '50ml', price: 3887, originalPrice: 10793, stock: 25 }],
    image: '/images/vanilla_oud.jpg'
  },
  {
    id: 'aff-oud-5', name: 'Royal Leather Oud', brand: 'Zero To One', category: 'Oud',
    type: 'Eau de Parfum', tagline: 'Luxurious leather and smoke.',
    price: 4022, originalPrice: 13692, rating: 4.9, reviews: 302,
    baseColor: '#1a1a1a', liquidColor: '#2f4f4f', capColor: '#ffd700', shapes: { bottle: 'square', cap: 'ornate' },
    scentNotes: { top: ['Leather'], middle: ['Birch Tar'], base: ['Oud'] },
    sizeVariants: [{ size: '50ml', price: 4264, originalPrice: 14352, stock: 12 }],
    image: '/images/royal_leather_oud.jpg'
  }
];

module.exports = perfumes;
