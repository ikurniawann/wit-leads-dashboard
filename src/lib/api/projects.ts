import { supabase } from '../supabase';

export interface Project {
  project_id: string;
  quotation_id?: string;
  project_name: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  start_date?: string;
  end_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  budget?: number;
  actual_cost?: number;
  client_id?: string;
  client_name?: string;
  project_manager?: string;
  project_manager_name?: string;
  is_internal: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  completion_percent: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  member_id: string;
  project_id: string;
  employee_id?: string;
  employee_name?: string;
  vendor_id?: string;
  vendor_name?: string;
  vendor_member_name?: string;
  role: string;
  allocation_percent: number;
  hourly_rate?: number;
  joined_date: string;
  left_date?: string;
  is_active: boolean;
}

export interface ProjectDocument {
  document_id: string;
  project_id: string;
  document_type: string;
  document_name: string;
  file_url?: string;
  file_size_bytes?: number;
  file_type?: string;
  is_mandatory: boolean;
  is_uploaded: boolean;
  uploaded_by?: string;
  uploaded_at?: string;
  notes?: string;
}

export interface ProjectStats {
  active_projects: number;
  planning_projects: number;
  on_hold_projects: number;
  completed_projects: number;
  cancelled_projects: number;
  total_projects: number;
  active_budget: number;
  total_actual_cost: number;
  average_completion: number;
}

export const projectsApi = {
  // GET ALL PROJECTS
  async getAll() {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories!projects_category_id_fkey (
          category_name
        ),
        clients!projects_client_id_fkey (
          company_name
        ),
        employees!projects_project_manager_fkey (
          employee_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten nested data - Supabase returns arrays for relationships
    return projects.map(p => {
      const categories = p.project_categories as any[];
      const clients = p.clients as any[];
      const employees = p.employees as any[];
      
      return {
        ...p,
        category_name: categories?.[0]?.category_name || null,
        client_name: clients?.[0]?.company_name || null,
        project_manager_name: employees?.[0]?.employee_name || null,
      };
    }) as Project[];
  },

  // GET PROJECT BY ID
  async getById(projectId: string) {
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (category_name),
        clients (company_name),
        employees (employee_name)
      `)
      .eq('project_id', projectId)
      .single();

    if (error) throw error;

    return {
      ...project,
      category_name: project.project_categories?.category_name,
      client_name: project.clients?.company_name,
      project_manager_name: project.employees?.employee_name,
    } as Project;
  },

  // GET PROJECT WITH MEMBERS & DOCUMENTS
  async getWithDetails(projectId: string) {
    const project = await this.getById(projectId);

    const { data: members } = await supabase
      .from('project_members')
      .select(`
        *,
        employees (employee_name),
        vendors (vendor_name)
      `)
      .eq('project_id', projectId);

    const { data: documents } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('document_type');

    return {
      project,
      members: members?.map(m => ({
        ...m,
        employee_name: m.employees?.employee_name,
        vendor_name: m.vendors?.vendor_name,
      })) as ProjectMember[],
      documents: documents as ProjectDocument[],
    };
  },

  // GET PROJECTS BY STATUS
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  // GET PROJECT STATS
  async getStats() {
    const { data, error } = await supabase
      .from('project_statistics')
      .select('*')
      .single();

    if (error) throw error;
    return data as ProjectStats;
  },

  // CREATE PROJECT
  async create(project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Create default documents checklist
    if (data.project_id) {
      await this.createDocumentChecklist(data.project_id);
    }

    return data as Project;
  },

  // UPDATE PROJECT
  async update(projectId: string, project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString(),
      })
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  // DELETE PROJECT
  async delete(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;
  },

  // CREATE DOCUMENT CHECKLIST
  async createDocumentChecklist(projectId: string) {
    const documents = [
      { document_type: 'NDA', document_name: 'NDA / Confidentiality Agreement', is_mandatory: false },
      { document_type: 'PO', document_name: 'Purchase Order', is_mandatory: true },
      { document_type: 'PKS', document_name: 'Perjanjian Kerja Sama (PKS)', is_mandatory: true },
      { document_type: 'MOU', document_name: 'Memorandum of Understanding', is_mandatory: false },
      { document_type: 'QUOTATION', document_name: 'Quotation', is_mandatory: true },
      { document_type: 'SUMMARY', document_name: 'Quotation Summary', is_mandatory: false },
      { document_type: 'INVOICE', document_name: 'Invoice', is_mandatory: true },
      { document_type: 'UAT', document_name: 'User Acceptance Test Document', is_mandatory: true },
      { document_type: 'BAST', document_name: 'Berita Acara Serah Terima', is_mandatory: true },
    ];

    const { error } = await supabase
      .from('project_documents')
      .insert(
        documents.map(doc => ({
          project_id: projectId,
          ...doc,
          is_uploaded: false,
          created_at: new Date().toISOString(),
        }))
      );

    if (error) throw error;
  },

  // ADD PROJECT MEMBER
  async addMember(member: Partial<ProjectMember>) {
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        ...member,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMember;
  },

  // UPDATE PROJECT MEMBER
  async updateMember(memberId: string, member: Partial<ProjectMember>) {
    const { data, error } = await supabase
      .from('project_members')
      .update({
        ...member,
        updated_at: new Date().toISOString(),
      })
      .eq('member_id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMember;
  },

  // REMOVE PROJECT MEMBER
  async removeMember(memberId: string) {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('member_id', memberId);

    if (error) throw error;
  },

  // UPLOAD PROJECT DOCUMENT
  async uploadDocument(documentId: string, fileUrl: string, uploadedBy: string) {
    const { data, error } = await supabase
      .from('project_documents')
      .update({
        file_url: fileUrl,
        is_uploaded: true,
        uploaded_by: uploadedBy,
        uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('document_id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
