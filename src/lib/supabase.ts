import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Lead {
  id: string;
  client_id: string;
  company_name: string;
  project_name: string;
  project_description: string | null;
  client_name: string | null;
  pic_employee_id: string | null;
  pic_excel_name: string | null;
  status_id: string;
  currency: string;
  unit_value: number | null;
  grand_total: number | null;
  tags: string[] | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  client_id: string;
  company_name: string;
  industry: string | null;
  client_name: string | null;
  email: string | null;
  phone: string | null;
  tags: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  employee_id: string;
  employee_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  department: string | null;
  join_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Leads API
export const leadsApi = {
  // Get all leads
  async getAll() {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Lead[];
  },

  // Get leads by status
  async getByStatus(statusId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Lead[];
  },

  // Get leads by PIC
  async getByPic(employeeId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('pic_employee_id', employeeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Lead[];
  },

  // Get single lead
  async getById(id: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Lead;
  },

  // Create lead
  async create(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('quotations')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  },

  // Update lead
  async update(id: string, lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('quotations')
      .update(lead)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  },

  // Delete lead
  async delete(id: string) {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get statistics
  async getStats() {
    const { data: allLeads, error } = await supabase
      .from('quotations')
      .select('status_id, grand_total');
    
    if (error) throw error;

    const stats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status_id === 'NEW').length,
      approved: allLeads.filter(l => l.status_id === 'APPROVED').length,
      inProgress: allLeads.filter(l => l.status_id === 'IN_PROGRESS').length,
      done: allLeads.filter(l => l.status_id === 'DONE').length,
      cancelled: allLeads.filter(l => l.status_id === 'CANCELLED').length,
      totalValue: allLeads.reduce((sum, l) => sum + (l.grand_total || 0), 0),
    };

    return stats;
  },
};

// Clients API
export const clientsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Client[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', id)
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async create(client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('client_id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('client_id', id);
    
    if (error) throw error;
  },
};

// Employees API
export const employeesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Employee[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', id)
      .single();
    
    if (error) throw error;
    return data as Employee;
  },

  async create(employee: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();
    
    if (error) throw error;
    return data as Employee;
  },

  async update(id: string, employee: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('employee_id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Employee;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('employee_id', id);
    
    if (error) throw error;
  },
};

// Utility functions
export const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
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
