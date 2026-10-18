import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Sparkles, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Maximize2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerView = () => {
  const { 
    currentUser,
    halls, 
    setSelectedHall, 
    setBookingModalHall, 
    requireAuth,
    formatINR,
    setIsTrackerOpen 
  } = useApp();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [maxPrice, setMaxPrice] = useState(100000000); // 10 Crores cap
  const [selectedAmenity, setSelectedAmenity] = useState('all');

  // Cities extracted safely
  const cities = useMemo(() => {
    const set = new Set(halls.map(h => (h.city || '').trim()).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [halls]);

  // Filtered Halls
  const filteredHalls = useMemo(() => {
    return halls.filter(hall => {
      const hName = (hall.name || '').toLowerCase();
      const hLoc = (hall.location || '').toLowerCase();
      const hTag = (hall.tagline || '').toLowerCase();
      const hCity = (hall.city || '').toLowerCase();
      const sQuery = searchTerm.trim().toLowerCase();

      const matchSearch = sQuery === '' || 
        hName.includes(sQuery) ||
        hLoc.includes(sQuery) ||
        hTag.includes(sQuery) ||
        hCity.includes(sQuery);

      const matchCity = selectedCity === 'all' || hCity === selectedCity.toLowerCase();
      
      const cap = Number(hall.capacity) || 0;
      let matchCapacity = true;
      if (selectedCapacity === 'small') matchCapacity = cap <= 600;
      else if (selectedCapacity === 'medium') matchCapacity = cap > 600 && cap <= 1000;
      else if (selectedCapacity === 'large') matchCapacity = cap > 1000;

      const price = Number(hall.pricePerDay) || 0;
      const matchPrice = price <= maxPrice;

      const matchAmenity = selectedAmenity === 'all' || 
        (Array.isArray(hall.amenities) && hall.amenities.some(a => (a || '').toLowerCase().includes(selectedAmenity.toLowerCase())));

      return matchSearch && matchCity && matchCapacity && matchPrice && matchAmenity;
    });
  }, [halls, searchTerm, selectedCity, selectedCapacity, maxPrice, selectedAmenity]);

  const handleBookClick = (hall) => {
    requireAuth(
      'customer',
      () => setBookingModalHall(hall),
      `Please log in to proceed with booking ${hall.name}.`
    );
  };

  return (
    <div className="space-y-12 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          
          {/* Royal Crest Monogram with ambient luxury glow */}
          <div className="flex justify-center mb-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
              <img 
                src="/images/banquora-crest-gold-transparent.png" 
                alt="Banquora Royal Crest" 
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_8px_16px_rgba(212,175,55,0.3)]"
              />
            </div>
          </div>

          {/* Curated Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-[#D4AF37] border border-amber-500/30 text-xs font-semibold tracking-wider uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curated Collection &bull; Grand Ballrooms & Heritage Palaces</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 leading-[1.18]">
            Extraordinary Venues for <br />
            <span className="italic font-serif text-[#C59A27]">Unforgettable</span> Celebrations
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Discover verified heritage palaces, luxury convention centers, and scenic banquet lawns across India. Transparent direct owner pricing with 100% escrow date protection.
          </p>

          {/* Quick Trust Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Direct Rates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Escrow Protection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Instant Date Confirmation</span>
            </div>
          </div>

        </div>

        {/* SEARCH & FILTER ENGINE BAR */}
        <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)] relative">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Keyword */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search venue name, city or area..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] focus:ring-1 focus:ring-[#C59A27]/20 transition-all"
              />
            </div>

            {/* City Dropdown */}
            <div className="lg:col-span-3">
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-8 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C59A27] appearance-none capitalize transition-all"
                >
                  <option value="all">All Locations</option>
                  {cities.filter(c => c !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Capacity Dropdown */}
            <div className="lg:col-span-3">
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-8 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C59A27] appearance-none transition-all"
                >
                  <option value="all">Any Capacity</option>
                  <option value="small">Intimate (Up to 600 Pax)</option>
                  <option value="medium">Grand (600 - 1,000 Pax)</option>
                  <option value="large">Imperial (1,000+ Pax)</option>
                </select>
              </div>
            </div>

            {/* Reset Filters */}
            <div className="lg:col-span-2 flex items-center justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('all');
                  setSelectedCapacity('all');
                  setMaxPrice(100000000);
                  setSelectedAmenity('all');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors text-center border border-slate-200/60 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

          </div>

          {/* Secondary Filter Tags */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">Curated Filters:</span>
              {['AC', 'Catering', 'Valet', 'Bridal Suite', 'DJ', 'Rooms'].map(amenity => (
                <button
                  key={amenity}
                  onClick={() => setSelectedAmenity(selectedAmenity === amenity ? 'all' : amenity)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
                    selectedAmenity === amenity
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>

            <div className="text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold">{filteredHalls.length}</span> verified venues
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER & HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-200/70 gap-2">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900">
              Featured Estates & Grand Halls
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Inspected and approved for premium weddings, receptions, and corporate galas.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {filteredHalls.length} Available Properties
          </span>
        </div>
      </section>

      {/* HALLS GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredHalls.length === 0 ? (
          <div className="text-center py-20 p-8 bg-white rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-900">No Venues Match Your Search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any halls matching your filter selection. Try adjusting your keywords or clearing the filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedCapacity('all');
                setSelectedAmenity('all');
              }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Show All Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHalls.map((hall) => {
              let primaryImage = hall.images && hall.images.length > 0
                ? hall.images[0]
                : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80";
              if (typeof primaryImage === 'string' && primaryImage.startsWith('images/')) {
                primaryImage = '/' + primaryImage;
              }

              return (
                <div
                  key={hall.id}
                  className="group relative bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(15,23,42,0.1)] hover:border-slate-300 transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={primaryImage}
                      alt={hall.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent"></div>

                    {/* City Badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/60 text-slate-800 text-xs font-semibold tracking-wide shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span>{hall.city}</span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/60 text-slate-900 text-xs font-bold shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      <span>{hall.rating}</span>
                    </div>

                    {/* Advance Required Tag */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md text-amber-300 text-xs font-medium border border-amber-500/25 shadow-sm">
                      Advance: <span className="font-bold text-white">{formatINR(hall.advanceBookingAmount)}</span>
                    </div>

                    {/* Owner Marker for Logged In Partner */}
                    {Boolean(currentUser && ((currentUser.ownerId && currentUser.ownerId === hall.ownerId) || (currentUser.id && currentUser.id === hall.ownerId))) && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 text-[#D4AF37] text-[11px] font-semibold border border-amber-500/30 backdrop-blur-md shadow-sm">
                        <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Your Listed Venue</span>
                      </div>
                    )}
                  </div>

                  {/* Hall Details Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
                        {hall.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-normal">
                        {hall.tagline || hall.location}
                      </p>

                      {/* Specs pills */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span>{hall.capacity.toLocaleString()} Pax</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                          <Maximize2 className="w-4 h-4 text-slate-500" />
                          <span>{hall.sqft ? hall.sqft.toLocaleString() : '15,000'} sq.ft</span>
                        </div>
                      </div>

                      {/* Amenities snippet */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {hall.amenities && hall.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/50"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hall.amenities && hall.amenities.length > 3 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            +{hall.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Full Rental</span>
                        <span className="text-base font-bold text-slate-900">
                          {formatINR(hall.pricePerDay)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedHall(hall)}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-colors border border-slate-200/60"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleBookClick(hall)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ESCROW ASSURANCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/[0.07] rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="hidden sm:flex shrink-0 w-20 h-20 rounded-2xl bg-slate-950 border border-amber-500/40 p-1.5 items-center justify-center shadow-xl">
                <img 
                  src="/images/banquora-badge-circle.png" 
                  alt="Banquora Official Escrow Seal" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-[#D4AF37] text-xs font-semibold border border-amber-400/20">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Date Protection Guarantee</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                  Official Platform Escrow Protection
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
                  Your advance booking token is safely deposited in the official platform escrow. Your reservation date is locked and held securely until the booking is confirmed with the venue management.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59A27] hover:brightness-105 text-slate-950 font-bold text-xs shadow-md transition-all text-center"
              >
                Track Existing Reservation
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
