import { BudgetCategory, EventType, Currency } from '../types';

export interface CategoryBenchmark {
  category: BudgetCategory;
  name: string;
  defaultPercentage: number;
  description: string;
  typicalItems: string[];
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
};

export const BUDGET_BENCHMARKS: Record<EventType, CategoryBenchmark[]> = {
  wedding: [
    {
      category: 'catering',
      name: 'Catering & Beverages',
      defaultPercentage: 35,
      description: 'Plated dinner or buffet, cocktail hour canapes, bar service, wedding cake',
      typicalItems: ['Plated 3-course dinner', 'Passed cocktail appetizers', 'Open bar & wine pairing', 'Wedding cake & dessert bar']
    },
    {
      category: 'venue',
      name: 'Venue Rental',
      defaultPercentage: 25,
      description: 'Ceremony & reception hall rental, ceremony fees, bridal suite access',
      typicalItems: ['Main reception hall', 'Ceremony lawn/chapel', 'Bridal dressing suite', 'Setup & cleanup fee']
    },
    {
      category: 'photo_video',
      name: 'Photography & Videography',
      defaultPercentage: 12,
      description: 'Full day documentary coverage, second shooter, drone footage, edited gallery',
      typicalItems: ['8-10 hour lead photographer', 'Second shooter', 'Highlight film videographer', 'Engagement photo session']
    },
    {
      category: 'decor_rentals',
      name: 'Floral Design & Decor Rentals',
      defaultPercentage: 10,
      description: 'Ceremony arch, bouquets, boutonnieres, table centerpieces, ambient lighting',
      typicalItems: ['Ceremony floral arch', 'Bridal bouquet & bridesmaids', 'Guest table centerpieces', 'Fairy string lights & drapery']
    },
    {
      category: 'entertainment',
      name: 'Music & Entertainment',
      defaultPercentage: 8,
      description: 'Ceremony acoustic musicians, reception DJ or live band, sound systems',
      typicalItems: ['Reception live band or DJ', 'Ceremony acoustic musician', 'Wireless microphones & sound board', 'Dance floor lighting']
    },
    {
      category: 'attire_beauty',
      name: 'Attire & Beauty',
      defaultPercentage: 5,
      description: 'Bridal gown, tuxedo/suit, alterations, hair & makeup for bridal party',
      typicalItems: ['Wedding gown & veil', 'Tuxedo or suit rental/purchase', 'Alterations & pressing', 'Hair & makeup styling']
    },
    {
      category: 'stationery_favors',
      name: 'Stationery & Favors',
      defaultPercentage: 2,
      description: 'Save-the-dates, formal invitations, menus, place cards, guest favors',
      typicalItems: ['Custom printed invitation suite', 'Day-of menus & seating chart', 'Personalized guest favors', 'Postage']
    },
    {
      category: 'contingency',
      name: 'Contingency & Buffer',
      defaultPercentage: 3,
      description: 'Emergency fund for unexpected weather shifts, last-minute additions, tips',
      typicalItems: ['Vendor gratuity & tips', 'Weather backup rentals', 'Last-minute guest alterations']
    }
  ],
  birthday: [
    {
      category: 'catering',
      name: 'Food, Drinks & Birthday Cake',
      defaultPercentage: 40,
      description: 'Main meal, snacks, birthday cake, themed cocktails/drinks',
      typicalItems: ['Main meal or catering / food trucks', 'Custom theme birthday cake', 'Cocktails, beers & mocktails', 'Appetizer platters']
    },
    {
      category: 'venue',
      name: 'Venue or Space Rental',
      defaultPercentage: 25,
      description: 'Party room, rooftop, lounge, backyard tent, or park reservation',
      typicalItems: ['Lounge / arcade / hall rental', 'Cleaning deposit', 'Table & chair rentals']
    },
    {
      category: 'entertainment',
      name: 'Entertainment & Games',
      defaultPercentage: 15,
      description: 'DJ, live performer, magician, games/arcade tokens, photo booth',
      typicalItems: ['DJ or curated party sound', 'Photo booth with instant prints', 'Arcade games or entertainers', 'Prizes for party games']
    },
    {
      category: 'decor_rentals',
      name: 'Theme Decor & Balloons',
      defaultPercentage: 10,
      description: 'Custom backdrop, balloon garlands, neon signage, themed tableware',
      typicalItems: ['Custom balloon garland arch', 'Neon milestone sign', 'Themed tableware & napkins', 'Themed photo backdrop']
    },
    {
      category: 'stationery_favors',
      name: 'Invites & Party Favors',
      defaultPercentage: 5,
      description: 'Digital animated invites, personalized goody bags or swag',
      typicalItems: ['Digital custom invites', 'Personalized party swag / gift bags', 'Thank you tokens']
    },
    {
      category: 'contingency',
      name: 'Contingency Fund',
      defaultPercentage: 5,
      description: 'Extra snacks, overtime venue hours, impromptu tipping',
      typicalItems: ['Overtime hourly fee reserve', 'Extra drinks & ice', 'Spontaneous activity reserve']
    }
  ],
  community: [
    {
      category: 'entertainment',
      name: 'Staging, Audio/Visual & Performers',
      defaultPercentage: 25,
      description: 'Festival stage, line-array sound system, microphones, local bands and performers',
      typicalItems: ['Mobile stage & generator power', 'Professional audio engineer & PA', 'Performers & musical acts', 'MC and podium']
    },
    {
      category: 'permits_safety',
      name: 'Permits, City Services & First Aid',
      defaultPercentage: 20,
      description: 'Civic permits, police/traffic details, portable restrooms, EMT/first-aid',
      typicalItems: ['City special events permit', 'Off-duty police traffic control', 'ADA portable restrooms & handwash', 'Licensed EMT first-aid tent']
    },
    {
      category: 'catering',
      name: 'Volunteer & Staff Hospitality',
      defaultPercentage: 15,
      description: 'Water hydration stations, volunteer meals, snacks, vendor coordination',
      typicalItems: ['Volunteer breakfast & lunch', 'Bulk water refilling stations', 'Food truck inspection / power hookups']
    },
    {
      category: 'decor_rentals',
      name: 'Tents, Signage & Activity Zones',
      defaultPercentage: 15,
      description: 'Canopy tents, informational wayfinding banners, kid craft supplies',
      typicalItems: ['10x10 canopy vendor tents', 'Directional & schedule banners', 'Kids zone activities & craft materials', 'Trash & recycling receptacles']
    },
    {
      category: 'stationery_favors',
      name: 'Marketing, Badges & T-shirts',
      defaultPercentage: 15,
      description: 'Participant bibs/medals, volunteer shirts, flyers, social media boosts',
      typicalItems: ['Volunteer branded t-shirts', 'Event program flyers & maps', 'Race bibs / participant tokens', 'Local press & signage']
    },
    {
      category: 'contingency',
      name: 'Weather & Emergency Reserve',
      defaultPercentage: 10,
      description: 'Inclement weather rain covers, unexpected sanitation needs, city deposits',
      typicalItems: ['Emergency rain tent tarps', 'Extra sanitation service calls', 'Refundable civic damage deposit']
    }
  ]
};

export const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  venue: 'Venue & Facilities',
  catering: 'Catering & Drinks',
  photo_video: 'Photo & Video',
  decor_rentals: 'Decor & Rentals',
  entertainment: 'Music & Entertainment',
  attire_beauty: 'Attire & Beauty',
  permits_safety: 'Permits & Safety',
  stationery_favors: 'Stationery & Favors',
  contingency: 'Contingency Buffer',
  other: 'Other Services'
};

export const CATEGORY_COLORS: Record<BudgetCategory, { bg: string; text: string; hex: string }> = {
  venue: { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', hex: '#10B981' },
  catering: { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', hex: '#F59E0B' },
  photo_video: { bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-400', hex: '#8B5CF6' },
  decor_rentals: { bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', hex: '#F43F5E' },
  entertainment: { bg: 'bg-indigo-100 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', hex: '#6366F1' },
  attire_beauty: { bg: 'bg-pink-100 dark:bg-pink-950/40', text: 'text-pink-700 dark:text-pink-400', hex: '#EC4899' },
  permits_safety: { bg: 'bg-cyan-100 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-400', hex: '#06B6D4' },
  stationery_favors: { bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', hex: '#3B82F6' },
  contingency: { bg: 'bg-slate-200 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', hex: '#64748B' },
  other: { bg: 'bg-stone-200 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', hex: '#78716C' },
};
