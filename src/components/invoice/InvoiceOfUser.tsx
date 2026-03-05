import React, { useEffect } from "react";
import { fetchInvoices } from "../../utils/services/invoice.service";
import { Invoice } from "../../utils/types/types";
import EditInvoiceModal from "./EditInvoiceModal";
import InvoiceItem from "./InvoiceItem";

interface InvoiceOfStudentProps {
  student: any;
  showModal: boolean;
  handleClose: () => void;
}

const InvoiceOfUser: React.FC<InvoiceOfStudentProps> = ({
  student,
  showModal,
  handleClose,
}) => {
  const [editingInvoice, setEditingInvoice] = React.useState<Invoice | null>(
    null
  );

  const [invoicePaid, setInvoicePaid] = React.useState(false);

  useEffect(() => {
    if (invoicePaid) {
      fetchInvoices()
        .then(() => setInvoicePaid(false))
        .catch((error) => console.error("Error fetching invoices:", error));
    }
  }, [invoicePaid]);
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 transition-opacity duration-300 
    ${showModal ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="w-3/4  p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {student.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl"
          >
            &times;
          </button>
        </div>

        {/* Invoices Table */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Student Info</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Total (₹)</th>
                  <th className="p-4 text-right">Paid (₹)</th>
                  <th className="p-4 text-right">Due (₹)</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {student.invoices.map((invoice: any) => (
                  <InvoiceItem
                    key={invoice._id}
                    invoice={invoice}
                    setEditingInvoice={setEditingInvoice}
                    fetchInvoices={fetchInvoices}
                    setInvoicePaid={setInvoicePaid}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end  pt-4 mt-6">
          <button
            onClick={handleClose}
            className="bg-gray-600 dark:bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSave={fetchInvoices}
        />
      )}
    </div>
  );
};

export default InvoiceOfUser;
