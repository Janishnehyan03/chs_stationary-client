import dayjs from "dayjs";
import { AlertCircle, ShoppingCart, Users, Wallet } from "lucide-react";
import { useEffect, useState, ChangeEvent, JSX } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "../../Axios";
import { getFilterDates } from "./LatestInvoices";

interface InvoiceData {
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  totalStudentBalance: number;
}

interface NavItem {
  path: string;
  name: string;
  icon: JSX.Element;
  value: number;
  color: string;
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
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalDue, setTotalDue] = useState<number>(0);
  const [totalStudentBalance, setTotalStudentBalance] = useState<number>(0);

  useEffect(() => {
    const fetchInvoices = async (): Promise<void> => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };

    fetchInvoices();
  }, [filter, customStartDate, customEndDate, invoicePaid]);

  const navItems: NavItem[] = [
    {
      path: "/total-invoice-purchase",
      name: "Total Purchases",
      icon: (
        <ShoppingCart
          size={20}
          className="text-green-600 dark:text-green-400"
        />
      ),
      value: totalRevenue,
      color: "text-green-600 dark:text-green-400",
    },
    {
      path: "/total-invoice-paid",
      name: "Total Paid",
      icon: <Wallet size={20} className="text-blue-600 dark:text-blue-400" />,
      value: totalPaid,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      path: "/total-invoice-due",
      name: "Total Due",
      icon: (
        <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
      ),
      value: totalDue,
      color: "text-red-600 dark:text-red-400",
    },
    {
      path: "/total-student-balances",
      name: "Student Balances",
      icon: (
        <Users size={20} className="text-yellow-600 dark:text-yellow-400" />
      ),
      value: totalStudentBalance,
      color: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Navigation Summary */}
          <nav className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-6 w-full md:w-auto">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {item.icon}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </p>
                  <p className={`text-xl font-semibold ${item.color}`}>
                    ₹{item.value.toLocaleString("en-IN")}
                  </p>
                </div>
              </a>
            ))}
          </nav>

          {/* Filter Controls */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <label
                htmlFor="filter"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Filter by:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    selected={customStartDate}
                    onChange={(date: Date | null) =>
                      date && setCustomStartDate(date)
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    End Date
                  </label>
                  <DatePicker
                    selected={customEndDate}
                    onChange={(date: Date | null) =>
                      date && setCustomEndDate(date)
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
