import { ArrowLeft, ArrowRight, Search, Printer } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Axios from "../Axios";
import { getClasses } from "../utils/services/class.service";
import { Class, User } from "../utils/types/types";
import { format } from "date-fns";

const StudentBalances = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const componentRef = useRef<HTMLDivElement>(null);

  const limit = 40;

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.get("/invoices/students/balances", {
        params: { page: 1, limit: 1000 },
      });
      setAllUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes and users on mount
  useEffect(() => {
    fetchUsers();
    getClasses().then(setClasses);
  }, []);

  // Filter and paginate users
  useEffect(() => {
    let filteredUsers = [...allUsers];

    if (roleFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        roleFilter === "student"
          ? user.role === "student"
          : user.role === "teacher"
      );
    }

    if (selectedClass !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.class?._id === selectedClass
      );
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.phone?.includes(search) ||
          user.admissionNumber?.toLowerCase().includes(searchLower)
      );
    }

    const totalFilteredPages = Math.ceil(filteredUsers.length / limit);
    setTotalPages(totalFilteredPages || 1);
    const validPage = Math.min(page, totalFilteredPages || 1);
    setPage(validPage);

    const startIndex = (validPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedUsers(filteredUsers.slice(startIndex, endIndex));
  }, [allUsers, selectedClass, roleFilter, search, page, limit]);

  // Print function
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=1000");
    if (!printWindow || !componentRef.current) return;

    const printContent = componentRef.current.innerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Balances Report</title>
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
              .summary {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #e2e8f0;
                text-align: right;
                font-weight: 600;
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
            
            
            ${printContent}
            
       
            
            <div class="print-footer">
              Generated on ${format(
                new Date(),
                "MMMM dd, yyyy HH:mm"
              )} | Student Management System
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
    <div className="max-w-6xl mt-5 mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">User Balances</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setPage(1);
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
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        ref={componentRef}
        className="overflow-x-auto rounded-lg border border-gray-200"
      >
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Admission No.</th>
              <th className="px-6 py-4 font-medium">Class</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Balance (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.phone || ""}</td>
                  <td className="px-6 py-4">{user.admissionNumber || ""}</td>
                  <td className="px-6 py-4">
                    {user.class
                      ? `${user.class.name}${
                          user.class.section ? `-${user.class.section}` : ""
                        }`
                      : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "student"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role?.charAt(0).toUpperCase() +
                        user.role?.slice(1) || ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-blue-600">
                    {user.balance.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No users found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, allUsers.length)} of {allUsers.length} entries
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

export default StudentBalances;
