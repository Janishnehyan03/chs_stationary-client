import { ArrowLeft, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../../Axios";
import { Invoice } from "../../utils/types/types";
import EditInvoiceModal from "./EditInvoiceModal";
import InvoiceItem from "./InvoiceItem";

const fetchInvoicesByStudentId = async (
  studentId: string
): Promise<Invoice[]> => {
  try {
    const response = await Axios.get(`/invoices/user/${studentId}`);
    // API should return { invoices: [...] }
    return response.data.invoices || [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

const initiatePayment = async (invoiceId: string) => {
  try {
    const response = await Axios.post(
      `/payment/initiate/${invoiceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200 && response.data.paymentUrl) {
      window.location.href = response.data.paymentUrl;
    } else {
      throw new Error("No payment URL returned");
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    alert("Failed to initiate payment. Please try again.");
  }
};

const downloadInvoice = async (invoiceId: string) => {
  try {
    const response = await Axios.get(`/api/invoices/download/${invoiceId}`, {
      responseType: "blob",
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error("Failed to download invoice");
    }
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Failed to download invoice. Please try again.");
  }
};

export default function StudentInvoices() {
  const { studentId } = useParams<{ studentId: string }>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [invoicePaid, setInvoicePaid] = useState(false);

  // Bulk Payment State
  const [isBulkPayModalOpen, setIsBulkPayModalOpen] = useState(false);
  const [bulkAmount, setBulkAmount] = useState<number | "">("");
  const [bulkMethod, setBulkMethod] = useState<"cash" | "online" | "balance" | "other">("cash");
  const [useBalance, setUseBalance] = useState<boolean>(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  useEffect(() => {
    const loadInvoices = async () => {
      if (!studentId) {
        setError("Invalid student ID");
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await fetchInvoicesByStudentId(studentId);
      setInvoices(data);
      setLoading(false);
    };
    loadInvoices();
  }, [studentId, invoicePaid]);

  const handleBulkPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || bulkAmount === "") return;

    setIsProcessingBulk(true);
    try {
      const response = await Axios.patch(`/invoices/bulk-pay/${studentId}`, {
        amount: Number(bulkAmount),
        method: bulkMethod,
        useBalance: useBalance,
      });

      toast.success(response.data.message || "Bulk payment successful!");

      // Close modal and reset state
      setIsBulkPayModalOpen(false);
      setBulkAmount("");
      setBulkMethod("cash");
      setUseBalance(false);

      // Trigger a refresh of invoices
      setInvoicePaid((prev) => !prev);
    } catch (error: any) {
      console.error("Bulk payment error:", error);
      toast.error(error.response?.data?.message || "Failed to process bulk payment.");
    } finally {
      setIsProcessingBulk(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/students"
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              title="Back to Students"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Invoices for User
            </h1>
          </div>
          <button
            onClick={() => setIsBulkPayModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors font-medium"
          >
            <CreditCard size={18} />
            Bulk Pay
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No invoices found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    <th className="p-4 font-medium">Student Info</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Total (₹)</th>
                    <th className="p-4 font-medium">Paid (₹)</th>
                    <th className="p-4 font-medium text-right">Due (₹)</th>
                    <th className="p-4 font-medium text-center">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {invoices.map((invoice) => (
                    <InvoiceItem
                      key={invoice._id}
                      invoice={invoice}
                      setEditingInvoice={setEditingInvoice}
                      fetchInvoices={() => {
                        /* implement fetchInvoices logic here */
                      }}
                      setInvoicePaid={setInvoicePaid}
                      onDownload={() => downloadInvoice(invoice._id)}
                      onPay={() => initiatePayment(invoice._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {editingInvoice && (
          <EditInvoiceModal
            invoice={editingInvoice as any}
            onClose={() => setEditingInvoice(null)}
            onSave={() => setInvoicePaid((prev) => !prev)}
          />
        )}

        {/* Bulk Pay Modal */}
        {isBulkPayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Bulk Invoice Payment
              </h2>
              <form onSubmit={handleBulkPay} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount to Pay (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter total amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={bulkMethod}
                    onChange={(e) => setBulkMethod(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="balance">Balance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useBalance"
                    checked={useBalance}
                    onChange={(e) => setUseBalance(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="useBalance" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Use Student Balance First
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsBulkPayModalOpen(false)}
                    disabled={isProcessingBulk}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingBulk || bulkAmount === ""}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isProcessingBulk ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
