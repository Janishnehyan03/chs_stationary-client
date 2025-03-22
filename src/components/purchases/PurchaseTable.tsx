import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface PurchaseTableProps {
  purchases: any[];
  shops: any[];
  onEdit: (purchase: any) => void;
  onUploadBill: (purchase: any) => void;
  onDelete: (purchaseId: string) => void;
}

const PurchaseTable = ({
  purchases,
  shops,
  onEdit,
  onUploadBill,
  onDelete,
}: PurchaseTableProps) => {
  // State for sorting and filtering
  const [sortField, setSortField] = useState<string>("purchaseDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Calculate total amount
  const totalAmount = purchases.reduce(
    (sum, purchase) => sum + (purchase.price || 0),
    0
  );

  // Filter purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const shopMatch = shopFilter === "all" || purchase.shop._id === shopFilter;
    const paymentMatch =
      paymentFilter === "all" || purchase.paymentMethod === paymentFilter;
    return shopMatch && paymentMatch;
  });

  // Sort purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (sortField === "price") return (a.price - b.price) * order;
    if (sortField === "shop")
      return (a.shop.name || "").localeCompare(b.shop.name || "") * order;
    return (new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()) * order;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header with Total and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Purchases</h3>
            <span className="text-sm text-gray-600">Total Amount: </span>
            <span className="text-lg font-bold text-gray-800">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Shops</option>
              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              {/* Add more payment methods as needed */}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                <button
                  onClick={() => handleSort("shop")}
                  className="flex items-center gap-1"
                >
                  Shop
                  {sortField === "shop" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-1"
                >
                  Price
                  {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                Purchased By
              </th>
              <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                <button
                  onClick={() => handleSort("purchaseDate")}
                  className="flex items-center gap-1"
                >
                  Date
                  {sortField === "purchaseDate" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </button>
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
            {sortedPurchases.map((purchase) => (
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
                <td className="px-6 py-4 text-sm">{purchase.purchasedBy}</td>
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
            {sortedPurchases.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  No purchases match the current filters
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
