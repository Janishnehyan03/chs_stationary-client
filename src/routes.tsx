import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import NotFoundPage from "./pages/NotFound";
import UserPage from "./pages/UserPage";
import StudentInvoices from "./components/invoice/StudentInvoicePayment";

// Public components
const Login = lazy(() => import("../src/pages/Login"));
const Students = lazy(() => import("../src/pages/StudentsPage"));
const Teachers = lazy(() => import("../src/pages/TeachersPage"));
const StudentProfile = lazy(() => import("../src/pages/StudentProfile"));
const Unauthorized = lazy(() => import("../src/pages/Unauthorized"));

// Protected components
const Dashboard = lazy(() => import("../src/pages/Dashboard"));
const UsersPage = lazy(() => import("../src/pages/Users"));
const Products = lazy(() => import("../src/pages/Products"));
const Shops = lazy(() => import("../src/pages/Shops"));
const PurchasePage = lazy(() => import("../src/pages/PurchaseBill"));
const ClassesPage = lazy(() => import("../src/pages/Classes"));
const TeachersPage = lazy(() => import("../src/pages/Teachers"));
const StudentsPage = lazy(() => import("../src/pages/Students"));
const Invoice = lazy(() => import("../src/pages/Invoice"));
const Permissions = lazy(() => import("../src/pages/Permissions"));
const TotalInvoiePurchases = lazy(
  () => import("../src/pages/TotalInvoicePurchases")
);
const TotalPaidInvoices = lazy(() => import("../src/pages/TotalPaidInvoices"));
const DueInvoices = lazy(() => import("../src/pages/TotalDueInvoices"));
const TotalStudentBalances = lazy(
  () => import("../src/pages/TotalStudentBalances")
);
const SalesDashboard = lazy(() => import("../src/pages/SalesDashboard")); // Update the path to the correct file

export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/student",
    element: <Students />,
  },
  {
    path: "/teacher",
    element: <Teachers />,
  },
  {
    path: "/user/:userId",
    element: <StudentProfile />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/user",
    element: (
      <RoleBasedRoute allowedRoles={["student", "teacher"]}>
        <UserPage />
      </RoleBasedRoute>
    ),
  },
];

export const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <Dashboard />
      </RoleBasedRoute>
    ),
  },

  {
    path: "/users",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <UsersPage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/invoices/:studentId",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <StudentInvoices />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <Products />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/shops",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <Shops />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/purchases",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <PurchasePage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/total-invoice-purchase",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <TotalInvoiePurchases />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/total-invoice-paid",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <TotalPaidInvoices />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/total-student-balances",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <TotalStudentBalances />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/total-invoice-due",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <DueInvoices />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/sales-dashboard",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <SalesDashboard />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/classes",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <ClassesPage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/teachers",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <TeachersPage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/students",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <StudentsPage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/invoice",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin", "admin"]}>
        <Invoice />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/permissions",
    element: (
      <RoleBasedRoute allowedRoles={["super-admin"]}>
        <Permissions />
      </RoleBasedRoute>
    ),
  },
];
