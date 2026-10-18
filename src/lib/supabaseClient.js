import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) 
    || 'https://bqpzbvuhjcdichnuwndu.supabase.co';

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) 
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcHpidnVoamNkaWNobnV3bmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MTE1NjQsImV4cCI6MjEwNDI4NzU2NH0.Yi5wFvNc9M1HxtWqpbLVtC270t9EvGhIjymV79I9IyI';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// DB to App Mappers
export const mapHallFromDB = (h) => ({
  ...h,
  fullAddress: h.full_address || h.fullAddress || '',
  pricePerDay: Number(h.price_per_day ?? h.pricePerDay ?? 0),
  advanceBookingAmount: Number(h.advance_booking_amount ?? h.advanceBookingAmount ?? 0),
  ownerId: h.owner_id || h.ownerId || '',
  ownerName: h.owner_name || h.ownerName || '',
  ownerPhone: h.owner_phone || h.ownerPhone || '',
  reviewCount: Number(h.review_count ?? h.reviewCount ?? 0),
  isAvailable: h.is_available !== undefined ? h.is_available : (h.isAvailable ?? true),
});

export const mapBookingFromDB = (b) => ({
  ...b,
  referenceCode: b.reference_code || b.referenceCode,
  hallId: b.hall_id || b.hallId,
  hallName: b.hall_name || b.hallName,
  hallCity: b.hall_city || b.hallCity,
  ownerId: b.owner_id || b.ownerId,
  customerName: b.customer_name || b.customerName,
  customerPhone: b.customer_phone || b.customerPhone,
  customerEmail: b.customer_email || b.customerEmail,
  eventType: b.event_type || b.eventType,
  eventDate: b.event_date || b.eventDate,
  timeSlot: b.time_slot || b.timeSlot,
  guestCount: Number(b.guest_count ?? b.guestCount ?? 0),
  totalPrice: Number(b.total_price ?? b.totalPrice ?? 0),
  advanceAmount: Number(b.advance_amount ?? b.advanceAmount ?? 0),
  transactionId: b.transaction_id || b.transactionId,
  paymentMethod: b.payment_method || b.paymentMethod || 'UPI QR Scanner',
  status: b.status || 'pending',
  statusNote: b.status_note || b.statusNote || '',
  approvedAt: b.approved_at || b.approvedAt,
  rejectedAt: b.rejected_at || b.rejectedAt,
  createdAt: b.created_at || b.createdAt,
  notes: b.notes || ''
});

// Strict Administrator Whitelist - Only 202501120080@mitaoe.ac.in
export const AUTHORIZED_ADMIN_EMAILS = [
  '202501120080@mitaoe.ac.in'
];

export const isAuthorizedAdminEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === '202501120080@mitaoe.ac.in';
};

// Super Admin Password - Strictly 202501120080
export const ADMIN_MASTER_PASSCODES = [
  '202501120080'
];

export const isValidAdminPasscode = (passcode) => {
  if (!passcode || typeof passcode !== 'string') return false;
  return passcode.trim() === '202501120080';
};

// Supabase Authentication Helpers
export const sendEmailOtp = async (email) => {
  if (!supabase) return { error: { message: 'Supabase client is not initialized' } };
  return await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.origin
    }
  });
};

export const verifyEmailOtp = async (email, token) => {
  if (!supabase) return { error: { message: 'Supabase client is not initialized' } };
  return await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email'
  });
};

export const signInWithEmailPassword = async (email, password) => {
  if (!supabase) return { error: { message: 'Supabase client is not initialized' } };
  return await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password
  });
};

export const checkIsGoogleOAuthEnabled = async () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { 'apikey': supabaseAnonKey }
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data?.external?.google);
    }
  } catch {}
  return false;
};

export const signInWithGoogleOAuth = async (redirectTo = window.location.origin) => {
  if (!supabase) return { error: { message: 'Supabase client is not initialized' } };
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        skipBrowserRedirect: true
      }
    });

    if (error) return { error };

    if (data?.url) {
      // Pre-flight check: ensure Supabase doesn't return "Unsupported provider" raw JSON
      try {
        const checkRes = await fetch(data.url);
        if (!checkRes.ok) {
          const errData = await checkRes.json().catch(() => ({}));
          return {
            error: {
              code: errData.code || 400,
              errorCode: errData.error_code || 'unsupported_provider',
              message: errData.msg || 'Google OAuth provider is not enabled in your Supabase project settings.'
            }
          };
        }
      } catch (e) {
        // If network or CORS prevents fetch inspection, fallback to direct redirect
      }

      // Validated: safe to redirect browser
      window.location.href = data.url;
      return { data, error: null };
    }

    return { data, error: null };
  } catch (err) {
    return { error: { message: err.message || 'Failed to initiate Google authentication' } };
  }
};

export const signOutSupabase = async () => {
  if (!supabase) return { error: null };
  return await supabase.auth.signOut();
};

