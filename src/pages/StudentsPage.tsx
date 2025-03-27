import { BookOpen, Loader2, Search, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import LogoSrc from "../../public/logo.png";
import Axios from "../Axios";

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
      .catch((err: any) => {
        console.error(err.response);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const handleClearSearch = () => {
    setSearch("");
    setStudents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header with Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={LogoSrc} alt="Logo" className="h-40 w-auto" />{" "}
            {/* Adjust size as needed */}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Search Students
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Find students by name, admission number, or other details. Start
            typing to see instant results.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full flex items-center rounded-xl shadow-sm bg-white p-3 border border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
          <Search className="w-5 h-5 text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Search by Name or Admission Number..."
            className="w-full bg-transparent p-3 pl-4 focus:outline-none text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users by name or admission number"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="mt-8 w-full bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition-all duration-200 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Search Results
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-500">Searching students...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-red-500 text-center">
                Error fetching users: {error}
              </p>
            </div>
          ) : students.length > 0 ? (
            <ul className="space-y-3">
              {students.map((student: any) => (
                <li
                  key={student.id}
                  className="p-4 flex items-center gap-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                >
                  <Link
                    to={`/user/${student._id}`}
                    className="flex items-center gap-4 w-full"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {student.name}
                      </h2>
                      <p className="text-gray-600 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">
                          {student.admissionNumber}
                        </span>
                      </p>
                    </div>
                    <div className="text-blue-600 font-medium text-sm">
                      View Profile
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : debouncedSearch ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No students found</p>
              <p className="text-gray-400 text-sm">
                Try a different search term or check the spelling
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Start typing to search for students
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Showing {students.length} results</p>
        </div>
      </div>
      {/* Developer Details and Copyright */}
      <div className="mt-12 text-center text-gray-400 text-xs">
        <p>
          Developed by {" "}
          <a href="https://digitiostack.vercel.app" target="_blank" className="font-semibold text-teal-600">
            <span className="font-semibold text-teal-600">Digitio Stack </span>
          </a>
        </p>
        <p>
          &copy; {new Date().getFullYear()} CHS Stationary. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Students;
