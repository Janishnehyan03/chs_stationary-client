import { X } from "lucide-react";
import { ChangeEvent } from "react";

interface ProductFormProps {
  newProduct?: Record<string, string>; // Make optional for adding new products
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSaveProduct: () => void; // Renamed to handle both add and edit
  onClose: () => void;
  isEditing?: boolean; // Add a flag to determine if we're editing
}

export function ProductForm({
  newProduct = {}, // Default to empty object for adding
  onInputChange,
  onSaveProduct,
  onClose,
  isEditing = false, // Default to false for adding
}: ProductFormProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center p-4 z-50">
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    {/* Form Fields */}
    <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {["title", "price", "productCode", "wholeSalePrice", "description", "stock"].map((field) => (
        <div key={field} className="col-span-1">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            htmlFor={field}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            type={field.includes("price") || field === "stock" ? "number" : "text"}
            name={field}
            placeholder={`Enter ${field}`}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            value={newProduct[field] || ""}
            onChange={onInputChange}
          />
        </div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700 flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSaveProduct}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
      >
        {isEditing ? "Save Changes" : "Add Product"}
      </button>
    </div>
  </div>
</div>

  );
}
