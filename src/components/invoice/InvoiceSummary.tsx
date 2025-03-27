import dayjs from "dayjs";
import {
  AlertCircle,
  ArrowRight,
  LucideShoppingCart,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState, ChangeEvent, JSX } from "react";
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
  hoverBgColor: string;
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
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalDue, setTotalDue] = useState<number>(0);
  const [totalStudentBalance, setTotalStudentBalance] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { startDate, endDate } =
          filter === "custom"
            ? {
                startDate: dayjs(customStartDate).format("YYYY-MM-DD"),
                endDate: dayjs(customEndDate).format("YYYY-MM-DD"),
              }
            : filter === "day"
            ? { startDate: "", endDate: "" }
            : getFilterDates(filter);

        const response = await Axios.get<InvoiceData>(
          `/invoices/overview/data?filter=${filter}&startDate=${startDate}&endDate=${endDate}`
        );

        setTotalRevenue(response.data.totalAmount);
        setTotalPaid(response.data.totalPaid);
        setTotalDue(response.data.totalDue);
        setTotalStudentBalance(response.data.totalStudentBalance);
        setTotalProfit(response.data.totalProfit);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [filter, customStartDate, customEndDate, invoicePaid]);

  // Format currency in INR
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
      name: "Total Purchases",
      icon: <ShoppingCart size={20} />,
      value: totalRevenue,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverBgColor: "hover:bg-green-100",
    },
    {
      path: "/total-invoice-paid",
      name: "Total Paid",
      icon: <Wallet size={20} />,
      value: totalPaid,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
    },
    {
      path: "/total-invoice-due",
      name: "Total Due",
      icon: <AlertCircle size={20} />,
      value: totalDue,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverBgColor: "hover:bg-red-100",
    },
    {
      path: "/total-student-balances",
      name: "Student Balances",
      icon: <Users size={20} />,
      value: totalStudentBalance,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBgColor: "hover:bg-purple-100",
    },
    {
      path: "/sales-dashboard",
      name: "Sales Dashboard",
      icon: <LucideShoppingCart size={20} />,
      value: totalProfit,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverBgColor: "hover:bg-teal-100",
    },
  ];

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFilter(e.target.value);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Navigation Summary */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Financial Overview
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {dayjs().format("DD MMM YYYY")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`${item.bgColor} ${item.hoverBgColor} p-4 rounded-lg cursor-pointer transition-all duration-200 border border-gray-100 hover:shadow-md`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-full ${item.bgColor}`}>
                      {item.icon}
                    </div>
                    <ArrowRight size={16} className="text-gray-400 mt-1" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{item.name}</p>
                    <p className={`text-lg font-semibold mt-1 ${item.color}`}>
                      {isLoading ? (
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        formatCurrency(item.value)
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Controls */}
        </div>
        <div className="w-full lg:w-auto">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label
                  htmlFor="filter"
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Filter period:
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={handleFilterChange}
                  className="w-full sm:w-40 border border-gray-300 bg-white text-gray-900 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option} value={option} className="capitalize">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Picker */}
              {filter === "custom" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Start Date
                    </label>
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date: Date | null) =>
                        date && setCustomStartDate(date)
                      }
                      dateFormat="dd MMM yyyy"
                      className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      End Date
                    </label>
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date: Date | null) =>
                        date && setCustomEndDate(date)
                      }
                      dateFormat="dd MMM yyyy"
                      className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
