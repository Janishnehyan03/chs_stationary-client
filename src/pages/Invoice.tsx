import { useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import CreateInvoiceForm from "../components/invoice/CreateInvoiceForm";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import LatestInvoices from "../components/invoice/LatestInvoices";
import { InvoiceItem } from "../utils/types/types";

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
  const [showInvoiceForm, setShowInvoiceForm] = useState(false); // State to toggle form visibility

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
      await Axios.post("/invoices", {
        user: user._id,
        items,
        totalAmount,
      });
      setNewDataAdded(true);
      setItems([]);
      setUser(undefined);
      setShowInvoiceForm(false); // Hide the form after submission
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 ">
      {/* Invoice Header */}
      <InvoiceHeader
        showInvoiceForm={showInvoiceForm}
        setShowInvoiceForm={setShowInvoiceForm}
      />

      {/* Invoice Form - Full width on mobile, Side-by-side on larger screens */}

      {showInvoiceForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg p-4 sm:p-6 transition-colors">
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
        </div>
      )}

      {/* Latest Invoices Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg overflow-hidden transition-colors">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
            Latest Invoices
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <LatestInvoices newDataAdded={newDataAdded} />
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
