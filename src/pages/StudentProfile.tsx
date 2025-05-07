import { IndianRupee, Loader2, Package, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useInvoices } from "../utils/hooks/useInvoice";
import UpiPayment from "./UpiPayment";
import { useState } from "react";

const StudentProfile = () => {
  const { userId } = useParams();
  const { invoices, loading, error, totalAmount, totalPaid, totalDue } =
    useInvoices(userId || "");

  const [enableUpi, setEnableUpi] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8 flex items-center justify-center gap-2">
          <User className="w-8 h-8 text-teal-600" />
          User Invoice Tracker
        </h1>

        {/* Summary Cards */}
        {!loading && !error && invoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Invoices
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {invoices.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Amount
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Paid
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{totalPaid.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Due Amount
                </h3>
              </div>
              <p className="text-3xl font-bold text-red-600 mt-2">
                ₹{totalDue.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Balance Amount
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{invoices[0].user.balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">
              Loading invoices...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* UPI Payment Button */}
        {!loading && !error && invoices.length > 0 && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setEnableUpi(!enableUpi)}
              className="bg-teal-600 flex cursor-pointer text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
            >
              <IndianRupee /> {enableUpi ? "Hide UPI Payment" : "UPI Payment"}
            </button>
          </div>
        )}

        {/* UPI Payment Component */}
        {enableUpi && <UpiPayment />}
        {/* Invoices List */}
        {!loading && !error && invoices.length > 0 && (
          <div className="space-y-6">
            {invoices.map((invoice) => (
              <div
                key={invoice._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {invoice.user.name}
                    </h3>
                    <p className="text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">
                      ₹{invoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Paid and Due Amount */}
                <div className="mt-4 flex justify-between">
                  <p className="text-lg font-semibold text-green-600">
                    Paid: ₹{invoice.amountPaid.toFixed(2)}
                  </p>
                  {invoice.totalAmount - invoice.amountPaid > 0 && (
                    <p className="text-lg font-semibold text-red-600">
                      Due: ₹
                      {(invoice.totalAmount - invoice.amountPaid).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                  <div className="divide-y divide-gray-100">
                    {invoice.items.map((item: any, index) => (
                      <div
                        key={index}
                        className="py-2 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-800">
                            {item.product.title}
                          </span>
                          <span className="ml-2 text-gray-500">
                            × {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && invoices.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No invoices found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
