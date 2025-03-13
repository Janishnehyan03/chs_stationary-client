import {
  BookOpen,
  Home,
  Package,
  ShoppingBag,
  Users as TeachersIcon,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Clear localStorage (or sessionStorage)
    localStorage.clear(); // Clears all stored data
    // Alternatively, you can remove specific items:
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("user");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-xl p-6 flex flex-col fixed h-screen">
      <Link to="/" className="flex items-center space-x-3 mb-8">
        <div className="flex items-center space-x-4 mb-8">
          <img
            src="/android-chrome-192x192.png"
            alt="Logo"
            className="w-16 h-16 rounded-full shadow-md"
          />
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>
      </Link>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/" ? "bg-blue-100" : "hover:bg-blue-100"
              }`}
            >
              <Home size={20} /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/invoice"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/invoice"
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
            >
              <ShoppingBag size={20} /> <span>Invoice</span>
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/products"
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
            >
              <Package size={20} /> <span>Products</span>
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/users"
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
            >
              <Users size={20} /> <span>Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/students"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/students"
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
            >
              <User size={20} /> <span>Students</span>
            </Link>
          </li>
          <li>
            <Link
              to="/teachers"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/teachers"
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
            >
              <TeachersIcon size={20} /> <span>Teachers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/classes"
              className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium p-3 rounded-lg ${
                location.pathname === "/classes"
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
            >
              <BookOpen size={20} /> <span>Classes</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 text-gray-700 hover:text-red-600 font-medium p-3 rounded-lg hover:bg-red-100 mt-auto"
      >
        <LogOut size={20} /> <span>Logout</span>
      </button>
    </div>
  );
}