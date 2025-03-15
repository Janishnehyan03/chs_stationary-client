import React from "react";
import { Invoice, User } from "../../utils/types/types";
import InvoiceItem from "./InvoiceItem";
import EditInvoiceModal from "./EditInvoiceModal";
import { fetchInvoices } from "../../utils/services/invoice.service";

interface InvoiceOfStudentProps {
  student: User;
  showModal: boolean;
  handleClose: () => void;
}

const InvoiceOfStudent: React.FC<InvoiceOfStudentProps> = ({
  student,
  showModal,
  handleClose,
}) => {
  const [editingInvoice, setEditingInvoice] = React.useState<Invoice | null>(
    null
  );

  const setInvoicePaid = () => {
    window.location.reload();
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md 
         ${
        showModal ? "block" : "hidden"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Invoices of {student.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          {student.invoices.map((invoice) => (
            <InvoiceItem
              key={invoice._id}
              invoice={invoice}
              setEditingInvoice={setEditingInvoice}
              fetchInvoices={fetchInvoices}
              setInvoicePaid={setInvoicePaid}
            />
          ))}
        </div>
        <div className="flex justify-end p-4 border-t dark:border-gray-700">
          <button
            onClick={handleClose}
            className="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
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

export default InvoiceOfStudent;
