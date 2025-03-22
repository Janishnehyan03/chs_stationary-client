import { Edit, Trash2 } from "lucide-react";

interface PurchaseTableProps {
  purchases: any[];
  shops: any[];
  onEdit: (purchase: any) => void;
  onUploadBill: (purchase: any) => void;
  onDelete: (purchaseId: string) => void;
}

const PurchaseTable = ({
  purchases,
  onEdit,
  onUploadBill,
  onDelete,
}: PurchaseTableProps) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                Shop
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">
                Bill
              </th>
              <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr
                key={purchase._id}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {purchase.shop.name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-gray-800">
                    ₹{purchase.price}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      purchase.paymentMethod === "Cash"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {purchase.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(purchase.purchaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-center">
                  {purchase.billUrl ? (
                    <div className="flex justify-center items-center space-x-3">
                      <a
                        href={purchase.billUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-150"
                        title="View bill"
                      >
                        View
                      </a>
                      <button
                        onClick={() => onUploadBill(purchase)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-150"
                        title="Replace bill"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUploadBill(purchase)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-150"
                      title="Upload bill"
                    >
                      Upload
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      onClick={() => onEdit(purchase)}
                      className="p-1 text-yellow-600 hover:text-yellow-700 transition-colors duration-150"
                      title="Edit purchase"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(purchase._id)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors duration-150"
                      title="Delete purchase"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  No purchases recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseTable;
