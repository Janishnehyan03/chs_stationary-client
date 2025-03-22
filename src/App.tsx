import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import ClassesPage from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Invoice from "./pages/Invoice";
import Products from "./pages/Products";
import StudentsPage from "./pages/Students";
import TeachersPage from "./pages/Teachers";
import UsersPage from "./pages/Users";
import Login from "./pages/Login";
import { UserProvider } from "./context/userContext";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import Unauthorized from "./pages/Unauthorized";
import StudentProfile from "./pages/StudentProfile";
import Students from "./pages/StudentsPage";
import { ModalProvider } from "./context/modalContext";
import Permissions from "./pages/Permissions";
import Shops from "./pages/Shops";
import PurchasePage from "./pages/PurchaseBill";

function App() {
  const location = useLocation();
  const publicPaths = ["/login", "/student"];

  // Check if the current page is public (login or student profile)
  const isPublicPage =
    publicPaths.includes(location.pathname) ||
    matchPath("/student/:userId", location.pathname);

  return (
    <ModalProvider>
      <UserProvider>
        <ToastContainer />
        <div className="flex w-full bg-gray-100 dark:bg-gray-800 min-h-screen">
          {/* Sidebar is only visible when not on public pages */}
          {!isPublicPage && <Sidebar />}

          {/* Main Content Wrapper */}
          <div
            className={`flex-grow transition-all ${!isPublicPage ? "md:ml-64" : ""
              }`}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/student" element={<Students />} />
              <Route path="/student/:userId" element={<StudentProfile />} />

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
