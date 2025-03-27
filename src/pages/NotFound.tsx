import { motion } from "framer-motion";
import { AlertTriangle, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";

export default function NotFoundPage() {
  const { user } = useUserContext();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-md mx-auto">
        {/* Animated 404 number */}
        <motion.div
          initial={{ scale: 0.8, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="absolute -inset-4 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-lg"></div>
          <div className="relative flex items-center justify-center">
            <AlertTriangle className="h-24 w-24 text-red-500 dark:text-red-400" />
            <span className="absolute text-6xl font-bold text-red-500 dark:text-red-400">
              404
            </span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4"
        >
          {user && (
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Home className="h-5 w-5" />
              <span>Go to Homepage</span>
            </Link>
          )}
          <Link
            to="/student"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <User className="h-5 w-5" />
            <span>Go to Students' Page</span>
          </Link>
          <Link
            to="/teacher"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <User className="h-5 w-5" />
            <span>Go to Teachers' Page</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
