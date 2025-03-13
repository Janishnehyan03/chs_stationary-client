import { Trash2 } from "lucide-react"; // Import Lucide icon

interface InvoiceItem {
  product: string;
  title: string;
  quantity: number;
  price: number;
}

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
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-4 px-4 text-gray-800 font-medium truncate max-w-[200px]">
                    {item.title}
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
                      className="w-20 py-1.5 px-2 border border-gray-300 rounded-md 
                      text-center text-gray-700 focus:ring-2 focus:ring-blue-400 
                      focus:border-transparent hover:border-gray-400 transition 
                      appearance-none"
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
