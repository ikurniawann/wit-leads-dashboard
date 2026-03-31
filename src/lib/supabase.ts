import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Create admin client for operations that need service role
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// Re-export dari api modules untuk backward compatibility
export { leadsApi, clientsApi, employeesApi } from './api';
export type { Lead, LeadStats } from './api/leads';
export type { Client } from './api/clients';
export type { Employee } from './api/employees';

// Utility functions
export const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const getStatusBadgeClass = (statusId: string) => {
  switch (statusId) {
    case 'NEW':
      return 'badge-new';
    case 'APPROVED':
      return 'badge-approved';
    case 'IN_PROGRESS':
      return 'badge-in-progress';
    case 'DONE':
      return 'badge-done';
    case 'CANCELLED':
      return 'badge-cancelled';
    default:
      return 'badge-new';
  }
};

export const getStatusLabel = (statusId: string) => {
  const labels: Record<string, string> = {
    NEW: 'Baru',
    APPROVED: 'Disetujui',
    IN_PROGRESS: 'Dalam Proses',
    DONE: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return labels[statusId] || statusId;
};
