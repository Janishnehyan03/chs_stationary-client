import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Axios from "../../Axios";

interface ImportStudentsProps {
  isOpen: boolean;
  onClose: () => void;
  classes: { _id: string; name: string; section: string }[];
}

interface Student {
  name: string;
  admissionNumber: string;
  class: string;
}

export default function ImportStudents({
  isOpen,
  onClose,
  classes: classes,
}: ImportStudentsProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!selectedClass) {
        alert("Please select a class first.");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const binaryStr = e.target?.result;
        if (!binaryStr) return;

        try {
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          const parsedStudents: Student[] = (jsonData as any[]).map((row) => ({
            name: row["Name"] || "",
            admissionNumber: row["Admission Number"] || "",
            class: selectedClass,
          }));

          if (parsedStudents.length === 0) {
            alert("No valid student data found in the file.");
            return;
          }

          setStudents(parsedStudents);
        } catch (error) {
          console.error("Error parsing file:", error);
          alert("Invalid file format. Please upload a valid Excel file.");
        }
      };

      reader.readAsBinaryString(file);
    },
    [selectedClass]
  );

  const uploadStudents = async () => {
    if (students.length === 0) {
      alert("No students to upload. Please select a file first.");
      return;
    }

    const confirmUpload = window.confirm(
      `Are you sure you want to upload ${students.length} students?`
    );
    if (!confirmUpload) return;

    setUploading(true);

    try {
      await Axios.post("/students/bulk", { students });
      alert("Students imported successfully!");
      setStudents([]); // Clear students after successful upload
      onClose(); // Close modal after successful upload
    } catch (error) {
      console.error("Error importing students:", error);
      alert("Failed to import students.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      <div className="w-full max-w-lg shadow-xl border border-gray-300 bg-white/90 rounded-2xl p-6 space-y-6 text-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center">Import Students</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Class Selection */}
        <label className="block text-sm font-semibold">Select Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Choose a class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} - {cls.section}
            </option>
          ))}
        </select>

        {/* File Dropzone */}
        <div
          {...getRootProps()}
          className="cursor-pointer p-5 border border-dashed border-gray-400 rounded-lg text-center bg-white/10 hover:bg-white/20 transition"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">
            Drag & drop an Excel file here, or click to select
          </p>
        </div>

        {/* File Upload Button */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={students.length === 0 || uploading}
          onClick={uploadStudents}
        >
          {uploading ? "Uploading..." : "Upload Students"}
        </button>
      </div>
    </div>
  );
}
