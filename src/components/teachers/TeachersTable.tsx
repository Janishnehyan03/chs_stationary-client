import { FileText, Pencil, Trash, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import InvoiceOfUser from "../invoice/InvoiceOfUser";

import { toast } from "react-toastify";
import Axios from "../../Axios";

interface TeachersTableProps {
  filteredTeachers: Teacher[];
  loading: boolean;
  deleteTeacher: (id: string) => void;
  canUpdateTeacher: any;
  canDeleteTeacher: any;
  onTeacherUpdated?: () => void; // Optional callback to refresh teacher list
}

import { X } from "lucide-react";
import { Teacher } from "../../utils/types/types";

interface TeacherFormProps {
  teacher?: Teacher; // Optional for add mode, required for edit mode
  onSubmit: (teacher: Partial<Teacher>) => void;
  onCancel: () => void;
  loading: boolean;
  mode: "add" | "edit";
}

function TeacherForm({
  teacher,
  onSubmit,
  onCancel,
  loading,
  mode,
}: TeacherFormProps) {
  const [formData, setFormData] = useState<Partial<Teacher>>(
    teacher || { name: "", email: "", phone: "", dueAmount: 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    window.location.reload(); // Refresh the page after submission
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {mode === "add" ? "Add New Teacher" : "Edit Teacher"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Phone
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Balance Amount
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter balance amount"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              value={formData.balance || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{mode === "add" ? "Adding..." : "Updating..."}</span>
                </div>
              ) : (
                <>{mode === "add" ? "Add Teacher" : "Update Teacher"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeachersTable({
  filteredTeachers,
  loading,
  deleteTeacher,
  canUpdateTeacher,
  canDeleteTeacher,
  onTeacherUpdated,
}: TeachersTableProps) {
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Teacher | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to handle opening the edit modal
  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  // Function to handle form submission for updating a teacher
  const handleUpdateTeacher = async (updatedTeacher: Partial<Teacher>) => {
    if (!selectedTeacher) return;
    setIsUpdating(true);
    try {
      await Axios.put(`/teachers/${selectedTeacher._id}`, updatedTeacher);
      setShowEditModal(false);
      setSelectedTeacher(null);
      toast.success("Teacher updated successfully!");
      if (onTeacherUpdated) onTeacherUpdated(); // Call callback to refresh data
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      toast.error(
        "Error updating teacher: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Invoice Modal */}
      {showInvoice && selectedStudent && (
        <InvoiceOfUser
          student={selectedStudent}
          showModal={showInvoice}
          handleClose={() => setShowInvoice(false)}
        />
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <TeacherForm
          teacher={selectedTeacher}
          onSubmit={handleUpdateTeacher}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTeacher(null);
          }}
          loading={isUpdating}
          mode="edit"
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 font-medium tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 font-medium tracking-wider">
                Due Amount
              </th>
              <th scope="col" className="px-6 py-3 font-medium tracking-wider">
                Balance Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 font-medium tracking-wider text-center"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    <span>Loading teachers...</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher: Teacher, index) => (
                <tr
                  key={teacher._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/user/${teacher._id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <User
                          size={18}
                          className="text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {teacher.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-red-800 bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-full px-2.5 py-1 text-xs">
                      ₹{teacher.dueAmount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-green-800 bg-green-100 dark:bg-green-900/40 dark:text-green-300 rounded-full px-2.5 py-1 text-xs">
                      ₹{teacher?.balance || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        to={`/invoices/${teacher._id}`}
                        className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      >
                        <button
                          onClick={() => {
                            setSelectedStudent(teacher);
                            setShowInvoice(true);
                          }}
                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          title="Show Invoice"
                        >
                          <FileText size={18} />
                        </button>
                      </Link>
                      {canUpdateTeacher && (
                        <button
                          onClick={() => handleEditClick(teacher)}
                          className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          title="Edit Teacher"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {canDeleteTeacher && (
                        <button
                          onClick={() => deleteTeacher(teacher._id)}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Delete Teacher"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeachersTable;
