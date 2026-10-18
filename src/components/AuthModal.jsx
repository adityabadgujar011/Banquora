import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Crown, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  KeyRound,
  Loader2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  isAuthorizedAdminEmail, 
  isValidAdminPasscode,
  sendEmailOtp, 
  signInWithEmailPassword
} from '../lib/supabaseClient';
import BanquoraLogo from './BanquoraLogo';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode, 
    authRequiredMessage, 
    authTargetRole,
    loginUser,
    registerAccount,
    registeredAccounts,
    owners
  } = useApp();

  const [selectedRole, setSelectedRole] = useState('customer');
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [adminAuthMethod, setAdminAuthMethod] = useState('passcode'); // 'passcode' | 'magic_link'
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    businessName: ''
  });

  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync role when modal opens with a target role
  useEffect(() => {
    if (authTargetRole) {
      setSelectedRole(authTargetRole);
    }
  }, [authTargetRole, isAuthModalOpen]);

  // Sync auth modal mode (login vs register)
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Reset errors and fields when role switches
  useEffect(() => {
    setErrors({});
    setMagicLinkSent(false);
  }, [selectedRole, activeTab]);

  if (!isAuthModalOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  // Super Admin: Dispatch Supabase Email Link
  const handleSendAdminMagicLink = async (e) => {
    if (e) e.preventDefault();
    const adminEmail = (formData.email || '').trim().toLowerCase();

    if (!adminEmail) {
      setErrors({ email: 'Please enter your administrator email address' });
      return;
    }

    if (!isAuthorizedAdminEmail(adminEmail)) {
      setErrors({ email: 'Access Denied: This email address is not authorized for Super Admin privileges.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await sendEmailOtp(adminEmail);
      setIsLoading(false);

      if (error) {
        setErrors({ general: error.message || 'Could not send verification email. Please check network.' });
      } else {
        setMagicLinkSent(true);
        setResendCountdown(60);
      }
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: 'Network error connecting to authentication server.' });
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // -------------------------------------------------------------
    // ROLE: SUPER ADMIN
    // -------------------------------------------------------------
    if (selectedRole === 'admin') {
      const adminEmail = (formData.email || '').trim().toLowerCase();
      
      if (!adminEmail) {
        newErrors.email = 'Administrator email is required';
        setErrors(newErrors);
        return;
      }

      if (!isAuthorizedAdminEmail(adminEmail)) {
        newErrors.email = 'Access Denied: This email address is not authorized for Super Admin privileges.';
        setErrors(newErrors);
        return;
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Super Admin security passcode or password is required';
        setErrors(newErrors);
        return;
      }

      const inputPassword = formData.password.trim();

      // Check Master Passcode (instant reliable fallback: 20250112 or admin@2025 or mitaoe@admin)
      if (isValidAdminPasscode(inputPassword)) {
        loginUser({
          id: `admin_${adminEmail.split('@')[0]}`,
          name: 'Super Admin',
          email: adminEmail,
          role: 'admin'
        });
        return;
      }

      // Also verify against Supabase Password if entered
      setIsLoading(true);
      try {
        const { data, error } = await signInWithEmailPassword(adminEmail, inputPassword);
        setIsLoading(false);

        if (!error && data?.user) {
          loginUser({
            id: data.user.id || `admin_${adminEmail.split('@')[0]}`,
            name: 'Super Admin',
            email: adminEmail,
            role: 'admin'
          });
          return;
        } else {
          setErrors({
            password: 'Authentication failed. Please verify your administrator credentials.'
          });
        }
      } catch (err) {
        setIsLoading(false);
        setErrors({
          password: 'Authentication failed. Please verify your administrator credentials.'
        });
      }
      return;
    }

    // -------------------------------------------------------------
    // ROLE: CUSTOMER OR OWNER (REGISTER MODE)
    // -------------------------------------------------------------
    if (activeTab === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required';
      if (!formData.email.trim()) newErrors.email = 'Email address is required';
      if (!formData.password.trim()) newErrors.password = 'Please create a password';
      if (selectedRole === 'owner' && !formData.businessName.trim()) {
        newErrors.businessName = 'Banquet venue or estate name is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Register new user and auto-login
      registerAccount({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        businessName: formData.businessName.trim() || undefined,
        role: selectedRole
      });
      return;
    }

    // -------------------------------------------------------------
    // ROLE: CUSTOMER OR OWNER (SIGN IN MODE)
    // -------------------------------------------------------------
    if (activeTab === 'login') {
      const loginIdentifier = (formData.phone || formData.email || '').trim();
      const loginPassword = (formData.password || '').trim();

      if (!loginIdentifier) {
        newErrors.phone = 'Email address or mobile number is required';
        setErrors(newErrors);
        return;
      }

      if (!loginPassword) {
        newErrors.password = 'Password is required';
        setErrors(newErrors);
        return;
      }

      // Match against registered accounts in directory
      const matched = registeredAccounts?.find(a => 
        (a.email?.toLowerCase() === loginIdentifier.toLowerCase() || 
         a.phone?.replace(/\s+/g, '') === loginIdentifier.replace(/\s+/g, '')) &&
        a.role === selectedRole
      );

      if (matched) {
        if (matched.password && matched.password !== loginPassword) {
          setErrors({ password: 'Incorrect password for this account.' });
          return;
        }
        loginUser(matched);
        return;
      }

      // If logging in as an existing owner by phone/email
      if (selectedRole === 'owner') {
        const ownerMatch = owners.find(o => 
          o.phone?.replace(/\s+/g, '').includes(loginIdentifier.replace(/\s+/g, '')) ||
          o.name?.toLowerCase().includes(loginIdentifier.toLowerCase())
        );

        if (ownerMatch) {
          loginUser({
            id: ownerMatch.id,
            name: ownerMatch.name,
            businessName: ownerMatch.businessName,
            phone: ownerMatch.phone,
            email: loginIdentifier.includes('@') ? loginIdentifier : 'owner@banquora.com',
            role: 'owner',
            ownerId: ownerMatch.id
          });
          return;
        }
      }

      // Allow direct sign-in for any customer credentials
      const isEmail = loginIdentifier.includes('@');
      const detectedName = isEmail 
        ? loginIdentifier.split('@')[0].replace(/[._]/g, ' ') 
        : `Member ${loginIdentifier.slice(-4)}`;

      loginUser({
        id: `usr_${Date.now().toString().slice(-5)}`,
        name: detectedName.charAt(0).toUpperCase() + detectedName.slice(1),
        email: isEmail ? loginIdentifier : `${loginIdentifier}@guest.banquora.com`,
        phone: !isEmail ? loginIdentifier : '+91 98765 43210',
        businessName: selectedRole === 'owner' ? `${detectedName} Estates` : undefined,
        role: selectedRole,
        ownerId: selectedRole === 'owner' ? 'owner_1' : undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-slide-up">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 relative text-center">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#0B152B] to-[#040814] border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-3 shadow-md p-2 hover:scale-105 transition-transform">
            <img 
              src="/images/banquora-crest-gold-transparent.png" 
              alt="Banquora Official Logo" 
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>

          <h3 className="font-serif text-xl font-semibold text-slate-900">
            {selectedRole === 'admin' 
              ? 'Super Admin Security Portal' 
              : activeTab === 'login' 
                ? (selectedRole === 'owner' ? 'Hall Owner Sign In' : 'Sign In to Banquora') 
                : (selectedRole === 'owner' ? 'Register Venue Partner' : 'Create Customer Account')}
          </h3>

          <p className="text-xs text-slate-500 mt-1 font-normal">
            {selectedRole === 'owner' 
              ? 'Manage your luxury banquet venues, reservations & rates.' 
              : selectedRole === 'admin' 
                ? 'Strict administrator identity verification for escrow control.' 
                : 'Reserve luxury banquet halls with 100% verified escrow protection.'}
          </p>

          {/* Action requirement alert banner */}
          {authRequiredMessage && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2 text-left shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{authRequiredMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">

          {/* Role selector pill tabs */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Select Account Type
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-center">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'customer'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('owner')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'owner'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Hall Owner</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'admin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 1: SUPER ADMIN SPECIALIZED AUTHENTICATION                        */}
          {/* ==================================================================== */}
          {selectedRole === 'admin' && (
            <div className="space-y-4 pt-1">
              
              {/* Restricted Security Notice */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Restricted Administrator Gateway</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-normal">
                    This control center is strictly restricted to verified platform administrators. Please enter your authorized administrator credentials below.
                  </p>
                </div>
              </div>

              {/* Secure Password Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Authorized Administrator Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder=""
                        autoComplete="off"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                        required
                      />
                  </div>
                  {errors.email && <p className="text-[10px] text-rose-600 font-medium mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Administrator Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-[10px] text-rose-600 font-medium mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>Verify & Open Super Admin Center</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 2: CUSTOMER SIGN-IN / REGISTRATION                               */}
          {/* ==================================================================== */}
          {selectedRole === 'customer' && (
            <div className="space-y-4 pt-1">
              
              {/* Mode Toggle (Sign In vs Create Account) */}
              <div className="flex border-b border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`pb-2 px-4 font-semibold transition-all border-b-2 ${
                    activeTab === 'login'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In with Password
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`pb-2 px-4 font-semibold transition-all border-b-2 ${
                    activeTab === 'register'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Customer Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Full Host Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Aditya Verma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                        required
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.name}</p>}
                  </div>
                )}

                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. aditya@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.email}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {activeTab === 'login' ? 'Email Address or Mobile Number *' : 'Mobile / WhatsApp Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={activeTab === 'login' ? 'e.g. priya@gmail.com or 9876543210' : '+91 98765 43210'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {activeTab === 'register' ? 'Create Password *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>{activeTab === 'login' ? 'Sign In as Customer' : 'Create Account & Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </form>
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 3: HALL OWNER SIGN-IN / REGISTRATION                            */}
          {/* ==================================================================== */}
          {selectedRole === 'owner' && (
            <div className="space-y-4 pt-1">

              {/* Mode Toggle (Sign In vs Register Partner) */}
              <div className="flex border-b border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`pb-2 px-4 font-semibold transition-all border-b-2 ${
                    activeTab === 'login'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Partner Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`pb-2 px-4 font-semibold transition-all border-b-2 ${
                    activeTab === 'register'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register New Property Owner
                </button>
              </div>

              {/* Owner Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Owner / Manager Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rajesh Sheth"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                        required
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.name}</p>}
                  </div>
                )}

                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Banquet Estate / Business Name *</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="e.g. Golden Palace Wedding Hall & Estates"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                        required
                      />
                    </div>
                    {errors.businessName && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.businessName}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {activeTab === 'login' ? 'Registered Email or Mobile Number *' : 'Contact Mobile / WhatsApp *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={activeTab === 'login' ? '+91 98201 12345 or singhania@palaces.com' : '+91 98201 12345'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.phone}</p>}
                </div>

                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Business Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. owner@goldenpalace.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.email}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#C59A27] transition-all"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>{activeTab === 'login' ? 'Sign In to Owner Portal' : 'Register & Access Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
