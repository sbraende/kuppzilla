/**
 * Deals/Kupps data structure
 *
 * Each deal represents a special offer or promotion from merchants
 * These will be mixed with products in the main grid based on relevancy
 */

export const deals = [
  {
    id: 'deal-1',
    type: 'deal',
    title: 'Halv pris på sateng-sengesett hos Princess',
    description: 'Få luksuriøse sateng-sengesett til halv pris. Myke og behagelige sengesett i flere farger og størrelser.',
    merchant: 'Princess',
    discount: 'Halv pris',
    discountValue: 50, // Numeric value for sorting/comparison
    categories: ['Hjem & interiør'],
    keywords: ['sengesett', 'seng', 'tekstiler', 'soverom', 'sateng', 'dyne', 'puter'],
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
    link: 'https://www.princess.no',
    validUntil: '2025-12-31',
    featured: true, // Higher relevance score
  },
  {
    id: 'deal-2',
    type: 'deal',
    title: 'Opptil 20% på storbyweekend!',
    description: 'Book din neste storbyweekend og spar opptil 20% på hotell og fly. Gjelder valgte destinasjoner i Europa.',
    merchant: 'TravelDeals',
    discount: 'Opptil 20%',
    discountValue: 20,
    categories: ['Sport & fritid'],
    keywords: ['reise', 'ferie', 'hotell', 'fly', 'weekend', 'storby', 'europa'],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
    link: 'https://www.example.com/reise',
    validUntil: '2025-11-30',
    featured: false,
  },
  {
    id: 'deal-3',
    type: 'deal',
    title: 'Kjøp 3 betal for 2 på LEGO',
    description: 'Alle LEGO-sett er nå med i 3 for 2-kampanjen. Perfekt for bursdagsgaver eller bare for moro skyld!',
    merchant: 'Lekeland',
    discount: '3 for 2',
    discountValue: 33,
    categories: ['Leker & hobby'],
    keywords: ['lego', 'leker', 'barn', 'bygging', 'klosser', 'gave'],
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop',
    link: 'https://www.example.com/lego',
    validUntil: '2025-12-15',
    featured: true,
  },
  {
    id: 'deal-4',
    type: 'deal',
    title: '30% rabatt på gaming-utstyr',
    description: 'Alt av gaming-mus, tastaturer og headsets er nå 30% billigere. Oppgrader ditt gaming-setup!',
    merchant: 'TechStore',
    discount: '30% rabatt',
    discountValue: 30,
    categories: ['Elektronikk'],
    keywords: ['gaming', 'mus', 'tastatur', 'headset', 'pc', 'spill', 'gamer'],
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop',
    link: 'https://www.example.com/gaming',
    validUntil: '2025-11-20',
    featured: true,
  },
  {
    id: 'deal-5',
    type: 'deal',
    title: 'Gratis frakt på alle hageartikler',
    description: 'Bestill hageartikler for over 500 kr og få gratis frakt. Gjør klar hagen for sesongen!',
    merchant: 'Hagesenteret',
    discount: 'Gratis frakt',
    discountValue: 15, // Approximate value for sorting
    categories: ['Verktøy & hage'],
    keywords: ['hage', 'planter', 'hageredskap', 'vanning', 'utendørs', 'vår'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    link: 'https://www.example.com/hage',
    validUntil: '2025-12-01',
    featured: false,
  },
  {
    id: 'deal-6',
    type: 'deal',
    title: '2 for 1 på hudpleieprodukter',
    description: 'Kjøp ett hudpleieprodukt og få ett gratis! Gjelder alle merker i kategorien ansiktspleie.',
    merchant: 'Skjønnhetsbutikken',
    discount: '2 for 1',
    discountValue: 50,
    categories: ['Helse & skjønnhet'],
    keywords: ['hudpleie', 'ansiktspleie', 'krem', 'serum', 'skjønnhet', 'kosmetikk'],
    image: 'https://images.unsplash.com/photo-1556228578-dd165a1b185c?w=800&h=600&fit=crop',
    link: 'https://www.example.com/hudpleie',
    validUntil: '2025-11-25',
    featured: false,
  },
  {
    id: 'deal-7',
    type: 'deal',
    title: 'Opptil 57% på sports- og treningsutstyr',
    description: 'Massive besparelser på alt av sports- og treningsutstyr. Yoga-matter, vekter, joggesko og mer!',
    merchant: 'SportOutlet',
    discount: 'Opptil 57%',
    discountValue: 57,
    categories: ['Sport & fritid'],
    keywords: ['sport', 'trening', 'fitness', 'yoga', 'løping', 'jogging', 'treningsutstyr'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    link: 'https://www.example.com/sport',
    validUntil: '2025-12-20',
    featured: true,
  },
  {
    id: 'deal-8',
    type: 'deal',
    title: '20%-30% på møbler fra IKEA',
    description: 'Utvalgte møbler til stuen, soverommet og kjøkkenet er nå 20-30% billigere. Begrenset tilbud!',
    merchant: 'IKEA',
    discount: '20%-30%',
    discountValue: 25,
    categories: ['Hjem & interiør'],
    keywords: ['møbler', 'sofa', 'bord', 'stoler', 'innredning', 'kjøkken', 'stue'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    link: 'https://www.ikea.no',
    validUntil: '2025-11-30',
    featured: true,
  },
  {
    id: 'deal-9',
    type: 'deal',
    title: '40% rabatt på vinterstøvler',
    description: 'Store besparelser på vinterstøvler for hele familien. Gode, varme og vannavstøtende støvler til vinterens eventyr.',
    merchant: 'Skobutikken',
    discount: '40% rabatt',
    discountValue: 40,
    categories: ['Mote'],
    keywords: ['støvler', 'vintersko', 'sko', 'vinter', 'varme', 'vannavstøtende'],
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=600&fit=crop',
    link: 'https://www.example.com/sko',
    validUntil: '2025-12-10',
    featured: false,
  },
  {
    id: 'deal-10',
    type: 'deal',
    title: 'Kjøp 2, få 1 gratis på bøker',
    description: 'Alt av skjønnlitteratur, faglitteratur og barnebøker er med i kampanjen. Kjøp 2 bøker og få den billigste gratis!',
    merchant: 'Bokklubben',
    discount: 'Kjøp 2, få 1 gratis',
    discountValue: 33,
    categories: ['Leker & hobby'],
    keywords: ['bøker', 'lesing', 'litteratur', 'barnebøker', 'roman', 'fagbok'],
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
    link: 'https://www.example.com/boker',
    validUntil: '2025-12-05',
    featured: false,
  },
  {
    id: 'deal-11',
    type: 'deal',
    title: '15% på elektronikk ved kjøp over 5000 kr',
    description: 'Få 15% rabatt på hele kjøpet ved handel for over 5000 kr. Gjelder datamaskiner, TV, mobiler og mer!',
    merchant: 'ElektroMarked',
    discount: '15% rabatt',
    discountValue: 15,
    categories: ['Elektronikk'],
    keywords: ['elektronikk', 'tv', 'pc', 'datamaskin', 'mobil', 'teknologi'],
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=600&fit=crop',
    link: 'https://www.example.com/elektronikk',
    validUntil: '2025-11-28',
    featured: false,
  },
  {
    id: 'deal-12',
    type: 'deal',
    title: 'Opptil 45% på leketøy fra Hasbro og Mattel',
    description: 'Massive besparelser på populære leketøymerker! Monopol, Barbie, Hot Wheels og mye mer.',
    merchant: 'LeketøysLageret',
    discount: 'Opptil 45%',
    discountValue: 45,
    categories: ['Leker & hobby'],
    keywords: ['leketøy', 'barn', 'spill', 'dukker', 'biler', 'hasbro', 'mattel'],
    image: 'https://images.unsplash.com/photo-1560582861-45078880e48e?w=800&h=600&fit=crop',
    link: 'https://www.example.com/leketoey',
    validUntil: '2025-12-24',
    featured: true,
  },
];

/**
 * Get deals filtered by category
 */
export function getDealsByCategory(category) {
  if (!category || category === 'all') return deals;
  return deals.filter(deal => deal.categories.includes(category));
}

/**
 * Get featured deals
 */
export function getFeaturedDeals() {
  return deals.filter(deal => deal.featured);
}

/**
 * Search deals by query
 */
export function searchDeals(query) {
  if (!query || !query.trim()) return deals;

  const lowerQuery = query.toLowerCase();
  return deals.filter(deal => {
    return (
      deal.title.toLowerCase().includes(lowerQuery) ||
      deal.description.toLowerCase().includes(lowerQuery) ||
      deal.merchant.toLowerCase().includes(lowerQuery) ||
      deal.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  });
}

export default deals;
