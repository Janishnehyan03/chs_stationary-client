import { ChevronRight, Download, Edit, CreditCard } from "lucide-react";
import { Invoice } from "../../utils/types/types";

interface InvoiceItemProps {
  invoice: any;
  onView?: (invoice: any) => void;
  setEditingInvoice?: (invoice: Invoice | null) => void;
  fetchInvoices?: () => void;
  setInvoicePaid?: (paid: boolean) => void;
  onDownload?: () => void;
  onPay?: () => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  onView,
  setEditingInvoice,
  onDownload,
  onPay,
}) => {
  const totalAmount = invoice.totalAmount || 0;
  const paidAmount = invoice.amountPaid || 0;
  const pendingAmount = Number(
    Math.max(totalAmount - paidAmount, 0).toFixed(2)
  );

  const handleRowClick = () => {
    if (onView) {
      onView(invoice);
    } else if (setEditingInvoice) {
      setEditingInvoice(invoice);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group border-b border-gray-100 dark:border-gray-800"
    >
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {invoice.user?.name || "Unknown"}
          </span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            ID: {invoice.user?.admissionNumber || "N/A"}
          </span>
        </div>
      </td>

      <td className="p-4 text-sm text-gray-500 font-medium">
        {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })}
      </td>

      <td className="p-4 text-sm font-bold text-gray-900 dark:text-gray-100">
        ₹{totalAmount.toLocaleString()}
      </td>

      <td className="p-4 text-sm font-bold text-blue-600">
        ₹{paidAmount.toLocaleString()}
      </td>

      <td className="p-4 text-sm font-black text-right">
        <span className={pendingAmount > 0 ? "text-red-500" : "text-green-500"}>
          ₹{pendingAmount.toLocaleString()}
        </span>
      </td>

      <td className="p-4 text-center">
        <div className="flex justify-center">
          {invoice.status === "paid" ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span className="text-[10px] font-black uppercase">Paid</span>
            </div>
          ) : invoice.status === "partially_paid" ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase">Partial</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="text-[10px] font-black uppercase">Unpaid</span>
            </div>
          )}
        </div>
      </td>

      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          {setEditingInvoice && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingInvoice(invoice);
              }}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit Invoice"
            >
              <Edit size={18} />
            </button>
          )}
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
              title="Download PDF"
            >
              <Download size={18} />
            </button>
          )}
          {onPay && pendingAmount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPay();
              }}
              className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
              title="Pay Now"
            >
              <CreditCard size={18} />
            </button>
          )}
          {!setEditingInvoice && !onDownload && !onPay && (
            <button className="p-2 text-gray-300 group-hover:text-blue-500 transition-colors">
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default InvoiceItem;
