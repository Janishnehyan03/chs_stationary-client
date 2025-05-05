import { useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import CreateInvoiceForm from "../components/invoice/CreateInvoiceForm";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import LatestInvoices from "../components/invoice/LatestInvoices";
import { InvoiceItem } from "../utils/types/types";
import { useHasPermission } from "../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../utils/permissions";

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
}

const InvoicePage = () => {
  const [user, setUser] = useState<User>();
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newDataAdded, setNewDataAdded] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [limit, setLimit] = useState<number | string>(50); // Default limit to 10
  const [isCustomLimit, setIsCustomLimit] = useState(false); // Track if custom limit is selected

  const canCreateInvoice = useHasPermission(PERMISSIONS.invoice.create);
  const canReadInvoice = useHasPermission(PERMISSIONS.invoice.read);

  // Add product to invoice
  const addProduct = (product: Product) => {
    setItems((prev) => [
      ...prev,
      {
        product: product._id,
        title: product.title,
        quantity: 1,
        price: product.price,
      },
    ]);
  };

  // Update quantity
  const updateQuantity = (index: number, quantity: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  // Remove item from invoice
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handle limit change
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

  // Handle custom limit input
  const handleCustomLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) > 0)) {
      setLimit(value === "" ? "" : Number(value));
    }
  };

  // Submit Invoice
  const submitInvoice = async () => {
    if (!user || items.length === 0) {
      toast.error("Please select a student and add items.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      await Axios.post(`/invoices?limit=${limit || 10}`, {
        user: user._id,
        items,
        totalAmount,
      });
      setNewDataAdded(true);
      setItems([]);
      setUser(undefined);
      setShowInvoiceForm(false);
      toast.success("Invoice submitted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error submitting invoice:", errorMessage);
    }
  };

  const LimitSelection = () => (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center">
        <label
          htmlFor="limit"
          className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Items per page:
        </label>
        <select
          id="limit"
          value={isCustomLimit ? "custom" : limit}
          onChange={handleLimitChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {isCustomLimit && (
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            value={limit}
            placeholder="Enter custom limit"
            onChange={handleCustomLimit}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Invoice Header */}
      <InvoiceHeader
        showInvoiceForm={showInvoiceForm}
        setShowInvoiceForm={setShowInvoiceForm}
      />

      {/* Invoice Form */}
      {showInvoiceForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg p-4 sm:p-6 transition-colors">
          {canCreateInvoice && (
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
          )}
        </div>
      )}

      {/* Latest Invoices Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
            Latest Invoices
          </h2>
          {/* Limit Selection */}
        </div>
        <div className="p-4 sm:p-6">
          {canReadInvoice && (
            <LatestInvoices
              newDataAdded={newDataAdded}
              limit={limit || 50}
              limitSelection={<LimitSelection />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
