import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Axios from "../../Axios";

const downloadInvoicePDF = async (classId: string) => {
  try {
    const { data } = await Axios.get(`/invoices/download/${classId}`);

    if (!data || data.invoices.length === 0) {
      console.warn("No invoice data available");
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set default font to Helvetica
    doc.setFont('helvetica');

    const firstInvoice = data.invoices[0];

    // Extract Class Name & Current Date
    const className = `Class ${firstInvoice.class}`;
    const reportDate = `Date: ${new Date().toISOString().split('T')[0]}`;

    // Page margins
    const marginLeft = 15;
    const marginRight = 15;
    const pageWidth = doc.internal.pageSize.width;

    // Header: Dark navy blue banner
    doc.setFillColor(10, 61, 98); // Dark navy blue (#0A3D62)
    doc.rect(0, 0, pageWidth, 25, 'F');

    // School Name & Report Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('CHS STATIONERY SHOP', marginLeft + 35, 12);
    doc.setFontSize(11);
    doc.text('Invoice Report', marginLeft + 35, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(className, marginLeft, 32);
    doc.text(reportDate, pageWidth - marginRight - 30, 32);

    // Prepare table data
    let tableBody: any[] = [];
    let classTotalAmount = 0;
    let classPendingAmount = 0;
    let classPaidAmount = 0;
    let classStudentBalance = 0;

    data.invoices.forEach((invoice: any, index: number) => {
      tableBody.push([
        index + 1, // Add index number
        invoice.name,
        invoice.admissionNumber,
        { content: invoice.class, styles: { fillColor: [224, 247, 250] } }, // Highlight Class column
        invoice.totalAmount,
        { content: invoice.pendingAmount, styles: { textColor: [200, 0, 0] } },
        invoice.paidAmount,
        invoice.studentBalance,
      ]);

      // Update class totals
      classTotalAmount += parseFloat(invoice.totalAmount);
      classPendingAmount += parseFloat(invoice.pendingAmount);
      classPaidAmount += parseFloat(invoice.paidAmount);
      classStudentBalance += parseFloat(invoice.studentBalance);
    });

    // Add class totals
    tableBody.push([
      { content: 'Class Totals:', colSpan: 4, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
      classTotalAmount.toFixed(2),
      { content: classPendingAmount.toFixed(2), styles: { textColor: [200, 0, 0], fillColor: [240, 240, 240] } },
      classPaidAmount.toFixed(2),
      classStudentBalance.toFixed(2),
    ]);

    // Generate table
    autoTable(doc, {
      head: [
        [
          'S.No', // Add Serial Number header
          'Name',
          'Admission Number',
          'Class',
          'Total Amount',
          'Pending Amount',
          'Paid Amount',
          'Student Balance',
        ],
      ],
      body: tableBody,
      startY: 40,
      theme: 'striped',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2.5,
        textColor: [50, 50, 50],
      },
      headStyles: {
        fillColor: [10, 61, 98], // Dark navy blue (#0A3D62)
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 15 }, // S.No
        1: { cellWidth: 40 }, // Name
        2: { cellWidth: 30 }, // Admission Number
        3: { cellWidth: 20, fillColor: [224, 247, 250] }, // Class (highlighted)
        4: { cellWidth: 20, fontStyle: 'bold' }, // Total Amount
        5: { cellWidth: 20, textColor: [200, 0, 0] }, // Pending Amount
        6: { cellWidth: 20, fontStyle: 'bold' }, // Paid Amount
        7: { cellWidth: 20, fontStyle: 'bold' }, // Student Balance
      },
      margin: { left: marginLeft, right: marginRight },
      didDrawPage: (data) => {
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('CHS Stationery Shop  | ', marginLeft, pageHeight - 10);
        doc.setTextColor(0, 0, 255); // Blue for URL
        doc.textWithLink('chsstationery.shop', marginLeft + 40, pageHeight - 10, { url: 'https://chsstationery.shop' });
        doc.setTextColor(100, 100, 100);
        doc.text(' | Developed by ', marginLeft + 70, pageHeight - 10);
        doc.setTextColor(0, 128, 0); // Green for Digitio Stack
        doc.textWithLink('Digitio Stack', marginLeft + 95, pageHeight - 10, { url: 'https://digitiostack.vercel.app' });
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${data.pageNumber}`, pageWidth - marginRight - 10, pageHeight - 10);
      },
    });

    // Save PDF
    doc.save(`Invoices_Class_${classId}.pdf`);
  } catch (error) {
    console.error('Error fetching invoices:', error);
  }
};

export { downloadInvoicePDF };