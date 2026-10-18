import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MapPin, 
  Trash2, 
  Eye, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  Calendar, 
  Check, 
  X,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRESET_GALLERIES, MAHARASHTRA_CITIES } from '../data/mockData';

export const OwnerPortal = () => {
  const { 
    currentUser,
    halls, 
    bookings, 
    activeOwnerId, 
    owners, 
    addHall, 
    deleteHall, 
    formatINR, 
    setSelectedHall,
    requireAuth,
    ownerApproveBooking,
    ownerRejectBooking
  } = useApp();

  const currentOwner = (currentUser && (currentUser.role === 'owner' || currentUser.ownerId) ? currentUser : null) || 
                       owners.find(o => o.id === activeOwnerId) || 
                       owners[0];

  const resolvedOwnerId = currentOwner.ownerId || currentOwner.id || activeOwnerId;

  // Filter halls owned by this owner
  const ownerHalls = halls.filter(h => h.ownerId === resolvedOwnerId || h.ownerId === activeOwnerId);
  const ownerHallIds = ownerHalls.map(h => h.id);

  // Filter bookings for this owner's halls
  const ownerBookings = bookings.filter(b => 
    b.ownerId === resolvedOwnerId || b.ownerId === activeOwnerId || ownerHallIds.includes(b.hallId)
  );

  const approvedBookings = ownerBookings.filter(b => b.status === 'approved');
  const pendingBookings = ownerBookings.filter(b => b.status === 'pending');

  const totalAdvanceEarned = approvedBookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0);

  // Toggle view between My Properties and All Banquora Venues
  const [portfolioTab, setPortfolioTab] = useState('my_properties'); // 'my_properties' | 'all_properties'

  // Add Hall Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPresetImage, setSelectedPresetImage] = useState(PRESET_GALLERIES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    city: 'Pune',
    location: '',
    fullAddress: '',
    capacity: 600,
    sqft: 15000,
    pricePerDay: 200000,
    advanceBookingAmount: 35000,
    description: '',
    amenities: [
      'Central Air Conditioning',
      'Stage & Mood Lighting',
      'Valet Parking',
      '100% Power Generator Backup'
    ],
    eventTypes: ['wedding', 'birthday', 'retirement'],
    stickers: ['Royal Wedding', 'Birthday Special', 'Formal Gala']
  });

  const availableOccasions = [
    { id: 'wedding', label: 'Wedding Receptions', sticker: 'Royal Wedding' },
    { id: 'birthday', label: 'Birthday Celebrations', sticker: 'Birthday Special' },
    { id: 'retirement', label: 'Retirement & Galas', sticker: 'Formal Gala' },
    { id: 'sangeet', label: 'Sangeet & Cocktails', sticker: 'Sangeet Soiree' },
    { id: 'corporate', label: 'Corporate Summits', sticker: 'Corporate Summit' }
  ];

  const availableAmenities = [
    'Central Air Conditioning',
    'Stage & Mood Lighting',
    'Bridal Dressing Suite',
    'Valet Parking (300+ Cars)',
    'In-House Master Chefs',
    'Live DJ & Sound System',
    '100% Power Generator Backup',
    'Luxury Guest Suites',
    'Helipad Access',
    'Private Lawn Access'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleCreateHall = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.pricePerDay || !formData.advanceBookingAmount) {
      alert('Please fill in Hall Name, Total Price, and Advance Booking Amount.');
      return;
    }

    let finalImage = customImageUrl.trim() ? customImageUrl.trim() : selectedPresetImage;
    if (finalImage.startsWith('images/')) {
      finalImage = '/' + finalImage;
    }

    await addHall({
      ...formData,
      images: [finalImage]
    });

    setIsAddModalOpen(false);
    setCustomImageUrl('');
    // Reset form
    setFormData({
      name: '',
      tagline: '',
      city: 'Pune',
      location: '',
      fullAddress: '',
      capacity: 600,
      sqft: 15000,
      pricePerDay: 200000,
      advanceBookingAmount: 35000,
      description: '',
      amenities: [
        'Central Air Conditioning',
        'Stage & Mood Lighting',
        'Valet Parking',
        '100% Power Generator Backup'
      ],
      eventTypes: ['Wedding', 'Grand Reception', 'Sangeet Night']
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* OWNER HEADER & PROFILE CARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentOwner.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
              alt={currentOwner.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0B152B] border border-[#D4AF37] flex items-center justify-center p-0.5 shadow-sm">
              <img src="/images/banquora-crest-gold-transparent.png" alt="Royal Partner" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 font-serif">
                {currentOwner.businessName || `${currentOwner.name} Estates`}
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Venue Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Managed by <span className="text-slate-800 font-medium">{currentOwner.name}</span> &bull; {currentOwner.phone || currentOwner.email || 'Verified Partner'}
            </p>
          </div>
        </div>

        {/* Add Hall CTA */}
        <div>
          <button
            onClick={() => requireAuth('owner', () => setIsAddModalOpen(true), 'Please log in as a Hall Owner to list a new banquet hall.')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>List New Property</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Your Listed Properties</span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {ownerHalls.length}
          </p>
          <span className="text-[11px] text-slate-500 font-normal">Live in platform catalog</span>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Confirmed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {approvedBookings.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Admin verified & locked</span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Advance Token Received</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatINR(totalAdvanceEarned)}
          </p>
          <span className="text-[11px] text-slate-500 font-normal">In escrow settlement</span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {pendingBookings.length}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">Under admin review</span>
        </div>
      </div>

      {/* SECTION 1: OWNER'S HALLS LIST & PLATFORM CATALOG */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              <span>
                {portfolioTab === 'my_properties' 
                  ? `Your Property Portfolio (${ownerHalls.length})` 
                  : `All Banquora Venues Catalog (${halls.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {portfolioTab === 'my_properties'
                ? `Venues registered and managed under ${currentOwner.businessName || currentOwner.name}`
                : `Showing all ${halls.length} verified banquet halls live on the Banquora platform`}
            </p>
          </div>

          {/* Toggle between My Properties & All Venues */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setPortfolioTab('my_properties')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                portfolioTab === 'my_properties'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Properties ({ownerHalls.length})
            </button>
            <button
              onClick={() => setPortfolioTab('all_properties')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                portfolioTab === 'all_properties'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Banquora Venues ({halls.length})
            </button>
          </div>
        </div>

        {/* Informative explanation banner */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Catalog Visibility: </span>
            {portfolioTab === 'my_properties' ? (
              <span>
                You are currently viewing <strong>My Properties</strong> ({ownerHalls.length} venues). These are venues specifically linked to your partner account. To view all {halls.length} venues that customers see in Customer View, switch to the <strong>All Banquora Venues</strong> tab above or click <strong>Explore Venues</strong> in the top navbar.
              </span>
            ) : (
              <span>
                You are currently viewing <strong>All Banquora Venues</strong> ({halls.length} venues across India). Venues marked with a gold <strong>Your Property</strong> badge belong to your account; other venues are managed by fellow verified partners.
              </span>
            )}
          </div>
        </div>

        {portfolioTab === 'my_properties' && ownerHalls.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No banquet halls listed under your account yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven't listed any venues under this owner account yet. Click "List New Property" to add your venue, or switch to "All Banquora Venues" to explore the platform catalog.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all"
              >
                List Your First Property
              </button>
              <button
                onClick={() => setPortfolioTab('all_properties')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all"
              >
                View All Banquora Venues ({halls.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(portfolioTab === 'my_properties' ? ownerHalls : halls).map((hall) => {
              const isMine = hall.ownerId === resolvedOwnerId || hall.ownerId === activeOwnerId;
              return (
                <div
                  key={hall.id}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-100">
                      <img
                        src={hall.images?.[0] || PRESET_GALLERIES[0].url}
                        alt={hall.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Ownership Badge */}
                      {isMine ? (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold border border-amber-500/30 shadow-sm">
                          <Crown className="w-3 h-3 text-[#D4AF37]" />
                          <span>Your Property</span>
                        </div>
                      ) : (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-medium border border-slate-200 shadow-sm">
                          Partner Venue
                        </div>
                      )}

                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-semibold border border-slate-200 shadow-sm">
                        {hall.city}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 truncate">{hall.name}</h3>
                        <p className="text-xs text-slate-500 truncate font-normal">{hall.location}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-semibold">Full Rent</span>
                          <span className="font-bold text-slate-900">{formatINR(hall.pricePerDay)}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-semibold">Advance Token</span>
                          <span className="font-bold text-slate-900">{formatINR(hall.advanceBookingAmount)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>Capacity: {hall.capacity} Pax</span>
                      </div>

                      {hall.stickers && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {hall.stickers.slice(0, 2).map((stk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60">
                              {stk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedHall(hall)}
                      className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Customer Preview</span>
                    </button>

                    {isMine ? (
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${hall.name}" from listings?`)) {
                            deleteHall(hall.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete Hall"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                        By {hall.ownerName || 'Verified Partner'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: INCOMING BOOKINGS FOR OWNER'S VENUES */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-700" />
              <span>Customer Booking Requests & Status ({ownerBookings.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live reservations for your properties with escrow clearance status
            </p>
          </div>
        </div>

        {ownerBookings.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs">
            No booking requests received yet.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Booking Ref</th>
                  <th className="px-5 py-4">Venue & Date</th>
                  <th className="px-5 py-4">Host Details</th>
                  <th className="px-5 py-4">Advance Token</th>
                  <th className="px-5 py-4">Transaction UTR</th>
                  <th className="px-5 py-4">Escrow Status</th>
                  <th className="px-5 py-4 text-center">Owner Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ownerBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      {b.referenceCode}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 truncate max-w-[180px]">{b.hallName}</p>
                      <p className="text-[11px] text-slate-500 font-normal">{b.eventDate} &bull; {b.guestCount} Pax</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-500">{b.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      {formatINR(b.advanceAmount)}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] font-medium text-slate-700">
                      {b.transactionId}
                    </td>
                    <td className="px-5 py-4">
                      {b.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Locked</span>
                        </span>
                      )}
                      {b.status === 'escrow_verified' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Escrow Paid • Action Required</span>
                        </span>
                      )}
                      {b.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Awaiting Admin Escrow</span>
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declined / Cancelled</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {b.status === 'escrow_verified' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => ownerApproveBooking(b.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                            title="Accept reservation and lock banquet date"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept & Lock Date</span>
                          </button>
                          <button
                            onClick={() => {
                              const reason = window.prompt('Please enter reason for declining (will be visible to customer):', 'Selected date is already reserved in our private offline register.');
                              if (reason) ownerRejectBooking(b.id, reason);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold transition-all flex items-center gap-1"
                            title="Decline this reservation request"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                      {b.status === 'pending' && (
                        <span className="text-[11px] text-slate-400 font-normal">Waiting Admin Escrow</span>
                      )}
                      {b.status === 'approved' && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="text-[11px] text-slate-400 font-normal">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW BANQUET HALL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-slide-up max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 flex items-center justify-center p-1.5 shadow-sm">
                  <img src="/images/banquora-crest-gold-transparent.png" alt="Banquora" className="w-full h-full object-contain filter drop-shadow" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-900">
                    List New Banquet Property
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Set pricing, required advance booking token, and luxury photo gallery
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateHall} className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6 custom-scrollbar">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  1. Venue Overview & Identity
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. The Grand Mirage Estate"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    >
                      {MAHARASHTRA_CITIES.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Tagline / Highlight
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="e.g. Sprawling lawns and majestic grand ballrooms"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Location Area *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Palace Road, Civil Lines"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Physical Address
                    </label>
                    <input
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. Plot 45, Royal Enclave, Jaipur"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Advance Tokens */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  2. Pricing & Required Advance Token
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Rental Price (₹/Day) *
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>

                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      Required Advance Token (₹) *
                    </label>
                    <input
                      type="number"
                      name="advanceBookingAmount"
                      required
                      value={formData.advanceBookingAmount}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Max Guests (Capacity) *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Area (Sq. Ft.)
                    </label>
                    <input
                      type="number"
                      name="sqft"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Gallery Selection */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  3. Luxury Photo Gallery (Preset Selection or Custom URL)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_GALLERIES.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetImage(preset.url);
                        setCustomImageUrl('');
                      }}
                      className={`relative h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedPresetImage === preset.url && !customImageUrl
                          ? 'border-slate-900 scale-[1.02] shadow-sm'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-[10px] font-medium text-white truncate">{preset.title}</span>
                      </div>
                      {selectedPresetImage === preset.url && !customImageUrl && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Or Enter Custom Photo URL
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  4. Select Included Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableAmenities.map((amenity) => {
                    const isChecked = formData.amenities.includes(amenity);
                    return (
                      <div
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Occasions & Stickers */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  5. Suitable Event Categories
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableOccasions.map((occ) => {
                    const isChecked = formData.eventTypes.includes(occ.id);
                    return (
                      <div
                        key={occ.id}
                        onClick={() => {
                          setFormData(prev => {
                            const exists = prev.eventTypes.includes(occ.id);
                            return {
                              ...prev,
                              eventTypes: exists ? prev.eventTypes.filter(e => e !== occ.id) : [...prev.eventTypes, occ.id],
                              stickers: exists ? prev.stickers.filter(s => s !== occ.sticker) : [...prev.stickers, occ.sticker]
                            };
                          });
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{occ.label}</span>
                        {isChecked && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                >
                  <span>Publish Property to Banquora</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
