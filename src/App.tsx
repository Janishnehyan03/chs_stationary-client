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
// import ProtectedRoute from "./utils/ProtectedRoute";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import Unauthorized from "./pages/Unauthorized"; // Import Unauthorized page
import StudentProfile from "./pages/StudentProfile";
import Students from "./pages/StudentsPage";
import { ModalProvider } from "./context/modalContext";

function App() {
  const location = useLocation();
  const publicPaths = ["/login", "/student"];

  // Function to check if the current path is public
  const isPublicPage =
    publicPaths.includes(location.pathname) ||
    matchPath("/student/:userId", location.pathname);
  return (
    <ModalProvider>
      <UserProvider>
        <ToastContainer />
        <div className="flex w-full bg-gray-100">
          {/* Show Sidebar only if not on the login page */}
          {!isPublicPage && <Sidebar />}

          {/* Main Content */}
          <div className={`flex-grow p-6 ${!isPublicPage ? "ml-64" : ""}`}>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />
              <Route path="/student" element={<Students />} />
              <Route path="/student/:userId" element={<StudentProfile />} />

              {/* Protected Routes */}
              {/* <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/invoice" element={<Invoice />} />
              </Route> */}

              {/* Role-Based Routes */}
              <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/invoice" element={<Invoice />} />
              </Route>

              <Route path="/user/:userId" element={<StudentProfile />} />
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
