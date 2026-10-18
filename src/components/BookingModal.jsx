import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Phone, 
  Mail, 
  User, 
  Crown,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QRCodeDisplay } from './QRCodeDisplay';

export const BookingModal = () => {
  const { 
    bookingModalHall, 
    setBookingModalHall, 
    paymentConfig, 
    createBooking, 
    formatINR,
    setIsTrackerOpen,
    setTrackingReference,
    currentUser
  } = useApp();

  const [step, setStep] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10-minute payment countdown
  const [createdBooking, setCreatedBooking] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: currentUser?.name || '',
    customerPhone: currentUser?.phone || '',
    customerEmail: currentUser?.email || '',
    eventType: 'Wedding & Grand Reception',
    eventDate: '',
    timeSlot: 'Full Day (9:00 AM - Midnight)',
    guestCount: 500,
    transactionId: '',
    notes: ''
  });

  // Sync if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        customerPhone: prev.customerPhone || currentUser.phone || '',
        customerEmail: prev.customerEmail || currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const [formErrors, setFormErrors] = useState({});

  // Countdown timer for step 2
  useEffect(() => {
    let interval = null;
    if (step === 2 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  if (!bookingModalHall) return null;

  const advanceAmount = bookingModalHall.advanceBookingAmount || 25000;
  const totalPrice = bookingModalHall.pricePerDay || 150000;

  // Format timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = 'Contact phone number is required';
    } else if (formData.customerPhone.trim().length < 10) {
      errors.customerPhone = 'Enter a valid 10-digit phone number';
    }
    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email address is required';
    } else if (!formData.customerEmail.includes('@')) {
      errors.customerEmail = 'Enter a valid email address';
    }
    if (!formData.eventDate) errors.eventDate = 'Event date is required';
    if (!formData.guestCount || formData.guestCount < 1) errors.guestCount = 'Guest count is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation (Transaction ID)
  const validateStep3 = () => {
    const errors = {};
    if (!formData.transactionId.trim()) {
      errors.transactionId = 'UPI Transaction ID / UTR Number is required';
    } else if (formData.transactionId.trim().length < 6) {
      errors.transactionId = 'Transaction ID must be at least 6 characters long';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePaidProceedToForm = () => {
    setStep(3);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (validateStep3()) {
      const newBooking = await createBooking({
        hallId: bookingModalHall.id,
        hallName: bookingModalHall.name,
        hallCity: bookingModalHall.city || bookingModalHall.hallCity || 'Pune',
        ownerId: bookingModalHall.ownerId || 'owner_1',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        timeSlot: formData.timeSlot,
        guestCount: Number(formData.guestCount),
        advanceAmount: advanceAmount,
        totalPrice: totalPrice,
        totalAmount: totalPrice,
        transactionId: formData.transactionId.trim().toUpperCase(),
        notes: formData.notes
      });
      setCreatedBooking(newBooking);
      setStep(4);
    }
  };

  const handleTrackBooking = () => {
    if (createdBooking) {
      setTrackingReference(createdBooking.referenceCode);
      setBookingModalHall(null);
      setIsTrackerOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-slide-up max-h-[94vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 shadow-sm flex items-center justify-center p-1.5">
              <img src="/images/banquora-crest-gold-transparent.png" alt="Banquora" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-900">
                Reserve {bookingModalHall.name}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {bookingModalHall.city} &bull; Required Advance Token: <span className="text-slate-900 font-bold">{formatINR(advanceAmount)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setBookingModalHall(null)}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between max-w-md mx-auto">
            
            {/* Step 1 Pill */}
            <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                1
              </span>
              <span className="hidden sm:inline">Details</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 ${step >= 2 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>

            {/* Step 2 Pill */}
            <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                2
              </span>
              <span className="hidden sm:inline">QR Scan</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 ${step >= 3 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>

            {/* Step 3 Pill */}
            <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                3
              </span>
              <span className="hidden sm:inline">Submit UTR</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 ${step === 4 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>

            {/* Step 4 Pill */}
            <div className={`flex items-center gap-2 text-xs font-semibold ${step === 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                ✓
              </span>
              <span className="hidden sm:inline">Confirmed</span>
            </div>

          </div>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 custom-scrollbar">

          {/* STEP 1: EVENT DETAILS FORM */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-5 animate-fade-in">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 flex items-center justify-between shadow-sm">
                <div className="text-xs">
                  <span className="text-slate-500 font-normal">Total Venue Rental: </span>
                  <span className="text-slate-900 font-bold">{formatINR(totalPrice)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500 font-normal">Advance Token to Hold Date: </span>
                  <span className="text-slate-900 font-bold text-sm">{formatINR(advanceAmount)}</span>
                </div>
              </div>

              {/* Escrow Host Privacy Banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 shadow-xs mb-4">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-normal leading-relaxed">
                  <strong className="font-semibold text-amber-950">Escrow Privacy Notice:</strong> Banquet hall owner's direct contact details (Name & Phone Number) are held under Escrow Protection and will be unlocked automatically once your advance payment is approved by the Admin.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Your Full Name (Customer / Guest) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Vikram Sharma"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all ${
                        formErrors.customerName ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.customerName && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.customerName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Your Contact Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all ${
                        formErrors.customerPhone ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.customerPhone && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.customerPhone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="e.g. host@domain.com"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all ${
                        formErrors.customerEmail ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.customerEmail && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.customerEmail}</p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Occasion / Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                  >
                    <option value="Royal Wedding & Grand Reception">Wedding & Grand Reception</option>
                    <option value="Birthday & Jubilee Bash">Birthday & Jubilee Bash</option>
                    <option value="Formal Gala & Retirement Celebration">Formal Gala & Retirement</option>
                    <option value="Sangeet & Cocktail Soiree">Sangeet & Cocktail Soiree</option>
                    <option value="Engagement & Ring Ceremony">Engagement & Ring Ceremony</option>
                    <option value="Corporate Annual Summit">Corporate Annual Summit</option>
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Event Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      name="eventDate"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all ${
                        formErrors.eventDate ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.eventDate && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.eventDate}</p>
                  )}
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Expected Guests (Max: {bookingModalHall.capacity}) *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      name="guestCount"
                      max={bookingModalHall.capacity}
                      min="10"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      placeholder="e.g. 500"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all ${
                        formErrors.guestCount ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.guestCount && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.guestCount}</p>
                  )}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Slot Timing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Morning (8:00 AM - 3:00 PM)',
                    'Evening (5:00 PM - Midnight)',
                    'Full Day (9:00 AM - Midnight)'
                  ].map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                      className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                        formData.timeSlot === slot
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Special Notes or Decor Preferences (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Specific stage setup, catering staging requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C59A27] transition-all"
                ></textarea>
              </div>

              {/* Bottom Action */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                >
                  <span>Proceed to Advance Payment QR</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT SCANNER VIEW */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Payment Timer Alert */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Official Payment QR Active. Complete payment within:</span>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left: QR Display Component */}
                <div className="md:col-span-6 flex justify-center">
                  <QRCodeDisplay
                    upiId={paymentConfig.upiId}
                    payeeName={paymentConfig.payeeName}
                    amount={advanceAmount}
                    customQrUrl={paymentConfig.qrImageUrl}
                  />
                </div>

                {/* Right: Payment Instructions Guide */}
                <div className="md:col-span-6 space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-slate-600" />
                      <span>How To Pay Advance</span>
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-4 leading-relaxed font-normal">
                      <li>
                        Open any UPI App (<span className="text-slate-900 font-semibold">GPay, PhonePe, Paytm, CRED</span>).
                      </li>
                      <li>
                        Scan the official QR Code or copy the UPI ID (<code className="text-slate-900 font-mono font-medium select-all">{paymentConfig.upiId}</code>).
                      </li>
                      <li>
                        Pay the exact advance amount of <span className="text-slate-900 font-bold">{formatINR(advanceAmount)}</span>.
                      </li>
                      <li>
                        Note down the <span className="text-slate-900 font-semibold">12-Digit UTR / Transaction ID</span> from your payment receipt.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200/70 rounded-2xl text-xs text-emerald-800 font-medium flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Your advance is held securely in platform escrow. Once you submit the UTR, Super Admin verifies the deposit and locks your date immediately.
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-700 text-xs font-medium hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Details</span>
                </button>

                <button
                  type="button"
                  onClick={handlePaidProceedToForm}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                >
                  <span>I Have Paid &rarr; Enter Transaction UTR</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION ID SUBMISSION FORM */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-5 animate-fade-in">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 font-normal">Advance Token:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatINR(advanceAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-normal">Venue & Date:</span>
                  <span className="font-semibold text-slate-800">{bookingModalHall.name} &bull; {formData.eventDate}</span>
                </div>
              </div>

              {/* UTR Number Input */}
              <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800">
                    Bank Transaction ID (UTR / Reference Number) *
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">Found in UPI App receipt</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="e.g. 321849102834 or TXN9876543210"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-mono tracking-wider text-slate-900 placeholder-slate-400 font-semibold uppercase focus:outline-none focus:border-[#C59A27] transition-all ${
                      formErrors.transactionId ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                </div>
                {formErrors.transactionId && (
                  <p className="text-[11px] text-rose-500 font-medium">{formErrors.transactionId}</p>
                )}

                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  Please ensure you enter the exact 12-digit UTR or Transaction ID provided by your UPI App (Google Pay / PhonePe / Paytm) for automated verification.
                </p>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-700 text-xs font-medium hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to QR</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Submit Booking For Admin Verification</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: BOOKING CONFIRMATION & TRACKING */}
          {step === 4 && createdBooking && (
            <div className="text-center py-4 space-y-6 animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
                  Pending Admin Verification
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 mt-3">
                  Reservation Submitted Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 font-normal">
                  Thank you, <span className="text-slate-900 font-semibold">{createdBooking.customerName}</span>. Your advance payment reference has been securely dispatched to the platform admin.
                </p>
              </div>

              {/* Reference Box */}
              <div className="max-w-md mx-auto p-6 bg-slate-50 border border-slate-200/90 rounded-3xl shadow-sm space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Your Unique Booking Reference Code
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tracking-wider select-all">
                    {createdBooking.referenceCode}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2.5 text-xs text-left">
                  <div>
                    <span className="text-slate-400 font-normal">Venue:</span>
                    <p className="text-slate-800 font-semibold truncate">{createdBooking.hallName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Date:</span>
                    <p className="text-slate-800 font-semibold">{createdBooking.eventDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Advance Token:</span>
                    <p className="text-emerald-700 font-bold">{formatINR(createdBooking.advanceAmount)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Transaction UTR:</span>
                    <p className="text-slate-800 font-mono text-[11px] truncate font-semibold">{createdBooking.transactionId}</p>
                  </div>
                </div>
              </div>

              {/* Banquet Hall Owner Locked Banner */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Banquet Hall Owner Details:</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                    Locked Under Escrow
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-normal">
                  The banquet hall owner's direct contact name and phone number will be revealed in your <strong>Reservation Tracker</strong> as soon as the Super Admin verifies and approves your advance payment.
                </p>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleTrackBooking}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Track Live Verification Status</span>
                </button>
                <button
                  onClick={() => setBookingModalHall(null)}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200 transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
