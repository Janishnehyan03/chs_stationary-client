import { Pencil, CreditCard, EyeOff } from "lucide-react";
import { useState, useCallback } from "react";
import Axios from "../../Axios";
import { Invoice } from "../../utils/types/types";

interface InvoiceItemProps {
  invoice: Invoice;
  setEditingInvoice: (invoice: Invoice | null) => void;
  fetchInvoices: () => void;
  setInvoicePaid: (paid: boolean) => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  setEditingInvoice,
  fetchInvoices,
  setInvoicePaid,
}) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [showPayment, setShowPayment] = useState(false);
  const [useBalance, setUseBalance] = useState(false);

  const totalAmount =
    invoice.items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.product?.price || 0),
      0
    ) || 0;

  const paidAmount = invoice.amountPaid || 0;
  const pendingAmount = Math.max(totalAmount - paidAmount, 0);
  const studentBalance = invoice.user?.balance || 0;

  // Auto-set amount when useBalance is checked
  const handleUseBalanceChange = (checked: boolean) => {
    setUseBalance(checked);
    setAmount(checked ? Math.min(pendingAmount, studentBalance) : "");
  };
  const handlePayment = useCallback(async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }

    const paymentAmount = Number(amount);
    if (paymentAmount <= 0 || paymentAmount > pendingAmount) {
      alert(`Please enter an amount between ₹1 and ₹${pendingAmount}.`);
      return;
    }

    if (useBalance && studentBalance < paymentAmount) {
      alert("Insufficient balance. Please use another payment method.");
      return;
    }

    setLoading(true);
    try {
      await Axios.patch(`/invoices/pay/${invoice._id}`, {
        amount: paymentAmount,
        useBalance,
      });
      alert("Payment successful!");
      setShowPayment(false);
      setAmount("");
      fetchInvoices();
      setInvoicePaid(true);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    useBalance,
    pendingAmount,
    studentBalance,
    fetchInvoices,
    invoice._id,
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {invoice.user?.name || "Unknown Student"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {invoice.user?.role === "student" &&
                  "ID:" + invoice.user?.admissionNumber}
              </span>
              {invoice.user?.class && (
                <span className="text-gray-500 text-xs">
                  {invoice.user.class.name} - {invoice.user.class.section}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {invoice.status === "paid"
                ? "Fully Paid"
                : `₹${totalAmount.toLocaleString()}`}
            </span>
            <span className="text-gray-500 text-xs mt-1">
              {invoice.createdAt
                ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Unknown Date"}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Student Balance:</span>
            <span className="text-green-700 font-semibold">
              ₹{studentBalance.toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Total Amount:</span>
              <span className="text-gray-900 font-semibold">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Paid Amount:</span>
              <span className="text-gray-900 font-semibold">
                ₹{paidAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Pending Amount:</span>
              <span
                className={`font-semibold ${
                  pendingAmount > 0 ? "text-red-600" : "text-gray-900"
                }`}
              >
                ₹{pendingAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {showPayment && invoice.status !== "paid" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || "")}
              className="border p-2 rounded w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount to pay"
              min="1"
              max={pendingAmount}
              disabled={useBalance}
            />
            {studentBalance > 0 && (
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="useBalance"
                  checked={useBalance}
                  onChange={(e) => handleUseBalanceChange(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="useBalance" className="text-sm text-gray-700">
                  Pay from student balance (₹{studentBalance.toLocaleString()}{" "}
                  available)
                </label>
              </div>
            )}
            <button
              onClick={handlePayment}
              className="w-full mt-2 bg-blue-600 text-white p-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading || !amount}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard size={16} /> Pay Now
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center mt-4 gap-2">
          {invoice.status !== "paid" && (
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded hover:bg-blue-50 flex items-center gap-1"
            >
              {showPayment ? (
                <>
                  <EyeOff size={16} /> Hide
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Pay Invoice
                </>
              )}
            </button>
          )}
          {invoice.status !== "paid" && (
            <button
              onClick={() => setEditingInvoice(invoice)}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded hover:bg-blue-50"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceItem;
