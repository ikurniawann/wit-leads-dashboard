import { supabase } from '../supabase';

export interface Employee {
  employee_id: string;
  employee_name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  join_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const employeesApi = {
  // GET ALL EMPLOYEES
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Employee[];
  },

  // GET EMPLOYEE BY ID
  async getById(employeeId: string) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error) throw error;
    return data as Employee;
  },

  // GET EMPLOYEE WITH LEADS
  async getWithLeads(employeeId: string) {
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (employeeError) throw employeeError;

    const { data: leads, error: leadsError } = await supabase
      .from('quotations')
      .select('quotation_id, project_name, company_name, status_id, grand_total')
      .eq('pic_employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    return {
      ...employee,
      leads,
      totalLeads: leads.length,
      totalValue: leads.reduce((sum, l) => sum + (l.grand_total || 0), 0),
    };
  },

  // CREATE EMPLOYEE
  async create(employee: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .insert({
        ...employee,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  // UPDATE EMPLOYEE
  async update(employeeId: string, employee: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update({
        ...employee,
        updated_at: new Date().toISOString(),
      })
      .eq('employee_id', employeeId)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  // DELETE EMPLOYEE
  async delete(employeeId: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('employee_id', employeeId);

    if (error) throw error;
  },

  // SEARCH EMPLOYEES
  async search(query: string) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(
        `employee_name.ilike.%${query}%,email.ilike.%${query}%,position.ilike.%${query}%,department.ilike.%${query}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Employee[];
  },

  // GET ACTIVE EMPLOYEES
  async getActive() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', 'active')
      .order('employee_name', { ascending: true });

    if (error) throw error;
    return data as Employee[];
  },
};
