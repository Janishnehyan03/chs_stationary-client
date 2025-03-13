import { Loader2, Package, IndianRupee, AlertCircle, Edit } from "lucide-react";
import { Product } from "../../utils/types/types";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEditClick: (product: Product) => void; // Add this prop
}

export function ProductTable({ products, isLoading, onEditClick }: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-teal-50 to-teal-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                #
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Product Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Wholesale Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package size={24} className="text-gray-400" />
                    <span>No products found</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Added {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <IndianRupee size={14} />
                      {product.price.toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                      {product.productCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.wholeSalePrice ? (
                      <div className="flex items-center gap-1 text-gray-700">
                        <IndianRupee size={14} />
                        {product.wholeSalePrice.toLocaleString("en-IN")}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-sm text-gray-600">
                      {product.description || (
                        <span className="text-gray-400">No description</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {product.stock === 0 && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= 10
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEditClick(product)}
                      className="text-teal-600 hover:text-teal-500 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}