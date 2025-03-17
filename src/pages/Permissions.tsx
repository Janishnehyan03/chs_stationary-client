import { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import Axios from "../Axios";

interface Permission {
  _id: string;
  permissionTitle: string;
  description?: string;
}

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Axios.get("/permissions")
      .then((res) => setPermissions(res.data))
      .catch((err: any) => {
        console.error(err.response);
        setError("Failed to load permissions");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Permissions
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Loading...
              </span>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
                <span className="ml-2 text-red-600 dark:text-red-400">
                  {error}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {permissions.map((perm) => (
                    <tr
                      key={perm._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                        {perm.permissionTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {perm.description || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}