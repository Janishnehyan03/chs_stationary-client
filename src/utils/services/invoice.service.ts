import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Axios from "../../Axios";

const downloadInvoicePDF = async (classId: string) => {
  try {
    const { data } = await Axios.get(`/invoices/download/${classId}`);
    console.log(data);

    if (!data || data.invoices.length === 0) {
      console.warn("No invoice data available");
      return;
    }

    const doc = new jsPDF();
    const firstInvoice = data.invoices[0];

    // Extract Class Name & Date
    const className = `Class ${firstInvoice.student.class.name}${firstInvoice.student.class.section}`;
    const reportDate = `Date: ${firstInvoice.date}`;

    // School Name & Report Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CHS STATIONERY SHOP", 14, 15);
    doc.setFontSize(12);
    doc.text("Invoice Report", 14, 25);
    doc.setFontSize(10);
    doc.text(className, 14, 35);
    doc.text(reportDate, 160, 35);

    let tableBody: any[] = [];
    let classTotalAmount = 0;
    let classTotalDue = 0;

    data.invoices.forEach((invoice: any) => {
      // Add Student Header Row
      tableBody.push([
        invoice.date,
        `${invoice.student.name} (${invoice.student.admissionNo})`,
        "",
        "",
        "",
      ]);

      // Add Product Details for the Student
      invoice.items.forEach((item: any) => {
        tableBody.push([
          "",
          item.product.title,
          item.quantity,
          item.product.price.toFixed(2),
          item.total,
        ]);
      });

      // Add Student Totals
      tableBody.push([
        "",
        "",
        "Total Amount:",
        "",
        invoice.totalAmount,
      ]);
      tableBody.push([
        "",
        "",
        { content: "Pending Amount:", styles: { textColor: [255, 0, 0] } },
        "",
        { content: invoice.dueAmount, styles: { textColor: [255, 0, 0] } },
      ]);
      tableBody.push(["", "", "", "", ""]); // Empty row for spacing

      // Update Class Totals
      classTotalAmount += parseFloat(invoice.totalAmount);
      classTotalDue += parseFloat(invoice.dueAmount);
    });

    // Add Class Totals at the End
    tableBody.push([
      "",
      "",
      "Class Total Amount:",
      "",
      classTotalAmount.toFixed(2),
    ]);
    tableBody.push([
      "",
      "",
      { content: "Class Pending Amount:", styles: { textColor: [255, 0, 0] } },
      "",
      { content: classTotalDue.toFixed(2), styles: { textColor: [255, 0, 0] } },
    ]);

    // Generate Table
    autoTable(doc, {
      head: [["Date", "Student", "Product", "Quantity", "Price", "Total"]],
      body: tableBody,
      startY: 45,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: { 4: { fontStyle: "bold" } },
    });

    // Save PDF
    doc.save(`Invoices_Class_${classId}.pdf`);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

export { downloadInvoicePDF };