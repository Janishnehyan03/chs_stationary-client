import {
  Loader2,
  Package,
  IndianRupee,
  AlertCircle,
  Edit,
  Filter,
  X,
} from "lucide-react";
import { Product } from "../../utils/types/types";
import { useHasPermission } from "../../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../../utils/permissions";
import { useState } from "react";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEditClick: (product: Product) => void;
  fetchProducts: () => void;
}

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

export function ProductTable({
  products,
  isLoading,
  onEditClick,
  fetchProducts,
}: ProductTableProps) {
  const canUpdateProduct = useHasPermission(PERMISSIONS.products.update);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const filteredProducts = products.filter((product) => {
    // Search term filter
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase());

    // Stock status filter
    let matchesStock = true;
    switch (stockFilter) {
      case "in-stock":
        matchesStock = product.stock > 10;
        break;
      case "low-stock":
        matchesStock = product.stock > 0 && product.stock <= 10;
        break;
      case "out-of-stock":
        matchesStock = product.stock === 0;
        break;
      default:
        matchesStock = true;
    }

    // Price range filter
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesStock && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStockFilter("all");
    setPriceRange([0, 10000]);
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>

          {(searchTerm !== "" ||
            stockFilter !== "all" ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 10000) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-red-500 dark:text-red-400"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          {/* Stock Status Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Stock Status
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { value: "all", label: "All Products", icon: "📦" },
                {
                  value: "in-stock",
                  label: "In Stock",
                  icon: "✅",
                  sublabel: "(>10)",
                },
                {
                  value: "low-stock",
                  label: "Low Stock",
                  icon: "⚠️",
                  sublabel: "(1-10)",
                },
                { value: "out-of-stock", label: "Out of Stock", icon: "❌" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStockFilter(option.value as StockFilter)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    stockFilter === option.value
                      ? "bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {option.label}
                    </p>
                    {option.sublabel && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.sublabel}
                      </p>
                    )}
                  </div>
                  {stockFilter === option.value && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-teal-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Price Range
              </h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Min (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                      ₹
                    </span>
                  </div>
                </div>
                <div className="pt-5 text-gray-400 dark:text-gray-500">→</div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Max (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                      ₹
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>₹0</span>
                  <span>₹10,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-end space-y-3">
            <button
              onClick={() => fetchProducts()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
              <span>Reset All</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-300">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-sm md:text-base">
                {[
                  "#",
                  "Title",
                  "Price",
                  "Product Code",
                  "Wholesale Price",
                  "Stock",
                  "Edit",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 md:px-6 md:py-4 text-left font-semibold text-teal-600 dark:text-teal-400 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 md:px-6 md:py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2
                        className="animate-spin text-teal-600 dark:text-teal-400"
                        size={20}
                      />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 md:px-6 md:py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package
                        size={24}
                        className="text-gray-400 dark:text-gray-500"
                      />
                      <span>No products match your filters</span>
                      <button
                        onClick={resetFilters}
                        className="text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150 text-sm md:text-base"
                  >
                    <td className="px-4 py-3 md:px-6 md:py-4 text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {product.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                        Added {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100">
                        <IndianRupee size={14} />
                        {product.price.toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 hidden md:table-cell">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
                        {product.productCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 hidden md:table-cell">
                      {product.wholeSalePrice ? (
                        <div className="flex items-center gap-1 text-gray-900 dark:text-gray-300">
                          <IndianRupee size={14} />
                          {product.wholeSalePrice.toLocaleString("en-IN")}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-2">
                        {product.stock === 0 && (
                          <AlertCircle
                            size={16}
                            className="text-red-600 dark:text-red-500"
                          />
                        )}
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-red-500 dark:text-red-400"
                              : product.stock <= 10
                              ? "text-orange-500 dark:text-orange-400"
                              : "text-green-600 dark:text-green-400"
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
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
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
    </div>
  );
}
