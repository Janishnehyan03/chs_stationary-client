import { Trash2 } from "lucide-react";
import { InvoiceItem } from "../../utils/types/types";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

const InvoiceItems = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: InvoiceItemsProps) => {
  return (
    <div className="mt-6 border border-gray-200 rounded-xl p-6 bg-white shadow-md">
      {/* Header */}
      <h3 className="font-semibold text-lg text-gray-900 mb-5">
        Invoice Items
      </h3>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 text-base">No products added yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add products using the search above
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase tracking-wide border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium w-12">#</th>
                <th className="py-3 px-4 text-left font-medium">Product</th>
                <th className="py-3 px-4 text-center font-medium w-28">
                  Quantity
                </th>
                <th className="py-3 px-4 text-right font-medium w-36">
                  Total Price
                </th>
                <th className="py-3 px-4 text-center font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 transition-colors duration-150 ${item.stock !== undefined && item.quantity > item.stock
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-gray-50 bg-white"
                    }`}
                >
                  <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-4 px-4 font-medium truncate max-w-[200px]">
                    <div className={`${item.stock !== undefined && item.quantity > item.stock ? "text-red-600" : "text-gray-800"}`}>
                      {item.title}
                    </div>
                    {item.stock !== undefined && item.quantity > item.stock && (
                      <div className="text-xs text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                        Wait, only {item.stock} in stock!
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        onUpdateQuantity(
                          index,
                          Math.max(1, Number(e.target.value))
                        )
                      }
                      className={`w-20 py-1.5 px-2 border rounded-md text-center focus:ring-2 focus:border-transparent transition appearance-none
                        ${item.stock !== undefined && item.quantity > item.stock
                          ? "border-red-300 text-red-700 bg-red-50 focus:ring-red-400"
                          : "border-gray-300 text-gray-700 focus:ring-blue-400 hover:border-gray-400"
                        }
                      `}
                    />
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    ₹
                    {(item.price * item.quantity).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-600 p-1.5 rounded-full 
                      hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 
                      transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceItems;
