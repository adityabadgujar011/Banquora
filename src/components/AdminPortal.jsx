import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, QrCode, TrendingUp, 
  CreditCard, Building2, Users, Copy, Check, AlertTriangle, 
  Search, Settings, BellRing, ExternalLink, Eye, FileSpreadsheet, 
  RotateCcw, Sparkles, Phone, Mail, Calendar, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { isAuthorizedAdminEmail } from '../lib/supabaseClient';

export const AdminPortal = () => {
  const { 
    currentUser,
    openLoginModal,
    switchRole,
    loginUser,
    setActiveOwnerId,
    bookings, halls, owners, paymentConfig, updatePaymentConfig, 
    approveBooking, rejectBooking, adminVerifyEscrow, formatINR, notifications, resetToDemoData 
  } = useApp();

  // Strict Authentication Guard
  if (!currentUser || currentUser.role !== 'admin' || !isAuthorizedAdminEmail(currentUser.email)) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center space-y-4 text-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 shadow-md flex items-center justify-center mx-auto p-2">
            <img src="/images/banquora-crest-gold-transparent.png" alt="Banquora Super Admin" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-slate-900">Super Admin Gateway</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            This control center is strictly restricted to verified platform administrators. Please sign in with an authorized administrator email ID.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={() => openLoginModal('Please sign in with your authorized administrator email.', null, 'admin')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Sign In as Admin
            </button>
            <button
              onClick={() => switchRole('customer')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold border border-slate-200 transition-colors"
            >
              Back to Customer View
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('approvals');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalBooking, setRejectModalBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('Payment UTR could not be verified in bank statement.');
  const [isEditingQR, setIsEditingQR] = useState(false);
  const [qrFormData, setQrFormData] = useState({
    upiId: paymentConfig.upiId,
    payeeName: paymentConfig.payeeName,
    bankName: paymentConfig.bankName,
    qrImageUrl: paymentConfig.qrImageUrl || ''
  });
  const [copiedUtr, setCopiedUtr] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedCredential, setCopiedCredential] = useState('');

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const escrowVerifiedBookings = bookings.filter(b => b.status === 'escrow_verified');
  const approvedBookings = bookings.filter(b => b.status === 'approved');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');

  const totalAdvanceCollected = approvedBookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0);
  const totalGMV = approvedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const pendingAdvanceInEscrow = pendingBookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0);

  const handleCopyUtr = (utr) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(''), 2500);
  };

  const handleSaveQRConfig = (e) => {
    e.preventDefault();
    updatePaymentConfig(qrFormData);
    setIsEditingQR(false);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (rejectModalBooking) {
      rejectBooking(rejectModalBooking.id, rejectReason);
      setRejectModalBooking(null);
      setRejectReason('Payment UTR could not be verified in bank statement.');
    }
  };

  const filteredAllBookings = bookings.filter(b => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch = searchQuery === '' ||
      b.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SUPER ADMIN HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 shadow-md flex items-center justify-center p-2">
            <img src="/images/banquora-crest-gold-transparent.png" alt="Banquora Escrow" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 font-serif">Super Admin Control Center</h1>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Live Escrow</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-normal flex items-center gap-1">
              <span>Review customer advance payments &bull; Validate UPI Transaction IDs &bull; Manage Escrow</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs shadow-sm">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Active Escrow UPI</span>
            <span className="font-mono text-slate-900 font-bold">{paymentConfig.upiId}</span>
          </div>
        </div>
      </div>

      {/* EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{pendingBookings.length}</p>
          <span className="text-[11px] text-amber-700 font-medium">{formatINR(pendingAdvanceInEscrow)} awaiting verification</span>
        </div>
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verified Advance</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{formatINR(totalAdvanceCollected)}</p>
          <span className="text-[11px] text-slate-500 font-normal">Across {approvedBookings.length} bookings</span>
        </div>
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Platform GMV Volume</span>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatINR(totalGMV)}</p>
          <span className="text-[11px] text-slate-500 font-normal">Venue booking value</span>
        </div>
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Listed Properties</span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{halls.length} <span className="text-xs text-slate-500 font-normal">halls / {owners.length} owners</span></p>
          <span className="text-[11px] text-slate-500 font-normal">Across destination cities</span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'approvals' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals ({pendingBookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('qr_config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'qr_config' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Escrow QR Config</span>
        </button>
        <button
          onClick={() => setActiveTab('all_bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all_bookings' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>All Bookings ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audit_logs' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Audit Stream ({notifications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('venue_owners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'venue_owners' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Venue Owners & Credentials ({owners.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Verification Queue: Customer Advance Payments</span>
              </h2>
              <p className="text-xs text-slate-500">
                Match customer submitted Transaction ID / UTR with your bank statement, then click Approve to lock date and alert the Hall Owner
              </p>
            </div>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900">No Pending Approvals</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All submitted customer bookings and advance payments have been verified and processed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((b) => (
                <div key={b.id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow transition-all space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold font-mono border border-slate-200 shadow-sm">
                        {b.referenceCode}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{b.hallName}</h3>
                        <p className="text-xs text-slate-500 font-normal">{b.hallCity} &bull; Event Date: <span className="text-slate-900 font-semibold">{b.eventDate}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Advance Amount Paid</span>
                      <span className="text-xl font-bold text-slate-900">{formatINR(b.advanceAmount)}</span>
                      <span className="text-[10px] text-slate-500 block font-normal">(Total: {formatINR(b.totalPrice)})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Customer Host</span>
                      <p className="text-slate-900 font-semibold text-sm">{b.customerName}</p>
                      <p className="text-slate-600 flex items-center gap-1.5 font-normal"><Phone className="w-3.5 h-3.5 text-slate-500" /><span>{b.customerPhone}</span></p>
                      <p className="text-slate-500 flex items-center gap-1.5 text-[11px]"><Mail className="w-3.5 h-3.5 text-slate-400" /><span className="truncate">{b.customerEmail}</span></p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Event Specs</span>
                      <p className="text-slate-800 font-semibold">{b.eventType}</p>
                      <p className="text-slate-600 flex items-center gap-1.5 font-normal"><Users className="w-3.5 h-3.5 text-slate-500" /><span>{b.guestCount} Guests Expected</span></p>
                      <p className="text-slate-500 flex items-center gap-1.5 text-[11px]"><Clock className="w-3.5 h-3.5 text-slate-400" /><span>{b.timeSlot}</span></p>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold text-slate-500">Customer Submitted UTR</span>
                        <button onClick={() => handleCopyUtr(b.transactionId)} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-900 font-medium">
                          {copiedUtr === b.transactionId ? (<><Check className="w-3 h-3 text-emerald-600" /><span className="text-emerald-700">Copied</span></>) : (<><Copy className="w-3 h-3 text-slate-400" /><span>Copy</span></>)}
                        </button>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-sm font-bold text-slate-900 truncate select-all">{b.transactionId}</div>
                      <p className="text-[10px] text-slate-500">Method: <span className="text-slate-800 font-medium">UPI QR Scanner</span> &bull; {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">Customer Note: </span>{b.notes}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verifying escrow locks payment and asks the Hall Owner to confirm date reservation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setRejectModalBooking(b)} className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold transition-all">
                        Reject UTR
                      </button>
                      <button onClick={() => adminVerifyEscrow(b.id)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verify Escrow & Send to Hall Owner</span>
                      </button>
                      <button onClick={() => approveBooking(b.id)} className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-all" title="Direct Admin Override">
                        Direct Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-section: Bookings waiting for Hall Owner acceptance */}
          {escrowVerifiedBookings.length > 0 && (
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>With Hall Owners for Final Date Confirmation ({escrowVerifiedBookings.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Escrow payment verified. Hall owners have been notified to review and officially lock their venue calendar.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {escrowVerifiedBookings.map((b) => (
                  <div key={b.id} className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 font-mono font-bold text-slate-900">{b.referenceCode}</span>
                      <div>
                        <span className="font-semibold text-slate-900">{b.hallName}</span>
                        <span className="text-slate-500 text-[11px] block">{b.eventDate} &bull; Customer: {b.customerName} ({b.customerPhone})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-700">{formatINR(b.advanceAmount)} in Escrow</span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold uppercase tracking-wider">Awaiting Owner Lock</span>
                      <button onClick={() => approveBooking(b.id)} className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-lg text-[11px]">
                        Admin Force Lock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QR SCANNER MANAGEMENT */}
      {activeTab === 'qr_config' && (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-slate-700" />
                <span>Super Admin Payment QR & UPI Gateway Configuration</span>
              </h2>
              <p className="text-xs text-slate-500">
                Update the official UPI ID, Payee details, or custom QR image displayed to customers during advance payment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4">
              <form onSubmit={handleSaveQRConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Platform Super Admin UPI ID *</label>
                  <input
                    type="text"
                    value={qrFormData.upiId}
                    onChange={(e) => setQrFormData(prev => ({ ...prev, upiId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                    placeholder="thakareanant994@okhdfcbank"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">All customer scan payments will be dynamically routed to this UPI ID.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Merchant / Registered Payee Name *</label>
                  <input
                    type="text"
                    value={qrFormData.payeeName}
                    onChange={(e) => setQrFormData(prev => ({ ...prev, payeeName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Escrow Settlement Bank Account Name</label>
                  <input
                    type="text"
                    value={qrFormData.bankName}
                    onChange={(e) => setQrFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Custom QR Graphic URL (Optional)</label>
                  <input
                    type="text"
                    value={qrFormData.qrImageUrl}
                    onChange={(e) => setQrFormData(prev => ({ ...prev, qrImageUrl: e.target.value }))}
                    placeholder="/images/escrow-scanner.png or https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C59A27] transition-all"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all">
                    Save & Apply To All Customer Modals
                  </button>
                </div>
              </form>
            </div>
            <div className="md:col-span-5 flex flex-col items-center p-6 bg-slate-50 border border-slate-100 rounded-3xl">
              <span className="text-[10px] uppercase font-semibold text-slate-500 mb-3 tracking-wider">Live Customer QR Preview (Sample ₹50,000)</span>
              <QRCodeDisplay upiId={qrFormData.upiId} payeeName={qrFormData.payeeName} amount={50000} customQrUrl={qrFormData.qrImageUrl} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALL BOOKINGS DIRECTORY */}
      {activeTab === 'all_bookings' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-slate-700" />
                <span>Global Bookings Registry ({filteredAllBookings.length})</span>
              </h2>
              <p className="text-xs text-slate-500">Complete historical view of customer bookings across all banquet halls</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ref, customer, hall, UTR..."
                  className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C59A27] transition-all"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Admin</option>
                <option value="escrow_verified">Escrow Verified (With Owner)</option>
                <option value="approved">Approved & Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Ref Code</th>
                  <th className="px-5 py-4">Banquet Venue</th>
                  <th className="px-5 py-4">Customer & Phone</th>
                  <th className="px-5 py-4">Event Date</th>
                  <th className="px-5 py-4">Advance</th>
                  <th className="px-5 py-4">Transaction UTR</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAllBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{b.referenceCode}</td>
                    <td className="px-5 py-4 font-medium text-slate-800 truncate max-w-[160px]">{b.hallName}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-500">{b.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-800 font-medium">{b.eventDate}</td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{formatINR(b.advanceAmount)}</td>
                    <td className="px-5 py-4 font-mono text-[11px] font-medium text-slate-700">{b.transactionId}</td>
                    <td className="px-5 py-4">
                      {b.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /><span>Approved</span>
                        </span>
                      )}
                      {b.status === 'escrow_verified' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" /><span>Escrow Verified</span>
                        </span>
                      )}
                      {b.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /><span>Pending</span>
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" /><span>Rejected</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {b.status === 'pending' && (
                        <button onClick={() => adminVerifyEscrow(b.id)} className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] rounded-xl shadow-sm">
                          Verify Escrow
                        </button>
                      )}
                      {b.status === 'escrow_verified' && (
                        <span className="text-blue-600 font-semibold text-[11px]">With Owner</span>
                      )}
                      {(b.status === 'approved' || b.status === 'rejected') && (
                        <span className="text-slate-400 text-[11px] font-normal">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE DISPATCH & NOTIFICATION STREAM */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-slate-700" />
                <span>Live Audit & Automated Dispatch Stream</span>
              </h2>
              <p className="text-xs text-slate-500">Log of automated alerts dispatched to Hall Owners and Customers upon transaction approval</p>
            </div>
          </div>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 text-xs shadow-sm">
                <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{new Date(n.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed font-normal">{n.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200 uppercase">Recipient: {n.recipientRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VENUE OWNERS DIRECTORY & CREDENTIALS */}
      {activeTab === 'venue_owners' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-700" />
                <span>Banquet Hall Owners Directory & Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Access official login IDs and passwords for all 6 banquet hall owners. You can copy credentials or click directly to log in as any owner.
              </p>
            </div>
            <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-medium">
              Universal Default Password: <span className="font-mono font-bold">owner123</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {owners.map((owner) => {
              const ownerAssignedHalls = halls.filter(h => h.ownerId === owner.id);
              const isRevealed = !!revealedPasswords[owner.id];
              const isCopied = copiedCredential === owner.email;

              return (
                <div key={owner.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow transition-all space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={owner.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'} 
                          alt={owner.name} 
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-900 text-base">{owner.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">{owner.businessName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {owner.id}
                      </span>
                    </div>

                    {/* Credentials Card */}
                    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Login ID / Email:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 select-all">{owner.email}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(owner.email);
                              setCopiedCredential(owner.email);
                              setTimeout(() => setCopiedCredential(''), 2000);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                            title="Copy Email"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {owner.alternateEmail && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-500">Alternate Login:</span>
                          <span className="font-mono text-slate-700">{owner.alternateEmail}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Account Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                            {isRevealed ? (owner.password || 'owner123') : '••••••••'}
                          </span>
                          <button
                            onClick={() => setRevealedPasswords(prev => ({ ...prev, [owner.id]: !prev[owner.id] }))}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                            title={isRevealed ? "Hide password" : "Show password"}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(owner.password || 'owner123');
                              setCopiedCredential(owner.id + '_pwd');
                              setTimeout(() => setCopiedCredential(''), 2000);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                            title="Copy password"
                          >
                            {copiedCredential === owner.id + '_pwd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Official Phone:</span>
                        <span className="font-mono font-medium text-slate-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {owner.phone}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Properties */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Owned Banquet Halls ({ownerAssignedHalls.length}):
                      </span>
                      <div className="space-y-1.5">
                        {ownerAssignedHalls.map(h => (
                          <div key={h.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                            <span className="font-semibold text-slate-800 truncate">{h.name}</span>
                            <span className="text-[11px] text-slate-500 shrink-0 ml-2 font-medium">{h.city}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Direct Switch / Login Action */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        const ownerAccount = {
                          id: 'acc_' + owner.id,
                          name: owner.name,
                          businessName: owner.businessName,
                          email: owner.email,
                          phone: owner.phone,
                          role: 'owner',
                          ownerId: owner.id
                        };
                        loginUser(ownerAccount);
                        setActiveOwnerId(owner.id);
                        switchRole('owner');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Log In Directly as {owner.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-slide-up">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-semibold text-slate-900">Reject Booking {rejectModalBooking.referenceCode}</h3>
            </div>
            <p className="text-xs text-slate-600 font-normal">
              Customer <span className="text-slate-900 font-semibold">{rejectModalBooking.customerName}</span> submitted UTR <span className="font-mono text-slate-900 font-bold">{rejectModalBooking.transactionId}</span>.
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Reason for Rejection (Visible to Customer)</label>
                <textarea
                  rows="3"
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-rose-500 transition-all"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRejectModalBooking(null)} className="px-4 py-2 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow transition-colors">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
