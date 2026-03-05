import { ShoppingCart, User, Check, AlertCircle } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <div className="px-4 sm:px-6 py-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
            <ShoppingCart size={24} />
          </span>
          New Invoice
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 ml-12">Search products and add them to the cart.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 pb-8">
        {/* Left Column: Product Search & Items (Main Workspace) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Product Search Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative z-20">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Find and Add Products
            </label>
            <InvoiceProductSearch onAddProduct={addProduct} />
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 font-mono">ENTER</span> to select
            </div>
          </div>

          {/* Invoice Items List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex-1 min-h-[400px] flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Cart Items</h3>
              <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                {items.length} Total
              </span>
            </div>

            <div className="flex-1 p-2">
              {items.length > 0 ? (
                <InvoiceItems
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center opacity-60">
                  <ShoppingCart size={48} className="mb-4" />
                  <p>No items in cart</p>
                  <p className="text-sm">Search products above to start</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Student & Summary (Sticky Sidebar) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 flex flex-col gap-6">

            {/* Student Selection Card */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 font-bold">
                <User size={18} className="text-blue-500" />
                <h3>Student Details</h3>
              </div>

              {!student ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Search for a student to assign this invoice.</p>
                  <InvoiceStudentSearch onSelectStudent={setStudent} />
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs rounded-lg flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>A student is required to generate an invoice.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 relative group transition-all hover:shadow-md">
                  <button
                    onClick={() => setStudent(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    title="Change Student"
                  >
                    <span className="sr-only">Change</span>
                    ✕
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold shadow-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{student.name}</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{student.admissionNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800/50">
                      <span className="text-gray-400 block mb-0.5">Class</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{student.class?.name}-{student.class?.section}</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800/50">
                      <span className="text-gray-400 block mb-0.5">Roll No</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{student.rollNumber || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary & Action Card */}
            <div className="bg-gray-900 dark:bg-black text-white p-6 rounded-xl shadow-xl flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div>
                <span className="text-gray-400 text-sm font-medium">Total Payable</span>
                <div className="text-4xl font-bold mt-1 tracking-tight">₹{totalAmount.toLocaleString()}</div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
           
              </div>

              <button
                onClick={submitInvoice}
                disabled={!student || items.length === 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
              >
                <Check size={20} className={items.length > 0 && student ? "text-green-300" : ""} />
                <span>Confirm Invoice</span>
              </button>

              {(!student || items.length === 0) && (
                <div className="text-xs text-center text-gray-500 font-medium">
                  {!student && items.length === 0 ? "Select student & add items" :
                    !student ? "Select a student to proceed" : "Add items to proceed"}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
