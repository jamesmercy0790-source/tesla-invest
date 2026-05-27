import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── USERS ───────────────────────────────────────────────────────────────────

export const dbGetUsers = async () => {
  const { data, error } = await supabase.from('users').select('*').order('joined', { ascending: false });
  if (error) { console.error('getUsers:', error); return []; }
  return data;
};

export const dbRegister = async (name, email, password) => {
  // Check duplicate email
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .ilike('email', email)
    .maybeSingle();

  if (existing) return { user: null, error: 'This email is already registered.' };

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    joined: new Date().toISOString().split('T')[0],
  };

  const { error } = await supabase.from('users').insert([user]);
  if (error) { console.error('register:', error); return { user: null, error: 'Registration failed. Please try again.' }; }
  return { user, error: null };
};

export const dbLogin = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error || !data) return { user: null, error: 'Invalid email or password.' };
  return { user: data, error: null };
};

// ─── CARS ────────────────────────────────────────────────────────────────────

export const dbGetCars = async () => {
  const { data, error } = await supabase.from('cars').select('*').order('id', { ascending: true });
  if (error) { console.error('getCars:', error); return null; } // null = fallback to defaults
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
  const { data, error } = await supabase.from('investments').insert([inv]).select().single();
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

export const dbInsertOrder = async (order) => {
  const { data, error } = await supabase.from('orders').insert([order]).select().single();
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
  return data;
};

export const dbInsertPayment = async (payment) => {
  const { data, error } = await supabase.from('payments').insert([payment]).select().single();
  if (error) { console.error('insertPayment:', error); return null; }
  return data;
};

export const dbUpdatePaymentStatus = async (id, status) => {
  const { error } = await supabase.from('payments').update({ status }).eq('id', id);
  if (error) { console.error('updatePaymentStatus:', error); return false; }
  return true;
};
