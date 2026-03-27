import { supabase } from '../supabase';

export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  specialization?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const vendorsApi = {
  // GET ALL VENDORS
  async getAll() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Vendor[];
  },

  // GET VENDOR BY ID
  async getById(vendorId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();

    if (error) throw error;
    return data as Vendor;
  },

  // GET ACTIVE VENDORS
  async getActive() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .order('vendor_name');

    if (error) throw error;
    return data as Vendor[];
  },

  // CREATE VENDOR
  async create(vendor: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert({
        ...vendor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Vendor;
  },

  // UPDATE VENDOR
  async update(vendorId: string, vendor: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .update({
        ...vendor,
        updated_at: new Date().toISOString(),
      })
      .eq('vendor_id', vendorId)
      .select()
      .single();

    if (error) throw error;
    return data as Vendor;
  },

  // DELETE VENDOR
  async delete(vendorId: string) {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('vendor_id', vendorId);

    if (error) throw error;
  },

  // TOGGLE VENDOR STATUS
  async toggleStatus(vendorId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('vendors')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('vendor_id', vendorId)
      .select()
      .single();

    if (error) throw error;
    return data as Vendor;
  },
};
