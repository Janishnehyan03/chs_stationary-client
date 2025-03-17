import { Loader2, Package, IndianRupee, AlertCircle, Edit } from "lucide-react";
import { Product } from "../../utils/types/types";
import { useHasPermission } from "../../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../../utils/permissions";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEditClick: (product: Product) => void; // Add this prop
}

export function ProductTable({
  products,
  isLoading,
  onEditClick,
}: ProductTableProps) {
  const canUpdateProduct = useHasPermission(PERMISSIONS.products.update);
  const canDeleteProduct = useHasPermission(PERMISSIONS.products.delete);
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-800 text-gray-300">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-600 text-sm md:text-base">
              {[
                "#",
                "Title",
                "Price",
                "Product Code",
                "Wholesale Price",
                "Stock",
                (canDeleteProduct || canUpdateProduct) && "Actions",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 md:px-6 md:py-4 text-left font-semibold text-teal-400 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 md:px-6 md:py-8 text-center text-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-teal-400" size={20} />
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 md:px-6 md:py-8 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package size={24} className="text-gray-500" />
                    <span>No products found</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-700/50 transition-colors duration-150 text-sm md:text-base"
                >
                  <td className="px-4 py-3 md:px-6 md:py-4 text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    <div className="font-medium text-gray-100">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-400 md:hidden">
                      Added {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center gap-1 font-semibold text-gray-100">
                      <IndianRupee size={14} />
                      {product.price.toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-gray-700 rounded-md text-sm font-medium text-gray-300">
                      {product.productCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 hidden md:table-cell">
                    {product.wholeSalePrice ? (
                      <div className="flex items-center gap-1 text-gray-300">
                        <IndianRupee size={14} />
                        {product.wholeSalePrice.toLocaleString("en-IN")}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center gap-2">
                      {product.stock === 0 && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 10
                            ? "text-orange-400"
                            : "text-green-400"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  {canUpdateProduct && (
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <button
                        onClick={() => onEditClick(product)}
                        className="text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
