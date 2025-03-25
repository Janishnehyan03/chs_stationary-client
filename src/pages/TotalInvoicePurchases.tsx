// src/components/TotalInvoicePurchases/TotalInvoicePurchases.tsx
import React, { useState, useEffect, useRef } from "react";
import { getPurchases } from "../utils/services/invoice.service";
import { getClasses } from "../utils/services/class.service";
import { format } from "date-fns";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Class } from "../utils/types/types";

interface Purchase {
  _id: string;
  user: {
    _id?: string;
    name: string;
    phone?: string;
    admissionNumber?: string;
    class?: { _id?: string; name: string; section?: string };
    role?: string; // Added role to user
  };
  totalAmount: number;
  amountPaid: number;
  createdAt: string;
}

const TotalInvoicePurchases: React.FC = () => {
  const [allPurchases, setAllPurchases] = useState<any[]>([]);
  const [displayedPurchases, setDisplayedPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [classes, setClasses] = useState<Class[]>([]);
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  // Fetch all purchases and classes on mount
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await getPurchases({
        page: 1,
        limit: 1000, // Fetch all data
      });
      setAllPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
    getClasses().then(setClasses);
  }, []);

  // Filter and paginate purchases
  useEffect(() => {
    let filtered = [...allPurchases];

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.user.role === roleFilter);
    }

    // Apply class filter
    if (selectedClass !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.user.class?._id === selectedClass
      );
    }

    // Apply search filter
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.user?.name?.toLowerCase().includes(searchLower) ||
          invoice.user?.phone?.includes(searchInput) ||
          invoice.user?.admissionNumber?.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const totalFilteredPages = Math.ceil(filtered.length / rowsPerPage);
    const validPage = Math.min(
      page,
      totalFilteredPages - 1 >= 0 ? totalFilteredPages - 1 : 0
    );
    setPage(validPage);
    const startIndex = validPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setDisplayedPurchases(filtered.slice(startIndex, endIndex));
  }, [allPurchases, page, rowsPerPage, searchInput, selectedClass, roleFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    setSearchInput("");
    setSelectedClass("all");
    setRoleFilter("all");
    setPage(0);
    fetchPurchases();
  };

  const totalFiltered = allPurchases.filter((invoice) => {
    if (!searchInput.trim() && selectedClass === "all" && roleFilter === "all")
      return true;
    const searchLower = searchInput.toLowerCase();
    return (
      (!searchInput.trim() ||
        invoice.user?.name?.toLowerCase().includes(searchLower) ||
        invoice.user?.phone?.includes(searchInput) ||
        invoice.user?.admissionNumber?.toLowerCase().includes(searchLower)) &&
      (selectedClass === "all" || invoice.user.class?._id === selectedClass) &&
      (roleFilter === "all" || invoice.user.role === roleFilter)
    );
  }).length;

  // Print to PDF
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
                <div>Date: ${format(new Date(), "MMMM dd, yyyy")}</div>
                <div>Total Records: ${totalFiltered}</div>
              </div>
            </div>
            
            ${printContent}
            
          
            
            <div class="invoice-footer">
              Generated on ${format(
                new Date(),
                "MMMM dd, yyyy HH:mm"
              )} | Powered by <a href="https://digitiostack.co.in/" target="_blank" rel="noopener noreferrer">Digitio Stack</a>
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Invoice Purchases
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Total {totalFiltered} purchases found
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or ID..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                  value={searchInput}
                  onChange={handleSearch}
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setPage(0);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
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
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
              </select>
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors no-print"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePrint()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors no-print"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div ref={componentRef} className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Identifier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Pending Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                      <span className="text-gray-500">
                        Loading purchases...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : displayedPurchases.length > 0 ? (
                displayedPurchases.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/user/${invoice.user?._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.user?.name || "Unknown User"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.user?.admissionNumber ||
                        invoice.user?.phone ||
                        ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.user.class
                        ? `${invoice.user.class.name}${
                            invoice.user.class.section
                              ? `-${invoice.user.class.section}`
                              : ""
                          }`
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                          : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(invoice.createdAt), "HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                      {invoice?.totalAmount?.toFixed(2) || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                      {invoice?.amountPaid?.toFixed(2) || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                      {(invoice?.totalAmount - invoice?.amountPaid)?.toFixed(
                        2
                      ) || ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">
                        No purchase invoices found matching your criteria
                      </p>
                      <button
                        onClick={handleRefresh}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[5, 10, 25].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, totalFiltered)} of{" "}
              {totalFiltered} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="p-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({
                  length: Math.min(5, Math.ceil(totalFiltered / rowsPerPage)),
                }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx)}
                    className={`w-8 h-8 rounded-md text-sm ${
                      page === idx
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                {Math.ceil(totalFiltered / rowsPerPage) > 5 && (
                  <span className="px-2">...</span>
                )}
              </div>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page + 1 >= Math.ceil(totalFiltered / rowsPerPage)}
                className="p-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalInvoicePurchases;
