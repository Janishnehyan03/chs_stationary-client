import { motion } from "framer-motion"; // For subtle animations

function UserNavigation({ activeTab, setActiveTab, cart }: any) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-lg shadow-sm transition-colors duration-300">
      <motion.button
        className={`px-6 py-3 font-semibold text-sm relative flex-1 text-center transition-colors duration-200 ${
          activeTab === "products"
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-t-md`}
        onClick={() => setActiveTab("products")}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Products
        {activeTab === "products" && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
            layoutId="underline"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
      <motion.button
        className={`px-6 py-3 font-semibold text-sm relative flex-1 text-center transition-colors duration-200 ${
          activeTab === "cart"
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-t-md`}
        onClick={() => setActiveTab("cart")}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        My Cart ({cart.length})
        {activeTab === "cart" && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
            layoutId="underline"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
      <motion.button
        className={`px-6 py-3 font-semibold text-sm relative flex-1 text-center transition-colors duration-200 ${
          activeTab === "payments"
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-t-md`}
        onClick={() => setActiveTab("payments")}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Payments
        {activeTab === "payments" && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
            layoutId="underline"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    </div>
  );
}

export default UserNavigation;