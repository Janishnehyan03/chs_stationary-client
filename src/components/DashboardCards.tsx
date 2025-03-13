import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, GraduationCap, School, DollarSign } from "lucide-react";
import Axios from "../Axios";

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  color: keyof typeof colorClasses;
}

const DashboardCards: React.FC = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalProducts: 0,
    outOfStockItems: 0,
    totalPurchases: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await Axios.get("/stats"); // Using Axios instance
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard icon={Users} title="Total Teachers" value={stats.totalTeachers} color="blue" />
        <DashboardCard icon={GraduationCap} title="Total Students" value={stats.totalStudents} color="purple" />
        <DashboardCard icon={School} title="Total Classes" value={stats.totalClasses} color="yellow" />
      </div>

      {/* Product and Purchase Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <DashboardCard icon={ShoppingCart} title="Total Products" value={stats.totalProducts} color="orange" />
        <DashboardCard icon={Package} title="Out of Stock Items" value={stats.outOfStockItems} color="red" />
        <DashboardCard icon={DollarSign} title="Total Purchases" value={stats.totalPurchases} color="green" />
      </div>
    </div>
  );
};

const colorClasses = {
  blue: "text-blue-500 bg-blue-100",
  yellow: "text-yellow-500 bg-yellow-100",
  green: "text-green-500 bg-green-100",
  purple: "text-purple-500 bg-purple-100",
  orange: "text-orange-500 bg-orange-100",
  red: "text-red-500 bg-red-100",
} as const;

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl flex items-center space-x-4 border border-gray-200 transition-all hover:shadow-xl hover:scale-105">
      <div className={`p-4 rounded-full ${colorClasses[color]}`}>
        <Icon size={30} className={colorClasses[color]} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCards;
