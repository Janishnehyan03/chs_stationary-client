import { CreditCard, EyeOff, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { handlePayment } from "../../utils/services/invoice.service";
import { Invoice } from "../../utils/types/types";
import { PERMISSIONS } from "../../utils/permissions";
import { useHasPermission } from "../../utils/hooks/useHasPermission";
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

  const canEditInvoice = useHasPermission(PERMISSIONS.invoice.update);
  const canPayInvoice = useHasPermission(PERMISSIONS.invoice.payment);
  // Auto-set amount when useBalance is checked
  const handleUseBalanceChange = (checked: boolean) => {
    setUseBalance(checked);
    setAmount(checked ? Math.min(pendingAmount, studentBalance) : "");
  };

  const onPayment = useCallback(async () => {
    await handlePayment({
      invoiceId: invoice._id,
      amount,
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
    useBalance,
    pendingAmount,
    studentBalance,
    fetchInvoices,
    setInvoicePaid,
    invoice._id,
  ]);

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
          <div className="flex flex-col items-end mt-3 sm:mt-0">
            <span
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                invoice.status === "paid"
                  ? "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300"
                  : "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300"
              }`}
            >
              {invoice.status === "paid"
                ? "Fully Paid"
                : `₹${totalAmount.toLocaleString()}`}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-xs mt-1">
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
