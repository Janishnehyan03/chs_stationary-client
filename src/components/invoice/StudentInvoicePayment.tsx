import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "../../Axios";
import InvoiceItem from "./InvoiceItem";
import EditInvoiceModal from "./EditInvoiceModal";
import { fetchInvoices } from "../../utils/services/invoice.service";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  createdAt: string;
}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
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
            </div>
          )}
        </div>
        {editingInvoice && (
          <EditInvoiceModal
            invoice={editingInvoice as any}
            onClose={() => setEditingInvoice(null)}
            onSave={fetchInvoices}
          />
        )}
      </div>
    </div>
  );
}
