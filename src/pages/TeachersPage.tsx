import {
  ChevronRight,
  Loader2,
  Phone,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import LogoSrc from "../../public/logo.png";
import Axios from "../Axios";

function Teachers() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const clearSearch = () => {
    setQuery("");
    setTeachers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Glass Effect */}
        <header className="text-center mb-12 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm">
          <div className="flex flex-col items-center">
            <img src={LogoSrc} alt="Logo" className="h-40 w-auto" />{" "}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text ">
              Teachers Directory
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
              Search for faculty members by name or contact information
            </p>
          </div>
        </header>

        {/* Search Input with Floating Label */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder=" "
            className="block w-full pl-10 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-transparent peer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search teachers"
          />
          <label className="absolute left-10 -top-2.5 px-1 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-300 transition-all">
            Search by name or phone
          </label>
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Status Indicators */}
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
              <p className="text-gray-600 dark:text-gray-300">
                Searching teachers...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <X className="w-5 h-5 mr-2" />
                <span>{errorMessage}</span>
              </div>
            </div>
          ) : teachers.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.map((teacher: any) => (
                <li key={teacher._id}>
                  <Link
                    to={`/user/${teacher._id}`}
                    className="block p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                          <UserCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-2" />
                          {teacher.phone}
                        </p>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : debouncedQuery ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                <Search className="w-5 h-5 mr-2" />
                <span>No teachers found matching your search</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Search className="w-5 h-5 mr-2" />
                <span>Enter a name or phone number to search</span>
              </div>
            </div>
          )}
        </section>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Can't find who you're looking for? Contact the administration office.
        </div>
      </div>
      <div className="mt-12 text-center text-gray-400 text-xs">
        <p>
          Developed by {" "}
          <a
            href="https://digitiostack.vercel.app"
            target="_blank"
            className="font-semibold text-teal-600"
          >
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

export default Teachers;
