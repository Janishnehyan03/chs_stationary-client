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

    const doc = new jsPDF();
    const firstInvoice = data.invoices[0];

    // Extract Class Name & Current Date
    const className = `Class ${firstInvoice.class}`;
    const reportDate = `Date: ${new Date().toISOString().split('T')[0]}`;

    // School Name & Report Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CHS STATIONERY SHOP", 14, 15);
    doc.setFontSize(12);
    doc.text("Invoice Report", 14, 25);
    doc.setFontSize(10);
    doc.text(className, 14, 35);
    doc.text(reportDate, 160, 35);

    // Prepare table data
    let tableBody: any[] = [];
    let classTotalAmount = 0;
    let classPendingAmount = 0;
    let classPaidAmount = 0;
    let classStudentBalance = 0;

    data.invoices.forEach((invoice: any) => {
      tableBody.push([
        invoice.name,
        invoice.admissionNumber,
        invoice.class,
        invoice.totalAmount,
        { content: invoice.pendingAmount, styles: { textColor: [255, 0, 0] } },
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
      { content: "Class Totals:", colSpan: 3, styles: { fontStyle: "bold" } },
      classTotalAmount.toFixed(2),
      { content: classPendingAmount.toFixed(2), styles: { textColor: [255, 0, 0] } },
      classPaidAmount.toFixed(2),
      classStudentBalance.toFixed(2),
    ]);

    // Generate table
    autoTable(doc, {
      head: [
        [
          "Name",
          "Admission Number",
          "Class",
          "Total Amount",
          "Pending Amount",
          "Paid Amount",
          "Student Balance",
        ],
      ],
      body: tableBody,
      startY: 45,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        4: { textColor: [255, 0, 0] }, // Pending Amount in red
        3: { fontStyle: "bold" }, // Total Amount bold
        5: { fontStyle: "bold" }, // Paid Amount bold
        6: { fontStyle: "bold" }, // Student Balance bold
      },
    });

    // Save PDF
    doc.save(`Invoices_Class_${classId}.pdf`);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

export { downloadInvoicePDF };