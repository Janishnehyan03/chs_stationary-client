import { ArrowLeft, ArrowRight, Search, Printer } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Axios from "../Axios";
import { getClasses } from "../utils/services/class.service";
import { Class } from "../utils/types/types";

interface User {
  name: string;
  phone: string;
  admissionNumber: string;
  class?: {
    _id?: string;
    name: string;
    section?: string;
  };
  role?: "student" | "teacher" | string;
}

interface Invoice {
  _id: string;
  user: User;
  amountPaid: number;
  totalAmount: number;
  status: "paid" | "unpaid" | string;
}

const DueInvoices = () => {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [displayedInvoices, setDisplayedInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const limit = 40;

  const componentRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.get<{ data: Invoice[] }>(
        "/invoices/due/all",
        {
          params: { page: 1, limit: 1000 },
        }
      );
      setAllInvoices(data.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    getClasses().then((classes) => setClasses(classes || []));
  }, []);

  useEffect(() => {
    let filteredInvoices = [...allInvoices];

    if (roleFilter !== "all") {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.user.role === roleFilter
      );
    }

    if (selectedClass !== "all") {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.user.class?._id === selectedClass
      );
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          invoice.user.name.toLowerCase().includes(searchLower) ||
          invoice.user.admissionNumber?.toLowerCase().includes(searchLower) ||
          invoice.user.phone?.includes(search)
      );
    }

    const totalFilteredPages = Math.ceil(filteredInvoices.length / limit);
    setTotalPages(totalFilteredPages || 1);
    const validPage = Math.min(page, totalFilteredPages || 1);
    setPage(validPage);

    const startIndex = (validPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedInvoices(filteredInvoices.slice(startIndex, endIndex));
  }, [allInvoices, search, page, selectedClass, roleFilter, limit]);

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=1000");
    if (!printWindow || !componentRef.current) return;

    const printContent = componentRef.current.innerHTML;

    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice Purchases Report</title>
                <style>
                    @media print {
                        @page {
                            size: A4;
                            margin: 20mm;
                        }
                        body {
                            font-family: 'Arial', sans-serif;
                            color: #333;
                            line-height: 1.4;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .invoice-container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            background: white;
                        }
                        .invoice-header {
                            border-bottom: 2px solid #2563eb;
                            padding-bottom: 15px;
                            margin-bottom: 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .invoice-header h1 {
                            color: #2563eb;
                            font-size: 24px;
                            margin: 0;
                            font-weight: 600;
                        }
                        .invoice-meta {
                            text-align: right;
                            font-size: 12px;
                            color: #666;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                            font-size: 14px;
                        }
                        th {
                            background: #f8fafc;
                            color: #1e293b;
                            font-weight: 600;
                            padding: 12px 15px;
                            text-align: left;
                            border-bottom: 2px solid #e2e8f0;
                        }
                        td {
                            padding: 12px 15px;
                            border-bottom: 1px solid #eef2ff;
                        }
                        tr:hover {
                            background: #f9fafb;
                        }
                        .summary {
                            margin-top: 20px;
                            padding-top: 15px;
                            border-top: 1px solid #e2e8f0;
                            text-align: right;
                            font-weight: 600;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .invoice-footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 12px;
                            color: #64748b;
                            border-top: 1px solid #e2e8f0;
                            padding-top: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="invoice-header">
                        <h1>Invoice Purchases Report</h1>
                        <div class="invoice-meta">
                            <div>Date: ${new Date().toLocaleDateString()}</div>
                            <div>Total Records: ${allInvoices.length}</div>
                        </div>
                    </div>
                    
                    ${printContent}
                    
                    <div class="invoice-footer">
                        Generated on ${new Date().toLocaleString()} | Powered by <a href="https://digitiostack.co.in/" target="_blank" rel="noopener noreferrer">Digitio Stack</a>
                    </div>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();

    // Wait for content to render before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="max-w-6xl mt-6 mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Due Invoices</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, phone, or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} {cls.section ? ` - ${cls.section}` : ""}
              </option>
            ))}
          </select>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
          {/* Print Button */}
          <button
            onClick={() => handlePrint()}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors no-print"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print PDF
          </button>
        </div>
      </div>

      {/* Printable Content */}
      <div
        ref={componentRef}
        className="overflow-x-auto rounded-lg border border-gray-200 print:block"
      >
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-50 text-indigo-900 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Phone / Adm. No</th>
              <th className="px-6 py-4 font-medium">Class</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Amount Paid</th>
              <th className="px-6 py-4 font-medium text-right">Total Amount</th>
              <th className="px-6 py-4 font-medium text-right">Due</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span>{invoice.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {invoice.user.phone ||
                      invoice.user.admissionNumber ||
                      "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {invoice.user.class
                      ? `${invoice.user.class.name}${
                          invoice.user.class.section
                            ? `-${invoice.user.class.section}`
                            : ""
                        }`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.user.role === "student"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {invoice.user.role
                        ? invoice.user.role.charAt(0).toUpperCase() +
                          invoice.user.role.slice(1)
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {invoice.amountPaid.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {invoice.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600">
                    {(invoice.totalAmount - invoice.amountPaid).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        invoice.status === "paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  {allInvoices.length === 0
                    ? "Loading invoices..."
                    : "No due invoices found matching your criteria"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 no-print">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, allInvoices.length)} of {allInvoices.length}{" "}
          invoices
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-gray-700 font-medium px-4">
            Page {page} of {totalPages}
          </span>
          <button
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          >
            <ArrowRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DueInvoices;
