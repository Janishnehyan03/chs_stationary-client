import {
  ChevronDown,
  Download,
  GraduationCap,
  Pencil,
  Trash,
  //  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AddStudentModal from "./AddStudentModal"; // Adjust the import path
import { User } from "../../utils/types/types";
import { downloadInvoicePDF } from "../../utils/services/download-invoice.service";
import InvoiceOfStudent from "../invoice/InvoiceOfStudent";
import { useHasPermission } from "../../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../../utils/permissions";

interface ClassOption {
  _id: string;
  name: string;
  section: string;
}

interface Props {
  students: User[];
  search: string;
  onDelete: (id: string) => void;
  classes: ClassOption[];
  fetchStudents: any; // Function to fetch students after adding/editing
}

export default function StudentsTable({
  students,
  search,
  onDelete,
  classes,
  fetchStudents,
}: Props) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(search.toLowerCase())) &&
      (selectedClass === "" || student.class?._id === selectedClass)
  );

  const handleShowInvoice = (student: User) => {
    setSelectedStudent(student); // Set the selected student
    setShowInvoice(true); // Show the invoice modal
  };
  const canCreateStudents = useHasPermission(PERMISSIONS.students.create);
  const canUpdateStudents = useHasPermission(PERMISSIONS.students.update);
  const canDeleteStudents = useHasPermission(PERMISSIONS.students.delete);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
      {showInvoice && selectedStudent && (
        <InvoiceOfStudent
          student={selectedStudent}
          showModal={showInvoice}
          handleClose={() => setShowInvoice(false)}
        />
      )}
      {/* Class Selection Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
            <Users size={24} className="text-indigo-600 dark:text-indigo-300" />
            <h2 className="text-lg font-semibold">Students</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative min-w-[200px]">
              <select
                id="classFilter"
                className="w-full appearance-none bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 dark:text-gray-100 font-medium"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} {cls.section}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none"
              />
            </div>
            {canCreateStudents && (
              <button
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Student
              </button>
            )}
            {selectedClass && (
              <button
                className="px-4 py-2.5 flex space-x-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
                onClick={() => downloadInvoicePDF(selectedClass)}
              >
                <Download /> Download Invoice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                #
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Class
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Admission No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Balance
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Due Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Show Invoice
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Index Number */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-center">
                    {index + 1}
                  </td>

                  {/* Student Name & Profile */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/user/${student._id}`}
                      className="flex items-center gap-3 font-medium text-indigo-600 dark:text-indigo-300 hover:underline"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                        <GraduationCap
                          size={18}
                          className="text-indigo-600 dark:text-indigo-300"
                        />
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">
                        {student.name}
                      </span>
                    </Link>
                  </td>

                  {/* Class & Section */}
                  <td className="px-6 py-4">
                    <p className="inline-flex items-center py-3 px-4 text-sm font-medium text-indigo-900 bg-indigo-50 dark:text-indigo-800 rounded">
                      {student.class?.name}
                      {student.class?.section}
                    </p>
                  </td>

                  {/* Admission Number */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      {student.admissionNumber}
                    </span>
                  </td>

                  {/* Balance Amount */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      ₹{student.balance.toLocaleString()}
                    </span>
                  </td>

                  {/* Due Amount */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.dueAmount > 0
                          ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      ₹{student.dueAmount.toLocaleString()}
                    </span>
                  </td>

                  {/* Show Invoice Button */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleShowInvoice(student)}
                      className="px-3 py-1.5 cursor-pointer rounded-md text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors font-medium"
                    >
                      Invoice
                    </button>
                  </td>

                  {/* Action Buttons: Edit & Delete */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {canUpdateStudents && (
                        <button
                          className="p-2 rounded-md cursor-pointer text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
                          title="Edit Student"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {canDeleteStudents && (
                        <button
                          className="p-2 rounded-md cursor-pointer text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                          onClick={() => onDelete(student._id)}
                          title="Delete Student"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <GraduationCap
                      size={48}
                      className="text-gray-400 dark:text-gray-500 mb-2"
                    />
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Try selecting a different class or check back later
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        fetchStudents={fetchStudents}
        newStudent={
          selectedStudent || { name: "", classId: "", admissionNumber: "" }
        }
        setNewStudent={setSelectedStudent}
        classes={classes}
        isEditMode={isEditModalOpen}
      />
    </div>
  );
}
