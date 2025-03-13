import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../Axios";
import { Invoice } from "../../utils/types/types";
import EditInvoiceModal from "./EditInvoiceModal";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import dayjs from "dayjs";

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

  const fetchInvoices = async () => {
    try {
      const response = await Axios.get<Invoice[]>("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [newDataAdded]);

  const handleSave = () => {
    fetchInvoices(); // Refetch invoices from the server after saving
    setEditingInvoice(null);
  };

  // Filter invoices based on the selected date range
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

    return invoiceDate.isAfter(startDate) && invoiceDate.isBefore(endDate);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Management
          </h1>
          <p className="text-gray-500 mt-1">
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

      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Invoices Found
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first invoice to get started.
          </p>
          {/* <button className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            Create Invoice
          </button> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => {
            const totalAmount = invoice.items.reduce(
              (sum, item) => sum + item.quantity * item.product.price,
              0
            );

            return (
              <div
                key={invoice._id}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg"
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
                  className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 cursor-pointer text-sm font-medium transition-all p-3 hover:bg-gray-50 border-t border-gray-100"
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
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSave={handleSave}
        />
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
