import { PlusCircle, Search, Upload } from "lucide-react"; // Added Upload icon
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import TeacherForm from "../components/teachers/TeacherForm";
import TeachersTable from "../components/teachers/TeachersTable";
import { useHasPermission } from "../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../utils/permissions";
import { addTeacher, fetchTeachers } from "../utils/services/teacherServices";
import { User as IUser } from "../utils/types/types";
import ImportTeachers from "../components/teachers/ImportTeachersModal";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // State for import modal
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const canCreateTeacher = useHasPermission(PERMISSIONS.teachers.create);
  const canUpdateTeacher = useHasPermission(PERMISSIONS.teachers.update);
  const canDeleteTeacher = useHasPermission(PERMISSIONS.teachers.delete);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleAddTeacher = async () => {
    if (!newTeacher.name.trim()) return alert("Name is required");

    try {
      setLoading(true);
      await addTeacher(newTeacher);
      setIsModalOpen(false);
      window.location.reload(); // Reload the page after adding a teacher
    } catch (error) {
      console.error("Error adding teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    try {
      await Axios.delete(`/teachers/${id}`);
      toast.success("Teacher deleted successfully");
      loadTeachers();
    } catch (error: any) {
      console.error("Error deleting teacher:", error.response);
      toast.error(
        "Error deleting teacher:",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Teachers Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and organize your teaching staff
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Search teachers..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              {canCreateTeacher && (
                <>
                  <button
                    className="text-blue-500 px-6 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                    onClick={() => window.open("/files/Teacher-format.xlsx")}
                  >
                    <span className="font-medium">Download Excel Format</span>
                  </button>
                  <button
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <PlusCircle size={20} />
                    <span className="font-medium">Add Teacher</span>
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                    onClick={() => setIsImportModalOpen(true)}
                  >
                    <Upload size={20} />
                    <span className="font-medium">Import Teachers</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <TeachersTable
          filteredTeachers={filteredTeachers}
          loading={loading}
          deleteTeacher={deleteTeacher}
          canUpdateTeacher={canUpdateTeacher}
          canDeleteTeacher={canDeleteTeacher}
        />
      </div>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <TeacherForm
          newTeacher={newTeacher}
          setNewTeacher={setNewTeacher}
          handleAddTeacher={handleAddTeacher}
          loading={loading}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {/* Import Teachers Modal */}
      {isImportModalOpen && (
        <ImportTeachers
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          fetchTeachers={loadTeachers} // Pass the function to refetch teachers after upload
        />
      )}
    </div>
  );
}
