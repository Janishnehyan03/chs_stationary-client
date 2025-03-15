import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../Axios";
import AddStudentModal from "../components/students/AddStudentModal";
import ImportStudentsModal from "../components/students/ImportStudentsModal";
import StudentsTable from "../components/students/StudentsTable";
import { User } from "../utils/types/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [classes, setClasses] = useState<
    { _id: string; name: string; section: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    classId: "",
    admissionNumber: "",
  });

  const fetchStudents = async () => {
    try {
      const response = await Axios.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await Axios.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await Axios.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  return (
    <div className="p-6 bg-green-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search students..."
            className="border border-green-300 dark:border-gray-600 px-4 py-2 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition"
            onClick={() => setIsImportOpen(true)}
          >
            <Upload size={20} /> Import Students
          </button>
        </div>

        <StudentsTable
          students={students}
          search={search}
          onDelete={deleteStudent}
          classes={classes}
          fetchStudents={fetchStudents}
        />
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddStudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          classes={classes}
          fetchStudents={fetchStudents}
        />
      )}

      {isImportOpen && (
        <ImportStudentsModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          classes={classes}
        />
      )}
    </div>
  );
}
