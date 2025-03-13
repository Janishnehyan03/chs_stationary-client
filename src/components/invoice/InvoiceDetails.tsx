import React from "react";

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

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, totalAmount }) => {
  return (
    <div className="p-4 border-t border-gray-100">
      <div className="divide-y divide-gray-100">
        {invoice.items.map((item, index) => (
          <div key={index} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.product.title}</p>
                <div className="flex items-center text-gray-500 text-sm space-x-4 mt-1">
                  <span>₹{item.product.price.toLocaleString()}</span>
                  <span>×</span>
                  <span>{item.quantity}</span>
                </div>
              </div>
              <p className="text-gray-800 font-medium">
                ₹{(item.product.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="font-medium text-gray-700">Total Amount</span>
        <span className="text-lg font-bold text-green-600">
          ₹{totalAmount.toLocaleString()}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between gap-2">
        <button className="flex-1 text-center py-2 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
