import { JSX, useEffect, useState } from "react";
import { LineChart, ShoppingCart, TrendingUp } from "lucide-react";
import Axios from "../Axios";

interface ProductSale {
  name: string;
  quantity: number;
  revenue: number;
  profit: number;
}

interface SalesReport {
  totalProfit: number;
  totalRevenue: number;
  totalProductsSold: number;
  productSales: ProductSale[];
}

export default function SalesDashboard() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        setIsLoading(true);
        const response = await Axios.get<SalesReport>("/invoices/report/all");
        setReport(response.data);
      } catch (err) {
        console.error("Failed to fetch sales report:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesReport();
  }, []);

  // Format currency in INR
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Sales Dashboard
          </h1>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={report?.totalRevenue || 0}
              icon={<TrendingUp className="w-5 h-5" />}
              trend="up"
              formatValue={formatCurrency}
            />
            <StatCard
              title="Total Profit"
              value={report?.totalProfit || 0}
              icon={<LineChart className="w-5 h-5" />}
              trend={report?.totalProfit && report.totalProfit > 0 ? "up" : "down"}
              formatValue={formatCurrency}
            />
            <StatCard
              title="Products Sold"
              value={report?.totalProductsSold || 0}
              icon={<ShoppingCart className="w-5 h-5" />}
              formatValue={(val) => val.toLocaleString('en-IN')}
            />
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Product Sales
            </h2>
            <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {report?.productSales.length || 0} products
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 font-medium text-gray-500">Product</th>
                  <th className="pb-4 font-medium text-gray-500 text-right">Quantity</th>
                  <th className="pb-4 font-medium text-gray-500 text-right">Revenue</th>
                  <th className="pb-4 font-medium text-gray-500 text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                      <td className="py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="py-4 text-right"><div className="h-4 bg-gray-200 rounded w-1/2 inline-block"></div></td>
                      <td className="py-4 text-right"><div className="h-4 bg-gray-200 rounded w-1/2 inline-block"></div></td>
                      <td className="py-4 text-right"><div className="h-4 bg-gray-200 rounded w-1/2 inline-block"></div></td>
                    </tr>
                  ))
                ) : report?.productSales.length ? (
                  report.productSales.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-800">{product.name}</td>
                      <td className="py-4 text-right">{product.quantity.toLocaleString('en-IN')}</td>
                      <td className="py-4 text-right">{formatCurrency(product.revenue)}</td>
                      <td className={`py-4 text-right ${product.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(product.profit)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  formatValue = (val) => val.toString()
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  trend?: "up" | "down";
  formatValue?: (value: number) => string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{formatValue(value)}</p>
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          trend === 'up' ? 'bg-green-100 text-green-600' : 
          trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
        }`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-3 text-xs font-medium inline-flex items-center ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Increased
            </>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Decreased
            </>
          )}
        </div>
      )}
    </div>
  );
}