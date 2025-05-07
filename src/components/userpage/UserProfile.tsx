import { motion } from "framer-motion"; // For subtle animations

function UserProfile({ user }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl transition-colors duration-300">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {user.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user.class.name} - {user.class.section} | Admission No:{" "}
              {user.admissionNumber}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.div
              className="bg-green-50 dark:bg-green-900/50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                Balance
              </p>
              <p className="font-semibold text-green-800 dark:text-green-300 mt-1">
                ₹{user.balance.toFixed(2)}
              </p>
            </motion.div>
            <motion.div
              className="bg-yellow-50 dark:bg-yellow-900/50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                Due Amount
              </p>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300 mt-1">
                ₹{user.dueAmount.toFixed(2)}
              </p>
            </motion.div>
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Paid Amount
              </p>
              <p className="font-semibold text-blue-800 dark:text-blue-300 mt-1">
                ₹{user.paidAmount.toFixed(2)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
