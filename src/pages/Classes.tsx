import { Check, Edit, PlusCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../Axios";
import { useHasPermission } from "../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../utils/permissions";

interface Class {
  _id: string;
  name: string;
  section: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editedClass, setEditedClass] = useState<{
    name: string;
    section: string;
  }>({ name: "", section: "" });

  useEffect(() => {
    Axios.get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  const handleEditClick = (cls: Class) => {
    setEditingClassId(cls._id);
    setEditedClass({ name: cls.name, section: cls.section });
  };

  const handleSaveEdit = (classId: string) => {
    Axios.put(`/classes/${classId}`, editedClass)
      .then((res) => {
        setClasses(
          classes.map((cls) => (cls._id === classId ? res.data : cls))
        );
        setEditingClassId(null);
      })
      .catch((err) => console.error("Error updating class:", err));
  };

  const canCreateClass = useHasPermission(PERMISSIONS.class.create);
  const canEditClass = useHasPermission(PERMISSIONS.class.update);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section with Glass Effect */}
        <div className="mb-12 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text ">
                Class Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-lg">
                Organize and manage all class sections with real-time updates
                and intuitive controls
              </p>
            </div>
            {canCreateClass && (
              <button className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-xl group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95">
                <PlusCircle size={20} className="mr-2" />
                <span className="font-medium">Add New Class</span>
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards with Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {classes.length}
                </p>
              </div>
            </div>
          </div>
          {/* Add additional stat cards here */}
        </div>

        {/* Class Cards Grid with Floating Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                editingClassId === cls._id ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              {editingClassId === cls._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={editedClass.name}
                      onChange={(e) =>
                        setEditedClass({ ...editedClass, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Class name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      value={editedClass.section}
                      onChange={(e) =>
                        setEditedClass({
                          ...editedClass,
                          section: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Section"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleSaveEdit(cls._id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Check size={18} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingClassId(null)}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                        Section {cls.section}
                      </p>
                    </div>
                    {canEditClass && (
                      <button
                        onClick={() => handleEditClick(cls)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit class"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
