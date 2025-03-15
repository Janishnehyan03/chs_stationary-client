import { Mail, Phone, PlusCircle, Search, User as IUser } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Axios from "../Axios";
import { UserForm } from "../components/users/UserForm";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: "admin",
    phone: "",
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
      await Axios.post("/users", newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
      setShowModal(false);
      setNewUser({ _id: "", name: "", email: "", role: "admin", phone: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-gray-200">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage and organize your user database</p>
      </div>
  
      {/* Search and Add Section */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} />
            <span className="font-medium">Add User</span>
          </button>
        </div>
      </div>
  
      {/* Users Table */}
      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 border-b border-gray-600">
                {['#', 'Name', 'Email', 'Phone'].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center">
                        <IUser size={16} className="text-teal-300" />
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={16} />
                      {user.phone || "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    {showModal && (
      <UserForm
        newUser={newUser}
        onInputChange={handleInputChange}
        onAddUser={handleAddUser}
        onClose={() => setShowModal(false)}
      />
    )}
  </div>
  );
}
