import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../Axios";
import { Invoice } from "../../utils/types/types";
import EditInvoiceModal from "./EditInvoiceModal";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import dayjs from "dayjs";
import { fetchInvoices } from "../../utils/services/invoice.service";

export default function LatestInvoices({
  newDataAdded,
}: {
  newDataAdded: boolean;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expandedInvoices, setExpandedInvoices] = useState<
    Record<string, boolean>
  >({});
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [invoicePaid, setInvoicePaid] = useState<boolean>(false);

  // Filter state
  const [filter, setFilter] = useState("month");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(
    new Date()
  );
  const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date());

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoiceData = async () => {
    const { data } = await Axios.get("/invoices");
    setInvoices(data);
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [newDataAdded]);

  const handleSave = () => {
    fetchInvoices(); // Refetch invoices from the server after saving
    setEditingInvoice(null);
  };

  // Filter invoices based on the selected date range and search query
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = dayjs(invoice.createdAt);
    const { startDate, endDate } =
      filter === "custom"
        ? {
            startDate: dayjs(customStartDate),
            endDate: dayjs(customEndDate),
          }
        : filter === "day"
        ? {
            startDate: dayjs().startOf("day"),
            endDate: dayjs().endOf("day"),
          }
        : getFilterDates(filter);

    // Check if the invoice date is within the selected range
    const isWithinDateRange =
      invoiceDate.isAfter(startDate) && invoiceDate.isBefore(endDate);

    // Check if the invoice matches the search query (case-insensitive)
    const matchesSearchQuery = invoice.user?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return isWithinDateRange && matchesSearchQuery;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Invoice Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage all student invoices
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <InvoiceSummary
        filter={filter}
        setFilter={setFilter}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        invoicePaid={invoicePaid}
      />

      {/* Search Box */}
      <div className="mt-6 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Invoices Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery
              ? "No invoices match your search."
              : "Create your first invoice to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => {
            const totalAmount = invoice.items.reduce(
              (sum, item) => sum + item.quantity * item.product.price,
              0
            );

            return (
              <div
                key={invoice._id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg dark:hover:shadow-gray-900"
              >
                {/* Invoice Header */}
                <InvoiceItem
                  invoice={invoice}
                  setEditingInvoice={setEditingInvoice}
                  fetchInvoices={fetchInvoices}
                  setInvoicePaid={setInvoicePaid}
                />

                {/* Show More / Show Less Toggle */}
                <button
                  onClick={() =>
                    setExpandedInvoices((prev) => ({
                      ...prev,
                      [invoice._id]: !prev[invoice._id],
                    }))
                  }
                  className="w-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer text-sm font-medium transition-all p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                >
                  {expandedInvoices[invoice._id]
                    ? "Hide Details"
                    : "View Details"}
                  {expandedInvoices[invoice._id] ? (
                    <ChevronUp
                      className="ml-1 transition-transform duration-300"
                      size={14}
                    />
                  ) : (
                    <ChevronDown
                      className="ml-1 transition-transform duration-300"
                      size={14}
                    />
                  )}
                </button>

                {/* Expanded Product Details */}
                {expandedInvoices[invoice._id] && (
                  <InvoiceDetails invoice={invoice} totalAmount={totalAmount} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <>
          <EditInvoiceModal
            invoice={editingInvoice}
            onClose={() => setEditingInvoice(null)}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
}

// Helper function to get filter dates
export const getFilterDates = (filter: string) => {
  const today = dayjs().toDate();
  const startOfWeek = dayjs().startOf("week").toDate();
  const startOfMonth = dayjs().startOf("month").toDate();
  const startOfYear = dayjs().startOf("year").toDate();

  switch (filter) {
    case "day":
      return { startDate: "", endDate: "" };
    case "week":
      return { startDate: dayjs(startOfWeek), endDate: dayjs(today) };
    case "month":
      return { startDate: dayjs(startOfMonth), endDate: dayjs(today) };
    case "year":
      return { startDate: dayjs(startOfYear), endDate: dayjs(today) };
    default:
      return { startDate: dayjs(today), endDate: dayjs(today) };
  }
};
