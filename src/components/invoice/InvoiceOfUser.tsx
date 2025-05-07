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

        {/* Invoices Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {student.invoices.map((invoice: any) => (
            <div
              key={invoice._id}
              className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <InvoiceItem
                invoice={invoice}
                setEditingInvoice={setEditingInvoice}
                fetchInvoices={fetchInvoices}
                setInvoicePaid={setInvoicePaid}
              />
            </div>
          ))}
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
