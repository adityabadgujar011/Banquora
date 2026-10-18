import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerView } from './components/CustomerView';
import { OwnerPortal } from './components/OwnerPortal';
import { AdminPortal } from './components/AdminPortal';
import { HallDetailModal } from './components/HallDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingTrackerModal } from './components/BookingTrackerModal';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';
import BanquoraLogo from './components/BanquoraLogo';
import { Crown, Sparkles, ShieldCheck, Heart, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

function AppContent() {
  const { currentRole, switchRole, setIsTrackerOpen, currentUser, openLoginModal } = useApp();

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
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900 selection:bg-[#C59A27] selection:text-white font-sans relative antialiased">
      
      {/* Top Navbar with live role switcher */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRole === 'customer' && <CustomerView />}
        {currentRole === 'owner' && <OwnerPortal />}
        {currentRole === 'admin' && <AdminPortal />}
      </main>

      {/* Interactive Global Modals */}
      <HallDetailModal />
      <BookingModal />
      <BookingTrackerModal />
      <AuthModal />

      {/* Real-time floating toast notifications */}
      <NotificationToast />

      {/* Modern Luxury Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white text-xs text-slate-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Brand column */}
            <div className="space-y-3.5 md:col-span-1">
              <BanquoraLogo 
                variant="horizontal" 
                size="md" 
                onClick={handleCustomerClick} 
              />
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                India's premier verified banquet hall discovery and official advance escrow booking platform. Curated venues with guaranteed date reservation.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Luxury Venues</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Platform</h5>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li>
                  <button onClick={handleCustomerClick} className="hover:text-[#C59A27] transition-colors">
                    Explore Venues
                  </button>
                </li>
                <li>
                  <button onClick={handleOwnerClick} className="hover:text-[#C59A27] transition-colors">
                    Hall Owner Portal
                  </button>
                </li>
                <li>
                  <button onClick={handleAdminClick} className="hover:text-[#C59A27] transition-colors">
                    Super Admin Escrow
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsTrackerOpen(true)} className="hover:text-[#C59A27] transition-colors">
                    Track Booking Status
                  </button>
                </li>
              </ul>
            </div>

            {/* Prime Locations */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Top Destinations</h5>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li>Pune & Maharashtra Venues</li>
                <li>Udaipur Palace Ballrooms</li>
                <li>Jaipur Heritage Havelis</li>
                <li>Mumbai Seafront Pavilions</li>
                <li>Bengaluru Glasshouses & Lawns</li>
              </ul>
            </div>

            {/* Escrow & Security */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Escrow Date Guarantee</h5>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Escrow Protection</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Advance payments are verified by Platform Super Admin before releasing to owners, preventing duplicate bookings.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-4 text-[11px]">
            <p className="text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Banquora Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
              <span>&bull;</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Escrow</span>
              <span>&bull;</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
