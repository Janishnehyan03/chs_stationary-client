import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import { ModalProvider } from "./context/modalContext";
import { UserProvider } from "./context/userContext";
import ClassesPage from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Invoice from "./pages/Invoice";
import Login from "./pages/Login";
import Permissions from "./pages/Permissions";
import Products from "./pages/Products";
import PurchasePage from "./pages/PurchaseBill";
import Shops from "./pages/Shops";
import StudentProfile from "./pages/StudentProfile";
import StudentsPage from "./pages/Students";
import Students from "./pages/StudentsPage";
import TeachersPage from "./pages/Teachers";
import Teachers from "./pages/TeachersPage";
import Unauthorized from "./pages/Unauthorized";
import UsersPage from "./pages/Users";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import TotalInvoiePurchases from "./pages/TotalInvoicePurchases";
import TotalPaidInvoices from "./pages/TotalPaidInvoices";
import DueInvoices from "./pages/TotalDueInvoices";
import TotalStudentBalances from "./pages/TotalStudentBalances";

function App() {
  const location = useLocation();
  const roleBasedPaths = [
    "/",
    "/users",
    "/products",
    "/shops",
    "/purchases",
    "/classes",
    "/teachers",
    "/students",
    "/invoice",
    "/permissions",
    "/total-invoice-purchase",
    "/total-invoice-paid",
    "/total-invoice-due",
    '/total-student-balances'
  ];

  // Check if the current page is a role-based (private) route
  const isRoleBasedPage = roleBasedPaths.some(
    (path) =>
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(`${path}/`))
  );

  return (
    <ModalProvider>
      <UserProvider>
        <ToastContainer />
        <div className="flex w-full bg-gray-100 dark:bg-gray-800 min-h-screen">
          {/* Sidebar is only visible for role-based (private) pages */}
          {isRoleBasedPage && <Sidebar />}

          {/* Main Content Wrapper */}
          <div
            className={`flex-grow transition-all ${
              isRoleBasedPage ? "md:ml-64" : ""
            }`}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/student" element={<Students />} />
              <Route path="/teacher" element={<Teachers />} />
              <Route path="/user/:userId" element={<StudentProfile />} />

              {/* Role-Based Routes */}
              <Route
                element={
                  <RoleBasedRoute allowedRoles={["super-admin", "admin"]} />
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/purchases" element={<PurchasePage />} />
                <Route
                  path="/total-invoice-purchase"
                  element={<TotalInvoiePurchases />}
                />
                <Route
                  path="/total-invoice-paid"
                  element={<TotalPaidInvoices />}
                />
                <Route
                  path="/total-student-balances"
                  element={<TotalStudentBalances />}
                />
                <Route path="/total-invoice-due" element={<DueInvoices />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/permissions" element={<Permissions />} />
              </Route>

              {/* Unauthorized Route */}
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </div>
        </div>
      </UserProvider>
    </ModalProvider>
  );
}

export default App;
