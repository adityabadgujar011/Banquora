import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Users, 
  Maximize2, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HallDetailModal = () => {
  const { selectedHall, setSelectedHall, setBookingModalHall, requireAuth, formatINR } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!selectedHall) return null;

  const images = selectedHall.images && selectedHall.images.length > 0
    ? selectedHall.images
    : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"];

  const handleBookNow = () => {
    const hallToBook = selectedHall;
    requireAuth(
      'customer',
      () => {
        setSelectedHall(null);
        setBookingModalHall(hallToBook);
      },
      `Please log in to proceed with booking ${hallToBook.name}.`
    );
  };

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-slide-up max-h-[92vh] flex flex-col">
        
        {/* Header Close Button */}
        <button
          onClick={() => setSelectedHall(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-slate-200/80 text-slate-700 hover:text-slate-950 hover:bg-white flex items-center justify-center transition-all shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Main Photo Carousel */}
          <div className="relative h-72 sm:h-96 w-full bg-slate-100 overflow-hidden group">
            <img
              src={images[activeImageIdx]}
              alt={selectedHall.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

            {/* Carousel navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-white transition-all shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-white transition-all shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* City & Rating Badge Over Image */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3 text-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-semibold text-xs tracking-wide shadow-md border border-slate-700">
                    {selectedHall.city}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-md">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{selectedHall.rating} ({selectedHall.reviewCount} Reviews)</span>
                  </div>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  {selectedHall.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{selectedHall.location}</span>
                </p>
              </div>

              {/* Thumbnails preview */}
              {images.length > 1 && (
                <div className="hidden sm:flex items-center gap-2 bg-slate-950/60 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIdx === idx ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-center p-2">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-medium">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Max Capacity</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {selectedHall.capacity.toLocaleString()} Pax
                </p>
              </div>

              <div className="text-center p-2 border-l border-slate-200/80">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-medium">
                  <Maximize2 className="w-4 h-4 text-slate-600" />
                  <span>Venue Area</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {selectedHall.sqft ? selectedHall.sqft.toLocaleString() : '15,000'} sq.ft
                </p>
              </div>

              <div className="text-center p-2 border-l border-slate-200/80">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-medium">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <span>Full Rental</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {formatINR(selectedHall.pricePerDay)}
                </p>
              </div>

              <div className="text-center p-2 border-l border-slate-200/80 bg-amber-500/10 rounded-xl">
                <div className="flex items-center justify-center gap-1.5 text-[#A67F1A] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#A67F1A]" />
                  <span>Advance Token</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {formatINR(selectedHall.advanceBookingAmount)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                About The Estate
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {selectedHall.description || selectedHall.tagline}
              </p>
            </div>

            {/* Address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C59A27] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-slate-900">Physical Venue Location</p>
                <p className="text-slate-500 mt-0.5 font-normal leading-relaxed">{selectedHall.fullAddress}</p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Key Amenities & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedHall.amenities && selectedHall.amenities.map((amenity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Occasion Compatibility */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Ideal Celebrations & Gatherings
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedHall.eventTypes && selectedHall.eventTypes.map((type, idx) => {
                  const labelMap = {
                    wedding: "Grand Wedding Receptions",
                    birthday: "Milestone Birthdays",
                    retirement: "Formal Galas & Dinners",
                    sangeet: "Sangeet & Cocktail Soirees",
                    corporate: "Corporate Summits"
                  };
                  return (
                    <span 
                      key={`evt-${idx}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-medium"
                    >
                      {labelMap[type] || type}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Escrow Booking Assurance */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3.5 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-white">Banquora 100% Escrow Protection Guarantee</p>
                <p className="text-slate-300 leading-relaxed font-normal">
                  Your advance payment of {formatINR(selectedHall.advanceBookingAmount)} is held securely in the official platform escrow account. Once your UTR is verified, your date is confirmed and held directly with venue management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-medium">Advance Token to Hold Date</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {formatINR(selectedHall.advanceBookingAmount)}
              </span>
              <span className="text-xs text-slate-500 font-normal">
                (Full Rental: {formatINR(selectedHall.pricePerDay)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedHall(null)}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
            >
              <span>Reserve with Advance QR</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
