import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_HALLS, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENT_CONFIG, 
  INITIAL_OWNERS,
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { 
  supabase, 
  isSupabaseConfigured, 
  mapHallFromDB, 
  mapBookingFromDB,
  isAuthorizedAdminEmail 
} from '../lib/supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current User Session (null if not logged in)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('banquora_user') || localStorage.getItem('royal_user');
    if (!saved) return null;
    try {
      const u = JSON.parse(saved);
      if (u.role === 'admin' && !isAuthorizedAdminEmail(u.email)) {
        return null;
      }
      return u;
    } catch {
      return null;
    }
  });

  // Active Role: 'customer' | 'owner' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('banquora_user') || localStorage.getItem('royal_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'admin' && !isAuthorizedAdminEmail(u.email)) {
          return 'customer';
        }
      } catch {}
    }
    const role = localStorage.getItem('banquora_role') || localStorage.getItem('royal_role') || 'customer';
    if (role === 'admin') {
      const savedUser = localStorage.getItem('banquora_user') || localStorage.getItem('royal_user');
      if (!savedUser) return 'customer';
      try {
        const u = JSON.parse(savedUser);
        if (!isAuthorizedAdminEmail(u.email)) return 'customer';
      } catch {
        return 'customer';
      }
    }
    return role;
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authRequiredMessage, setAuthRequiredMessage] = useState('');
  const [authTargetRole, setAuthTargetRole] = useState('customer');
  const [pendingAuthAction, setPendingAuthAction] = useState(null);

  // Active Owner ID for Owner Portal
  const [activeOwnerId, setActiveOwnerId] = useState(() => {
    const savedUser = localStorage.getItem('banquora_user') || localStorage.getItem('royal_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.ownerId) return u.ownerId;
      } catch {}
    }
    return localStorage.getItem('banquora_active_owner') || 'owner_1';
  });

  // Supabase Online Health Flag
  const [isSupabaseOnline, setIsSupabaseOnline] = useState(false);

  // Halls Data Store
  const [halls, setHalls] = useState(() => {
    const saved = localStorage.getItem('banquora_halls') || localStorage.getItem('royal_halls');
    return saved ? JSON.parse(saved) : INITIAL_HALLS;
  });

  // Bookings Data Store
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('banquora_bookings') || localStorage.getItem('royal_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Hall Owners Data Store
  const [owners, setOwners] = useState(() => {
    const saved = localStorage.getItem('banquora_owners') || localStorage.getItem('royal_owners');
    if (!saved) return INITIAL_OWNERS;
    try {
      const parsed = JSON.parse(saved);
      return INITIAL_OWNERS.map(initial => {
        const found = parsed.find(p => p.id === initial.id);
        return found ? { ...initial, ...found, password: initial.password, email: initial.email, assignedHalls: initial.assignedHalls, assignedHallIds: initial.assignedHallIds } : initial;
      }).concat(parsed.filter(p => !INITIAL_OWNERS.some(i => i.id === p.id)));
    } catch {
      return INITIAL_OWNERS;
    }
  });

  // Platform Payment Configuration (Super Admin QR Code & UPI)
  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = localStorage.getItem('banquora_payment_config') || localStorage.getItem('royal_payment_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.upiId && !parsed.upiId.includes('icici')) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PAYMENT_CONFIG;
  });

  // Notifications Stream
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('banquora_notifications') || localStorage.getItem('royal_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI State: Selected Hall for Detailed Modal
  const [selectedHall, setSelectedHall] = useState(null);

  // UI State: Booking Modal Active Hall
  const [bookingModalHall, setBookingModalHall] = useState(null);

  // UI State: Booking Status Tracker Modal
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackingReference, setTrackingReference] = useState('');

  // Toast Alerts Queue
  const [toasts, setToasts] = useState([]);

  // Registered Accounts Directory (Customer and Hall Owner Accounts)
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem('banquora_accounts');
    const defaultAccounts = [
      {
        id: 'acc_cust_1',
        name: 'Priya Sharma',
        email: 'priya@gmail.com',
        phone: '+91 98765 43210',
        password: 'password123',
        role: 'customer'
      },
      {
        id: 'acc_owner_1',
        name: 'Vikramaditya Singhania',
        businessName: 'Singhania Royal Palaces Ltd.',
        email: 'singhania@palaces.com',
        alternateEmail: 'owner1@banquora.com',
        phone: '+91 98201 12345',
        password: 'owner123',
        role: 'owner',
        ownerId: 'owner_1'
      },
      {
        id: 'acc_owner_2',
        name: 'Maharani Gayatri Group',
        businessName: 'Gayatri Heritage & Luxury Estates',
        email: 'gayatri@estates.com',
        alternateEmail: 'owner2@banquora.com',
        phone: '+91 94140 88776',
        password: 'owner123',
        role: 'owner',
        ownerId: 'owner_2'
      }
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge so default owners are always present
        const defaultEmails = new Set(defaultAccounts.map(a => a.email.toLowerCase()));
        return [...defaultAccounts, ...parsed.filter(a => !defaultEmails.has(a.email?.toLowerCase()))];
      } catch {}
    }
    return defaultAccounts;
  });

  // Supabase Realtime & Remote Sync
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Sync Halls
      supabase
        .from('halls')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setIsSupabaseOnline(true);
            if (data.length > 0) {
              const remoteHalls = data.map(mapHallFromDB);
              setHalls((prev) => {
                const remoteIds = new Set(remoteHalls.map((h) => h.id));
                const localUnsynced = prev.filter((h) => !remoteIds.has(h.id));
                return [...remoteHalls, ...localUnsynced];
              });
            }
          } else {
            setIsSupabaseOnline(false);
          }
        });

      // Sync Bookings
      supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setBookings(data.map(mapBookingFromDB));
          }
        });

      // Sync Payment Config
      supabase
        .from('payment_config')
        .select('*')
        .eq('id', 1)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setPaymentConfig(prev => ({
              ...prev,
              upiId: data.upi_id || prev.upiId,
              payeeName: data.payee_name || prev.payeeName,
              merchantCode: data.merchant_code || prev.merchantCode,
              bankName: data.bank_name || prev.bankName,
              qrImageUrl: data.qr_image_url || prev.qrImageUrl,
              contactPhone: data.contact_phone || prev.contactPhone
            }));
          }
        });

      // Realtime subscription for live booking approvals
      const bookingChannel = supabase
        .channel('banquora-live-bookings')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const mapped = mapBookingFromDB(payload.new);
              setBookings((prev) => [mapped, ...prev.filter((b) => b.id !== mapped.id)]);
            } else if (payload.eventType === 'UPDATE') {
              const mapped = mapBookingFromDB(payload.new);
              setBookings((prev) => prev.map((b) => (b.id === mapped.id ? mapped : b)));
              if (mapped.status === 'approved') {
                triggerConfetti();
              }
            } else if (payload.eventType === 'DELETE') {
              setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      // Realtime subscription for halls
      const hallChannel = supabase
        .channel('banquora-live-halls')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'halls' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const mapped = mapHallFromDB(payload.new);
              setHalls((prev) => [mapped, ...prev.filter((h) => h.id !== mapped.id)]);
            } else if (payload.eventType === 'UPDATE') {
              const mapped = mapHallFromDB(payload.new);
              setHalls((prev) => prev.map((h) => (h.id === mapped.id ? mapped : h)));
            } else if (payload.eventType === 'DELETE') {
              setHalls((prev) => prev.filter((h) => h.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      // Listen to Supabase Auth State Changes (e.g. OAuth redirect, OTP login)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const isAdmin = isAuthorizedAdminEmail(email);
          const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || (isAdmin ? 'Super Admin' : email.split('@')[0]);
          
          setCurrentUser(prev => {
            if (prev && prev.email === email) return prev;
            return {
              id: session.user.id,
              name: fullName,
              email: email,
              role: isAdmin ? 'admin' : (prev?.role || 'customer'),
              ownerId: prev?.ownerId
            };
          });
          if (isAdmin) {
            setCurrentRole('admin');
          }
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const email = session.user.email || '';
          const isAdmin = isAuthorizedAdminEmail(email);
          const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || (isAdmin ? 'Super Admin' : email.split('@')[0]);
          
          const newUser = {
            id: session.user.id,
            name: fullName,
            email: email,
            role: isAdmin ? 'admin' : 'customer'
          };
          setCurrentUser(newUser);
          setCurrentRole(newUser.role);
          addToast({
            title: `Welcome, ${fullName}!`,
            message: isAdmin ? 'Verified as Super Admin on Banquora' : 'Signed in to Banquora',
            type: 'success',
            roleTag: newUser.role
          });
          setIsAuthModalOpen(false);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setCurrentRole('customer');
        }
      });

      return () => {
        supabase.removeChannel(bookingChannel);
        supabase.removeChannel(hallChannel);
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('banquora_user', JSON.stringify(currentUser));
      if (currentUser.ownerId) {
        setActiveOwnerId(currentUser.ownerId);
      }
    } else {
      localStorage.removeItem('banquora_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('banquora_active_owner', activeOwnerId);
  }, [activeOwnerId]);

  useEffect(() => {
    localStorage.setItem('banquora_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('banquora_halls', JSON.stringify(halls));
  }, [halls]);

  useEffect(() => {
    localStorage.setItem('banquora_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('banquora_owners', JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    localStorage.setItem('banquora_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('banquora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('banquora_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  // Register a new Account (Customer or Hall Owner)
  const registerAccount = (accountData) => {
    const newId = `acc_${Date.now().toString().slice(-5)}`;
    let assignedOwnerId = accountData.ownerId;

    if (accountData.role === 'owner' && !assignedOwnerId) {
      assignedOwnerId = `owner_${Date.now().toString().slice(-4)}`;
      const newOwnerObj = {
        id: assignedOwnerId,
        name: accountData.name,
        businessName: accountData.businessName || `${accountData.name} Royal Estates`,
        phone: accountData.phone,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        joinedDate: "Recently Joined"
      };
      setOwners(prev => [newOwnerObj, ...prev]);
      setActiveOwnerId(assignedOwnerId);
    }

    const newAcc = {
      id: newId,
      ...accountData,
      ownerId: assignedOwnerId
    };

    // Sync to Supabase profiles table
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('profiles')
        .upsert({
          id: newId,
          name: accountData.name || 'User',
          phone: accountData.phone || null,
          email: accountData.email || null,
          role: accountData.role || 'customer',
          business_name: accountData.businessName || null
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase profile sync error:', error);
        });
    }

    setRegisteredAccounts(prev => [newAcc, ...prev.filter(a => a.email !== newAcc.email)]);
    loginUser(newAcc);
    return newAcc;
  };

  // Toast Dispatcher Helper
  const addToast = ({ title, message, type = 'info', roleTag = null, duration = 4500 }) => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, title, message, type, roleTag };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Open Auth Modal
  const openLoginModal = (message = '', onSuccessAction = null, preferredRole = 'customer') => {
    setAuthRequiredMessage(message);
    setPendingAuthAction(() => onSuccessAction);
    setAuthTargetRole(preferredRole);
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAuthAction(null);
    setAuthRequiredMessage('');
  };

  // Login User
  const loginUser = (user) => {
    if (user.role === 'admin' && !isAuthorizedAdminEmail(user.email)) {
      addToast({
        title: 'Access Denied',
        message: 'This email address is not authorized for Super Admin privileges.',
        type: 'danger'
      });
      return;
    }

    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.ownerId) {
      setActiveOwnerId(user.ownerId);
    }

    addToast({
      title: 'Welcome, ' + user.name + '!',
      message: 'Signed in as ' + user.role.toUpperCase() + ' on Banquora',
      type: 'success',
      roleTag: user.role
    });

    setIsAuthModalOpen(false);

    if (pendingAuthAction && typeof pendingAuthAction === 'function') {
      setTimeout(() => {
        pendingAuthAction();
        setPendingAuthAction(null);
      }, 200);
    }
  };

  // Logout User
  const logoutUser = () => {
    const name = currentUser ? currentUser.name : 'User';
    setCurrentUser(null);
    setCurrentRole('customer');
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    addToast({
      title: 'Logged Out',
      message: name + ' has been signed out of Banquora.',
      type: 'info'
    });
  };

  // Require Auth Guard
  const requireAuth = (roleNeeded, actionCallback, message = 'Please log in to continue') => {
    if (currentUser) {
      if (roleNeeded === 'admin') {
        if (currentUser.role !== 'admin' || !isAuthorizedAdminEmail(currentUser.email)) {
          openLoginModal(
            'Please sign in with an authorized administrator email.',
            actionCallback,
            'admin'
          );
          return;
        }
      }
      if (roleNeeded && currentUser.role !== roleNeeded && currentUser.role !== 'admin') {
        openLoginModal(
          'You need to be logged in as a ' + (roleNeeded === 'owner' ? 'Hall Owner' : roleNeeded) + ' for this action.',
          actionCallback,
          roleNeeded
        );
        return;
      }
      actionCallback();
    } else {
      openLoginModal(message, actionCallback, roleNeeded || 'customer');
    }
  };

  // Role Switcher
  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      if (!currentUser || currentUser.role !== 'admin' || !isAuthorizedAdminEmail(currentUser.email)) {
        openLoginModal(
          'Super Admin mode requires signing in with an authorized administrator email.',
          () => switchRole('admin'),
          'admin'
        );
        return;
      }
    }

    setCurrentRole(newRole);
    addToast({
      title: 'Switched to ' + (newRole === 'admin' ? 'Super Admin' : newRole === 'owner' ? 'Hall Owner' : 'Customer') + ' View',
      message: 'Now browsing Banquora as ' + newRole + '.',
      type: 'info',
      roleTag: newRole
    });
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#C9A227', '#166534', '#FBBF24']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Customer: Create Booking
  const createBooking = async (bookingData) => {
    const newBookingId = 'BK-' + Math.floor(10000 + Math.random() * 90000);
    const newReferenceCode = 'BQ-' + Math.floor(10000 + Math.random() * 90000);

    const matchedHall = halls.find(h => h.id === bookingData.hallId);
    const resolvedCity = bookingData.hallCity || bookingData.city || matchedHall?.city || 'Pune';
    const resolvedOwnerId = bookingData.ownerId || matchedHall?.ownerId || 'owner_1';
    const matchedOwner = owners.find(o => o.id === resolvedOwnerId);
    const resolvedOwnerName = matchedHall?.ownerName || matchedOwner?.businessName || matchedOwner?.name || 'Authorized Venue Partner';
    const resolvedOwnerPhone = matchedHall?.ownerPhone || matchedOwner?.phone || '+91 98201 12345';
    const resolvedTotalPrice = Number(bookingData.totalPrice ?? bookingData.totalAmount ?? matchedHall?.pricePerDay ?? 150000);
    const resolvedAdvance = Number(bookingData.advanceAmount ?? matchedHall?.advanceBookingAmount ?? 25000);

    const newBooking = {
      ...bookingData,
      id: newBookingId,
      referenceCode: newReferenceCode,
      hallCity: resolvedCity,
      ownerId: resolvedOwnerId,
      ownerName: resolvedOwnerName,
      ownerPhone: resolvedOwnerPhone,
      totalPrice: resolvedTotalPrice,
      advanceAmount: resolvedAdvance,
      status: 'pending',
      statusNote: 'Advance paid via UPI QR. Waiting for Banquora Super Admin verification.',
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert([{
            id: newBookingId,
            reference_code: newReferenceCode,
            hall_id: bookingData.hallId,
            hall_name: bookingData.hallName,
            hall_city: resolvedCity,
            owner_id: resolvedOwnerId,
            customer_name: bookingData.customerName,
            customer_phone: bookingData.customerPhone,
            customer_email: bookingData.customerEmail,
            event_type: bookingData.eventType,
            event_date: bookingData.eventDate,
            time_slot: bookingData.timeSlot,
            guest_count: Number(bookingData.guestCount || 500),
            total_price: resolvedTotalPrice,
            advance_amount: resolvedAdvance,
            transaction_id: bookingData.transactionId,
            payment_method: 'UPI QR Scanner',
            status: 'pending',
            status_note: 'Advance paid via UPI QR. Waiting for Banquora Super Admin verification.',
            notes: bookingData.notes || ''
          }])
          .select();

        if (error) {
          console.error('Supabase booking insert error:', error);
          addToast({
            title: 'Database Notice',
            message: 'Booking saved locally. Remote DB sync error: ' + error.message,
            type: 'warning'
          });
        } else {
          console.log('Booking saved to Supabase successfully:', data);
        }
      } catch (err) {
        console.error('Exception inserting booking to Supabase:', err);
      }
    }

    // Create Notification for Admin
    const adminNotif = {
      id: 'notif-' + Date.now(),
      recipientRole: 'admin',
      title: 'New Advance Payment Received',
      message: bookingData.customerName + ' submitted ' + resolvedAdvance + ' INR for ' + bookingData.hallName + '. Transaction: ' + bookingData.transactionId,
      timestamp: new Date().toISOString(),
      type: 'booking_created',
      read: false
    };

    setNotifications((prev) => [adminNotif, ...prev]);

    addToast({
      title: 'Booking Request Placed!',
      message: 'Ref: ' + newReferenceCode + '. Advance payment submitted for verification.',
      type: 'success',
      roleTag: 'customer'
    });

    triggerConfetti();
    return newBooking;
  };

  // Admin: Approve Booking
  const approveBooking = async (bookingId, adminNote = 'Payment verified by Banquora Super Admin.') => {
    setBookings((prev) => prev.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'approved',
          statusNote: adminNote,
          approvedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'approved', 
            status_note: adminNote,
            approved_at: new Date().toISOString() 
          })
          .eq('id', bookingId);
        if (error) console.error('Supabase approve error:', error);
      } catch (e) {
        console.error('Exception approving in Supabase:', e);
      }
    }

    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      const ownerNotif = {
        id: 'notif-' + Date.now() + '-owner',
        recipientRole: 'owner',
        ownerId: targetBooking.ownerId,
        title: 'Booking Confirmed by Admin',
        message: 'Booking ' + targetBooking.referenceCode + ' for ' + targetBooking.hallName + ' on ' + targetBooking.eventDate + ' has been confirmed.',
        timestamp: new Date().toISOString(),
        type: 'booking_approved',
        read: false
      };

      setNotifications((prev) => [ownerNotif, ...prev]);

      addToast({
        title: 'Booking Approved!',
        message: 'Booking ' + targetBooking.referenceCode + ' approved. Owner & Customer notified.',
        type: 'success',
        roleTag: 'admin'
      });

      triggerConfetti();
    }
  };

  // Admin: Reject Booking
  const rejectBooking = async (bookingId, reason = 'Transaction ID could not be verified in bank records.') => {
    setBookings((prev) => prev.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'rejected',
          statusNote: reason,
          rejectedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'rejected', 
            status_note: reason,
            rejected_at: new Date().toISOString() 
          })
          .eq('id', bookingId);
        if (error) console.error('Supabase reject error:', error);
      } catch (e) {
        console.error('Exception rejecting in Supabase:', e);
      }
    }

    addToast({
      title: 'Booking Rejected',
      message: 'Booking #' + bookingId + ' rejected. Reason: ' + reason,
      type: 'danger',
      roleTag: 'admin'
    });
  };

  // Admin: Verify Escrow & Forward to Venue Owner for Final Confirmation
  const adminVerifyEscrow = async (bookingId, adminNote = 'Payment verified by Banquora Super Admin in escrow. Awaiting hall owner date lock.') => {
    setBookings((prev) => prev.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'escrow_verified',
          statusNote: adminNote,
          escrowVerifiedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'escrow_verified', 
            status_note: adminNote
          })
          .eq('id', bookingId);
        if (error) console.error('Supabase escrow verify error:', error);
      } catch (e) {
        console.error('Exception escrow verifying in Supabase:', e);
      }
    }

    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      const ownerNotif = {
        id: 'notif-' + Date.now() + '-owner',
        recipientRole: 'owner',
        ownerId: targetBooking.ownerId,
        title: 'Booking Awaiting Your Confirmation',
        message: 'Advance payment of ' + formatINR(targetBooking.advanceAmount) + ' verified for ' + targetBooking.hallName + ' on ' + targetBooking.eventDate + '. Please review & lock the date.',
        timestamp: new Date().toISOString(),
        type: 'escrow_verified',
        read: false
      };

      setNotifications((prev) => [ownerNotif, ...prev]);

      addToast({
        title: 'Escrow Payment Verified!',
        message: 'Booking ' + targetBooking.referenceCode + ' forwarded to Hall Owner for final acceptance.',
        type: 'success',
        roleTag: 'admin'
      });
    }
  };

  // Owner: Approve / Confirm Reservation & Lock Date
  const ownerApproveBooking = async (bookingId, ownerNote = 'Reservation accepted and date locked by Banquet Hall Owner.') => {
    setBookings((prev) => prev.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'approved',
          statusNote: ownerNote,
          approvedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'approved', 
            status_note: ownerNote,
            approved_at: new Date().toISOString() 
          })
          .eq('id', bookingId);
        if (error) console.error('Supabase owner approve error:', error);
      } catch (e) {
        console.error('Exception approving by owner in Supabase:', e);
      }
    }

    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      const customerNotif = {
        id: 'notif-' + Date.now() + '-cust',
        recipientRole: 'customer',
        title: 'Reservation Confirmed & Date Locked!',
        message: 'Congratulations! The venue owner has accepted your booking for ' + targetBooking.hallName + ' on ' + targetBooking.eventDate + '.',
        timestamp: new Date().toISOString(),
        type: 'booking_approved',
        read: false
      };

      const adminNotif = {
        id: 'notif-' + Date.now() + '-admin',
        recipientRole: 'admin',
        title: 'Venue Owner Confirmed Date',
        message: 'Booking ' + targetBooking.referenceCode + ' was accepted by ' + (targetBooking.ownerName || 'Venue Owner') + '.',
        timestamp: new Date().toISOString(),
        type: 'booking_approved',
        read: false
      };

      setNotifications((prev) => [customerNotif, adminNotif, ...prev]);

      addToast({
        title: 'Reservation Confirmed!',
        message: 'Date locked for ' + targetBooking.customerName + '. Host notified with direct contact info.',
        type: 'success',
        roleTag: 'owner'
      });

      triggerConfetti();
    }
  };

  // Owner: Reject / Decline Reservation
  const ownerRejectBooking = async (bookingId, reason = 'Selected date is unavailable in banquet calendar. Full advance refund initiated.') => {
    setBookings((prev) => prev.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'rejected',
          statusNote: reason,
          rejectedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'rejected', 
            status_note: reason,
            rejected_at: new Date().toISOString() 
          })
          .eq('id', bookingId);
        if (error) console.error('Supabase owner reject error:', error);
      } catch (e) {
        console.error('Exception rejecting by owner in Supabase:', e);
      }
    }

    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      const custNotif = {
        id: 'notif-' + Date.now() + '-cust',
        recipientRole: 'customer',
        title: 'Booking Request Declined by Venue',
        message: 'The banquet hall declined reservation ' + targetBooking.referenceCode + ': ' + reason + '. Escrow refund is being initiated.',
        timestamp: new Date().toISOString(),
        type: 'booking_rejected',
        read: false
      };

      const adminNotif = {
        id: 'notif-' + Date.now() + '-admin',
        recipientRole: 'admin',
        title: 'Venue Declined Booking - Refund Needed',
        message: 'Booking ' + targetBooking.referenceCode + ' declined by owner. Please refund advance payment of ' + formatINR(targetBooking.advanceAmount) + '.',
        timestamp: new Date().toISOString(),
        type: 'booking_rejected',
        read: false
      };

      setNotifications((prev) => [custNotif, adminNotif, ...prev]);

      addToast({
        title: 'Reservation Declined',
        message: 'Customer & Admin notified. Escrow refund flagged.',
        type: 'warning',
        roleTag: 'owner'
      });
    }
  };

  // Owner: Add New Hall
  const addHall = async (hallData) => {
    const newId = 'hall-' + Date.now();
    const currentOwner = (currentUser && (currentUser.role === 'owner' || currentUser.ownerId) ? currentUser : null) || 
                         owners.find((o) => o.id === activeOwnerId) || 
                         owners[0];

    const cleanName = hallData.name?.trim() || 'Grand Luxury Ballroom';
    const cleanCity = hallData.city?.trim() || 'Pune';
    const cleanLocation = hallData.location?.trim() || cleanCity;
    const cleanFullAddress = hallData.fullAddress?.trim() || `${cleanName}, ${cleanLocation}, ${cleanCity}`;
    const cleanCapacity = parseInt(hallData.capacity, 10) || 500;
    const cleanSqft = parseInt(hallData.sqft, 10) || 12000;
    const cleanPrice = parseFloat(hallData.pricePerDay) || 200000;
    const cleanAdvance = parseFloat(hallData.advanceBookingAmount) || 35000;
    const cleanTagline = hallData.tagline?.trim() || 'Prestigious Wedding & Celebration Venue';
    const cleanDescription = hallData.description?.trim() || cleanTagline;

    // Normalize images: if user wrote "images/...", turn into "/images/..."
    const rawImages = Array.isArray(hallData.images) && hallData.images.length > 0 
      ? hallData.images 
      : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'];
    const cleanImages = rawImages.map(img => {
      if (typeof img === 'string' && img.startsWith('images/')) return '/' + img;
      return img;
    });

    const cleanAmenities = Array.isArray(hallData.amenities) && hallData.amenities.length > 0
      ? hallData.amenities
      : ['Central Air Conditioning', 'Stage & Mood Lighting', 'Valet Parking', '100% Power Generator Backup'];

    const newHall = {
      ...hallData,
      id: newId,
      name: cleanName,
      tagline: cleanTagline,
      city: cleanCity,
      location: cleanLocation,
      fullAddress: cleanFullAddress,
      capacity: cleanCapacity,
      sqft: cleanSqft,
      pricePerDay: cleanPrice,
      advanceBookingAmount: cleanAdvance,
      ownerId: currentOwner.ownerId || currentOwner.id || 'owner_1',
      ownerName: currentOwner.businessName || currentOwner.name || 'Singhania Royal Palaces Ltd.',
      ownerPhone: currentOwner.phone || '+91 98201 12345',
      rating: 5.0,
      reviewCount: 1,
      images: cleanImages,
      amenities: cleanAmenities,
      description: cleanDescription,
      isAvailable: true,
      eventTypes: hallData.eventTypes || ['wedding', 'birthday', 'retirement']
    };

    // Update local state immediately with new hall at the top
    setHalls((prev) => [newHall, ...prev.filter(h => h.id !== newId)]);

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('halls')
          .insert([{
            id: newId,
            name: newHall.name,
            tagline: newHall.tagline,
            city: newHall.city,
            location: newHall.location,
            full_address: newHall.fullAddress,
            capacity: newHall.capacity,
            sqft: newHall.sqft,
            price_per_day: newHall.pricePerDay,
            advance_booking_amount: newHall.advanceBookingAmount,
            owner_id: newHall.ownerId,
            owner_name: newHall.ownerName,
            owner_phone: newHall.ownerPhone,
            rating: 5.0,
            review_count: 1,
            images: newHall.images,
            amenities: newHall.amenities,
            is_available: true,
            description: newHall.description
          }])
          .select();

        if (error) {
          console.error('Supabase hall insert error:', error);
        } else if (data && data.length > 0) {
          const mapped = mapHallFromDB(data[0]);
          setHalls((prev) => [mapped, ...prev.filter(h => h.id !== mapped.id && h.id !== newId)]);
        }
      } catch (e) {
        console.error('Exception inserting hall into Supabase:', e);
      }
    }

    addToast({
      title: 'Hall Listed Successfully!',
      message: newHall.name + ' is now live and visible to customers on Banquora.',
      type: 'success',
      roleTag: 'owner'
    });

    triggerConfetti();
    return newHall;
  };

  // Owner: Delete Hall
  const deleteHall = (hallId) => {
    setHalls((prev) => prev.filter((h) => h.id !== hallId));

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('halls')
        .delete()
        .eq('id', hallId)
        .then(() => {});
    }

    addToast({
      title: 'Hall Removed',
      message: 'The banquet hall listing has been deleted.',
      type: 'info',
      roleTag: 'owner'
    });
  };

  // Super Admin: Update Payment Gateway UPI / QR Settings
  const updatePaymentConfig = (newConfig) => {
    setPaymentConfig(newConfig);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('payment_config')
        .upsert({
          id: 1,
          upi_id: newConfig.upiId,
          payee_name: newConfig.payeeName,
          merchant_code: newConfig.merchantCode || 'BANQUORA-IND-01',
          bank_name: newConfig.bankName,
          qr_image_url: newConfig.qrImageUrl || '',
          contact_phone: newConfig.contactPhone || '+91 8000 77 9900',
          updated_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase payment config error:', error);
        });
    }

    addToast({
      title: 'Payment Gateway Updated',
      message: 'New QR Code & UPI settings are now live for all customer advance checkouts.',
      type: 'success',
      roleTag: 'admin'
    });
  };

  // Helper: Currency Formatter
  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      loginUser,
      logoutUser,
      requireAuth,
      isAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      authRequiredMessage,
      authTargetRole,
      openLoginModal,
      closeAuthModal,
      currentRole,
      switchRole,
      activeOwnerId,
      setActiveOwnerId,
      halls,
      bookings,
      owners,
      paymentConfig,
      notifications,
      selectedHall,
      setSelectedHall,
      bookingModalHall,
      setBookingModalHall,
      isTrackerOpen,
      setIsTrackerOpen,
      trackingReference,
      setTrackingReference,
      toasts,
      addToast,
      removeToast,
      createBooking,
      approveBooking,
      rejectBooking,
      adminVerifyEscrow,
      ownerApproveBooking,
      ownerRejectBooking,
      addHall,
      deleteHall,
      updatePaymentConfig,
      formatINR,
      triggerConfetti,
      isSupabaseConfigured,
      isSupabaseOnline,
      registeredAccounts,
      registerAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
