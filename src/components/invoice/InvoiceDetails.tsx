import React from "react";
import Axios from "../../Axios";
import DeleteInvoiceButton from "./DeleteInvoiceButton"; // Import the new component

interface InvoiceDetailsProps {
  invoice: {
    _id: string;
    items: {
      product: { title: string; price: number };
      quantity: number;
    }[];
  };
  totalAmount: number;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoice,
  totalAmount,
}) => {
  const handleDeleteInvoice = async (id: string) => {
    await Axios.delete(`/invoices/${id}`);
    window.location.reload(); // Reload the page after deletion
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="divide-y divide-gray-700">
        {invoice.items.map((item, index) => (
          <div key={index} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium text-gray-300">
                  {item.product.title}
                </p>
                <div className="flex items-center text-gray-400 text-sm space-x-4 mt-1">
                  <span>₹{item.product.price.toLocaleString()}</span>
                  <span>×</span>
                  <span>{item.quantity}</span>
                </div>
              </div>
              <p className="text-gray-300 font-medium">
                ₹{(item.product.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
        <span className="font-medium text-gray-400">Total Amount</span>
        <span className="text-lg font-bold text-green-400">
          ₹{totalAmount.toLocaleString()}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between gap-2">
        <DeleteInvoiceButton
          invoiceId={invoice._id}
          onDelete={handleDeleteInvoice}
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
