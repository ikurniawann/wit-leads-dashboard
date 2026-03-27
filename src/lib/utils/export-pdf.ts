/**
 * Export data to PDF format
 */

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  data: any[];
  columns: { header: string; key: string; width?: number }[];
}

export const exportToPDF = async (options: PDFExportOptions) => {
  try {
    // Dynamic import untuk menghindari SSR issues
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;

    const { title, subtitle, data, columns } = options;
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(192, 0, 0); // WIT red
    doc.text(title, 14, 20);
    
    // Add subtitle
    if (subtitle) {
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(subtitle, 14, 28);
    }
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 14, 35);
    
    // Prepare table data
    const tableHeaders = columns.map(col => col.header);
    const tableData = data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (value === null || value === undefined) return '-';
        if (col.key.includes('value') || col.key.includes('revenue')) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(value as number);
        }
        if (col.key.includes('date')) {
          return new Date(value as string).toLocaleDateString('id-ID');
        }
        return String(value);
      })
    );
    
    // Add table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [192, 0, 0] }, // WIT red
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 40 },
    });
    
    // Save PDF
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, message: 'Failed to export PDF' };
  }
};

export const exportLeadsToPDF = async (leads: any[]) => {
  const options: PDFExportOptions = {
    title: 'Leads Report',
    subtitle: 'Complete overview of all leads',
    data: leads,
    columns: [
      { header: 'Quotation ID', key: 'quotation_id' },
      { header: 'Company', key: 'company_name' },
      { header: 'Project', key: 'project_name' },
      { header: 'Client', key: 'client_name' },
      { header: 'PIC', key: 'pic_name' },
      { header: 'Status', key: 'status_id' },
      { header: 'Value', key: 'value', width: 100 },
    ],
  };
  
  return exportToPDF(options);
};

export const exportClientsToPDF = async (clients: any[]) => {
  const options: PDFExportOptions = {
    title: 'Clients Report',
    subtitle: 'Active clients database',
    data: clients,
    columns: [
      { header: 'Company', key: 'company_name' },
      { header: 'Contact Person', key: 'contact_person' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Industry', key: 'industry' },
      { header: 'Status', key: 'status' },
    ],
  };
  
  return exportToPDF(options);
};

export const exportEmployeesToPDF = async (employees: any[]) => {
  const options: PDFExportOptions = {
    title: 'Employees Report',
    subtitle: 'Employee directory',
    data: employees,
    columns: [
      { header: 'Name', key: 'employee_name' },
      { header: 'Position', key: 'position' },
      { header: 'Department', key: 'department' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Status', key: 'status' },
    ],
  };
  
  return exportToPDF(options);
};
