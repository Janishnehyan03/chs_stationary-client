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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            "title",
            "price",
            "productCode",
            "wholeSalePrice",
            "description",
            "stock",
          ].map((field) => (
            <div key={field} className="col-span-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor={field}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={
                  field.includes("price") || field === "stock"
                    ? "number"
                    : "text"
                }
                name={field}
                placeholder={`Enter ${field}`}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={newProduct[field] || ""} // Use empty string as fallback
                onChange={onInputChange}
              />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSaveProduct}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            {isEditing ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}