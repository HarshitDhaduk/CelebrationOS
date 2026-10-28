import { EventProject } from '../types';

export const weddingPreset: EventProject = {
  event: {
    id: 'preset-wedding-1',
    title: 'Elena & Marcus: Coastal Sunset Wedding',
    eventType: 'wedding',
    subType: 'Romantic Oceanfront Celebration',
    date: '2026-09-18',
    time: '16:00',
    location: 'Cypress Point Overlook & Grand Meadow, Carmel-by-the-Sea, CA',
    guestCount: 130,
    totalBudget: 35000,
    currency: 'USD',
    vibe: 'Romantic, Coastal Elegance with Organic Florals and Acoustic Soul',
    notes: 'Ceremony begins at golden hour (4:30 PM). Outdoor dinner under string lights followed by indoor dancing.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  budgetItems: [
    {
      id: 'b-w-1',
      name: 'Oceanfront Lawn & Pavilion Rental',
      category: 'venue',
      estimatedCost: 8500,
      actualCost: 8200,
      paidAmount: 4000,
      isPaid: false,
      priority: 'must-have',
      notes: 'Includes tables, chivari chairs, and bridal suite access.'
    },
    {
      id: 'b-w-2',
      name: 'Farm-to-Table Plated Dinner & Canapés (130 guests)',
      category: 'catering',
      estimatedCost: 10400,
      actualCost: 10100,
      paidAmount: 5000,
      isPaid: false,
      priority: 'must-have',
      notes: '$78 per person including appetizers and late night sliders.'
    },
    {
      id: 'b-w-3',
      name: 'Curated Open Bar (Local Wines & Craft Spirits)',
      category: 'catering',
      estimatedCost: 3200,
      actualCost: 3000,
      paidAmount: 1500,
      isPaid: false,
      priority: 'must-have',
      notes: 'Signature coastal cocktail plus Monterey County Pinot Noir.'
    },
    {
      id: 'b-w-4',
      name: 'Fine Art Documentary Photographer (8 Hours + Drone)',
      category: 'photo_video',
      estimatedCost: 3800,
      actualCost: 3800,
      paidAmount: 1900,
      isPaid: false,
      priority: 'must-have',
      notes: 'Second shooter included for golden hour couple portraits.'
    },
    {
      id: 'b-w-5',
      name: 'Ceremony Floral Arch & Centerpieces',
      category: 'decor_rentals',
      estimatedCost: 2800,
      actualCost: 2600,
      paidAmount: 2600,
      isPaid: true,
      priority: 'must-have',
      notes: 'Eucalyptus, blush peonies, pampas grass, driftwoods.'
    },
    {
      id: 'b-w-6',
      name: 'Acoustic Guitar Duo (Ceremony) + 5-Piece Soul Band (Reception)',
      category: 'entertainment',
      estimatedCost: 2600,
      actualCost: 2700,
      paidAmount: 1350,
      isPaid: false,
      priority: 'must-have',
      notes: 'Acoustic covers for ceremony; high-energy funk/Motown for reception.'
    },
    {
      id: 'b-w-7',
      name: 'Wedding Attire & Tailoring',
      category: 'attire_beauty',
      estimatedCost: 1900,
      actualCost: 1850,
      paidAmount: 1850,
      isPaid: true,
      priority: 'must-have',
      notes: 'Bridal gown alterations & tailored linen tux.'
    },
    {
      id: 'b-w-8',
      name: 'Bridal Hair & Makeup + 4 Bridesmaids',
      category: 'attire_beauty',
      estimatedCost: 950,
      actualCost: 950,
      paidAmount: 475,
      isPaid: false,
      priority: 'nice-to-have',
      notes: 'On-site styling team.'
    },
    {
      id: 'b-w-9',
      name: 'Letterpress Invitations, Menus & Thank You Cards',
      category: 'stationery_favors',
      estimatedCost: 650,
      actualCost: 600,
      paidAmount: 600,
      isPaid: true,
      priority: 'nice-to-have',
      notes: 'Handmade deckled edge cotton paper with wax seal.'
    },
    {
      id: 'b-w-10',
      name: 'Contingency Buffer & Gratuities',
      category: 'contingency',
      estimatedCost: 2000,
      actualCost: 0,
      paidAmount: 0,
      isPaid: false,
      priority: 'must-have',
      notes: 'Safety fund for weather contingencies and vendor tipping.'
    }
  ],
  milestones: [
    {
      id: 'm-w-1',
      title: 'Secure Ceremony & Reception Venue',
      phase: '6_plus_months',
      dueDate: '2026-03-01',
      completed: true,
      category: 'venue',
      priority: 'high',
      assignedTo: 'Elena & Marcus'
    },
    {
      id: 'm-w-2',
      title: 'Book Lead Photographer and Videographer',
      phase: '6_plus_months',
      dueDate: '2026-03-15',
      completed: true,
      category: 'photo_video',
      priority: 'high',
      assignedTo: 'Marcus'
    },
    {
      id: 'm-w-3',
      title: 'Finalize Menu Tasting & Signature Cocktails',
      phase: '3_to_6_months',
      dueDate: '2026-05-20',
      completed: true,
      category: 'catering',
      priority: 'high',
      assignedTo: 'Elena'
    },
    {
      id: 'm-w-4',
      title: 'Mail Formal Wedding Invitations & Launch RSVP Portal',
      phase: '1_to_2_months',
      dueDate: '2026-07-15',
      completed: true,
      category: 'stationery_favors',
      priority: 'high',
      assignedTo: 'Elena'
    },
    {
      id: 'm-w-5',
      title: 'Finalize Seating Chart & Dietary Restrictions Count',
      phase: '2_to_4_weeks',
      dueDate: '2026-08-25',
      completed: false,
      category: 'catering',
      priority: 'high',
      assignedTo: 'Both'
    },
    {
      id: 'm-w-6',
      title: 'Submit Song Must-Play / Do-Not-Play List to Band',
      phase: '2_to_4_weeks',
      dueDate: '2026-09-01',
      completed: false,
      category: 'entertainment',
      priority: 'medium',
      assignedTo: 'Marcus'
    },
    {
      id: 'm-w-7',
      title: 'Rehearsal Dinner & Walk-Through at Carmel Bluff',
      phase: 'final_week',
      dueDate: '2026-09-17',
      completed: false,
      category: 'venue',
      priority: 'high',
      assignedTo: 'Wedding Party'
    }
  ],
  runOfShow: [
    {
      id: 'ros-w-1',
      startTime: '13:00',
      endTime: '15:15',
      title: 'Bridal Party Hair, Makeup & Groom Prep',
      description: 'Bridal suite styling; Groom suite relaxed prep with groomsmen. Photographer arrives at 14:00.',
      responsibleParty: 'Lead Stylist & Photographer',
      location: 'Cypress Suites A & B',
      completed: false
    },
    {
      id: 'ros-w-2',
      startTime: '15:15',
      endTime: '15:50',
      title: 'First Look & Intimate Couple Portraits',
      description: 'Private first look on the pine bluff path, followed by immediate family portraits before guests arrive.',
      responsibleParty: 'Lead Photographer & Planner',
      location: 'Pine Grove Overlook',
      completed: false
    },
    {
      id: 'ros-w-3',
      startTime: '16:00',
      endTime: '16:30',
      title: 'Guest Arrival & Welcome Sparkling Cider/Wine',
      description: 'Acoustic guitar duo plays gentle ambient arrangements as guests take their seats overlooking the ocean.',
      responsibleParty: 'Event Staff & Acoustic Duo',
      location: 'Meadow Ceremony Lawn',
      completed: false
    },
    {
      id: 'ros-w-4',
      startTime: '16:30',
      endTime: '17:15',
      title: 'The Ceremony & Vow Exchange',
      description: 'Processional, personal vows written by Elena & Marcus, ring exchange, and joyous recessional.',
      responsibleParty: 'Officiant & Wedding Couple',
      location: 'Ceremony Altar Arch',
      completed: false
    },
    {
      id: 'ros-w-5',
      startTime: '17:15',
      endTime: '18:30',
      title: 'Cocktail Hour & Golden Hour Sunset Photos',
      description: 'Passed artisanal hors doeuvres, signature cocktails. Elena & Marcus slip away for 25 min sunset portraits.',
      responsibleParty: 'Catering Captain & Photographer',
      location: 'Sunset Terrace & Cliff Walk',
      completed: false
    },
    {
      id: 'ros-w-6',
      startTime: '18:30',
      endTime: '20:15',
      title: 'Grand Entrance & Plated Dinner',
      description: 'Welcome cheers, 3-course dinner served with local wine pairings. Speeches by Maid of Honor and Best Man between courses.',
      responsibleParty: 'Band Emcee & Catering Team',
      location: 'Main Pavilion Dining Room',
      completed: false
    },
    {
      id: 'ros-w-7',
      startTime: '20:15',
      endTime: '20:30',
      title: 'First Dance & Parent Dances',
      description: 'Elena & Marcus first dance (Song: "You Are The Best Thing"), followed by Father-Daughter and Mother-Son dances.',
      responsibleParty: 'Live Soul Band & Planner',
      location: 'Dance Floor',
      completed: false
    },
    {
      id: 'ros-w-8',
      startTime: '20:30',
      endTime: '23:00',
      title: 'Open Dance Floor, Late Night Bites & Sparkler Send-off',
      description: 'High energy dance set. Gourmet truffle sliders and churros served at 22:00. Sparkler send-off at 23:00.',
      responsibleParty: 'Band, Catering Captain & Coordinator',
      location: 'Dance Hall & Courtyard Exit',
      completed: false
    }
  ],
  vendors: [
    {
      id: 'v-w-1',
      name: 'Carmel Meadow Estates',
      category: 'venue',
      status: 'booked',
      contactPerson: 'Sarah Jenkins',
      email: 'events@carmelmeadow.com',
      phone: '(831) 555-0192',
      quotedPrice: 8200,
      depositPaid: 4000,
      contractSigned: true,
      rating: 5,
      notes: 'Includes 14 hours total access, load-in at 10 AM, clean-up until midnight.'
    },
    {
      id: 'v-w-2',
      name: 'Heirloom Coastal Catering',
      category: 'catering',
      status: 'booked',
      contactPerson: 'Chef Mateo Rivera',
      email: 'mateo@heirloomcoastalcatering.com',
      phone: '(831) 555-4820',
      quotedPrice: 13100,
      depositPaid: 6500,
      contractSigned: true,
      rating: 5,
      notes: 'Dinner + bar service package. Complimentary tastings completed in May.'
    },
    {
      id: 'v-w-3',
      name: 'Lumière Pacific Photography',
      category: 'photo_video',
      status: 'booked',
      contactPerson: 'Chloe Chen',
      email: 'chloe@lumierepacific.com',
      phone: '(415) 555-7319',
      quotedPrice: 3800,
      depositPaid: 1900,
      contractSigned: true,
      rating: 5,
      notes: 'Deliverables: Full gallery of 700+ edited high-res photos within 4 weeks.'
    },
    {
      id: 'v-w-4',
      name: 'Wildflower & Driftwood Botanicals',
      category: 'decor_rentals',
      status: 'booked',
      contactPerson: 'Aria Vance',
      email: 'aria@driftwoodbotanicals.com',
      phone: '(831) 555-8831',
      quotedPrice: 2600,
      depositPaid: 2600,
      contractSigned: true,
      rating: 5,
      notes: 'Paid in full. Arch delivery scheduled for 12:30 PM on wedding day.'
    },
    {
      id: 'v-w-5',
      name: 'The Golden Gate Soul Syndicate',
      category: 'entertainment',
      status: 'booked',
      contactPerson: 'Marcus Vance',
      email: 'booking@goldengatesoul.com',
      phone: '(510) 555-3211',
      quotedPrice: 2700,
      depositPaid: 1350,
      contractSigned: true,
      rating: 5,
      notes: 'Wireless lapel mic provided for officiant during ceremony.'
    }
  ],
  vendorChecklist: [
    {
      id: 'vc-w-1',
      vendorCategory: 'venue',
      title: 'Review venue noise ordinance and curfew cutoffs',
      description: 'Carmel sound ordinances require outdoor amplified music to stop at 22:00, indoor until 23:00.',
      completed: true,
    },
    {
      id: 'vc-w-2',
      vendorCategory: 'catering',
      title: 'Confirm vegetarian, vegan, and gluten-free headcounts',
      description: 'Total of 8 vegan, 14 vegetarian, and 4 severe nut allergies logged.',
      completed: true,
    },
    {
      id: 'vc-w-3',
      vendorCategory: 'photo_video',
      title: 'Send "VIP Family & Bridal Shot List" to photographer',
      description: 'Detailing divorced parent groupings and grandparent mobility considerations.',
      completed: false,
    },
    {
      id: 'vc-w-4',
      vendorCategory: 'entertainment',
      title: 'Confirm microphone and power outlets for ceremony altar',
      description: 'Verify 2 dedicated 20A circuits near the meadow arbor.',
      completed: false,
    }
  ],
  creativeThemes: [
    {
      name: 'Pacific Coastal Twilight',
      tagline: 'Sun-bleached linen, ocean mist, and warm amber candlelight',
      description: 'An organic seaside palette inspired by Monterey cypress, crashing surf, and sunset hues.',
      palettes: [
        { name: 'Sea Salt White', hex: '#F8F9FA', role: 'Primary' },
        { name: 'Coastal Sage', hex: '#87986A', role: 'Secondary' },
        { name: 'Pacific Slate', hex: '#475569', role: 'Neutral' },
        { name: 'Sunset Terracotta', hex: '#D97757', role: 'Accent' },
        { name: 'Warm Amber Gold', hex: '#E5A93C', role: 'Highlight' }
      ],
      decorVibe: [
        'Raw textured linen runners on reclaimed wood farm tables',
        'Clusters of ribbed glass hurricane lamps with pillar candles',
        'Loose, gathered coastal florals with wild olive branch and pampas'
      ],
      dressCodePrompt: 'Coastal Formal / Cocktail: Lightweight linens, botanical florals, and block heels suited for lawn walking.'
    }
  ],
  activeThemeIndex: 0,
  invitations: [
    {
      headline: 'Together with their families, Elena & Marcus invite you to celebrate their wedding',
      hosts: 'Elena Rostova & Marcus Sterling',
      honoree: 'Elena & Marcus',
      dateAndLocation: 'Saturday, the Eighteenth of September, Two Thousand Twenty-Six at Four O’Clock in the Afternoon | Cypress Point Overlook, Carmel-by-the-Sea, California',
      dressCode: 'Coastal Formal (Suits & Cocktail Attire)',
      rsvpDeadline: 'August 15, 2026',
      fullInvitationText: 'Under the coastal cypress and overlooking the Pacific horizon, we gather to exchange our lifelong vows. Join us for an evening of joyous music, farm-to-table dining, and dancing under the stars.',
      quirkyPointers: [
        'The ceremony takes place on a grassy cliffside lawn; stilettos are strongly discouraged in favor of block heels or flats.',
        'Carmel evenings can get breezy — cozy wraps and blankets will be provided at dusk!'
      ]
    }
  ],
  drinks: [
    {
      name: 'The Pacific Mist',
      type: 'cocktail',
      description: 'A refreshing, botanical gin cocktail with elderflower, cucumber, and sparkling prosecco.',
      glassware: 'Coupe or Champagne Flute',
      ingredients: [
        '1.5 oz Botanist Artisanal Gin',
        '0.75 oz St-Germain Elderflower Liqueur',
        '0.5 oz Fresh Meyer Lemon Juice',
        '0.5 oz Cucumber Ribbon Infusion',
        'Top with Valdobbiadene Prosecco'
      ],
      garnish: 'Thinly sliced English cucumber ribbon and edible borage flower',
      funFactOrToast: 'Elena and Marcus ordered this exact cocktail on their first weekend trip to Big Sur!'
    },
    {
      name: 'Carmel Golden Hour Spritz',
      type: 'mocktail',
      description: 'A crisp, zero-proof aperitif with blood orange, rosemary syrup, and sparkling tonic.',
      glassware: 'Stemmed Wine Glass with Ice',
      ingredients: [
        '2.0 oz Fresh Blood Orange Juice',
        '0.75 oz Handcrafted Rosemary Simple Syrup',
        '0.5 oz Fresh Lime Juice',
        '3.0 oz Fever-Tree Mediterranean Tonic Water'
      ],
      garnish: 'Charred rosemary sprig and dehydrated blood orange wheel',
      funFactOrToast: 'A vibrant non-alcoholic delight that rivals any cocktail in complexity.'
    }
  ],
  speeches: [
    {
      title: 'Best Man Toast: The Anchor and The Spark',
      speakerRole: 'Best Man (Julian)',
      tone: 'heartfelt',
      durationMinutes: 4,
      bodyParagraphs: [
        'Marcus and I have been best friends since freshman year dorms, when his idea of high cuisine was microwaved ramen topped with hot sauce. When Marcus first met Elena four years ago, I noticed an immediate shift. Suddenly, he was learning how to cook sourdough from scratch, listening to jazz, and laughing with a genuine joy I had never seen before.',
        'Elena, you bring so much warmth, grace, and adventurous spirit into Marcus’s life. Together, you balance each other perfectly: Marcus is the grounded anchor, and Elena, you are the soaring sail catching every ocean breeze.',
        'To see the way you two look at each other today under the Carmel sky reminds everyone in this room what true partnership looks like.'
      ],
      closingToast: 'Everyone, please raise your glasses to Elena and Marcus — may your love weather every storm and dance in every sunset. Cheers!'
    }
  ],
  chatHistory: [
    {
      id: 'msg-w-1',
      sender: 'assistant',
      content: 'Welcome to CelebrationOS! I am your AI Event Copilot for Elena & Marcus’s Coastal Sunset Wedding. I’ve configured your budget allocation, timeline, vendor checklist, and creative design studio. How can I assist you today? You can ask me to optimize costs, adjust your run-of-show, write vendor inquiry emails, or brainstorm personalized ideas!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Check Budget Health', actionType: 'switch_tab', payload: 'budget' },
        { label: 'Review Day-of Run-of-Show', actionType: 'switch_tab', payload: 'timeline' },
        { label: 'Generate Vendor RFP Email', actionType: 'switch_tab', payload: 'vendors' },
        { label: 'Explore Cocktail Recipes', actionType: 'switch_tab', payload: 'ideas' }
      ]
    }
  ]
};

export const birthdayPreset: EventProject = {
  event: {
    id: 'preset-birthday-1',
    title: 'Liam’s 30th: Retro Neon Synthwave & Arcade Bash',
    eventType: 'birthday',
    subType: 'Milestone 30th Birthday',
    date: '2026-11-14',
    time: '19:30',
    location: 'Cybercade Lounge & Rooftop, Austin, TX',
    guestCount: 65,
    totalBudget: 5500,
    currency: 'USD',
    vibe: '80s Retro Arcade, Neon Glow, Cyberpunk Synthwave & Gourmet Street Bites',
    notes: 'Surprise element during cake presentation at 21:30 with custom laser light show!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  budgetItems: [
    {
      id: 'b-b-1',
      name: 'Private Arcade Lounge Rental (4 hours)',
      category: 'venue',
      estimatedCost: 1600,
      actualCost: 1500,
      paidAmount: 750,
      isPaid: false,
      priority: 'must-have',
      notes: 'Includes unlimited free-play on 40 vintage arcade cabinets and pinball.'
    },
    {
      id: 'b-b-2',
      name: 'Artisanal Smash Burger & Bao Bun Food Truck',
      category: 'catering',
      estimatedCost: 1500,
      actualCost: 1450,
      paidAmount: 500,
      isPaid: false,
      priority: 'must-have',
      notes: '65 guests with 2 mains each + loaded waffle fries.'
    },
    {
      id: 'b-b-3',
      name: 'Two Drink Tokens Per Guest + Neon Bar Setup',
      category: 'catering',
      estimatedCost: 900,
      actualCost: 900,
      paidAmount: 450,
      isPaid: false,
      priority: 'must-have',
      notes: 'Custom glowing cocktails and Austin local IPAs.'
    },
    {
      id: 'b-b-4',
      name: 'Custom 2-Tier 80s Cassette & Pac-Man Birthday Cake',
      category: 'catering',
      estimatedCost: 350,
      actualCost: 320,
      paidAmount: 320,
      isPaid: true,
      priority: 'must-have',
      notes: 'Cookies & cream tier with chocolate espresso.'
    },
    {
      id: 'b-b-5',
      name: 'Neon LED Signage, Glow Sticks & Retro Decor',
      category: 'decor_rentals',
      estimatedCost: 400,
      actualCost: 380,
      paidAmount: 380,
      isPaid: true,
      priority: 'must-have',
      notes: 'Custom "LIAM LEVEL 30 UNLOCKED" neon sign.'
    },
    {
      id: 'b-b-6',
      name: 'DJ playing Nu-Disco, French Touch & 80s Synth Pop',
      category: 'entertainment',
      estimatedCost: 550,
      actualCost: 550,
      paidAmount: 275,
      isPaid: false,
      priority: 'must-have',
      notes: 'Includes sound system and neon laser rig.'
    },
    {
      id: 'b-b-7',
      name: 'Contingency & Tip Pool',
      category: 'contingency',
      estimatedCost: 200,
      actualCost: 0,
      paidAmount: 0,
      isPaid: false,
      priority: 'optional',
      notes: 'For extra drink tokens or overtime arcade time.'
    }
  ],
  milestones: [
    {
      id: 'm-b-1',
      title: 'Book Cybercade Lounge Private Mezzanine',
      phase: '1_to_2_months',
      dueDate: '2026-09-20',
      completed: true,
      category: 'venue',
      priority: 'high',
      assignedTo: 'Party Host (Sam)'
    },
    {
      id: 'm-b-2',
      title: 'Book Food Truck & Finalize Menu',
      phase: '1_to_2_months',
      dueDate: '2026-10-05',
      completed: true,
      category: 'catering',
      priority: 'high',
      assignedTo: 'Sam'
    },
    {
      id: 'm-b-3',
      title: 'Send Neon Digital Invites via Partiful / WhatsApp',
      phase: '2_to_4_weeks',
      dueDate: '2026-10-18',
      completed: true,
      category: 'stationery_favors',
      priority: 'high',
      assignedTo: 'Sam'
    },
    {
      id: 'm-b-4',
      title: 'Design "Liam Lore" 30-Question Trivia Quiz',
      phase: '2_to_4_weeks',
      dueDate: '2026-11-01',
      completed: false,
      category: 'entertainment',
      priority: 'medium',
      assignedTo: 'Host Committee'
    },
    {
      id: 'm-b-5',
      title: 'Pick Up Custom Neon Sign & Cake',
      phase: 'final_week',
      dueDate: '2026-11-14',
      completed: false,
      category: 'decor_rentals',
      priority: 'high',
      assignedTo: 'Alex'
    }
  ],
  runOfShow: [
    {
      id: 'ros-b-1',
      startTime: '18:30',
      endTime: '19:30',
      title: 'Venue Load-In, Neon Setup & Soundcheck',
      description: 'Host committee arrives to mount neon sign, set up photo backdrop, and test DJ sound system.',
      responsibleParty: 'Sam & DJ Alex',
      location: 'Mezzanine & Main Arcade',
      completed: false
    },
    {
      id: 'ros-b-2',
      startTime: '19:30',
      endTime: '20:30',
      title: 'Guest Arrival, Free-Play Arcade & Welcome Glow Drinks',
      description: 'Guests arrive, receive drink tokens and custom LED wristbands. Street Fighter II & Mario Kart tournament starts.',
      responsibleParty: 'Door Coordinator',
      location: 'Arcade Floor',
      completed: false
    },
    {
      id: 'ros-b-3',
      startTime: '20:30',
      endTime: '21:30',
      title: 'Food Truck Opens: Smash Burgers & Bao Bites',
      description: 'Fresh hot food served on the patio lounge. Retro background tunes spinning.',
      responsibleParty: 'Food Truck Staff',
      location: 'Rooftop Patio',
      completed: false
    },
    {
      id: 'ros-b-4',
      startTime: '21:30',
      endTime: '22:00',
      title: 'Cake Presentation, Toast & "Level 30" Video Montage',
      description: 'Lights dim, neon sparks ignite. Short 4-minute roast & toast by best friends, blowing candles.',
      responsibleParty: 'Sam & Liam',
      location: 'Lounge Center Stage',
      completed: false
    },
    {
      id: 'ros-b-5',
      startTime: '22:00',
      endTime: '23:30',
      title: 'Synthwave Dance Party & Tournament Grand Finals',
      description: 'DJ ramps up high energy dance set. Winner of arcade tournament receives champion trophy.',
      responsibleParty: 'DJ & Guests',
      location: 'Dance Floor & Arcade',
      completed: false
    }
  ],
  vendors: [
    {
      id: 'v-b-1',
      name: 'Cybercade Arcade & Lounge',
      category: 'venue',
      status: 'booked',
      contactPerson: 'Dave K.',
      email: 'events@cybercadeaustin.com',
      phone: '(512) 555-9021',
      quotedPrice: 1500,
      depositPaid: 750,
      contractSigned: true,
      rating: 5,
      notes: 'Confirmed 19:00 - 23:30.'
    },
    {
      id: 'v-b-2',
      name: 'Atomic Smash Truck',
      category: 'catering',
      status: 'booked',
      contactPerson: 'Chef Brenda',
      email: 'orders@atomicsmash.com',
      phone: '(512) 555-1234',
      quotedPrice: 1450,
      depositPaid: 500,
      contractSigned: true,
      rating: 5,
      notes: 'Truck will park on south patio.'
    }
  ],
  vendorChecklist: [
    {
      id: 'vc-b-1',
      vendorCategory: 'venue',
      title: 'Confirm arcade free-play token-bypass mode',
      description: 'Ensure cabinets do not require physical quarters.',
      completed: true
    },
    {
      id: 'vc-b-2',
      vendorCategory: 'catering',
      title: 'Confirm dessert table setup and cake knife',
      description: 'Bakery delivering cake at 19:00.',
      completed: false
    }
  ],
  creativeThemes: [
    {
      name: 'Cyberpunk 1986 / Neon Synthwave',
      tagline: 'Outrun sunsets, vector grids, and retro-futuristic vibes',
      description: 'Electric pinks, deep blues, and laser purples reminiscent of classic arcade golden years.',
      palettes: [
        { name: 'Neon Magenta', hex: '#FF007F', role: 'Primary' },
        { name: 'Electric Cyan', hex: '#00F0FF', role: 'Secondary' },
        { name: 'Synthwave Indigo', hex: '#2E0854', role: 'Neutral' },
        { name: 'Laser Amber', hex: '#FFB800', role: 'Accent' }
      ],
      decorVibe: [
        'Custom LED neon typography ("LEVEL 30")',
        'Retro CRT television stacks looping 80s anime and gaming trailers',
        'Glow-in-the-dark cocktail swizzles and pixel art coasters'
      ],
      dressCodePrompt: 'Retro 80s / Neon Casual: Denim jackets, vintage band tees, neon accents, and bold sneakers.'
    }
  ],
  activeThemeIndex: 0,
  invitations: [
    {
      headline: 'Liam has survived 30 years! Time to unlock Level 30.',
      hosts: 'Sam & The Austin Crew',
      honoree: 'Liam',
      dateAndLocation: 'Saturday, November 14, 2026 at 7:30 PM | Cybercade Lounge, Austin, TX',
      dressCode: 'Neon / 80s Retro Arcade Casual',
      rsvpDeadline: 'November 1, 2026',
      fullInvitationText: 'Insert coin to continue! Liam is hitting the big 3-0, and we are celebrating with free-play arcade battles, smash burgers, neon cocktails, and high-energy synth jams. No gifts needed — just bring your A-game for the Mario Kart tournament.',
      quirkyPointers: [
        'Unlimited arcade tokens included with admission.',
        'Costume prize for best 80s retro outfit!'
      ]
    }
  ],
  drinks: [
    {
      name: 'The 8-Bit Overdrive',
      type: 'cocktail',
      description: 'A blue curacao and spiced rum concoction that glows under blacklight.',
      glassware: 'Highball Glass with LED Ice Cube',
      ingredients: [
        '1.5 oz Spiced Dark Rum',
        '0.75 oz Blue Curaçao',
        '0.5 oz Pineapple Juice',
        '0.5 oz Fresh Lime Juice',
        'Topped with Ginger Beer'
      ],
      garnish: 'Maraschino cherry and pop-rocks sugar rim',
      funFactOrToast: 'Glows electric neon under UV blacklights in the arcade!'
    }
  ],
  speeches: [
    {
      title: 'Host Toast: Level 30 Unlocked',
      speakerRole: 'Best Friend & Host (Sam)',
      tone: 'humorous',
      durationMinutes: 3,
      bodyParagraphs: [
        'They say your 20s are the tutorial level, and at 30, the real game begins. Looking at Liam, I think he spent the entire tutorial collecting side quests, mastering guitar solos, and building the coolest circle of friends in Austin.',
        'Liam is the kind of friend who will answer your call at 2 AM to help move a couch, or show up in full costume when you specifically told him not to.',
        'Here is to 30 years of legend, and to the next 30 levels ahead.'
      ],
      closingToast: 'To Liam! May your health bar always be full and your Wi-Fi always strong. Cheers!'
    }
  ],
  chatHistory: [
    {
      id: 'msg-b-1',
      sender: 'assistant',
      content: 'Welcome! I am your CelebrationOS AI Copilot for Liam’s 30th Retro Arcade Bash. I have pre-calculated your food truck budget, scheduled your party run-of-show, and drafted your neon synthwave theme. How can I help you customize this epic party?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'View Food Truck & Drink Budget', actionType: 'switch_tab', payload: 'budget' },
        { label: 'Check Arcade Run-of-Show', actionType: 'switch_tab', payload: 'timeline' },
        { label: 'Generate Party Games & Trivia', actionType: 'switch_tab', payload: 'ideas' }
      ]
    }
  ]
};

export const communityPreset: EventProject = {
  event: {
    id: 'preset-community-1',
    title: 'Oakridge Eco-Harvest Festival & 5K Walk',
    eventType: 'community',
    subType: 'Neighborhood Civic Festival & Fundraiser',
    date: '2026-10-10',
    time: '08:00',
    location: 'Oakridge Community Park & Civic Amphitheater, Portland, OR',
    guestCount: 650,
    totalBudget: 18500,
    currency: 'USD',
    vibe: 'Eco-conscious, Family-Friendly, Vibrant Community Celebration with Live Folk Music',
    notes: 'City Council special event permit approved. Proceeds benefit Oakridge Urban Forestry Initiative.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  budgetItems: [
    {
      id: 'b-c-1',
      name: 'City Park Rental, Street Closure & Sound Permits',
      category: 'permits_safety',
      estimatedCost: 2200,
      actualCost: 2150,
      paidAmount: 2150,
      isPaid: true,
      priority: 'must-have',
      notes: 'City Parks Dept & Traffic Police permit.'
    },
    {
      id: 'b-c-2',
      name: 'Main Stage, Solar-Powered Sound & PA System',
      category: 'entertainment',
      estimatedCost: 3800,
      actualCost: 3600,
      paidAmount: 1800,
      isPaid: false,
      priority: 'must-have',
      notes: 'Full sound engineer for 4 local bands + civic speeches.'
    },
    {
      id: 'b-c-3',
      name: 'Sanitation Stations, Recycling Tents & 8 Portable Restrooms',
      category: 'permits_safety',
      estimatedCost: 1900,
      actualCost: 1800,
      paidAmount: 900,
      isPaid: false,
      priority: 'must-have',
      notes: 'Zero-waste initiative with dedicated composting bins.'
    },
    {
      id: 'b-c-4',
      name: 'Local Food Truck Coordination & Health Dept Inspection',
      category: 'catering',
      estimatedCost: 800,
      actualCost: 750,
      paidAmount: 750,
      isPaid: true,
      priority: 'must-have',
      notes: 'Permit fees for 6 artisan food trucks (Tacos, Vegan Bowls, Cider, Pretzels).'
    },
    {
      id: 'b-c-5',
      name: 'Volunteer Hospitality (60 Volunteers: Breakfast & T-shirts)',
      category: 'catering',
      estimatedCost: 1800,
      actualCost: 1700,
      paidAmount: 1700,
      isPaid: true,
      priority: 'must-have',
      notes: 'Organic fair-trade coffee, bagels, and organic cotton volunteer shirts.'
    },
    {
      id: 'b-c-6',
      name: 'Kids Zone: Pumpkin Decorating, Face Paint & Petting Zoo',
      category: 'decor_rentals',
      estimatedCost: 2400,
      actualCost: 2300,
      paidAmount: 1150,
      isPaid: false,
      priority: 'must-have',
      notes: 'Supervised activities for children age 3-12.'
    },
    {
      id: 'b-c-7',
      name: 'First Aid EMT Station & Off-Duty Traffic Officers',
      category: 'permits_safety',
      estimatedCost: 1500,
      actualCost: 1500,
      paidAmount: 750,
      isPaid: false,
      priority: 'must-have',
      notes: 'Mandatory civic safety coverage for 5K race route.'
    },
    {
      id: 'b-c-8',
      name: '5K Race Bibs, Timing Chips & Medals (250 runners)',
      category: 'stationery_favors',
      estimatedCost: 2200,
      actualCost: 2100,
      paidAmount: 2100,
      isPaid: true,
      priority: 'must-have',
      notes: 'Eco-wood medals planted with native wildflower seeds.'
    },
    {
      id: 'b-c-9',
      name: 'Contingency & Weather Buffer',
      category: 'contingency',
      estimatedCost: 1900,
      actualCost: 0,
      paidAmount: 0,
      isPaid: false,
      priority: 'must-have',
      notes: 'Emergency rain canopy rentals reserve.'
    }
  ],
  milestones: [
    {
      id: 'm-c-1',
      title: 'Submit City Street Closure & Park Permit Application',
      phase: '6_plus_months',
      dueDate: '2026-04-10',
      completed: true,
      category: 'permits_safety',
      priority: 'high',
      assignedTo: 'Civic Committee'
    },
    {
      id: 'm-c-2',
      title: 'Secure Corporate & Local Business Sponsors',
      phase: '3_to_6_months',
      dueDate: '2026-06-30',
      completed: true,
      category: 'other',
      priority: 'high',
      assignedTo: 'Fundraising Lead'
    },
    {
      id: 'm-c-3',
      title: 'Recruit & Screen 60 Community Volunteers',
      phase: '1_to_2_months',
      dueDate: '2026-08-20',
      completed: true,
      category: 'other',
      priority: 'high',
      assignedTo: 'Volunteer Coordinator'
    },
    {
      id: 'm-c-4',
      title: 'Finalize Route Marshalling & Safety Briefing with Police',
      phase: '2_to_4_weeks',
      dueDate: '2026-09-25',
      completed: false,
      category: 'permits_safety',
      priority: 'high',
      assignedTo: 'Safety Officer'
    },
    {
      id: 'm-c-5',
      title: 'Conduct Volunteer Orientation & T-Shirt Distribution',
      phase: 'final_week',
      dueDate: '2026-10-07',
      completed: false,
      category: 'other',
      priority: 'medium',
      assignedTo: 'Team'
    }
  ],
  runOfShow: [
    {
      id: 'ros-c-1',
      startTime: '06:30',
      endTime: '07:45',
      title: 'Volunteer Check-In, Course Coning & Sound Check',
      description: 'Traffic cones laid out for 5K course. Sound engineers test main amphitheater speakers.',
      responsibleParty: 'Event Director & Safety Team',
      location: 'Park North Pavilion',
      completed: false
    },
    {
      id: 'ros-c-2',
      startTime: '08:00',
      endTime: '08:15',
      title: 'Mayor’s Welcome & 5K Race Kickoff',
      description: 'Opening remarks, national anthem, air-horn start for 250 runners and walkers.',
      responsibleParty: 'Mayor & Race Marshall',
      location: 'Start Line on Oak Avenue',
      completed: false
    },
    {
      id: 'ros-c-3',
      startTime: '09:30',
      endTime: '10:15',
      title: '5K Awards Ceremony & Tree Planting Demonstration',
      description: 'Medals awarded to age group winners. Master Gardeners lead live urban oak planting demo.',
      responsibleParty: 'Race Director & Parks Dept',
      location: 'Main Amphitheater Stage',
      completed: false
    },
    {
      id: 'ros-c-4',
      startTime: '10:30',
      endTime: '15:30',
      title: 'Harvest Festival Open: Bands, Food Trucks & Kids Zone',
      description: 'Continuous live folk & bluegrass bands. 6 food trucks open. Kids craft and pumpkin painting running.',
      responsibleParty: 'All Coordinators',
      location: 'Entire Park Meadow',
      completed: false
    },
    {
      id: 'ros-c-5',
      startTime: '15:30',
      endTime: '17:00',
      title: 'Community Raffle Draw & Zero-Waste Cleanup',
      description: 'Raffle prizes drawn for urban forestry fund. Volunteer teams sweep grounds for 100% recycling sorting.',
      responsibleParty: 'Green Team Lead',
      location: 'Amphitheater & Recycling Tents',
      completed: false
    }
  ],
  vendors: [
    {
      id: 'v-c-1',
      name: 'Cascadia Stage & Sound',
      category: 'entertainment',
      status: 'booked',
      contactPerson: 'Jesse Miller',
      email: 'jesse@cascadiasound.com',
      phone: '(503) 555-7822',
      quotedPrice: 3600,
      depositPaid: 1800,
      contractSigned: true,
      rating: 5,
      notes: 'Includes mobile solar trailer powering sound board.'
    },
    {
      id: 'v-c-2',
      name: 'Pacific Sanitation & Eco-Loo',
      category: 'permits_safety',
      status: 'booked',
      contactPerson: 'Gail Thorne',
      email: 'dispatch@ecoloo.com',
      phone: '(503) 555-4491',
      quotedPrice: 1800,
      depositPaid: 900,
      contractSigned: true,
      rating: 5,
      notes: 'Delivering 8 units + 2 ADA compliant accessible units by 06:00 AM.'
    }
  ],
  vendorChecklist: [
    {
      id: 'vc-c-1',
      vendorCategory: 'permits_safety',
      title: 'Verify ADA accessibility compliance for festival grounds',
      description: 'Ensure clear 5-foot pathways and accessible seating at the stage.',
      completed: true
    },
    {
      id: 'vc-c-2',
      vendorCategory: 'permits_safety',
      title: 'Confirm EMT station power and hydration supply',
      description: 'First aid tent requires ice chest and clean water hookup.',
      completed: false
    }
  ],
  creativeThemes: [
    {
      name: 'Cascadia Autumn Harvest',
      tagline: 'Warm earth tones, sustainable forestry, and community fellowship',
      description: 'Inspired by Pacific Northwest autumn leaves, Douglas firs, and golden harvest grain.',
      palettes: [
        { name: 'Forest Green', hex: '#1B4332', role: 'Primary' },
        { name: 'Harvest Ochre', hex: '#D4A373', role: 'Secondary' },
        { name: 'Pumpkin Terracotta', hex: '#BC6C25', role: 'Accent' },
        { name: 'Cream Canvas', hex: '#FEFAE0', role: 'Neutral' }
      ],
      decorVibe: [
        'Burlap and upcycled wooden crate signage',
        'Hay bale seating around acoustic circle',
        'Native plant and wildflower pollinator centerpieces'
      ],
      dressCodePrompt: 'Comfortable Outdoor Festive: Flannels, trail-friendly footwear, and cozy layers for an autumn day in the park.'
    }
  ],
  activeThemeIndex: 0,
  invitations: [
    {
      headline: 'Join Us for the 12th Annual Oakridge Eco-Harvest Festival & 5K Walk!',
      hosts: 'Oakridge Neighborhood Association & Urban Forestry Board',
      honoree: 'Oakridge Community',
      dateAndLocation: 'Saturday, October 10, 2026 | 8:00 AM - 5:00 PM | Oakridge Community Park, Portland, OR',
      dressCode: 'Outdoor Casual & Running Gear for 5K Participants',
      rsvpDeadline: 'Registration open online until October 8; Walk-ins welcome!',
      fullInvitationText: 'Celebrate our neighborhood green spaces with a morning 5K fun run followed by an all-day festival featuring local bluegrass bands, artisan food trucks, pumpkin decorating, and a native tree sale.',
      quirkyPointers: [
        'Free secure bicycle valet available at the park entrance!',
        'Bring a refillable water bottle — free sparkling water stations will be open all day.'
      ]
    }
  ],
  drinks: [
    {
      name: 'Spiced Cascade Apple Cider',
      type: 'mocktail',
      description: 'Locally pressed Hood River apples simmered with cinnamon bark, clove, and orange zest.',
      glassware: 'Compostable Eco-Mug',
      ingredients: [
        '6.0 oz Fresh Local Unfiltered Apple Cider',
        '1 Cinnamon Stick',
        '2 Whole Cloves',
        '0.5 oz Fresh Orange Juice',
        'Dash of Nutmeg'
      ],
      garnish: 'Fresh orange wheel and cinnamon stirrer',
      funFactOrToast: 'Apples donated by local organic orchards in the Willamette Valley.'
    }
  ],
  speeches: [
    {
      title: 'Community Opening Remarks: Growing Together',
      speakerRole: 'Neighborhood Association President',
      tone: 'inspirational',
      durationMinutes: 4,
      bodyParagraphs: [
        'Good morning, neighbors! Twelve years ago, this park was an overgrown lot. Today, look around you: 650 neighbors coming together to run, celebrate, and plant trees for our children’s future.',
        'Every dollar raised from today’s 5K walk will go directly to planting 150 mature shade trees across our school walking routes.',
        'A strong community isn’t measured by buildings or roads; it’s measured by how we take care of one another and our shared environment.'
      ],
      closingToast: 'Let’s lace up our shoes, enjoy the music, and celebrate our wonderful home. Have a fantastic festival!'
    }
  ],
  chatHistory: [
    {
      id: 'msg-c-1',
      sender: 'assistant',
      content: 'Welcome! I am your CelebrationOS AI Civic Planner for the Oakridge Eco-Harvest Festival. I have structured your city permit checklist, volunteer coordination, and emergency safety plans. How can I assist you with civic event logistics today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Check Safety & Permits Checklist', actionType: 'switch_tab', payload: 'vendors' },
        { label: 'Review Volunteer Timeline', actionType: 'switch_tab', payload: 'timeline' },
        { label: 'Sponsor Pitch & Speech Generator', actionType: 'switch_tab', payload: 'ideas' }
      ]
    }
  ]
};
