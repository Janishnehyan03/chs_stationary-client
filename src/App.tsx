import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import { ModalProvider } from "./context/modalContext";
import { UserProvider } from "./context/userContext";
import { publicRoutes, protectedRoutes } from "./routes";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const location = useLocation();

  // Check if current route is protected (shows sidebar)
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      location.pathname === route.path ||
      (route.path !== "/" && location.pathname.startsWith(`${route.path}/`))
  );

  return (
    <ModalProvider>
      <UserProvider>
        <ToastContainer />
        <div className="flex w-full bg-gray-100 dark:bg-gray-800 min-h-screen">
          {/* Sidebar is only visible for protected routes */}
          {isProtectedRoute && <Sidebar />}

          {/* Main Content Wrapper */}
          <div
            className={`flex-grow transition-all ${
              isProtectedRoute ? "md:ml-64" : ""
            }`}
          >
            <Suspense fallback={<LoadingSpinner fullPage />}>
              <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}

                {/* Protected Routes */}
                {protectedRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </Suspense>
          </div>
        </div>
      </UserProvider>
    </ModalProvider>
  );
}

export default App;
