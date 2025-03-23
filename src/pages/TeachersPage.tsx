import {
    BookOpen,
    Loader,
    Phone,
    Search,
    UserCircle,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import Axios from "../Axios";

function Teachers() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch teachers when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setTeachers([]);
      return;
    }

    const fetchTeachers = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await Axios.get(
          `/users?search=${debouncedQuery}&role=teacher`
        );

        setTeachers(response.data || []);
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch teachers"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [debouncedQuery]);

  // Clear search input and results
  const clearSearch = () => {
    setQuery("");
    setTeachers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-purple-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 flex items-center justify-center gap-3">
            <BookOpen className="w-9 h-9 text-indigo-600" />
            Teachers Directory
          </h1>
          <p className="mt-2 text-indigo-700 text-lg">
            Find teachers by name or phone number
          </p>
        </header>

        {/* Search Input */}
        <div className="relative flex items-center bg-white rounded-lg shadow-md border border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-400 transition-all mb-10">
          <Search className="w-6 h-6 text-indigo-500 mx-4" />
          <input
            type="text"
            placeholder="Search by Name or phone number"
            className="w-full py-3 pr-12 text-indigo-800 placeholder-indigo-400 bg-transparent focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search teachers by name or phone number"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 text-indigo-500 hover:text-indigo-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results Display */}
        <section className="bg-white rounded-lg shadow-lg p-6 border border-indigo-100">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : errorMessage ? (
            <p className="text-center text-red-600 font-medium py-4">
              {errorMessage}
            </p>
          ) : teachers.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {teachers.map((teacher: any) => (
                <Link
                  to={`/user/${teacher._id}`}
                  key={teacher._id}
                  className="p-5 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <UserCircle className="w-12 h-12 text-indigo-600 bg-indigo-200 rounded-full p-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-indigo-900">
                      {teacher.name}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-indigo-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span> {teacher.phone}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : debouncedQuery ? (
            <p className="text-center text-indigo-600 py-6 font-medium">
              No teachers found matching your search
            </p>
          ) : (
            <p className="text-center text-indigo-500 py-6">
              Enter a name or phone number to begin searching
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Teachers;
