import { useState, useEffect } from "react";
import Axios from "../../Axios"; // Adjust the import based on your project structure

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newStudent: any;
  setNewStudent: (student: any) => void;
  classes: { _id: string; name: string; section: string }[];
  isEditMode?: boolean; // Add this prop to distinguish between add and edit modes
  fetchStudents: any; // Optional function to fetch students after adding/editing
}

export default function AddStudentModal({
  isOpen,
  onClose,

  newStudent,
  setNewStudent,
  classes,
  isEditMode = false, // Default to false for add mode
  fetchStudents,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  // Reset form when modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      setNewStudent({ name: "", class: "", admissionNumber: "", balance: 0 });
    }
  }, [isOpen, setNewStudent]);

  const handleSubmit = async () => {
    if (
      !isEditMode &&
      (!newStudent.name ||
        !newStudent.admissionNumber ||
        !newStudent.class ||
        !newStudent.balance)
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && newStudent._id) {
        // Edit existing student (PATCH request)
        await Axios.put(`/students/${newStudent._id}`, newStudent);
        alert("Student updated successfully!");
        fetchStudents();
      } else {
        // Add new student (POST request)
        await Axios.post("/students", newStudent);
        fetchStudents();
        alert("Student added successfully!");
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving student:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admission Number
            </label>
            <input
              type="text"
              placeholder="Enter admission number"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={newStudent.admissionNumber}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  admissionNumber: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={newStudent.class}
              onChange={(e) =>
                setNewStudent({ ...newStudent, class: e.target.value })
              }
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Balance
            </label>
            <input
              type="number"
              placeholder="Enter balance amount"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={newStudent.balance}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  balance: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
