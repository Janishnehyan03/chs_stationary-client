import { CreditCard, Edit, EyeOff, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { useHasPermission } from "../../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../../utils/permissions";
import {
  editPayment,
  handlePayment,
} from "../../utils/services/invoice.service";
import { toast } from "react-toastify";

const InvoiceItem: React.FC<any> = ({
  invoice,
  setEditingInvoice,
  fetchInvoices,
  setInvoicePaid,
}) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<"cash" | "online" | "balance" | "other">(
    "cash"
  );
  const [useBalance, setUseBalance] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number | "">("");

  const totalAmount =
    invoice.items?.reduce(
      (sum: any, item: any) =>
        sum + (item.quantity || 0) * (item.product?.price || 0),
      0
    ) || 0;

  const paidAmount = invoice.amountPaid || 0;
  const pendingAmount = Math.max(totalAmount - paidAmount, 0);
  const studentBalance = invoice.user?.balance || 0;

  const canEditInvoice = useHasPermission(PERMISSIONS.invoice.update);
  const canPayInvoice = useHasPermission(PERMISSIONS.invoice.payment);

  // Auto-set amount when useBalance is checked
  const handleUseBalanceChange = (checked: boolean) => {
    setUseBalance(checked);
    setAmount(checked ? Math.min(pendingAmount, studentBalance) : "");
    if (checked) setMethod("balance");
  };

  const onPayment = useCallback(async () => {
    await handlePayment({
      invoiceId: invoice._id,
      amount,
      method,
      useBalance,
      pendingAmount,
      studentBalance,
      fetchInvoices,
      setInvoicePaid,
      setLoading,
      setShowPayment,
      setAmount,
    });
  }, [
    amount,
    method,
    useBalance,
    pendingAmount,
    studentBalance,
    fetchInvoices,
    setInvoicePaid,
    invoice._id,
  ]);

  const onEditPayment = useCallback(
    async (paymentId: string) => {
      if (!editAmount || editAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      setLoading(true);
      try {
        await editPayment({
          invoiceId: invoice._id,
          paymentId,
          newAmount: editAmount,
          newMethod: method,
          fetchInvoices,
        });
        setEditingPaymentId(null);
        setEditAmount("");
        // setInvoicePaid(true);
        toast.success("Payment updated successfully!");
        // reload without refreshing the page
        fetchInvoices();
      } catch (error) {
        console.error("Error editing payment:", error);
        alert("Failed to edit payment.");
      } finally {
        setLoading(false);
      }
    },
    [editAmount, method, invoice._id, fetchInvoices]
  );

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-md overflow-hidden border border-gray-300 dark:border-gray-700 transition-all hover:shadow-lg p-6">
      <div className="rounded-xl shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          {/* User Info */}
          <div>
            <h3 className="font-semibold text-xl text-gray-800 dark:text-white flex items-center gap-2">
              {invoice.user?.name}
              {invoice.user?.role === "student" && (
                <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 text-xs font-semibold rounded-full px-3 py-0.5 ml-1 shadow-sm">
                  Student
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {invoice.user?.role === "student" && (
                <span className="bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-xs font-medium px-3 py-1 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800">
                  ID: {invoice.user?.admissionNumber}
                </span>
              )}
              {invoice.user?.class && (
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  {invoice.user.class.name} - {invoice.user.class.section}
                </span>
              )}
            </div>
          </div>
          {/* Invoice Status + Date */}
          <div className="flex flex-col items-end text-right">
            <span
              className={`
          px-4 py-1 rounded-full font-semibold text-xs tracking-wide shadow border
          ${
            invoice.status === "paid"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              : invoice.status === "partially_paid"
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
          }
        `}
            >
              {invoice.status === "paid"
                ? "Paid"
                : invoice.status === "partially_paid"
                ? "Partial"
                : `Due: ₹${totalAmount.toLocaleString()}`}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {invoice.createdAt
                ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 border border-gray-200 dark:border-gray-800">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 tracking-tight flex items-center gap-2">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            className="inline-block text-indigo-500 dark:text-indigo-400"
          >
            <circle cx="9" cy="9" r="8" strokeWidth="2" />
            <path strokeWidth="2" d="M6 9.5L8 11l4-4.5" />
          </svg>
          Account Summary
        </h4>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800">
            <span className="text-green-700 dark:text-green-300 font-medium">
              Student Balance
            </span>
            <span className="text-green-800 dark:text-green-200 font-semibold text-base tracking-wide">
              ₹{studentBalance.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                Total Amount
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                Paid Amount
              </span>
              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                ₹{paidAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                Pending Amount
              </span>
              <span
                className={`font-semibold ${
                  pendingAmount > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                ₹{pendingAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
        <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              className="inline-block text-indigo-500 dark:text-indigo-400"
            >
              <rect x="3" y="3" width="12" height="12" rx="3" strokeWidth="2" />
              <path strokeWidth="2" d="M6.5 9.5l2 2 3-3" />
            </svg>
            Payment History
          </h4>
          <ul className="space-y-3">
            {invoice.paymentHistory.map((payment: any) => (
              <li
                key={payment._id}
                className={`flex justify-between items-center p-4 rounded-xl border transition-opacity duration-200 shadow-sm
            bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800
            border-gray-100 dark:border-gray-800
            ${payment.corrected ? "opacity-60" : "opacity-100"}
          `}
                aria-label={`Payment on ${new Date(
                  payment.date
                ).toLocaleDateString("en-IN")}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {new Date(payment.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-0">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold mr-2">
                      {payment.method.charAt(0).toUpperCase() +
                        payment.method.slice(1)}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-50">
                      ₹{payment.amount.toLocaleString()}
                    </span>
                    {payment.corrected && (
                      <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded px-2 py-0.5">
                        Corrected
                      </span>
                    )}
                  </span>
                </div>
                {canPayInvoice && !payment.corrected && (
                  <button
                    onClick={() => {
                      setEditingPaymentId(payment._id);
                      setEditAmount(payment.amount);
                      setMethod(payment.method);
                    }}
                    className="p-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Edit payment of ₹${
                      payment.amount
                    } made on ${new Date(payment.date).toLocaleDateString(
                      "en-IN"
                    )}`}
                  >
                    <Edit size={18} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {editingPaymentId && (
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <label
                htmlFor="editAmount"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1"
              >
                Corrected Amount
              </label>
              <input
                id="editAmount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(Number(e.target.value) || "")}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 mb-2"
                placeholder="Enter corrected amount"
                min="1"
                max={
                  pendingAmount +
                  (invoice.paymentHistory.find(
                    (p: any) => p._id === editingPaymentId
                  )?.amount || 0)
                }
                aria-describedby="editAmountHelp"
              />
              <p
                id="editAmountHelp"
                className="text-xs text-gray-500 dark:text-gray-400 mb-2"
              >
                Maximum: ₹
                {(
                  pendingAmount +
                  (invoice.paymentHistory.find(
                    (p: any) => p._id === editingPaymentId
                  )?.amount || 0)
                ).toLocaleString()}
              </p>
              <label
                htmlFor="editMethod"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2 mb-1"
              >
                Payment Method
              </label>
              <select
                id="editMethod"
                value={method}
                onChange={(e: any) => setMethod(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="balance">Balance</option>
                <option value="other">Other</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onEditPayment(editingPaymentId)}
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading || !editAmount}
                  aria-label="Save payment correction"
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    "Save Correction"
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingPaymentId(null);
                    setEditAmount("");
                  }}
                  className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Cancel payment correction"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Payment Input Section */}
      {showPayment && invoice.status !== "paid" && (
        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6">
          <label
            htmlFor="amount"
            className="block font-semibold text-gray-800 dark:text-gray-200 mb-2"
          >
            Amount to Pay
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || "")}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 mb-3"
            placeholder="Enter amount to pay"
            min="1"
            max={pendingAmount}
            disabled={useBalance}
          />
          <label
            htmlFor="pay-method"
            className="block font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-2"
          >
            Payment Method
          </label>
          <select
            id="pay-method"
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            disabled={useBalance}
          >
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="balance">Balance</option>
            <option value="other">Other</option>
          </select>
          {studentBalance > 0 && (
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="useBalance"
                checked={useBalance}
                onChange={(e) => handleUseBalanceChange(e.target.checked)}
                className="accent-blue-600 mr-2 w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="useBalance"
                className="text-sm text-gray-700 dark:text-gray-300 select-none"
              >
                Pay from student balance{" "}
                <span className="font-semibold text-green-700 dark:text-green-400">
                  (₹{studentBalance.toLocaleString()} available)
                </span>
              </label>
            </div>
          )}
          {canPayInvoice && (
            <button
              onClick={onPayment}
              className="w-full mt-4 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading || !amount}
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <CreditCard size={18} /> Pay Now
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center mt-6 gap-3">
        {invoice.status !== "paid" && (
          <button
            onClick={() => setShowPayment(!showPayment)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center gap-2 font-medium"
          >
            {showPayment ? (
              <>
                <EyeOff size={18} /> Hide
              </>
            ) : (
              canPayInvoice && (
                <>
                  <CreditCard size={18} /> Pay Now
                </>
              )
            )}
          </button>
        )}
        {invoice.status !== "paid" && canEditInvoice && (
          <button
            onClick={() => setEditingInvoice(invoice)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center gap-2"
            aria-label="Edit invoice"
          >
            <Pencil size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceItem;
