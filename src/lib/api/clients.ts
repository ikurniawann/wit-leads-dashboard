import { supabase } from '../supabase';

export interface Client {
  client_id: string;
  company_name: string;
  industry?: string;
  client_name?: string;
  client_position?: string;
  email?: string;
  phone?: string;
  company_address?: string;
  company_website?: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const clientsApi = {
  // GET ALL CLIENTS
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Client[];
  },

  // GET CLIENT BY ID
  async getById(clientId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) throw error;
    return data as Client;
  },

  // GET CLIENT WITH PROJECTS
  async getWithProjects(clientId: string) {
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (clientError) throw clientError;

    const { data: projects, error: projectsError } = await supabase
      .from('quotations')
      .select('quotation_id, project_name, status_id, grand_total, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;

    return {
      ...client,
      projects,
      totalProjects: projects.length,
      totalValue: projects.reduce((sum, p) => sum + (p.grand_total || 0), 0),
    };
  },

  // CREATE CLIENT
  async create(client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Client;
  },

  // UPDATE CLIENT
  async update(clientId: string, client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...client,
        updated_at: new Date().toISOString(),
      })
      .eq('client_id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data as Client;
  },

  // DELETE CLIENT
  async delete(clientId: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('client_id', clientId);

    if (error) throw error;
  },

  // SEARCH CLIENTS
  async search(query: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(
        `company_name.ilike.%${query}%,client_name.ilike.%${query}%,industry.ilike.%${query}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Client[];
  },
};
