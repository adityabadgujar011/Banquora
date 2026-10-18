import React, { useState, useRef, useEffect } from 'react';
import { 
  Crown, 
  Search, 
  ShieldAlert, 
  Building2, 
  ChevronDown,
  Ticket,
  LogOut,
  LogIn,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import BanquoraLogo from './BanquoraLogo';

export const Navbar = () => {
  const { 
    currentUser,
    logoutUser,
    openLoginModal,
    currentRole, 
    switchRole, 
    bookings,
    setIsTrackerOpen,
    isSupabaseConfigured,
    isSupabaseOnline 
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  const handleCustomerClick = () => {
    switchRole('customer');
  };

  const handleOwnerClick = () => {
    if (currentUser && (currentUser.role === 'owner' || currentUser.role === 'admin')) {
      switchRole('owner');
    } else {
      openLoginModal(
        'Please sign in as a Hall Owner to access the Hall Owner Portal.',
        () => switchRole('owner'),
        'owner'
      );
    }
  };

  const handleAdminClick = () => {
    if (currentUser && currentUser.role === 'admin') {
      switchRole('admin');
    } else {
      openLoginModal(
        'Super Admin authentication required to access the verification & escrow control center.',
        () => switchRole('admin'),
        'admin'
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
      
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-amber-400/10 text-[#D4AF37] border border-amber-400/20">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              LUXURY VENUES & ESTATES
            </span>
            <span className="hidden sm:inline text-slate-400 font-normal">
              Curated Venues &bull; 100% Escrow Protected &bull; Direct Owner Rates
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSupabaseConfigured && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition-colors ${
                isSupabaseOnline 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                  : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isSupabaseOnline ? 'Live Cloud DB' : 'Connecting DB'}</span>
              </span>
            )}

            <button
              onClick={() => setIsTrackerOpen(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium text-xs transition-colors group"
            >
              <Ticket className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Track Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <BanquoraLogo 
            variant="horizontal"
            size="md"
            onClick={handleCustomerClick}
          />

          {/* Role Navigator Pill Tabs */}
          <div className="hidden md:flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
            
            {/* Customer - Always accessible */}
            <button
              onClick={handleCustomerClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentRole === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Explore Venues</span>
            </button>

            {/* Hall Owner - Login Required */}
            <button
              onClick={handleOwnerClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentRole === 'owner'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Owner Portal</span>
            </button>

            {/* Super Admin - Admin Login Required */}
            <button
              onClick={handleAdminClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                currentRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              <span>Super Admin</span>
              {pendingBookingsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {pendingBookingsCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Action Icons & User Login */}
          <div className="flex items-center gap-3">
            
            {/* User Session Login / Account */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition-all text-xs text-slate-900"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#D4AF37] flex items-center justify-center font-bold text-xs border border-amber-500/20">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-xs truncate max-w-[120px] leading-tight text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#A67F1A]">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-xs">
                    <div className="p-2.5 border-b border-slate-100 mb-1">
                      <p className="font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone || 'Verified User'}</p>
                    </div>
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('Please sign in to reserve or manage luxury banquet halls.', null, 'customer')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
