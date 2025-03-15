import { Plus, X } from "lucide-react";

interface InvoiceHeaderProps {
  showInvoiceForm: boolean;
  setShowInvoiceForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  showInvoiceForm,
  setShowInvoiceForm,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
          Invoice Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create and manage student invoices
        </p>
      </div>

      {!showInvoiceForm ? (
        <button
          onClick={() => setShowInvoiceForm(true)}
          className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus size={18} className="text-white" />
          Create New Invoice
        </button>
      ) : (
        <button
          onClick={() => setShowInvoiceForm(false)}
          className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
        >
          <X size={18} className="text-gray-700 dark:text-gray-200" />
          Cancel Invoice Creation
        </button>
      )}
    </div>
  );
};

export default InvoiceHeader;
