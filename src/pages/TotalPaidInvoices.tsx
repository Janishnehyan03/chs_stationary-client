// components/PaidInvoices.jsx
import { format } from "date-fns";
import {
    ChevronLeft,
    ChevronRight,
    Printer,
    Search,
    User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Axios from "../Axios";
import { getClasses } from "../utils/services/class.service";
import { Class } from "../utils/types/types";
  
  const TotalPaidInvoices = () => {
    const [allInvoices, setAllInvoices] = useState<any[]>([]); // All invoices fetched once
    const [displayedInvoices, setDisplayedInvoices] = useState<any[]>([]); // Filtered and paginated invoices
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [classes, setClasses] = useState<Class[]>([]);
    const componentRef = useRef<HTMLDivElement>(null);
  
    // Fetch all paid invoices once (no search param)
    const fetchPaidInvoices = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/invoices/paid/all", {
          params: {
            page: 1,
            limit: 1000, // Fetch a large number to get all data
          },
        });
        setAllInvoices(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch invoices and classes on mount
    useEffect(() => {
      fetchPaidInvoices();
      getClasses().then(setClasses);
    }, []);
  
    // Filter and paginate invoices on the frontend
    useEffect(() => {
      let filteredInvoices = [...allInvoices];
  
      // Apply role filter
      if (roleFilter !== "all") {
        filteredInvoices = filteredInvoices.filter(
          (invoice) => invoice.user.role === roleFilter
        );
      }
  
      // Apply class filter
      if (selectedClass !== "all") {
        filteredInvoices = filteredInvoices.filter(
          (invoice) => invoice.user.class?._id === selectedClass
        );
      }
  
      // Apply search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredInvoices = filteredInvoices.filter(
          (invoice) =>
            invoice.user.name.toLowerCase().includes(searchLower) ||
            invoice.user.phone?.includes(searchTerm) ||
            invoice.user.admissionNumber?.toLowerCase().includes(searchLower)
        );
      }
  
      // Pagination
      const totalFiltered = filteredInvoices.length;
      const totalFilteredPages = Math.ceil(totalFiltered / pagination.limit);
      const validPage = Math.min(
        pagination.page,
        totalFilteredPages > 0 ? totalFilteredPages : 1
      );
      setPagination((prev) => ({
        ...prev,
        total: totalFiltered,
        totalPages: totalFilteredPages,
        page: validPage,
      }));
  
      const startIndex = (validPage - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      setDisplayedInvoices(filteredInvoices.slice(startIndex, endIndex));
    }, [
      allInvoices,
      pagination.page,
      pagination.limit,
      searchTerm,
      selectedClass,
      roleFilter,
    ]);
  
    const handlePageChange = (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
    };
  
    // Calculate total paid amount
    const totalPaidAmount = displayedInvoices.reduce(
      (sum, invoice) => sum + (invoice.amountPaid || 0),
      0
    );
  
    // Print function
    const handlePrint = () => {
      const printWindow = window.open("", "", "width=800,height=1000");
      if (!printWindow || !componentRef.current) return;
  
      const printContent = componentRef.current.innerHTML;
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Paid Invoices Report</title>
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
                .print-container {
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                  background: white;
                }
                .print-header {
                  border-bottom: 2px solid #2563eb;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .print-header h1 {
                  color: #2563eb;
                  font-size: 24px;
                  margin: 0;
                  font-weight: 600;
                }
                .print-meta {
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
                .print-footer {
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
            <div class="print-container">
              <div class="print-header">
                <h1>Paid Invoices Report</h1>
                <div class="print-meta">
                  <div>Date: ${format(new Date(), "MMMM dd, yyyy")}</div>
                  <div>Total Records: ${pagination.total}</div>
                </div>
              </div>
              
              ${printContent}
              
              <div class="print-footer">
                Generated on ${format(new Date(), "MMMM dd, yyyy HH:mm")} | Invoice Management System
              </div>
            </div>
          </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    };
  
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Paid Invoices
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total Paid: ₹{totalPaidAmount.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, phone, or admission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-40 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} {cls.section ? ` - ${cls.section}` : ""}
                </option>
              ))}
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-40 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
  
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">Loading invoices...</p>
          </div>
        )}
  
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
  
        {/* Invoices Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div ref={componentRef}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Admission No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedInvoices.length > 0 ? (
                    displayedInvoices.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                              {invoice.user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">
                              {invoice.user.admissionNumber || ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {invoice.user.phone || ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">
                              {format(
                                new Date(invoice.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-green-600">
                              ₹{invoice.amountPaid?.toFixed(2) || ""}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No paid invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
  
            {/* Pagination */}
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-gray-50 border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total} invoices
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-4 py-2 bg-blue-50 rounded-md text-sm font-medium text-blue-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default TotalPaidInvoices;