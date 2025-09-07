import * as XLSX from 'xlsx';
import type { Project } from '../types/api';
import type { SubmittedReport } from '../hooks/useSubmittedReports';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const generateProjectReportExcel = (
    project: Project,
    reports: SubmittedReport[]
): void => {
    const workbook = XLSX.utils.book_new();

    // Create Project Details Sheet
    const projectSheet = createProjectDetailsSheet(project);
    XLSX.utils.book_append_sheet(workbook, projectSheet, 'Project Details');

    // Create a sheet for each report
    reports.forEach((report, index) => {
        const reportSheet = createReportSheet(report);
        const sheetName = `Report ${index + 1} (${report.id.slice(-8)})`;
        XLSX.utils.book_append_sheet(workbook, reportSheet, sheetName);
    });

    // Generate and download the Excel file
    const fileName = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
};

const createProjectDetailsSheet = (project: Project): XLSX.WorkSheet => {
    const data = [
        ['Project Report', ''],
        ['Generated On', formatDate(new Date().toISOString())],
        ['', ''],
        ['PROJECT INFORMATION', ''],
        ['Project Name', project.name],
        ['Description', project.description],
        ['Status', project.status || 'Not specified'],
        ['Project Type', project.projectType.name],
        ['Created Date', formatDate(project.createdAt)],
        ['Last Updated', formatDate(project.updatedAt)],
        ['Due Date', project.dueDate ? formatDate(project.dueDate) : 'Not set'],
        ['', ''],
    ];

    // Add Agent Information if available
    if (project.assignedAgent) {
        data.push(
            ['ASSIGNED AGENT', ''],
            ['Agent Name', project.assignedAgent.fullName],
            ['Email', project.assignedAgent.email],
            ['Phone', project.assignedAgent.phoneNumber],
            ['Status', project.assignedAgent.status],
            ['', '']
        );
    }

    // Add Customer Information if available
    if (project.customer) {
        data.push(
            ['CUSTOMER INFORMATION', ''],
            ['Customer Name', project.customer.fullName],
            ['Email', project.customer.email],
            ['Phone', project.customer.phoneNumber],
            ['Status', project.customer.status],
            ['', '']
        );
    }

    // Add Report Progress if available
    if (project.reportProgress) {
        data.push(
            ['REPORT PROGRESS', ''],
            ['Total Reports', project.reportProgress.totalReports.toString()],
            ['Completed Reports', project.reportProgress.completedReports.toString()],
            ['In Progress Reports', project.reportProgress.inProgressReports.toString()],
            ['Pending Reports', project.reportProgress.pendingReports.toString()],
            ['Completion Rate', `${Math.round((project.reportProgress.completedReports / project.reportProgress.totalReports) * 100)}%`]
        );
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
        { width: 25 }, // Column A
        { width: 50 }, // Column B
    ];

    // Style headers
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let row = range.s.r; row <= range.e.r; row++) {
        const cellA = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (worksheet[cellA] && typeof worksheet[cellA].v === 'string') {
            const cellValue = worksheet[cellA].v;
            // Style section headers
            if (cellValue.includes('INFORMATION') || cellValue.includes('PROGRESS') || cellValue.includes('AGENT') || cellValue.includes('CUSTOMER')) {
                worksheet[cellA].s = {
                    font: { bold: true, color: { rgb: '000000' } },
                    fill: { fgColor: { rgb: 'E3F2FD' } }
                };
            }
            // Style main title
            if (cellValue === 'Project Report') {
                worksheet[cellA].s = {
                    font: { bold: true, size: 16, color: { rgb: '000000' } },
                    fill: { fgColor: { rgb: 'BBDEFB' } }
                };
            }
        }
    }

    return worksheet;
};

const createReportSheet = (report: SubmittedReport): XLSX.WorkSheet => {
    const data = [
        ['Report Details', ''],
        ['Report ID', report.id],
        ['Status', report.status],
        ['Submitted Date', formatDate(report.createdAt)],
        ['Last Updated', formatDate(report.updatedAt)],
    ];

    // Add approval/rejection info
    if (report.approvedAt) {
        data.push(['Approved Date', formatDate(report.approvedAt)]);
    }
    if (report.rejectedAt) {
        data.push(['Rejected Date', formatDate(report.rejectedAt)]);
    }
    if (report.approvalComments) {
        data.push(['Approval Comments', report.approvalComments]);
    }
    if (report.rejectionComments) {
        data.push(['Rejection Comments', report.rejectionComments]);
    }

    data.push(['', '']);

    // Add report sections
    report.reportData.forEach((section, sectionIndex) => {
        data.push([`SECTION ${sectionIndex + 1}: ${section.name ? section.name.toUpperCase() : 'UNNAMED SECTION'}`, '']);

        if (section.description && section.description !== section.name) {
            data.push(['Description', section.description]);
        }

        data.push(['', '']);

        // Add fields
        section.data.forEach((field) => {
            let value = field.value;

            // Format boolean values
            if (field.type === 'boolean' || field.type === 'checkbox') {
                value = field.value === 'true' ? 'Yes' : 'No';
            }

            // Handle image types
            if (field.type === 'image') {
                value = `[Image Attachment: ${field.value}]`;
            }

            data.push([`${field.name || 'Unnamed Field'} (${field.type})`, value]);
        });

        data.push(['', '']);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
        { width: 30 }, // Column A
        { width: 60 }, // Column B
    ];

    // Style headers
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let row = range.s.r; row <= range.e.r; row++) {
        const cellA = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (worksheet[cellA] && typeof worksheet[cellA].v === 'string') {
            const cellValue = worksheet[cellA].v;

            // Style section headers
            if (cellValue.startsWith('SECTION')) {
                worksheet[cellA].s = {
                    font: { bold: true, color: { rgb: '000000' } },
                    fill: { fgColor: { rgb: 'E8F5E8' } }
                };
            }

            // Style main title
            if (cellValue === 'Report Details') {
                worksheet[cellA].s = {
                    font: { bold: true, size: 14, color: { rgb: '000000' } },
                    fill: { fgColor: { rgb: 'C8E6C9' } }
                };
            }
        }
    }

    return worksheet;
};
