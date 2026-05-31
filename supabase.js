import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Check your .env file or Vercel environment settings.');
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
);

// ─── USERS ───────────────────────────────────────────────────────────────────

export const dbGetUsers = async () => {
  const { data, error } = await supabase.from('users').select('*').order('joined', { ascending: false });
  if (error) { console.error('getUsers:', error); return []; }
  return data;
};

export const dbRegister = async (name, email, password) => {
  const { data: existing } = await supabase.from('users').select('id').ilike('email', email).maybeSingle();
  if (existing) return { user: null, error: 'This email is already registered.' };

  const user = {
    id: crypto.randomUUID(),
    name, email, password,
    joined: new Date().toISOString().split('T')[0],
  };

  const { error } = await supabase.from('users').insert([user]);
  if (error) { console.error('register:', error); return { user: null, error: 'Registration failed. Please try again.' }; }
  return { user, error: null };
};

export const dbLogin = async (email, password) => {
  const { data, error } = await supabase.from('users').select('*').ilike('email', email).eq('password', password).maybeSingle();
  if (error || !data) return { user: null, error: 'Invalid email or password.' };
  return { user: data, error: null };
};

// ─── CARS ────────────────────────────────────────────────────────────────────

export const dbGetCars = async () => {
  const { data, error } = await supabase.from('cars').select('*').order('id', { ascending: true });
  if (error) { console.error('getCars:', error); return null; }
  return data;
};

export const dbInsertCar = async (car) => {
  const { data, error } = await supabase.from('cars').insert([car]).select().single();
  if (error) { console.error('insertCar:', error); return null; }
  return data;
};

export const dbUpdateCar = async (car) => {
  const { error } = await supabase.from('cars').update(car).eq('id', car.id);
  if (error) { console.error('updateCar:', error); return false; }
  return true;
};

export const dbDeleteCar = async (id) => {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) { console.error('deleteCar:', error); return false; }
  return true;
};

export const dbSeedCars = async (cars) => {
  const { error } = await supabase.from('cars').insert(cars);
  if (error) console.error('seedCars:', error);
};

// ─── INVESTMENTS ─────────────────────────────────────────────────────────────

export const dbGetInvestments = async (userId = null) => {
  let query = supabase.from('investments').select('*').order('date', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) { console.error('getInvestments:', error); return []; }
  return data;
};

export const dbInsertInvestment = async (inv) => {
  // Map camelCase fields to snake_case columns
  const record = {
    user_id:  inv.user_id,
    car_name: inv.carName || inv.car_name || null,
    amount:   inv.amount,
    plan:     inv.plan || null,
    returns:  inv.returns || 0,
    status:   inv.status || 'Active',
    date:     inv.date || new Date().toISOString().split('T')[0],
  };
  const { data, error } = await supabase.from('investments').insert([record]).select().single();
  if (error) { console.error('insertInvestment:', error); return null; }
  return data;
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const dbGetOrders = async (userId = null) => {
  let query = supabase.from('orders').select('*').order('date', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) { console.error('getOrders:', error); return []; }
  return data;
};

export const dbInsertOrder = async (ord) => {
  const record = {
    user_id:     ord.user_id,
    car_name:    ord.carName || ord.car_name || null,
    car_id:      ord.carId   || ord.car_id   || null,
    car_price:   ord.carPrice || ord.car_price || ord.price || null,
    price:       ord.price   || null,
    color:       ord.color   || null,
    full_name:   ord.fullName || ord.full_name || null,
    email:       ord.email   || null,
    phone:       ord.phone   || null,
    address:     ord.address || null,
    notes:       ord.notes   || null,
    tracking_id: ord.tracking_id || null,
    status:      ord.status  || 'Pending',
    date:        ord.date    || new Date().toISOString().split('T')[0],
  };
  const { data, error } = await supabase.from('orders').insert([record]).select().single();
  if (error) { console.error('insertOrder:', error); return null; }
  return data;
};

export const dbUpdateOrderStatus = async (id, status) => {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) { console.error('updateOrderStatus:', error); return false; }
  return true;
};

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export const dbGetPayments = async (userId = null) => {
  let query = supabase.from('payments').select('*').order('date', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) { console.error('getPayments:', error); return []; }
  // Map snake_case back to camelCase for the UI
  return data.map(p => ({
    ...p,
    userName:       p.user_name,
    userEmail:      p.user_email,
    walletAddress:  p.wallet_address,
    returnRate:     p.return_rate,
    receiptPreview: p.receipt_preview,
    receiptName:    p.receipt_name,
  }));
};

export const dbInsertPayment = async (pay) => {
  const record = {
    user_id:        pay.user_id,
    order_id:       pay.order_id       || null,
    amount:         pay.amount,
    method:         pay.method         || pay.coin || null,
    status:         pay.status         || 'Pending',
    date:           pay.date           || new Date().toISOString().split('T')[0],
    user_name:      pay.userName       || pay.user_name  || null,
    user_email:     pay.userEmail      || pay.user_email || null,
    coin:           pay.coin           || null,
    wallet_address: pay.walletAddress  || pay.wallet_address || null,
    network:        pay.network        || null,
    plan:           pay.plan           || null,
    asset:          pay.asset          || null,
    return_rate:    pay.returnRate     || pay.return_rate || null,
    receipt_preview: pay.receiptPreview || pay.receipt_preview || null,
    receipt_name:   pay.receiptName    || pay.receipt_name || null,
  };
  const { data, error } = await supabase.from('payments').insert([record]).select().single();
  if (error) { console.error('insertPayment:', error); return null; }
  // Return with camelCase fields for UI
  return {
    ...data,
    userName:       data.user_name,
    userEmail:      data.user_email,
    walletAddress:  data.wallet_address,
    returnRate:     data.return_rate,
    receiptPreview: data.receipt_preview,
    receiptName:    data.receipt_name,
  };
};

export const dbUpdatePaymentStatus = async (id, status) => {
  const { error } = await supabase.from('payments').update({ status }).eq('id', id);
  if (error) { console.error('updatePaymentStatus:', error); return false; }
  return true;
};

// ─── WITHDRAWALS ─────────────────────────────────────────────────────────────

export const dbGetWithdrawals = async (userId = null) => {
  let query = supabase.from('withdrawals').select('*').order('date', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) { console.error('getWithdrawals:', error); return []; }
  return data;
};

export const dbInsertWithdrawal = async (w) => {
  const { data, error } = await supabase.from('withdrawals').insert([w]).select().single();
  if (error) { console.error('insertWithdrawal:', error); return null; }
  return data;
};

export const dbUpdateWithdrawalStatus = async (id, status) => {
  const { error } = await supabase.from('withdrawals').update({ status }).eq('id', id);
  if (error) { console.error('updateWithdrawalStatus:', error); return false; }
  return true;
};

// ─── BROADCASTS ──────────────────────────────────────────────────────────────

export const dbGetBroadcasts = async () => {
  const { data, error } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getBroadcasts:', error); return []; }
  return data;
};

export const dbInsertBroadcast = async (msg) => {
  const { data, error } = await supabase.from('broadcasts').insert([msg]).select().single();
  if (error) { console.error('insertBroadcast:', error); return null; }
  return data;
};

export const dbDeleteBroadcast = async (id) => {
  const { error } = await supabase.from('broadcasts').delete().eq('id', id);
  if (error) { console.error('deleteBroadcast:', error); return false; }
  return true;
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export const dbGetNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('getNotifications:', error); return []; }
  return data;
};

export const dbInsertNotification = async (n) => {
  const { data, error } = await supabase.from('notifications').insert([n]).select().single();
  if (error) { console.error('insertNotification:', error); return null; }
  return data;
};

export const dbMarkNotificationRead = async (id) => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) { console.error('markRead:', error); return false; }
  return true;
};

export const dbMarkAllNotificationsRead = async (userId) => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  if (error) { console.error('markAllRead:', error); return false; }
  return true;
};

export const dbDeleteNotification = async (id) => {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) { console.error('deleteNotification:', error); return false; }
  return true;
};

// ─── KYC ─────────────────────────────────────────────────────────────────────

export const dbGetKyc = async (userId = null) => {
  let query = supabase.from('kyc').select('*').order('submitted_at', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) { console.error('getKyc:', error); return userId ? null : []; }
  return userId ? (data?.[0] || null) : data;
};

export const dbUpsertKyc = async (kyc) => {
  const record = {
    user_id:        kyc.user_id,
    user_name:      kyc.user_name || null,
    user_email:     kyc.user_email || null,
    full_name:      kyc.full_name || null,
    dob:            kyc.dob || null,
    phone:          kyc.phone || null,
    address:        kyc.address || null,
    country:        kyc.country || null,
    id_type:        kyc.id_type || null,
    id_number:      kyc.id_number || null,
    document_front: kyc.document_front || kyc.document_image || null,
    document_back:  kyc.document_back || null,
    document_image: kyc.document_front || kyc.document_image || null,
    status:         kyc.status || 'Pending',
    submitted_at:   kyc.submitted_at || new Date().toISOString(),
  };
  const { data, error } = await supabase.from('kyc').upsert([record], { onConflict: 'user_id' }).select().single();
  if (error) { console.error('upsertKyc:', error); return null; }
  return data;
};

export const dbUpdateKycStatus = async (userId, status) => {
  const { error } = await supabase.from('kyc').update({ status }).eq('user_id', userId);
  if (error) { console.error('updateKycStatus:', error); return false; }
  return true;
};
