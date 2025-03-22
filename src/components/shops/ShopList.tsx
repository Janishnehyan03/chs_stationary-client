import { useEffect, useState } from "react";
import { getShops, deleteShop } from "../../utils/services/shopService";
import ShopForm from "./ShopForm";

export default function ShopList() {
  const [shops, setShops] = useState<any[]>([]);
  const [editingShop, setEditingShop] = useState<any>(null);

  const fetchShops = async () => {
    const { data } = await getShops();
    setShops(data);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteShop(id);
      fetchShops();
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-100 rounded-2xl shadow-neo">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-gray-200/50 p-4 rounded-xl shadow-inner">
        Shops Management
      </h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Table */}
        <div className="bg-white/80 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <th className="p-4 text-left font-medium text-sm uppercase tracking-wide">
                  Name
                </th>
                <th className="p-4 text-left font-medium text-sm uppercase tracking-wide">
                  Address
                </th>
                <th className="p-4 text-left font-medium text-sm uppercase tracking-wide">
                  Contact
                </th>
                <th className="p-4 text-center font-medium text-sm uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr
                  key={shop._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{shop.name}</td>
                  <td className="p-4 text-gray-600">{shop.address || "-"}</td>
                  <td className="p-4 text-gray-600">{shop.contact || "-"}</td>
                  <td className="p-4 flex justify-center space-x-2">
                    <button
                      onClick={() => setEditingShop(shop)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-400/90 text-gray-900 shadow-md hover:bg-yellow-500 hover:shadow-inner transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(shop._id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/90 text-white shadow-md hover:bg-red-600 hover:shadow-inner transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6">
          {/* Editing Form */}
          {editingShop && (
            <div className="bg-white/70 p-6 rounded-xl shadow-neo transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Edit Shop
              </h3>
              <ShopForm
                shop={editingShop}
                onSuccess={() => {
                  setEditingShop(null);
                  fetchShops();
                }}
              />
            </div>
          )}

          {/* Add New Shop Form */}
          <div className="bg-white/70 p-6 rounded-xl shadow-neo">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Shop
            </h3>
            <ShopForm onSuccess={fetchShops} />
          </div>
        </div>
      </div>
    </div>
  );
}
