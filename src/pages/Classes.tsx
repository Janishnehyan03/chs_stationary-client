import { Check, Edit, PlusCircle, Users, X } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Class Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your classes and sections efficiently
              </p>
            </div>
            {canCreateClass && (
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-800">
                <PlusCircle size={20} />
                <span className="font-medium">Add New Class</span>
              </button>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Total Classes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {classes.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {editingClassId === cls._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={editedClass.name}
                      onChange={(e) =>
                        setEditedClass({ ...editedClass, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter class name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter section"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => handleSaveEdit(cls._id)}
                      className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                      title="Save changes"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => setEditingClassId(null)}
                      className="p-2 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      title="Cancel editing"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {cls.name} - {cls.section}
                    </h3>
                    {canEditClass && (
                      <button
                        onClick={() => handleEditClick(cls)}
                        className="p-2 text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
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
