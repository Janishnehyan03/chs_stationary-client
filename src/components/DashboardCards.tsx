import {
  Users,
  Package,
  ShoppingCart,
  GraduationCap,
  School,
  DollarSign,
  PlusCircle,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import Axios from "../Axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  totalProducts: number;
  outOfStockItems: number;
  totalPurchases: number;
}

const DashboardCards: React.FC = () => {
  const { user } = useUserContext();
  const [isDeletingStudents, setIsDeletingStudents] = useState(false);
  const [isDeletingAllData, setIsDeletingAllData] = useState(false);

  const requireTripleConfirmation = (
    title: string,
    keyword: string,
  ): boolean => {
    const first = window.confirm(
      `${title}\n\nThis action is permanent and cannot be undone.`,
    );
    if (!first) return false;

    const second = window.prompt(
      `Second confirmation: type ${keyword} to continue.`,
      "",
    );
    if (second !== keyword) {
      alert("Confirmation text did not match. Action cancelled.");
      return false;
    }

    const third = window.confirm(
      `Final confirmation: are you absolutely sure to proceed with ${title.toLowerCase()}?`,
    );
    return third;
  };

  const handleDeleteStudents = async () => {
    if (
      !requireTripleConfirmation(
        "Delete all students and related invoices",
        "DELETE STUDENTS",
      )
    ) {
      return;
    }

    try {
      setIsDeletingStudents(true);
      const response = await Axios.delete("/stats/danger-zone/students");
      const { deletedStudents = 0, deletedInvoices = 0 } = response.data || {};
      alert(
        `Completed. Deleted ${deletedStudents} students and ${deletedInvoices} invoices.`,
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete students:", error);
      alert("Failed to delete student data. Please try again.");
    } finally {
      setIsDeletingStudents(false);
    }
  };

  const handleDeleteAllData = async () => {
    if (
      !requireTripleConfirmation(
        "Delete all academic year data",
        "DELETE ALL DATA",
      )
    ) {
      return;
    }

    try {
      setIsDeletingAllData(true);
      const response = await Axios.delete("/stats/danger-zone/all");
      const {
        deletedUsers = 0,
        deletedClasses = 0,
        deletedInvoices = 0,
        deletedProducts = 0,
        deletedPurchases = 0,
        deletedShops = 0,
      } = response.data || {};

      alert(
        `Completed. Users: ${deletedUsers}, Classes: ${deletedClasses}, Invoices: ${deletedInvoices}, Products: ${deletedProducts}, Purchases: ${deletedPurchases}, Shops: ${deletedShops}.`,
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete all data:", error);
      alert("Failed to delete all academic data. Please try again.");
    } finally {
      setIsDeletingAllData(false);
    }
  };

  const canUseDangerZone =
    user?.role === "admin" || user?.role === "super-admin";

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await Axios.get("/stats");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
        <h2 className="text-xl font-bold">Failed to load dashboard stats</h2>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickAction
          to="/students"
          icon={PlusCircle}
          label="Add Student"
          color="bg-purple-500"
        />
        <QuickAction
          to="/invoice"
          icon={FileText}
          label="New Sale"
          color="bg-green-500"
        />
        <QuickAction
          to="/products"
          icon={Package}
          label="Products"
          color="bg-orange-500"
        />
        <QuickAction
          to="/purchases"
          icon={ShoppingBag}
          label="Purchases"
          color="bg-blue-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          color="blue"
        />
        <StatCard
          icon={GraduationCap}
          title="Total Students"
          value={stats?.totalStudents || 0}
          color="purple"
        />
        <StatCard
          icon={School}
          title="Total Classes"
          value={stats?.totalClasses || 0}
          color="yellow"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Products"
          value={stats?.totalProducts || 0}
          color="orange"
        />
        <StatCard
          icon={Package}
          title="Out of Stock"
          value={stats?.outOfStockItems || 0}
          color="red"
          alert={stats?.outOfStockItems ? stats.outOfStockItems > 0 : false}
        />
        <StatCard
          icon={DollarSign}
          title="Total Purchases"
          value={stats?.totalPurchases || 0}
          color="green"
        />
      </div>

      {canUseDangerZone && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-6">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
            Danger Zone
          </h2>
          <p className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">
            Use these options only for starting a new academic year. Deletion is permanent and includes multiple confirmations.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDeleteStudents}
              disabled={isDeletingStudents || isDeletingAllData}
              className="px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeletingStudents ? "Deleting Students..." : "Bulk Delete Students"}
            </button>
            <button
              type="button"
              onClick={handleDeleteAllData}
              disabled={isDeletingStudents || isDeletingAllData}
              className="px-4 py-2.5 rounded-lg bg-red-800 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeletingAllData ? "Deleting All Data..." : "Bulk Delete All Data"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Components ---

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  color: keyof typeof colorStyles;
  alert?: boolean;
}

const colorStyles = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", iconBg: "bg-blue-100 dark:bg-blue-800" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", iconBg: "bg-purple-100 dark:bg-purple-800" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400", iconBg: "bg-yellow-100 dark:bg-yellow-800" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", iconBg: "bg-orange-100 dark:bg-orange-800" },
  red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", iconBg: "bg-red-100 dark:bg-red-800" },
  green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", iconBg: "bg-green-100 dark:bg-green-800" },
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, alert }) => {
  const styles = colorStyles[color];

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${alert ? 'ring-2 ring-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {value.toLocaleString()}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg} ${styles.text}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 w-full h-1 ${styles.text.replace('text', 'bg')}`} />
    </div>
  );
};

interface QuickActionProps {
  to: string;
  icon: React.ElementType;
  label: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ to, icon: Icon, label, color }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:border-gray-300 dark:hover:border-gray-600 group"
  >
    <div className={`p-2 rounded-lg text-white ${color} shadow-sm group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
    <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
      {label}
    </span>
  </Link>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      ))}
    </div>
  </div>
);

export default DashboardCards;
