import React from "react";
import { Package } from "lucide-react";

const InvoiceDetails: React.FC<any> = ({ invoice, totalAmount }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
          <Package size={14} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Line Items
        </h4>
      </div>

      <div className="space-y-3">
        {invoice.items.map((item: any, index: number) => (
          <div
            key={index}
            className="group relative bg-white dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/60 transition-all hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/30"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {item.product?.title || item.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-2 py-0.5 rounded">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300">×</span>
                  <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                    {item.quantity} units
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Footer */}
      <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
              Grand Total
            </p>
      
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
