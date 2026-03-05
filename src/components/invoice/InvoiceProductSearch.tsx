import { useState, useEffect } from "react";
import Axios from "../../Axios";
import { Loader2, X, Package } from "lucide-react";
import { Product } from "../../utils/types/types";

interface ProductSearchProps {
  onAddProduct: any;
}

const InvoiceProductSearch = ({ onAddProduct }: ProductSearchProps) => {
  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (productQuery.length > 2) {
        setLoading(true);
        setError("");
        try {
          const { data } = await Axios.get(`/products?search=${productQuery}`);
          setProducts(data);
          setSelectedIndex(-1);
        } catch (err) {
          setError("Failed to fetch products. Please try again.");
        }
        setLoading(false);
      } else {
        setProducts([]);
      }
    };

    const debounce = setTimeout(fetchProducts, 300); // Debounce API calls by 300ms to avoid spamming
    return () => clearTimeout(debounce);
  }, [productQuery]);

  const handleSelectProduct = (product: Product) => {
    if (product.stock <= 0) {
      // Optional: Prevent adding out of stock items or just warn
      // For now, allowing it but it might be good to warn
    }
    onAddProduct(product);
    setProductQuery("");
    setProducts([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < products.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelectProduct(products[selectedIndex]);
    }
  };

  return (
    <div className="relative w-full">
      {/* Input field */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Package size={18} />
        </div>
        <input
          type="text"
          placeholder="Search products by name, SKU or code..."
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
        transition-all duration-200 shadow-sm hover:bg-white dark:hover:bg-gray-750"
        />

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin">
            <Loader2 size={18} />
          </div>
        )}

        {/* Clear Button */}
        {productQuery && !loading && (
          <button
            onClick={() => {
              setProductQuery("");
              setProducts([]);
              setSelectedIndex(-1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
          hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 
          rounded-full p-1 transition-colors duration-150"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Product Suggestions Dropdown */}
      {products.length > 0 && (
        <div
          className="absolute w-full mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-xl 
      border border-gray-100 dark:border-gray-700 max-h-80 overflow-y-auto z-50 divide-y divide-gray-100 dark:divide-gray-700"
        >
          {products.map((p, index) => (
            <button
              key={p._id}
              onClick={() => handleSelectProduct(p)}
              className={`w-full flex justify-between items-center px-4 py-3 
            text-left transition-colors duration-150 group ${selectedIndex === index
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                } ${p.stock <= 0 ? "opacity-75 bg-gray-50/50" : ""}`}
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm truncate">
                    {p.title}
                  </span>
                  {p.stock <= 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Out of Stock</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">
                    {p.productCode}
                  </span>
                  <span className={`${p.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : "No stock"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                  ₹{p.price.toFixed(2)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceProductSearch;
