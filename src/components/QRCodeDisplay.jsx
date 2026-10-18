import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

export const QRCodeDisplay = ({ upiId, payeeName, amount, customQrUrl }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'qr_only'

  // Formatted UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Banquora Advance Booking')}`;
  
  // Check if custom uploaded QR / scanner image is provided
  const hasCustomQr = Boolean(
    customQrUrl && (
      customQrUrl.startsWith('http') || 
      customQrUrl.startsWith('/') || 
      customQrUrl.startsWith('data:')
    )
  );

  // Resolved image sources
  const fullScannerUrl = hasCustomQr ? customQrUrl : '/images/escrow-scanner.png';
  const qrCodeOnlyUrl = '/images/escrow-qr-code.png';

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* QR Scanner Card Frame */}
      <div className="relative p-5 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 flex flex-col items-center max-w-[310px] w-full transition-all">
        
        {/* Header Tag */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold tracking-wide border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>OFFICIAL ESCROW QR</span>
          </div>

          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Google Pay / UPI
          </span>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="mb-3 flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/70 text-[11px] font-semibold w-full">
          <button
            type="button"
            onClick={() => setViewMode('card')}
            className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
              viewMode === 'card' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Verified Scanner
          </button>
          <button
            type="button"
            onClick={() => setViewMode('qr_only')}
            className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
              viewMode === 'qr_only' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Large QR
          </button>
        </div>

        {/* QR Code Container */}
        <div className="relative bg-slate-50 p-2.5 rounded-2xl shadow-inner border border-slate-200/80 group flex items-center justify-center overflow-hidden w-full">
          {viewMode === 'card' ? (
            <img 
              src={fullScannerUrl} 
              alt="Anant Thakare Google Pay UPI Scanner" 
              className="w-full max-w-[260px] h-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/escrow-qr-code.png';
              }}
            />
          ) : (
            <img 
              src={qrCodeOnlyUrl} 
              alt="Anant Thakare UPI QR Code" 
              className="w-52 h-52 object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl=${encodeURIComponent(upiUri)}`;
              }}
            />
          )}
        </div>

        {/* Amount Badge */}
        <div className="mt-3.5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Exact Advance Amount</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            ₹{Number(amount).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* UPI ID Copy Bar */}
      <div className="mt-3.5 w-full max-w-[310px] bg-white border border-slate-200/90 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-sm">
        <div className="min-w-0 pl-1.5">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Escrow UPI ID</p>
          <p className="text-xs font-mono font-medium text-slate-800 truncate select-all">{upiId}</p>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            copied
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Payee Info & Supported Apps */}
      <div className="mt-2 text-center text-xs text-slate-500 space-y-0.5">
        <div>
          <span className="text-slate-400">Verified Platform Escrow Payee:</span>{' '}
          <span className="text-slate-900 font-semibold">{payeeName}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          Official Escrow Account &bull; Direct Hall Owner Contact Unlocks After Admin Approval
        </p>
      </div>
    </div>
  );
};

