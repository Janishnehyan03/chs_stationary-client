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
        setInvoicePaid(true);
        toast.success("Payment updated successfully!");
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
      <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="font-bold text-lg">{invoice.user?.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {invoice.user?.role === "student" && (
                <span className="bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                  ID: {invoice.user?.admissionNumber}
                </span>
              )}
              {invoice.user?.class && (
                <span className="text-gray-600 dark:text-gray-400 text-xs">
                  {invoice.user.class.name} - {invoice.user.class.section}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end mt-3 sm:mt-0 text-sm">
            <span
              className={`px-2.5 py-0.5 rounded-full ${
                invoice.status === "paid"
                  ? "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300"
                  : invoice.status === "partially_paid"
                  ? "bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                  : "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300"
              }`}
            >
              {invoice.status === "paid"
                ? "Paid"
                : invoice.status === "partially_paid"
                ? "Partial"
                : `₹${totalAmount.toLocaleString()}`}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">
            Student Balance:
          </span>
          <span className="text-green-700 dark:text-green-500 font-semibold">
            ₹{studentBalance.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Total Amount:
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Paid Amount:
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              ₹{paidAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Pending Amount:
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

      {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Payment History
          </h4>
          <ul className="space-y-3">
            {invoice.paymentHistory.map((payment: any) => (
              <li
                key={payment._id}
                className={`flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-opacity duration-200 ${
                  payment.corrected ? "opacity-60" : "opacity-100"
                }`}
                aria-label={`Payment on ${new Date(
                  payment.date
                ).toLocaleDateString("en-IN")}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {new Date(payment.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payment.method.charAt(0).toUpperCase() +
                      payment.method.slice(1)}
                    : ₹{payment.amount.toLocaleString()}
                    {payment.corrected && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        (Corrected)
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
                    <Edit size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {editingPaymentId && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
              <label
                htmlFor="editAmount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Corrected Amount
              </label>
              <input
                id="editAmount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(Number(e.target.value) || "")}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder-gray-400 dark:placeholder-gray-500"
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
                className="text-xs text-gray-500 dark:text-gray-400 mt-1"
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3 mb-1"
              >
                Payment Method
              </label>
              <select
                id="editMethod"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="balance">Balance</option>
                <option value="other">Other</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onEditPayment(editingPaymentId)}
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Cancel payment correction"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showPayment && invoice.status !== "paid" && (
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || "")}
            className="border p-2 rounded w-full bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount to pay"
            min="1"
            max={pendingAmount}
            disabled={useBalance}
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="mt-2 border p-2 rounded w-full bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mr-2"
              />
              <label
                htmlFor="useBalance"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Pay from student balance (₹{studentBalance.toLocaleString()}{" "}
                available)
              </label>
            </div>
          )}
          {canPayInvoice && (
            <button
              onClick={onPayment}
              className="w-full mt-2 bg-blue-600 dark:bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
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
          )}
        </div>
      )}

      <div className="flex items-center mt-4 gap-2">
        {invoice.status !== "paid" && (
          <button
            onClick={() => setShowPayment(!showPayment)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center gap-1"
          >
            {showPayment ? (
              <>
                <EyeOff size={16} /> Hide
              </>
            ) : (
              <>
                {canPayInvoice && (
                  <>
                    <CreditCard size={16} /> Pay Now
                  </>
                )}
              </>
            )}
          </button>
        )}
        {invoice.status !== "paid" && (
          <>
            {canEditInvoice && (
              <button
                onClick={() => setEditingInvoice(invoice)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                <Pencil size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceItem;
