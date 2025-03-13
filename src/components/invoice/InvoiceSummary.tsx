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
  invoicePaid
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
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex gap-6">
        <div>
          <p className="text-sm text-gray-500">Total Purchase </p>
          <p className="text-xl font-semibold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-xl font-semibold text-blue-600">
            ₹{totalPaid.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Due</p>
          <p className="text-xl font-semibold text-red-600">
            ₹{totalDue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Student Balance</p>
          <p className="text-xl font-semibold text-yellow-600">
            ₹{totalStudentBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {FILTER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {filter === "custom" && (
        <div className="flex gap-4">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded-md w-full"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded-md w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceSummary;
