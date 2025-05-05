import { motion } from "framer-motion";

function UserCart({ cart, addToCart, removeFromCart, calculateTotal }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          My Cart
        </h3>
      </div>
      {cart.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your cart is empty
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {cart.map((item: any) => (
              <motion.div
                key={item.id}
                className="px-6 py-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ₹{item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-lg w-24 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                Total:
              </span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="mt-5 flex justify-end space-x-4">
              <motion.button
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
              <motion.button
                className="px-5 py-2.5 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Proceed to Payment
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserCart;