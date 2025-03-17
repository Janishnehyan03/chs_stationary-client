import { Lock, ShieldCheck, User, X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Axios from "../../Axios";

interface Permission {
  _id: string;
  permissionTitle: string;
}

interface UserFormProps {
  newUser: any;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddUser: () => void;
  onClose: () => void;
  isEditing: boolean;
  setNewUser: (user: any) => void;
}

export function UserForm({
  newUser,
  onInputChange,
  onAddUser,
  onClose,
  isEditing,
  setNewUser,
}: UserFormProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Ensure selectedPermissions stores permission IDs as strings
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (newUser.permissions) {
      // Convert newUser.permissions to an array of strings (permission IDs)
      const userPermissionIds = newUser.permissions.map((p: any) =>
        typeof p === "string" ? p : p._id
      );
      setSelectedPermissions(userPermissionIds);
    } else {
      setSelectedPermissions([]);
    }
  }, [newUser]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await Axios.get("/permissions");
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  const handlePermissionChange = (permissionId: string) => {
    setNewUser((prevUser: any) => {
      const updatedPermissions = selectedPermissions.includes(permissionId)
        ? selectedPermissions.filter((id) => id !== permissionId)
        : [...selectedPermissions, permissionId];

      setSelectedPermissions(updatedPermissions);
      return { ...prevUser, permissions: updatedPermissions };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 dark:text-gray-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={newUser.name}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <input
                type="password"
                name="password"
                placeholder={
                  isEditing ? "Cannot change password" : "Enter password"
                }
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={newUser.password}
                onChange={onInputChange}
                disabled={isEditing}
              />
            </div>
          </div>

          {/* Permissions Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permissions
            </label>
            <div className="space-y-3 max-h-60 overflow-auto border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              {permissions.map((perm) => (
                <label
                  key={perm._id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm._id)}
                    onChange={() => handlePermissionChange(perm._id)}
                    className="w-5 h-5 accent-indigo-500 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                  />
                  <ShieldCheck
                    size={18}
                    className="text-gray-600 dark:text-gray-400 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {perm.permissionTitle}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Permissions */}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAddUser}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2"
          >
            {isEditing ? "Update User" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}
