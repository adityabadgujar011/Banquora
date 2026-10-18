export const PRESET_GALLERIES = [
  {
    id: "palace-ballroom",
    title: "Grand Royal Palace",
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    category: "Palace"
  },
  {
    id: "chandeliers-gold",
    title: "Imperial Gold Chandelier Hall",
    url: "https://images.unsplash.com/photo-1545232979-fbf68fe9ec44?auto=format&fit=crop&w=1200&q=80",
    category: "Luxury"
  },
  {
    id: "glasshouse-garden",
    title: "Enchanted Glasshouse & Lawn",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    category: "Garden"
  },
  {
    id: "heritage-haveli",
    title: "Heritage Courtyard Banquet",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    category: "Heritage"
  },
  {
    id: "modern-convention",
    title: "Sapphire Modern Convention Center",
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    category: "Modern"
  },
  {
    id: "coastal-resort",
    title: "Seaside Royale Pavilion",
    url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
    category: "Resort"
  }
];

export const MAHARASHTRA_CITIES = [
  "Pune",
  "Pimpri Chinchwad",
  "Haveli / Pune Nagar Road",
  "Hinjawadi / Wakad",
  "Hadapsar / Magarpatta",
  "Baner / Balewadi",
  "Kothrud / Karve Nagar",
  "Chakan / Talegaon",
  "Lonavala / Khandala",
  "Mumbai",
  "Navi Mumbai",
  "Thane",
  "Nashik",
  "Kolhapur",
  "Mahabaleshwar"
];

export const INITIAL_OWNERS = [
  {
    id: "owner_1",
    name: "Vikramaditya Singhania",
    businessName: "Singhania Royal Palaces Ltd.",
    phone: "+91 98201 12345",
    email: "singhania@palaces.com",
    alternateEmail: "owner1@banquora.com",
    password: "owner123",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    joinedDate: "Jan 2025",
    assignedHallIds: ["hall-101", "hall-103", "hall-105"],
    assignedHalls: [
      "Golden Palace (Pune)",
      "Regal Horizon Bayfront Ballroom (Mumbai)",
      "Taj Crown Convention & Banquets"
    ]
  },
  {
    id: "owner_2",
    name: "Maharani Gayatri Group",
    businessName: "Gayatri Heritage & Luxury Estates",
    phone: "+91 94140 88776",
    email: "gayatri@estates.com",
    alternateEmail: "owner2@banquora.com",
    password: "owner123",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    joinedDate: "Feb 2025",
    assignedHallIds: ["hall-102", "hall-104", "hall-106"],
    assignedHalls: [
      "The Saffron Gold (Pune)",
      "The Emerald Glasshouse & Meadow",
      "Royal Heritage Haveli & Palace"
    ]
  }
];

export const INITIAL_HALLS = [
  {
    id: "hall-101",
    name: "Golden Palace",
    tagline: "Grand celebratory wedding stage and magnificent royal open lawns",
    city: "Pune",
    location: "Pune Nagar Road, Haveli",
    fullAddress: "Golden Palace Wedding Hall & Waykar Sheth Designer, Pune Nagar Road, Haveli, MH, India",
    capacity: 1200,
    sqft: 24000,
    pricePerDay: 350000,
    advanceBookingAmount: 50000,
    ownerId: "owner_1",
    ownerName: "Singhania Royal Palaces Ltd.",
    ownerPhone: "+91 98201 12345",
    rating: 4.95,
    reviewCount: 148,
    images: [
      "/images/golden-palace-1.png",
      "/images/golden-palace-2.png"
    ],
    amenities: [
      "Centrally Air Conditioned",
      "Grand Wedding Stage & Royal Mandap",
      "Separate Royal Bride & Groom Suites",
      "Vast Open Celebration Lawns",
      "Valet Parking (300+ Cars)",
      "In-House Master Chefs",
      "Live DJ & JBL Sound System",
      "100% Power Generator Backup",
      "Luxury Guest Rooms Included"
    ],
    isAvailable: true,
    description: "Golden Palace Wedding Hall & Waykar Sheth Designer on Pune Nagar Road is Haveli's premier grand celebratory venue. Featuring a magnificent grand wedding stage, royal mandap decor, and vast capacity for grand receptions, birthdays, and auspicious celebrations."
  },
  {
    id: "hall-102",
    name: "The Saffron Gold",
    tagline: "Heritage banquet court with grand celebratory stage & festive pavilion",
    city: "Pune",
    location: "Pune Nagar Road, Haveli",
    fullAddress: "The Saffron Gold Banquet Hall, Pune Nagar Road, Haveli, MH, India",
    capacity: 800,
    sqft: 16500,
    pricePerDay: 220000,
    advanceBookingAmount: 35000,
    ownerId: "owner_2",
    ownerName: "Gayatri Heritage & Luxury Estates",
    ownerPhone: "+91 94140 88776",
    rating: 4.88,
    reviewCount: 92,
    images: [
      "/images/saffron-gold-1.png",
      "/images/saffron-gold-2.png"
    ],
    amenities: [
      "Centrally Air Conditioned",
      "Grand Celebration Stage",
      "Stage Lighting & Acoustic Rig",
      "Bridal Suite",
      "Valet Parking (150 Cars)",
      "In-House Catering & Dining Pavilion",
      "100% Generator Power Backup"
    ],
    isAvailable: true,
    description: "The Saffron Gold Banquet Hall on Pune Nagar Road, Haveli is an exquisite celebration destination featuring a grand illuminated stage, traditional welcome arch, and full banquet amenities for weddings, receptions, and family celebrations."
  },
  {
    id: "hall-103",
    name: "Regal Horizon Bayfront Ballroom",
    tagline: "Ultra-luxury glass banquet overlooking the Arabian Sea",
    city: "Mumbai",
    location: "Worli Sea Face",
    fullAddress: "Floor 4, Horizon Towers, Worli Sea Face, Mumbai, Maharashtra 400030",
    capacity: 650,
    sqft: 14000,
    pricePerDay: 480000,
    advanceBookingAmount: 75000,
    ownerId: "owner_1",
    ownerName: "Singhania Royal Palaces Ltd.",
    ownerPhone: "+91 98201 12345",
    rating: 4.98,
    reviewCount: 215,
    images: [
      "https://images.unsplash.com/photo-1545232979-fbf68fe9ec44?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Panoramic Sea View Windows",
      "Fully Air Conditioned",
      "Multi-Tier Stage Lighting",
      "Multi-Cuisine Gourmet Kitchen",
      "VIP Lounge & Green Rooms",
      "Dedicated Escalator & Lifts",
      "Valet Parking (400 Cars)",
      "High-Tech Audio Visual Rig"
    ],
    isAvailable: true,
    description: "Mumbai's most coveted shoreline banquet destination. Features floor-to-ceiling glass panoramic sea views, cutting-edge AV rigs, and glamorous setups for weddings and milestone celebrations."
  },
  {
    id: "hall-104",
    name: "The Emerald Glasshouse & Meadow",
    tagline: "Lush tropical estate with climate-controlled botanical banquet",
    city: "Bengaluru",
    location: "Whitefield Eco Valley",
    fullAddress: "23 Palm Meadows Drive, Whitefield, Bengaluru, Karnataka 560066",
    capacity: 1000,
    sqft: 25000,
    pricePerDay: 290000,
    advanceBookingAmount: 40000,
    ownerId: "owner_2",
    ownerName: "Gayatri Heritage & Luxury Estates",
    ownerPhone: "+91 94140 88776",
    rating: 4.91,
    reviewCount: 110,
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Glasshouse Climate Control",
      "Expansive Green Lawn (15,000 sq ft)",
      "Valet Parking",
      "Fairytale Fairy Lights & Stage",
      "Organic Farm-to-Table Kitchen",
      "4 AC Changing Suites",
      "Full Power Backup"
    ],
    isAvailable: true,
    description: "A botanical paradise in the Garden City. Perfect for open-air garden birthdays, evening retirement celebrations, and fairytale greenhouse wedding receptions."
  },
  {
    id: "hall-105",
    name: "Taj Crown Convention & Banquets",
    tagline: "Colossal multi-tier hall for royal weddings and mega gatherings",
    city: "Delhi NCR",
    location: "Golf Course Road, Gurugram",
    fullAddress: "Sector 54, Golf Course Road, Gurugram, Haryana 122002",
    capacity: 1800,
    sqft: 35000,
    pricePerDay: 550000,
    advanceBookingAmount: 80000,
    ownerId: "owner_1",
    ownerName: "Singhania Royal Palaces Ltd.",
    ownerPhone: "+91 98201 12345",
    rating: 4.94,
    reviewCount: 180,
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545232979-fbf68fe9ec44?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Central HVAC & Air Filtration",
      "Separate Vegetarian / Non-Veg Kitchens",
      "Helipad Access (On Request)",
      "Valet Parking (600 Cars)",
      "12 Furnished Guest Rooms",
      "Line Array Audio System",
      "Grand Entrance Foyer"
    ],
    isAvailable: true,
    description: "The crown jewel of Delhi NCR. Tailored for grandiose celebrations with double-height ceilings, seamless pillarless sightlines, and unmatched hospitality."
  },
  {
    id: "hall-106",
    name: "Casa Del Mar Royal Beachside Pavilion",
    tagline: "Sunset seaside lawns and illuminated Portuguese ballroom",
    city: "Goa",
    location: "Candolim Beachfront",
    fullAddress: "144 Fort Aguada Road, Candolim, Goa 403515",
    capacity: 500,
    sqft: 12000,
    pricePerDay: 260000,
    advanceBookingAmount: 45000,
    ownerId: "owner_2",
    ownerName: "Gayatri Heritage & Luxury Estates",
    ownerPhone: "+91 94140 88776",
    rating: 4.89,
    reviewCount: 78,
    images: [
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Direct Private Beach Access",
      "Portuguese Style Architecture",
      "Poolside Cocktail Area",
      "Live BBQ & Seafood Grills",
      "DJ Deck with Laser Lights",
      "Valet Parking",
      "Luxury Beachfront Villa Suites"
    ],
    isAvailable: true,
    description: "Experience the magic of breezy beachfront celebrations with golden sunsets, live BBQ grills, and ocean view lawns."
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "BK-84910",
    referenceCode: "BQ-84910",
    hallId: "hall-101",
    hallName: "Golden Palace",
    hallCity: "Pune",
    ownerId: "owner_1",
    customerName: "Rohan Malhotra & Ananya Sen",
    customerPhone: "+91 98112 34567",
    customerEmail: "rohan.malhotra@gmail.com",
    eventType: "Wedding & Grand Reception",
    eventDate: "2026-11-20",
    timeSlot: "Full Day (9:00 AM - Midnight)",
    guestCount: 850,
    totalPrice: 350000,
    advanceAmount: 50000,
    transactionId: "TXN-9847120409",
    paymentMethod: "UPI QR Scanner",
    paymentDate: "2026-08-28T14:30:00Z",
    status: "pending",
    statusNote: "Customer submitted UTR. Waiting for admin bank settlement check.",
    createdAt: "2026-08-28T14:35:00Z",
    notes: "Requires flower mandap decoration and extra bridal room."
  },
  {
    id: "BK-84911",
    referenceCode: "BQ-84911",
    hallId: "hall-102",
    hallName: "The Imperial Amber Court & Pavilion",
    hallCity: "Jaipur",
    ownerId: "owner_2",
    customerName: "Col. Rajeshwar Singh (Retd.)",
    customerPhone: "+91 94140 33221",
    customerEmail: "rajeshwar.singh@veteran.org",
    eventType: "Retirement & Lifetime Honor Gala",
    eventDate: "2026-10-24",
    timeSlot: "Evening (5:00 PM - 11:30 PM)",
    guestCount: 350,
    totalPrice: 220000,
    advanceAmount: 35000,
    transactionId: "UTR-7738291044",
    paymentMethod: "UPI QR Scanner",
    paymentDate: "2026-08-25T11:20:00Z",
    status: "approved",
    statusNote: "Payment verified by Super Admin. Owner and Customer notified.",
    approvedAt: "2026-08-25T12:00:00Z",
    createdAt: "2026-08-25T11:25:00Z",
    notes: "Requires tribute AV projector and silver jubilee flower garland setup."
  },
  {
    id: "BK-84912",
    referenceCode: "BQ-84912",
    hallId: "hall-104",
    hallName: "The Emerald Glasshouse & Meadow",
    hallCity: "Bengaluru",
    ownerId: "owner_2",
    customerName: "Dr. Kavita & Sameer Deshmukh",
    customerPhone: "+91 97841 55667",
    customerEmail: "sameer.deshmukh@gmail.com",
    eventType: "50th Golden Jubilee Birthday Bash",
    eventDate: "2026-12-05",
    timeSlot: "Evening (4:00 PM - Midnight)",
    guestCount: 250,
    totalPrice: 290000,
    advanceAmount: 40000,
    transactionId: "UPI-4491028394",
    paymentMethod: "UPI QR Scanner",
    paymentDate: "2026-08-29T09:15:00Z",
    status: "pending",
    statusNote: "Submitted via QR Scanner. Ready for Super Admin approval.",
    createdAt: "2026-08-29T09:20:00Z",
    notes: "Requires theme balloon arch and LED cake spotlight stage."
  }
];

export const INITIAL_PAYMENT_CONFIG = {
  upiId: "thakareanant994@okhdfcbank",
  payeeName: "Anant Thakare",
  merchantCode: "BANQUORA-HDFC-01",
  bankName: "HDFC Bank (Google Pay Escrow)",
  qrImageUrl: "/images/escrow-scanner.png",
  contactPhone: "+91 8000 77 9900"
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    recipientRole: "admin",
    title: "New Booking Submitted",
    message: "Rohan Malhotra submitted a ₹50,000 advance payment with UTR TXN-9847120409 for Golden Palace.",
    timestamp: "2026-08-28T14:35:00Z",
    type: "booking_created",
    read: false
  },
  {
    id: "notif-2",
    recipientRole: "owner",
    ownerId: "owner_2",
    title: "Booking Approved by Super Admin",
    message: "Retirement Gala for Col. Rajeshwar Singh at Amber Court confirmed for Oct 24, 2026.",
    timestamp: "2026-08-25T12:00:00Z",
    type: "booking_approved",
    read: true
  }
];
