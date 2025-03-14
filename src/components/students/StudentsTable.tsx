import {
  ChevronDown,
  Download,
  GraduationCap,
  Pencil,
  //  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AddStudentModal from "./AddStudentModal"; // Adjust the import path
import { User } from "../../utils/types/types";
import { downloadInvoicePDF } from "../../utils/services/download-invoice.service";
import InvoiceOfStudent from "../invoice/InvoiceOfStudent";

interface ClassOption {
  _id: string;
  name: string;
  section: string;
}

interface Props {
  students: User[];
  search: string;
  // onDelete: (id: string) => void;
  classes: ClassOption[];
  fetchStudents: any; // Function to fetch students after adding/editing
}

export default function StudentsTable({
  students,
  search,
  // onDelete,
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {showInvoice && selectedStudent && (
        <InvoiceOfStudent
          student={selectedStudent}
          showModal={showInvoice}
          handleClose={() => setShowInvoice(false)}
        />
      )}
      {/* Class Selection Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2 text-indigo-900">
            <Users size={24} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Students</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative min-w-[200px]">
              <select
                id="classFilter"
                className="w-full appearance-none bg-white px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 font-medium"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
            <button
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Student
            </button>
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
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                #
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Class
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Admission No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Balance
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Due Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Show Invoice
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/user/${student._id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <GraduationCap
                            size={16}
                            className="text-indigo-600"
                          />
                        </div>
                        <span className="font-medium text-gray-900">
                          {student.name}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-indigo-50 text-indigo-700 font-medium">
                      {student.class?.name} {student.class?.section}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-700">
                      {student.admissionNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-700 bg-green-200 rounded-full px-2.5 py-0.5">
                      ₹{student.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full ${
                        student.dueAmount > 0
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      ₹{student.dueAmount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowInvoice(student)} // Use the handler here
                      className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 bg-indigo-50 transition-colors hover:bg-indigo-100 cursor-pointer"
                    >
                      show invoice
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit student"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil size={18} />
                      </button>
                      {/* <button
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => onDelete(student._id)}
                        title="Delete student"
                      >
                        <Trash size={18} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <GraduationCap size={48} className="text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-sm text-gray-400">
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