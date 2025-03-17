import { Edit, User as IUser, PlusCircle, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Axios from "../Axios";
import { UserForm } from "../components/users/UserForm";
import { toast } from "react-toastify";
import { User } from "../utils/types/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    role: "",
    password: "",
    phone: "",
    admissionNumber: "",
    dueAmount: 0,
    balance: 0,
    invoices: [],
    permissions: [{ permissionTitle: "", description: "" }],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await Axios.get(`/users?role=admin`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleAddUser = async () => {
    try {
      if (isEditing) {
        // If editing, update user
        await Axios.put(`/users/${newUser._id}`, newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("User updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // If adding new user
        await Axios.post("/users", newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("User added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      fetchUsers();
      setShowModal(false);
      setNewUser({
        _id: "",
        name: "",
        email: "",
        role: "admin",
        phone: "",
        admissionNumber: "",
        dueAmount: 0,
        balance: 0,
        invoices: [],
        permissions: [{ permissionTitle: "", description: "" }],
        password: "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditUser = (user: User) => {
    setNewUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize your user database
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditing(false);
                setNewUser({
                  _id: "",
                  name: "",
                  email: "",
                  role: "admin",
                  phone: "",
                  admissionNumber: "",
                  dueAmount: 0,
                  balance: 0,
                  invoices: [],
                  permissions: [{ permissionTitle: "", description: "" }],
                  password: "",
                });
              }}
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              <PlusCircle size={20} />
              <span className="font-medium">Add User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                  {["#", "Name", "Permissions", "Actions"].map(
                    (header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-500 dark:bg-teal-700 flex items-center justify-center">
                          <IUser
                            size={16}
                            className="text-teal-700 dark:text-teal-300"
                          />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user?.permissions?.map((permission) => (
                          <span
                            key={permission._id}
                            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                          >
                            {permission
                              ? permission.permissionTitle
                              : "Unknown"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Form Modal */}
        {showModal && (
          <UserForm
            newUser={newUser}
            onInputChange={handleInputChange}
            onAddUser={handleAddUser}
            onClose={() => setShowModal(false)}
            isEditing={isEditing}
            setNewUser={setNewUser}
          />
        )}
      </div>
    </div>
  );
}
