import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFilterDates } from "./LatestInvoices";
import Axios from "../../Axios";

const FILTER_OPTIONS = ["day", "week", "month", "year", "custom"];

const InvoiceSummary = ({
  filter,
  setFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  invoicePaid,
}: {
  filter: string;
  setFilter: (filter: string) => void;
  customStartDate: Date | null;
  setCustomStartDate: (date: Date | null) => void;
  customEndDate: Date | null;
  setCustomEndDate: (date: Date | null) => void;
  invoicePaid: boolean;
}) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [totalStudentBalance, setTotalStudentBalance] = useState(0);

  useEffect(() => {
    const fetchInvoices = async () => {
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

        const response = await Axios.get(
          `/invoices/overview/data?filter=${filter}&startDate=${startDate}&endDate=${endDate}`
        );

        setTotalRevenue(response.data.totalAmount);
        setTotalPaid(response.data.totalPaid);
        setTotalDue(response.data.totalDue);
        setTotalStudentBalance(response.data.totalStudentBalance);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [filter, customStartDate, customEndDate, invoicePaid]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:flex gap-6 w-full md:w-auto">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Purchase
          </p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            ₹{totalPaid.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Due</p>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">
            ₹{totalDue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Student Balance
          </p>
          <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
            ₹{totalStudentBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="mt-4 md:mt-0">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker (Shown only if custom filter is selected) */}
      {filter === "custom" && (
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start Date
            </p>
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceSummary;
