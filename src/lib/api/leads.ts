import { supabase } from '../supabase';

export interface Lead {
  quotation_id: string;
  client_id: string;
  company_name: string;
  project_name: string;
  project_description?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_position?: string;
  pic_employee_id?: string;
  pic_excel_name?: string;
  status_id: string;
  currency: string;
  unit_value?: number;
  grand_total?: number;
  tax_percent?: number;
  tax_amount?: number;
  discount_percent?: number;
  discount_amount?: number;
  total_value?: number;
  quotation_date?: string;
  valid_until?: string | null;
  follow_up_date?: string | null;
  tags?: string[];
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LeadStats {
  total: number;
  new: number;
  approved: number;
  inProgress: number;
  done: number;
  cancelled: number;
  totalValue: number;
}

export const leadsApi = {
  // GET ALL LEADS
  async getAll() {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  // GET LEAD BY ID
  async getById(quotationId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('quotation_id', quotationId)
      .single();

    if (error) throw error;
    return data as Lead;
  },

  // GET LEADS BY STATUS
  async getByStatus(statusId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  // GET LEADS BY PIC
  async getByPic(employeeId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('pic_employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  // GET LEADS BY CLIENT
  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  // GET STATS
  async getStats() {
    const { data: allLeads, error } = await supabase
      .from('quotations')
      .select('status_id, grand_total, total_value');

    if (error) throw error;

    const stats: LeadStats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status_id === 'NEW').length,
      approved: allLeads.filter(l => l.status_id === 'APPROVED').length,
      inProgress: allLeads.filter(l => l.status_id === 'IN_PROGRESS').length,
      done: allLeads.filter(l => l.status_id === 'DONE').length,
      cancelled: allLeads.filter(l => l.status_id === 'CANCELLED').length,
      totalValue: allLeads.reduce((sum, l) => sum + (l.grand_total || l.total_value || 0), 0),
    };

    return stats;
  },

  // CREATE LEAD
  async create(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('quotations')
      .insert({
        ...lead,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  },

  // UPDATE LEAD
  async update(quotationId: string, lead: Partial<Lead>) {
    console.log('API Update - ID:', quotationId);
    console.log('API Update - Data:', lead);
    
    // Hapus field yang tidak boleh diupdate (read-only fields)
    const { quotation_id, created_at, created_by, client_id, ...updateData } = lead;
    
    // Pastikan ada data yang diupdate
    if (Object.keys(updateData).length === 0) {
      console.warn('No data to update');
      throw new Error('Tidak ada data yang diupdate');
    }
    
    try {
      const { data, error } = await supabase
        .from('quotations')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('quotation_id', quotationId)
        .select()
        .single();

      if (error) {
        console.error('API Update - Supabase Error:', error);
        
        // Berikan pesan error yang lebih informatif
        if (error.code === '23503') {
          throw new Error('Data tidak valid. Pastikan semua referensi sudah benar.');
        } else if (error.code === '42501') {
          throw new Error('Tidak memiliki izin untuk mengupdate data. Cek login Anda.');
        } else if (error.message?.includes('CORS')) {
          throw new Error('Masalah koneksi. Coba refresh halaman.');
        } else {
          throw new Error(`Update gagal: ${error.message || 'Unknown error'}`);
        }
      }
      
      console.log('API Update - Success:', data);
      return data as Lead;
    } catch (networkError: any) {
      console.error('API Update - Network Error:', networkError);
      if (networkError.message?.includes('fetch') || networkError.message?.includes('CORS')) {
        throw new Error('Koneksi ke server gagal. Cek internet Anda dan coba lagi.');
      }
      throw networkError;
    }
  },

  // DELETE LEAD
  async delete(quotationId: string) {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('quotation_id', quotationId);

    if (error) throw error;
  },

  // SOFT DELETE LEAD
  async softDelete(quotationId: string, userId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('quotation_id', quotationId)
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  },

  // SEARCH LEADS
  async search(query: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .or(
        `company_name.ilike.%${query}%,project_name.ilike.%${query}%,client_name.ilike.%${query}%,pic_excel_name.ilike.%${query}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  // GET PIPELINE BY MONTH
  async getPipelineByMonth(year: number = new Date().getFullYear()) {
    const { data, error } = await supabase
      .from('quotations')
      .select('created_at, grand_total, total_value, status_id');

    if (error) throw error;

    const monthlyData = Array(12).fill(0);
    const monthlyLeads = Array(12).fill(0);

    data.forEach(lead => {
      const month = new Date(lead.created_at).getMonth();
      const yearLead = new Date(lead.created_at).getFullYear();

      if (yearLead === year) {
        monthlyData[month] += lead.grand_total || lead.total_value || 0;
        monthlyLeads[month] += 1;
      }
    });

    return {
      revenue: monthlyData,
      leads: monthlyLeads,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };
  },

  // GET WIN RATE
  async getWinRate() {
    const { data, error } = await supabase
      .from('quotations')
      .select('status_id');

    if (error) throw error;

    const total = data.length;
    const won = data.filter(l => l.status_id === 'DONE').length;
    const winRate = total > 0 ? (won / total) * 100 : 0;

    return {
      total,
      won,
      winRate: Math.round(winRate * 100) / 100,
    };
  },

  // GET REVENUE BY PIC
  async getRevenueByPic() {
    const { data, error } = await supabase
      .from('quotations')
      .select('pic_excel_name, grand_total, total_value, status_id');

    if (error) throw error;

    const picData: Record<string, { revenue: number; leads: number }> = {};

    data.forEach(lead => {
      const pic = lead.pic_excel_name || 'Unassigned';
      if (!picData[pic]) {
        picData[pic] = { revenue: 0, leads: 0 };
      }
      picData[pic].revenue += lead.grand_total || lead.total_value || 0;
      picData[pic].leads += 1;
    });

    return Object.entries(picData).map(([pic, data]) => ({
      pic,
      revenue: data.revenue,
      leads: data.leads,
    }));
  },
};
