import { X } from "lucide-react";

function TeacherForm({
  newTeacher,
  setNewTeacher,
  handleAddTeacher,
  loading,
  setIsModalOpen,
}: {
  newTeacher: { name: string; email: string; phone: string };
  setNewTeacher: Function;
  handleAddTeacher: any;
  loading: boolean;
  setIsModalOpen: Function;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add New Teacher
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Phone
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
              value={newTeacher.phone}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
            onClick={handleAddTeacher}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Adding...</span>
              </div>
            ) : (
              "Add Teacher"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherForm;
