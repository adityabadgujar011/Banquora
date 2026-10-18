import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  Ticket,
  Sparkles,
  Building2,
  Phone,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookingTrackerModal = () => {
  const { 
    isTrackerOpen, 
    setIsTrackerOpen, 
    trackingReference, 
    setTrackingReference, 
    bookings, 
    halls,
    owners,
    formatINR 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(trackingReference || '');
  const [searchedBooking, setSearchedBooking] = useState(() => {
    if (trackingReference) {
      return bookings.find(b => 
        b.referenceCode?.toLowerCase() === trackingReference.toLowerCase() ||
        b.transactionId?.toLowerCase() === trackingReference.toLowerCase()
      ) || null;
    }
    return null;
  });

  // Resolve banquet hall owner details
  const getOwnerInfo = (booking) => {
    if (!booking) return { name: '', phone: '' };
    const hall = halls?.find(h => h.id === booking.hallId || h.name?.toLowerCase() === booking.hallName?.toLowerCase());
    const owner = owners?.find(o => o.id === booking.ownerId || o.id === hall?.ownerId);
    return {
      name: booking.ownerName || hall?.ownerName || owner?.businessName || owner?.name || 'Authorized Venue Partner',
      phone: booking.ownerPhone || hall?.ownerPhone || owner?.phone || '+91 98201 12345'
    };
  };

  const ownerInfo = searchedBooking ? getOwnerInfo(searchedBooking) : null;

  if (!isTrackerOpen) return null;

  const handleSearch = (e) => {
    e?.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = bookings.find(b => 
      b.referenceCode.toLowerCase() === query ||
      b.id.toLowerCase() === query ||
      b.transactionId?.toLowerCase() === query ||
      b.customerPhone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
    );

    setSearchedBooking(found || null);
  };

  const handleSelectRecent = (booking) => {
    setSearchQuery(booking.referenceCode);
    setSearchedBooking(booking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-slide-up max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 shadow-sm flex items-center justify-center p-1.5">
              <img src="/images/banquora-crest-gold-transparent.png" alt="Banquora" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-900">
                Track Reservation Status
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Check real-time escrow verification and date confirmation
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsTrackerOpen(false);
              setTrackingReference('');
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar Container */}
        <div className="p-6 bg-white border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Reference Code (e.g. BQ-84910), UTR, or Phone Number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick chips for latest 3 bookings */}
          <div className="mt-3.5 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500">
            <span className="shrink-0 text-slate-400 font-medium">Recent Reservations:</span>
            {bookings.slice(0, 3).map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectRecent(b)}
                className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-mono font-medium shrink-0 transition-colors"
              >
                {b.referenceCode} ({b.customerName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Status Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 custom-scrollbar">
          {searchedBooking ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Status Header Badge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Booking Reference
                  </span>
                  <h4 className="text-xl font-mono font-bold text-slate-900">
                    {searchedBooking.referenceCode}
                  </h4>
                </div>

                <div>
                  {searchedBooking.status === 'approved' && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>APPROVED & CONFIRMED</span>
                    </span>
                  )}
                  {searchedBooking.status === 'escrow_verified' && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 shadow-sm animate-pulse">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>ESCROW VERIFIED • WITH HALL OWNER</span>
                    </span>
                  )}
                  {searchedBooking.status === 'pending' && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>PENDING ADMIN VERIFICATION</span>
                    </span>
                  )}
                  {searchedBooking.status === 'rejected' && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>RESERVATION CANCELLED</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Verification Lifecycle
                </p>

                <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-2">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white"></div>
                    <p className="text-xs font-semibold text-slate-900">1. Advance Payment Submitted via QR</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Transaction UTR: <span className="text-slate-800 font-mono font-medium">{searchedBooking.transactionId}</span> &bull; {new Date(searchedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                      searchedBooking.status === 'approved' || searchedBooking.status === 'escrow_verified' ? 'bg-emerald-600' :
                      searchedBooking.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                    }`}></div>
                    <p className="text-xs font-semibold text-slate-900">2. Escrow Bank UTR Settlement Check</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {(searchedBooking.status === 'approved' || searchedBooking.status === 'escrow_verified') && 'Payment verified in platform escrow bank account by Super Admin.'}
                      {searchedBooking.status === 'pending' && 'Platform Admin is verifying transaction settlement in real-time.'}
                      {searchedBooking.status === 'rejected' && `Verification failed: ${searchedBooking.statusNote}`}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                      searchedBooking.status === 'approved' ? 'bg-emerald-600' :
                      searchedBooking.status === 'escrow_verified' ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'
                    }`}></div>
                    <p className="text-xs font-semibold text-slate-900">3. Venue Owner Official Acceptance & Date Lock</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {searchedBooking.status === 'approved' && 'Accepted & confirmed by Banquet Hall Owner. Date locked in private registry.'}
                      {searchedBooking.status === 'escrow_verified' && 'Advance verified. Banquet Hall Owner has received request to accept & lock date.'}
                      {searchedBooking.status === 'pending' && 'Awaiting completion of admin escrow verification step.'}
                      {searchedBooking.status === 'rejected' && 'Booking was cancelled without date reservation.'}
                    </p>
                  </div>

                </div>
              </div>

              {/* ========================================================= */}
              {/* BANQUET HALL OWNER CONTACT (UNLOCKED UPON APPROVAL)        */}
              {/* ========================================================= */}
              {searchedBooking.status === 'approved' ? (
                <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/80 border border-emerald-300 space-y-4 shadow-sm text-left animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Advance Payment Verified & Approved
                        </span>
                        <h5 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                          Banquet Hall Owner Contact Unlocked
                        </h5>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide uppercase border border-emerald-300 shadow-xs">
                      Verified Host
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-white rounded-2xl border border-emerald-200/90 shadow-xs">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                        Banquet Hall Owner / Management
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {ownerInfo.name}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-emerald-200/90 shadow-xs">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                        Direct Phone / WhatsApp
                      </span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 mt-1">
                        {ownerInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={`tel:${ownerInfo.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Call Hall Owner</span>
                    </a>
                    <a
                      href={`https://wa.me/${ownerInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, my booking for ${searchedBooking.hallName} on ${searchedBooking.eventDate} (Ref: ${searchedBooking.referenceCode}) has been verified and approved by Banquora.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Owner</span>
                    </a>
                  </div>

                  <p className="text-[11px] text-emerald-900/90 font-normal leading-relaxed pt-1.5 border-t border-emerald-200">
                    🎉 <strong>Your Date is Officially Locked:</strong> You can now call or WhatsApp the venue owner directly for stage setup planning, caterer entry passes, and key handover.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 text-left shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Banquet Hall Owner Contact:</span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      Locked Under Escrow
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    To prevent unverified bookings and guarantee 100% deposit safety, the banquet hall owner's direct contact name and phone number will unlock automatically once the Super Admin verifies your advance payment UTR.
                  </p>
                </div>
              )}

              {/* Booking Voucher Summary Box */}
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <img src="/images/banquora-badge-circle.png" alt="Banquora Official Seal" className="w-10 h-10 object-contain shadow-sm rounded-full" />
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{searchedBooking.hallName}</h5>
                      <p className="text-xs text-slate-500">{searchedBooking.hallCity}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-medium">
                    {searchedBooking.eventType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-normal">Customer Name:</span>
                    <p className="text-slate-800 font-semibold">{searchedBooking.customerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Customer Phone:</span>
                    <p className="text-slate-800 font-semibold">{searchedBooking.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Event Date:</span>
                    <p className="text-slate-800 font-semibold">{searchedBooking.eventDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Timing Slot:</span>
                    <p className="text-slate-800 font-semibold">{searchedBooking.timeSlot}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Guests Expected:</span>
                    <p className="text-slate-800 font-semibold">{searchedBooking.guestCount} Guests</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Advance Token Paid:</span>
                    <p className="text-emerald-700 font-bold text-sm">{formatINR(searchedBooking.advanceAmount)}</p>
                  </div>

                  {/* Hall Owner Details in Voucher */}
                  {searchedBooking.status === 'approved' ? (
                    <>
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-400 font-normal">Hall Owner / Management:</span>
                        <p className="text-emerald-800 font-bold">{ownerInfo.name}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-400 font-normal">Owner Contact Phone:</span>
                        <p className="text-emerald-800 font-bold font-mono">{ownerInfo.phone}</p>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 pt-2 border-t border-slate-200">
                      <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Hall Owner direct name and phone will be printed on this voucher upon Admin Approval.</span>
                      </div>
                    </div>
                  )}
                </div>

                {searchedBooking.statusNote && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Status Note: </span>
                    {searchedBooking.statusNote}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Voucher</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">No Reservation Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Enter your Booking Reference Code (e.g. BQ-84910) or Transaction ID above to track live verification status.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
