import { Product } from '../store/useStore';

export const PRODUCTS: Product[] = [
  {
    id: 'w1',
    name: 'Chronograph Noir',
    price: 125000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000',
    description: 'A masterpiece of engineering and aesthetics. The Chronograph Noir features a matte black ceramic case with rose gold accents.',
    specs: ['42mm Ceramic Case', 'Automatic Movement', 'Sapphire Crystal', '100m Water Resistance']
  },
  {
    id: 'w2',
    name: 'Royal Oak Gold',
    price: 450000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000',
    description: 'Timeless elegance defined. 18k solid gold construction with our signature textured dial.',
    specs: ['40mm 18k Gold Case', 'Swiss Automatic', 'Exhibition Back', 'Limited Edition']
  },
  {
    id: 'p1',
    name: 'Midnight Oud',
    price: 18000,
    category: 'Perfumes',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000',
    description: 'An intoxicating blend of rare oud, amber, and midnight jasmine. Designed for the evening.',
    specs: ['100ml Eau de Parfum', 'Notes: Oud, Amber, Jasmine', 'Long-lasting Sillage', 'Hand-blown Glass Bottle']
  },
  {
    id: 'p2',
    name: 'Celestial Rose',
    price: 15500,
    category: 'Perfumes',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000',
    description: 'A modern interpretation of the classic rose, lifted by citrus and grounded in white musk.',
    specs: ['100ml Eau de Parfum', 'Notes: Rose, Bergamot, Musk', 'Day & Night Wear', 'French Origin']
  },
  {
    id: 'g1',
    name: 'Aviator Luxe',
    price: 28000,
    category: 'Glasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000',
    description: 'Classic aviator silhouette reimagined with titanium frames and polarized gradient lenses.',
    specs: ['Titanium Frame', 'Polarized Lenses', 'UV400 Protection', 'Handcrafted in Italy']
  },
  {
    id: 'g2',
    name: 'Geometric Acetate',
    price: 24000,
    category: 'Glasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1000',
    description: 'Bold geometric shapes in premium acetate. A statement piece for the modern visionary.',
    specs: ['Premium Acetate', 'Blue Light Filter', 'Anti-scratch Coating', 'Japanese Hinges']
  },
  {
    id: 'c1',
    name: 'Silk Evening Gown',
    price: 85000,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
    description: 'Pure silk evening gown with a draping silhouette that flows like water.',
    specs: ['100% Mulberry Silk', 'Floor Length', 'Hidden Zipper', 'Dry Clean Only']
  },
  {
    id: 'c2',
    name: 'Cashmere Overcoat',
    price: 120000,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000',
    description: 'The ultimate winter luxury. Double-breasted cashmere coat in charcoal grey.',
    specs: ['100% Cashmere', 'Horn Buttons', 'Satin Lining', 'Tailored Fit']
  },
  {
    id: 'w3',
    name: 'Skeleton Tourbillon',
    price: 850000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000',
    description: 'An intricate skeletonized dial revealing the mesmerizing tourbillon movement within.',
    specs: ['44mm Platinum Case', 'Manual Wind Tourbillon', 'Sapphire Crystal', 'Alligator Strap']
  },
  {
    id: 'w4',
    name: 'Diver Pro Titanium',
    price: 95000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000',
    description: 'Built for the depths. Lightweight titanium construction with a unidirectional ceramic bezel.',
    specs: ['43mm Titanium Case', 'Automatic Movement', '300m Water Resistance', 'Luminescent Markers']
  },
  {
    id: 'p3',
    name: 'Velvet Sandalwood',
    price: 21000,
    category: 'Perfumes',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1000',
    description: 'A warm, creamy sandalwood base enriched with spicy cardamom and smooth vanilla.',
    specs: ['100ml Extrait de Parfum', 'Notes: Sandalwood, Cardamom, Vanilla', 'Intense Sillage', 'Hand-polished Cap']
  },
  {
    id: 'g3',
    name: 'Round Tortoise',
    price: 18000,
    category: 'Glasses',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=1000',
    description: 'Vintage-inspired round frames in classic Havana tortoiseshell acetate.',
    specs: ['Havana Acetate', 'Anti-Reflective Coating', 'UV400 Protection', 'Hand-polished']
  },
  {
    id: 'g4',
    name: 'Rimless Titanium',
    price: 32000,
    category: 'Glasses',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1000',
    description: 'The epitome of minimalist luxury. Ultra-lightweight rimless design with titanium temples.',
    specs: ['Rimless Design', 'Beta-Titanium Temples', 'Blue Light Filter', 'Featherweight Comfort']
  },
  {
    id: 'c3',
    name: 'Linen Summer Suit',
    price: 65000,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000',
    description: 'Breathable Italian linen tailored to perfection for the warmer months.',
    specs: ['100% Italian Linen', 'Unstructured Shoulder', 'Patch Pockets', 'Breathable Weave']
  },
  {
    id: 'c4',
    name: 'Velvet Dinner Jacket',
    price: 95000,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
    description: 'A statement piece for evening affairs. Deep midnight blue velvet with silk lapels.',
    specs: ['Cotton Velvet', 'Silk Peak Lapels', 'Single Button', 'Tailored Fit']
  }
];
