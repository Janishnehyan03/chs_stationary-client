import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Axios from "../../Axios";

interface ImportTeachersProps {
  isOpen: boolean;
  onClose: () => void;
  fetchTeachers: () => void;
}

interface Teacher {
  name: string;
  phone: string;
}

export default function ImportTeachers({
  isOpen,
  onClose,
  fetchTeachers,
}: ImportTeachersProps) {
  const [uploading, setUploading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

        const parsedTeachers: Teacher[] = (jsonData as any[]).map((row) => ({
          name: row["Name"] || "",
          phone: row["Phone"] || "",
        }));

        if (parsedTeachers.length === 0) {
          alert("No valid teacher data found in the file.");
          return;
        }

        setTeachers(parsedTeachers);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Invalid file format. Please upload a valid Excel file.");
      }
    };

    reader.readAsBinaryString(file);
  }, []);

  const uploadTeachers = async () => {
    if (teachers.length === 0) {
      alert("No teachers to upload. Please select a file first.");
      return;
    }

    const confirmUpload = window.confirm(
      `Are you sure you want to upload ${teachers.length} teachers?`
    );
    if (!confirmUpload) return;

    setUploading(true);

    try {
      await Axios.post("/teachers/bulk", teachers);
      alert("Teachers imported successfully!");
      setTeachers([]); // Clear teachers after successful upload
      onClose(); // Close modal after successful upload
      fetchTeachers(); // Fetch teachers after successful upload
    } catch (error) {
      console.error("Error importing teachers:", error);
      alert("Failed to import teachers.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      <div className="w-full max-w-lg shadow-xl border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 space-y-6 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center">Import Teachers</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* File Dropzone */}
        <div
          {...getRootProps()}
          className="cursor-pointer p-5 border border-dashed border-gray-400 dark:border-gray-500 rounded-lg text-center bg-white/10 dark:bg-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/30 transition"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 dark:text-gray-300">
            Drag & drop an Excel file here, or click to select
          </p>
        </div>

        {/* Display Parsed Teachers */}
        {teachers.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Name
                  </th>
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {teacher.name}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {teacher.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* File Upload Button */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={teachers.length === 0 || uploading}
          onClick={uploadTeachers}
        >
          {uploading ? "Uploading..." : "Upload Teachers"}
        </button>
      </div>
    </div>
  );
}