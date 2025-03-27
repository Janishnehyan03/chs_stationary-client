import { useEffect, useState } from "react";
import { getShops, deleteShop } from "../../utils/services/shopService";
import ShopForm from "./ShopForm";
import { Store, Trash2, Edit, RefreshCw, X } from "lucide-react";

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
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl">
      {/* Header with glass morphism effect */}
      <div className="mb-8 p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Shops Management
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your retail locations and inventory sources
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors">
              <RefreshCw
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                onClick={fetchShops}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Two-column layout with subtle animation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Table with modern styling */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-lg overflow-hidden transition-all hover:shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {["Shop Name", "Location", "Contact", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {shops.map((shop) => (
                  <tr
                    key={shop._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
                          <Store className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {shop.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {shop.address || (
                          <span className="italic text-gray-400">
                            Not specified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {shop.contact || (
                          <span className="italic text-gray-400">
                            Not provided
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingShop(shop)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                        </button>
                        <button
                          onClick={() => handleDelete(shop._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Forms with floating effect */}
        <div className="space-y-6">
          {/* Edit Form (conditionally shown) */}
          {editingShop && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-lg p-6 transform transition-all hover:scale-[1.005] hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Edit Shop Details
                </h3>
                <button
                  onClick={() => setEditingShop(null)}
                  className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-lg p-6 transform transition-all hover:scale-[1.005] hover:shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Register New Shop
            </h3>
            <ShopForm onSuccess={fetchShops} />
          </div>
        </div>
      </div>
    </div>
  );
}
