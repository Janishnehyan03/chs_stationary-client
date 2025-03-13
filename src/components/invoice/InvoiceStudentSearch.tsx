import { useState, useEffect, useRef } from "react";
import Axios from "../../Axios";
import { Loader2 } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  admissionNumber: string;
  class?: { name: string; section: string };
}

interface StudentSearchProps {
  onSelectStudent: (student: Student) => void;
}

const InvoiceStudentSearch = ({ onSelectStudent }: StudentSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1); // Track highlighted index
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (searchQuery.trim().length < 3) {
        setStudents([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await Axios.get(`/users?search=${searchQuery}`);
        setStudents(data);
        setHighlightIndex(-1); // Reset highlight when new data is fetched
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students.");
      }

      setLoading(false);
    };

    const debounce = setTimeout(fetchStudents, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setStudents([]);
        setHighlightIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (students.length === 0) return;

    if (event.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev < students.length - 1 ? prev + 1 : 0));
    } else if (event.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : students.length - 1));
    } else if (event.key === "Enter" && highlightIndex >= 0) {
      onSelectStudent(students[highlightIndex]);
      setSearchQuery("");
      setStudents([]);
      setHighlightIndex(-1);
    } else if (event.key === "Escape") {
      setStudents([]);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
    {/* Input Field */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search users by name or admission number..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
          text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-transparent hover:border-gray-300 
          transition-shadow duration-200 pr-10"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin">
          <Loader2 size={18} />
        </div>
      )}
    </div>
  
    {/* Error Message */}
    {error && (
      <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
    )}
  
    {/* Student Suggestions Dropdown */}
    {students.length > 0 && (
      <ul className="absolute w-full mt-1.5 bg-white border border-gray-100 
        rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
        {students.map((s, index) => (
          <li
            key={s._id}
            className={`px-4 py-2.5 cursor-pointer transition-colors duration-150 
              ${highlightIndex === index ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50"}`}
            onClick={() => {
              onSelectStudent(s);
              setSearchQuery("");
              setStudents([]);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-800">{s.name}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({s.admissionNumber})
                </span>
              </div>
              {s.class && (
                <span className="text-xs text-gray-600 font-medium bg-gray-100 
                  px-2 py-1 rounded-md">
                  {s.class.name} - {s.class.section}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

export default InvoiceStudentSearch;
