import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

function UserProductsList({ products, addToCart }: any) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product: any) =>
    `${product.title}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-xl rounded-2xl shadow-xl p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-300 dark:border-gray-700 pb-4 mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
          🛍 Available Products
        </h3>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/60 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none backdrop-blur"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <motion.div
              key={product.id}
              className="bg-white/80 dark:bg-gray-800/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-5 border border-gray-200 dark:border-gray-700 backdrop-blur-md"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h4 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                {product.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                  ₹{product.price.toFixed(2)}
                </span>
                <motion.button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProductsList;
