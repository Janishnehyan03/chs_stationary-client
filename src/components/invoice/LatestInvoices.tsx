import { Search, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../Axios";
import { Invoice } from "../../utils/types/types";
import EditInvoiceModal from "./EditInvoiceModal";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceDrawer from "./InvoiceDrawer";
import dayjs from "dayjs";

export default function LatestInvoices({
  newDataAdded,
  limit,
  limitSelection,
}: {
  newDataAdded: any;
  limit: number | string;
  limitSelection: any;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter state
  const [filter, setFilter] = useState("year");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoiceData = async () => {
    try {
      let url = "";
      if (searchQuery) {
        url = `/invoices/search/data?search=${encodeURIComponent(searchQuery)}`;
      } else {
        const { startDate, endDate } =
          filter === "custom"
            ? {
              startDate: dayjs(customStartDate),
              endDate: dayjs(customEndDate),
            }
            : getFilterDates(filter);

        const params = new URLSearchParams({
          limit: String(limit || 10),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        url = `/invoices?${params.toString()}`;
      }

      const { data } = await Axios.get(url);
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [
    newDataAdded,
    limit,
    filter,
    customStartDate,
    customEndDate,
    searchQuery,
  ]);

  const handleSave = () => {
    fetchInvoiceData();
    setEditingInvoice(null);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = dayjs(invoice.createdAt);
    const { startDate, endDate } =
      filter === "custom"
        ? {
          startDate: dayjs(customStartDate),
          endDate: dayjs(customEndDate),
        }
        : getFilterDates(filter);

    return (invoiceDate.isAfter(startDate) || invoiceDate.isSame(startDate)) &&
      (invoiceDate.isBefore(endDate) || invoiceDate.isSame(endDate));
  });

  return (
    <div className="space-y-6">
      {/* Integrated Dashboard Section */}
      <InvoiceSummary
        filter={filter}
        setFilter={setFilter}
        setCustomStartDate={setCustomStartDate}
        setCustomEndDate={setCustomEndDate}
        invoicePaid={false}
        customStartDate={customStartDate || new Date()}
        customEndDate={customEndDate || new Date()}
      />

      {/* List Header & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full group">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Find records by name, ID or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 font-medium"
              />
            </div>
            {limitSelection}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-600">
              <PackageOpen size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2">
              No results match your criteria
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {searchQuery ? "Try adjusting your search terms or filters" : "Start by creating a new invoice record"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-gray-900/30 border-b border-gray-50 dark:border-gray-800">
                  <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] pl-8">Student</th>
                  <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Date</th>
                  <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Total</th>
                  <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Paid</th>
                  <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] text-right">Due</th>
                  <th className="p-5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] text-center">Status</th>
                  <th className="p-5 w-16 pr-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredInvoices.map((invoice) => (
                  <InvoiceItem
                    key={invoice._id}
                    invoice={invoice}
                    onView={(inv: any) => setSelectedInvoice(inv)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Drawer for Details */}
      <InvoiceDrawer
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        fetchInvoices={fetchInvoiceData}
      />

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
  const today = dayjs().endOf("day").toDate();
  const startOfWeek = dayjs().startOf("week").toDate();
  const startOfMonth = dayjs().startOf("month").toDate();
  const startOfYear = dayjs().startOf("year").toDate();

  switch (filter) {
    case "day":
      return {
        startDate: dayjs().startOf("day"),
        endDate: dayjs().endOf("day"),
      };
    case "week":
      return { startDate: dayjs(startOfWeek), endDate: dayjs(today) };
    case "month":
      return { startDate: dayjs(startOfMonth), endDate: dayjs(today) };
    case "year":
      return { startDate: dayjs(startOfYear), endDate: dayjs(today) };
    case "all":
      return { startDate: dayjs("2000-01-01"), endDate: dayjs(today) };
    default:
      return { startDate: dayjs(today).startOf("day"), endDate: dayjs(today) };
  }
};
