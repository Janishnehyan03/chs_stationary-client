import React from "react";
import { InvoiceItem } from "../../utils/types/types";
import InvoiceItems from "./InvoiceItems";
import InvoiceProductSearch from "./InvoiceProductSearch";
import InvoiceStudentSearch from "./InvoiceStudentSearch";

// Define the props interface
interface CreateInvoiceFormProps {
  student: any;
  addProduct: (product: any) => void;
  items: InvoiceItem[];
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  totalAmount: number;
  submitInvoice: () => Promise<void>;
  setStudent: any;
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({
  student,
  addProduct,
  items,
  updateQuantity,
  removeItem,
  totalAmount,
  submitInvoice,
  setStudent,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Left Section (2/3 width) */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h2 className="text-xl font-semibold text-white">New Invoice</h2>
            <p className="text-blue-100 text-sm mt-1">
              {student
                ? `For: ${student.name}`
                : "Select a student to continue"}
            </p>
          </div>

          {/* Product Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Products
            </label>
            <InvoiceProductSearch onAddProduct={addProduct} />
          </div>

          {/* Invoice Items */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                Invoice Items
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">
                  No items added to this invoice yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Search for products above to add them to the invoice
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <InvoiceItems
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </div>
            )}
          </div>

          {/* Summary and Action */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{totalAmount}
                </p>
              </div>
              <button
                onClick={submitInvoice}
                disabled={!student || items.length === 0}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:bg-blue-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (1/3 width) */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              User Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Search and select a user for this invoice
            </p>
          </div>

          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search User
            </label>
            <InvoiceStudentSearch onSelectStudent={setStudent} />

            {student ? (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Selected User
                  </h4>
                  <button
                    onClick={() => setStudent(null)}
                    className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Name:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {student.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      ID:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {student.admissionNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Class:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {student.class?.name} - {student.class?.section}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">
                  No user selected
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Search for a user above to continue
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
