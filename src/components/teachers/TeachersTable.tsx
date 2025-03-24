import { Phone, Trash, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Teacher } from "../../utils/types/types";
import InvoiceOfUser from "../invoice/InvoiceOfUser";
import React from "react";

function TeachersTable({
  filteredTeachers,
  loading,
  deleteTeacher,
  canUpdateTeacher,
  canDeleteTeacher,
}: {
  filteredTeachers: Teacher[];
  loading: any;
  deleteTeacher: any;
  canUpdateTeacher: any;
  canDeleteTeacher: any;
}) {
  const [showInvoice, setShowInvoice] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<any | null>(
    null
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {showInvoice && selectedStudent && (
        <InvoiceOfUser
          student={selectedStudent}
          showModal={showInvoice}
          handleClose={() => setShowInvoice(false)}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                #
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Due Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Show Invoice
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Edit
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <tr
                  key={teacher._id}
                  className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/user/${teacher._id}`}
                        className="flex items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <User
                            size={16}
                            className="text-indigo-600 dark:text-indigo-300"
                          />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 hover:underline">
                          {teacher.name}
                        </span>
                      </Link>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone size={16} />
                      {teacher.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 rounded-full px-2.5 py-0.5">
                      ₹{teacher.dueAmount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedStudent(teacher);
                        setShowInvoice(true);
                      }}
                      className="text-indigo-600 dark:text-indigo-300 hover:underline"
                    >
                      Show Invoice
                    </button>
                  </td>

                  {canUpdateTeacher && (
                    <td className="px-6 py-4">
                      <Link
                        to={`/user/${teacher._id}`}
                        className="text-indigo-600 dark:text-indigo-300 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  )}
                  {canDeleteTeacher && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteTeacher(teacher._id)}
                        className="text-red-500 dark:text-red-300 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeachersTable;
