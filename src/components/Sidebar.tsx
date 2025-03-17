import {
  BookOpen,
  Home,
  Package,
  ShoppingBag,
  Users as TeachersIcon,
  User,
  Users,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHasPermission } from "../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../utils/permissions";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const canCreateUsers=useHasPermission(PERMISSIONS.users.create);
  const canReadClasses = useHasPermission(PERMISSIONS.class.read);
  const canReadStudents = useHasPermission(PERMISSIONS.students.read);
  const canReadTeachers = useHasPermission(PERMISSIONS.teachers.read);
  const canReadPermissions = useHasPermission(PERMISSIONS.permissions.read);
  const canReadProducts = useHasPermission(PERMISSIONS.products.read);
  const canReadInvoice = useHasPermission(PERMISSIONS.invoice.read);


  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Sidebar toggle function
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (isOpen && isMobile && !event.target.closest("#sidebar")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768); // Auto open on larger screens
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set dark mode on initial load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="relative">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 fixed top-4 right-4 bg-white dark:bg-gray-900 dark:text-white shadow-lg rounded-full z-50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (Mobile) */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed h-screen bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col transition-all duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"} 
          md:translate-x-0 md:w-64`}
      >
        {/* Logo & Title */}
        <Link to="/" className="flex items-center space-x-4 mb-8">
          <img
            src="/android-chrome-192x192.png"
            alt="Logo"
            className="w-12 h-12 rounded-full shadow-md"
          />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Admin Panel
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-3">
            {[
              { to: "/", label: "Home", icon: Home, permission: true },
              { to: "/invoice", label: "Invoice", icon: ShoppingBag, permission: canReadInvoice },
              { to: "/products", label: "Products", icon: Package, permission: canReadProducts },
              { to: "/users", label: "Users", icon: Users, permission: canCreateUsers },
              { to: "/students", label: "Students", icon: User, permission: canReadStudents },
              { to: "/teachers", label: "Teachers", icon: TeachersIcon, permission: canReadTeachers },
              { to: "/classes", label: "Classes", icon: BookOpen, permission: canReadClasses },
              { to: "/permissions", label: "Permissions", icon: Shield, permission: canReadPermissions },
            ]
              .filter(({ permission }) => permission)
              .map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 text-gray-700 dark:text-gray-300 font-medium p-3 rounded-lg transition-all 
                  ${
                  location.pathname === to
                    ? "bg-blue-500 text-white dark:bg-blue-600"
                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                  }`}
                >
                <Icon size={20} /> <span>{label}</span>
                </Link>
              </li>
              ))}
          </ul>
        </nav>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mt-4"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-700 mt-4"
        >
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
