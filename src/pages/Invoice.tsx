import { useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import CreateInvoiceForm from "../components/invoice/CreateInvoiceForm";
import LatestInvoices from "../components/invoice/LatestInvoices";
import { InvoiceItem } from "../utils/types/types";
import { useHasPermission } from "../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../utils/permissions";
import { Filter, ChevronDown, FileText, Plus, Sparkles } from "lucide-react";

interface User {
  _id: string;
  name: string;
  admissionNumber: string;
  class?: { name: string; section: string };
}

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
}

const InvoicePage = () => {
  const [user, setUser] = useState<User>();
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [limit, setLimit] = useState<number | string>(50);
  const [isCustomLimit, setIsCustomLimit] = useState(false);

  const canCreateInvoice = useHasPermission(PERMISSIONS.invoice.create);
  const canReadInvoice = useHasPermission(PERMISSIONS.invoice.read);

  const addProduct = (product: Product) => {
    setItems((prev) => [
      ...prev,
      {
        product: product._id,
        title: product.title,
        quantity: 1,
        price: product.price,
        stock: product.stock,
      },
    ]);
  };

  const updateQuantity = (index: number, quantity: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomLimit(true);
      setLimit("");
    } else {
      setIsCustomLimit(false);
      setLimit(Number(value));
    }
  };

  const handleCustomLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) > 0)) {
      setLimit(value === "" ? "" : Number(value));
    }
  };

  const submitInvoice = async () => {
    if (!user || items.length === 0) {
      toast.error("Please select a student and add items.");
      return;
    }

    try {
      await Axios.post(`/invoices?limit=${limit || 10}`, {
        user: user._id,
        items,
        totalAmount,
      });
      setRefreshKey(prev => prev + 1);
      setItems([]);
      setUser(undefined);
      setShowInvoiceForm(false);
      toast.success("Invoice generated successfully!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const LimitSelection = () => (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 px-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <Filter size={14} className="text-gray-400" />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:inline">
        Rows:
      </span>
      <div className="relative">
        <select
          id="limit"
          value={isCustomLimit ? "custom" : limit}
          onChange={handleLimitChange}
          className="appearance-none bg-transparent pr-5 text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
        >
          {[10, 20, 50, 100, 10000].map(v => (
            <option key={v} value={v}>{v === 10000 ? "All" : v}</option>
          ))}
          <option value="custom">Custom</option>
        </select>
        <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
      </div>

      {isCustomLimit && (
        <input
          type="number"
          min="1"
          value={limit}
          placeholder="#"
          onChange={handleCustomLimit}
          className="w-12 p-0 bg-transparent text-sm font-bold text-blue-600 outline-none border-b border-blue-200"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F1A] transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-10">
        {/* Page Header - SaaS Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  Invoices
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
                  Manage collections and student billing effortlessly.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowInvoiceForm(!showInvoiceForm)}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${showInvoiceForm
              ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
              : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/20 hover:shadow-blue-500/40"
              }`}
          >
            {showInvoiceForm ? "Close Menu" : (
              <>
                <Plus size={20} className="transition-transform group-hover:rotate-90" />
                Create Invoice
                <Sparkles size={16} className="animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Create Invoice Form Section */}
        {showInvoiceForm && (
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Generate New Billing</h2>
              <p className="text-sm text-gray-500 font-medium">Add items and select a student to proceed.</p>
            </div>
            <div className="p-8">
              {canCreateInvoice ? (
                <CreateInvoiceForm
                  student={user}
                  addProduct={addProduct}
                  items={items}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  totalAmount={totalAmount}
                  submitInvoice={submitInvoice}
                  setStudent={setUser}
                />
              ) : (
                <p className="text-center text-red-500 font-bold p-10 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                  Access Denied: Missing permissions to create records.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        {canReadInvoice ? (
          <div className="space-y-10">
            <LatestInvoices
              newDataAdded={refreshKey}
              limit={limit || 50}
              limitSelection={<LimitSelection />}
            />
          </div>
        ) : (
          <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm font-bold text-gray-400 uppercase tracking-widest">
            Restricted Content
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
