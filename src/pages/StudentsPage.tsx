import { useState, useEffect } from "react";
import Axios from "../Axios";
import { useDebounce } from "use-debounce";
import { Search, XCircle, User, Shield, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

function Students() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedSearch) {
      setStudents([]);
      return;
    }

    setLoading(true);
    setError(null);
    Axios.get(`/users?search=${debouncedSearch}&role=student`)
      .then((res) => setStudents(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const handleClearSearch = () => {
    setSearch("");
    setStudents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <Shield className="w-10 h-10 text-blue-600" />
            Search Students
          </h1>
          <p className="text-gray-600">
            Search for users by name or admission number
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full flex items-center rounded-xl shadow-sm bg-white p-3 border border-gray-200 hover:border-blue-300 transition-all">
          <Search className="w-5 h-5 text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Search by Name or Admission Number"
            className="w-full bg-transparent p-3 pl-4 focus:outline-none text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users by name or admission number"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="mt-8 w-full bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">
              Error fetching users: {error}
            </p>
          ) : students.length > 0 ? (
            <ul className="space-y-4">
              {students.map((student: any) => (
                <li
                  key={student.id}
                  className="p-4 flex items-center gap-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Link
                    to={`/user/${student._id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {student.name}
                      </h2>
                      <p className="text-gray-600 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span>{student.admissionNumber}</span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : debouncedSearch ? (
            <p className="text-gray-500 text-center">No users found</p>
          ) : (
            <p className="text-gray-500 text-center">
              Start typing to search for users
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;
