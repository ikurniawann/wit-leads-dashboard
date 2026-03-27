import { supabase } from '../supabase';

export interface EmployeeWorkload {
  employee_id: string;
  employee_name: string;
  position: string;
  department: string;
  employee_status: string;
  active_projects_count: number;
  total_allocation_percent: number;
  project_names: string;
  workload_status: 'OVERLOADED' | 'OPTIMAL' | 'UNDERLOADED' | 'AVAILABLE';
}

export interface WorkloadStats {
  total_employees: number;
  overloaded: number;
  optimal: number;
  underloaded: number;
  available: number;
  average_allocation: number;
}

export const workloadApi = {
  // GET ALL EMPLOYEE WORKLOAD
  async getAll() {
    const { data, error } = await supabase
      .from('employee_workload')
      .select('*')
      .order('total_allocation_percent', { ascending: false });

    if (error) throw error;
    return data as EmployeeWorkload[];
  },

  // GET WORKLOAD STATS
  async getStats() {
    const workloads = await this.getAll();
    
    const stats: WorkloadStats = {
      total_employees: workloads.length,
      overloaded: workloads.filter(w => w.workload_status === 'OVERLOADED').length,
      optimal: workloads.filter(w => w.workload_status === 'OPTIMAL').length,
      underloaded: workloads.filter(w => w.workload_status === 'UNDERLOADED').length,
      available: workloads.filter(w => w.workload_status === 'AVAILABLE').length,
      average_allocation: workloads.length > 0 
        ? workloads.reduce((sum, w) => sum + (w.total_allocation_percent || 0), 0) / workloads.length 
        : 0,
    };

    return stats;
  },

  // GET OVERLOADED EMPLOYEES
  async getOverloaded() {
    const workloads = await this.getAll();
    return workloads.filter(w => w.workload_status === 'OVERLOADED');
  },

  // GET AVAILABLE EMPLOYEES
  async getAvailable() {
    const workloads = await this.getAll();
    return workloads.filter(w => w.workload_status === 'AVAILABLE' || w.workload_status === 'UNDERLOADED');
  },
};
