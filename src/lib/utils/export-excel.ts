/**
 * Export data to Excel (XLSX) format
 */

interface ExportData {
  [key: string]: string | number | null | undefined;
}

export const exportToExcel = async (data: ExportData[], filename: string = 'export.xlsx') => {
  try {
    // Dynamic import untuk menghindari SSR issues
    const { utils, writeFile } = await import('xlsx');

    // Create worksheet
    const ws = utils.json_to_sheet(data);

    // Create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');

    // Download file
    writeFile(wb, filename);
    
    return { success: true, message: 'Excel exported successfully' };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, message: 'Failed to export Excel' };
  }
};

export const exportLeadsToExcel = async (leads: any[]) => {
  const data = leads.map(lead => ({
    'Quotation ID': lead.quotation_id,
    'Company': lead.company_name,
    'Project': lead.project_name,
    'Client': lead.client_name || '-',
    'PIC': lead.pic_name || '-',
    'Status': lead.status_id,
    'Value (IDR)': lead.value || 0,
    'Probability': `${lead.probability || 0}%`,
    'Created': lead.created_at ? new Date(lead.created_at).toLocaleDateString('id-ID') : '-',
  }));

  const filename = `leads-export-${new Date().toISOString().split('T')[0]}.xlsx`;
  return exportToExcel(data, filename);
};

export const exportClientsToExcel = async (clients: any[]) => {
  const data = clients.map(client => ({
    'Company': client.company_name,
    'Contact Person': client.contact_person || '-',
    'Email': client.email || '-',
    'Phone': client.phone || '-',
    'Website': client.website || '-',
    'Industry': client.industry || '-',
    'Address': client.address || '-',
    'Tags': client.tags || '-',
    'Status': client.status,
  }));

  const filename = `clients-export-${new Date().toISOString().split('T')[0]}.xlsx`;
  return exportToExcel(data, filename);
};

export const exportEmployeesToExcel = async (employees: any[]) => {
  const data = employees.map(emp => ({
    'Name': emp.employee_name,
    'Email': emp.email || '-',
    'Phone': emp.phone || '-',
    'Position': emp.position || '-',
    'Department': emp.department || '-',
    'Join Date': emp.join_date ? new Date(emp.join_date).toLocaleDateString('id-ID') : '-',
    'Status': emp.status,
  }));

  const filename = `employees-export-${new Date().toISOString().split('T')[0]}.xlsx`;
  return exportToExcel(data, filename);
};
