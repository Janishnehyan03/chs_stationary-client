import { useState, useEffect } from "react";
import Axios from "../../Axios";
import { Loader2, X } from "lucide-react";
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
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        text-gray-700 placeholder-gray-400 transition-shadow duration-200 
        hover:shadow-sm pr-10"
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
          hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 
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
          className="absolute w-full mt-1.5 bg-white shadow-xl rounded-lg 
      border border-gray-100 max-h-64 overflow-y-auto z-50"
        >
          {products.map((p, index) => (
            <button
              key={p._id}
              onClick={() => handleSelectProduct(p)}
              className={`w-full flex justify-between items-center px-4 py-2.5 
            text-left transition-colors duration-150 ${
              selectedIndex === index
                ? "bg-blue-50 text-blue-900"
                : "hover:bg-gray-50 text-gray-800"
            }`}
            >
              <span className="text-sm font-medium truncate max-w-[70%]">
                {p.title} <span className="text-gray-500 font-normal bg-gray-100 px-1.5 rounded-md">
                {p.productCode}
                </span>
              </span>
              <span className="text-sm font-semibold text-gray-600">
                ${p.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceProductSearch;
