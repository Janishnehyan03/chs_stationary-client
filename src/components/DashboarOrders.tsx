import { Hourglass, CheckCircle } from "lucide-react";

function DashboardOrders() {
  const demoOrders = [
    {
      id: 1,
      name: "John Doe",
      items: 3,
      status: "Pending",
      date: "2025-02-20",
    },
    {
      id: 2,
      name: "Jane Smith",
      items: 5,
      status: "Approved",
      date: "2025-02-19",
    },
  ];

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-sm font-semibold text-gray-600">#</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Items</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {demoOrders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-3 text-sm text-gray-700">{order.id}</td>
              <td className="p-3 text-sm text-gray-700">{order.name}</td>
              <td className="p-3 text-sm text-gray-700">{order.items}</td>
              <td className="p-3 text-sm">
                <div className="flex items-center gap-2">
                  {order.status === "Pending" ? (
                    <Hourglass size={16} className="text-yellow-500" />
                  ) : (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  <span
                    className={
                      order.status === "Pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {order.status}
                  </span>
                </div>
              </td>
              <td className="p-3 text-sm text-gray-700">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardOrders;
