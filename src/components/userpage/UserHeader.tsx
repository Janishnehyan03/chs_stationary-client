import { Book, CreditCard, LogOut, ShoppingCart, User } from "lucide-react";

function UserHeader({ user }: any) {
  const logout = () => {
    // Handle logout logic here
    localStorage.clear();
    window.location.href = "/login"; // Redirect to login page
  }
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-indigo-500 dark:text-indigo-400 transition-transform duration-300 hover:scale-110" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            CHS Stationery
          </h1>
        </div>

        <div className="flex items-center space-x-8">
          <div className="relative group">
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all duration-300">
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              {user.cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {user.cartItems}
                </span>
              )}
            </button>
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-10 hidden group-hover:block p-6 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white">
                Your Cart ({user.cartItems} items)
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Click to view full cart details
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 group relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white hidden md:inline-block">
              {user.name}
            </span>
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-10 hidden group-hover:block py-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <button className="w-full text-left px-5 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center text-gray-700 dark:text-gray-200 transition-colors duration-200">
                <User className="mr-2 w-4 h-4" /> My Profile
              </button>
              <button className="w-full text-left px-5 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center text-gray-700 dark:text-gray-200 transition-colors duration-200">
                <CreditCard className="mr-2 w-4 h-4" /> Payments
              </button>
              <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-1"></div>
              <button 
              onClick={logout}
              className="w-full text-left px-5 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900 text-red-500 dark:text-red-400 flex items-center transition-colors duration-200">
                <LogOut className="mr-2 w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
