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
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        showModal ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Invoices of {student.name}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
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
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
