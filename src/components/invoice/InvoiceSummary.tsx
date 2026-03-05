import dayjs from "dayjs";
import {
  AlertCircle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Users,
  Wallet,
  Calendar,
} from "lucide-react";
import { useEffect, useState, JSX } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "../../Axios";
import { getFilterDates } from "./LatestInvoices";
import { useNavigate } from "react-router-dom";

interface InvoiceData {
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  totalStudentBalance: number;
  totalProfit: number;
}

interface NavItem {
  path: string;
  name: string;
  icon: JSX.Element;
  value: number;
  color: string;
  bgColor: string;
  iconBg: string;
}

interface InvoiceSummaryProps {
  filter: string;
  setFilter: (filter: string) => void;
  customStartDate: Date;
  setCustomStartDate: (date: Date) => void;
  customEndDate: Date;
  setCustomEndDate: (date: Date) => void;
  invoicePaid: boolean;
}

const FILTER_OPTIONS: string[] = ["day", "week", "month", "year", "custom"];

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  filter,
  setFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  invoicePaid,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<InvoiceData>({
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0,
    totalStudentBalance: 0,
    totalProfit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { startDate, endDate } =
          filter === "custom"
            ? {
              startDate: dayjs(customStartDate).format("YYYY-MM-DD"),
              endDate: dayjs(customEndDate).format("YYYY-MM-DD"),
            }
            : getFilterDates(filter);

        const response = await Axios.get<InvoiceData>(
          `/invoices/overview/data?filter=${filter}&startDate=${startDate}&endDate=${endDate}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [filter, customStartDate, customEndDate, invoicePaid]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const navItems: NavItem[] = [
    {
      path: "/total-invoice-purchase",
      name: "Total Revenue",
      icon: <TrendingUp size={24} />,
      value: data.totalAmount,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50/50 dark:bg-emerald-900/10",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      path: "/total-invoice-paid",
      name: "Collections",
      icon: <Wallet size={24} />,
      value: data.totalPaid,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50/50 dark:bg-blue-900/10",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      path: "/total-invoice-due",
      name: "Outstanding",
      icon: <AlertCircle size={24} />,
      value: data.totalDue,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50/50 dark:bg-rose-900/10",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      path: "/total-student-balances",
      name: "Student Funds",
      icon: <Users size={24} />,
      value: data.totalStudentBalance,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50/50 dark:bg-violet-900/10",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      path: "/sales-dashboard",
      name: "Net Profit",
      icon: <CreditCard size={24} />,
      value: data.totalProfit,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50/50 dark:bg-teal-900/10",
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm glass">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            Performance Overview
          </h2>
          <p className="text-sm text-gray-500 font-medium">Monitoring financial health for {dayjs().format("MMMM YYYY")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/80 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700 w-full lg:w-auto">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-gray-400">
              <Calendar size={16} />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-700 dark:text-gray-200 outline-none pr-4 capitalize cursor-pointer"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {filter === "custom" && (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/80 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <DatePicker
                  selected={customStartDate}
                  onChange={(date: Date | null) => date && setCustomStartDate(date)}
                  dateFormat="MMM dd"
                  className="bg-transparent text-[11px] font-bold text-gray-600 dark:text-gray-400 outline-none w-16 text-center"
                />
                <ArrowRight size={12} className="text-gray-300" />
                <DatePicker
                  selected={customEndDate}
                  onChange={(date: Date | null) => date && setCustomEndDate(date)}
                  dateFormat="MMM dd"
                  className="bg-transparent text-[11px] font-bold text-gray-600 dark:text-gray-400 outline-none w-16 text-center"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`group relative flex flex-col p-5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 ${item.bgColor} text-left overflow-hidden`}
          >
            {/* Background Decoration */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all group-hover:scale-150 ${item.bgColor}`} />

            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110 ${item.iconBg} ${item.color}`}>
                {item.icon}
              </div>
              <div className="p-1 px-2 rounded-full bg-white/50 dark:bg-black/20 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Details
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {item.name}
              </p>
              <div className={`text-2xl font-black ${item.color} tracking-tight`}>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ) : (
                  formatCurrency(item.value)
                )}
              </div>
            </div>

            {/* Bottom Progress Bar Decoration */}
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all w-0 group-hover:w-full" style={{ color: "rgb(var(--color-primary))" }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoiceSummary;
