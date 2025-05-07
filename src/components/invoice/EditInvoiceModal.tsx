import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "../../Axios";
import { fetchProducts } from "../../utils/services/product.service";
import { Invoice } from "../../utils/types/types";

interface Product {
  _id: string;
  title: string;
  price: number;
}

interface EditInvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSave: (updatedInvoice: Invoice) => void;
}

export default function EditInvoiceModal({
  invoice,
  onClose,
  onSave,
}: EditInvoiceModalProps) {
  const [editedInvoice, setEditedInvoice] = useState(invoice);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);

  // Handle quantity change for existing items
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...editedInvoice.items];
    updatedItems[index].quantity = quantity;
    setEditedInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  // Remove an item from the invoice
  const handleRemoveItem = (index: number) => {
    const updatedItems = editedInvoice.items.filter((_, i) => i !== index);
    setEditedInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  // Add a new product to the invoice
  const handleAddProduct = () => {
    if (newProduct && newQuantity > 0) {
      const updatedItems = [
        ...editedInvoice.items,
        {
          product: { title: newProduct.title, price: newProduct.price },
          quantity: newQuantity,
        },
      ];
      setEditedInvoice((prev: any) => ({ ...prev, items: updatedItems }));
      setNewProduct(null);
      setNewQuantity(1);
    }
  };

  // Submit the updated invoice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure correct structure for backend
    const formattedInvoice = {
      ...editedInvoice,
      items: editedInvoice.items.map((item: any) => {
        const matchedProduct = products.find(
          (p) => p.title === item.product.title
        );

        return {
          product: matchedProduct?._id, // Ensure `_id` is sent
          price: matchedProduct?.price ?? item.product.price, // Ensure price is valid
          quantity: item.quantity,
        };
      }),
    };

    // Validate before sending to backend
    const hasInvalidItem = formattedInvoice.items.some(
      (item) => item.price === undefined || item.price < 0
    );

    if (hasInvalidItem) {
      console.error(
        "Validation failed: Each item must have a valid non-negative price."
      );
      return;
    }

    try {
      const response = await Axios.patch(
        `/invoices/${invoice._id}`,
        formattedInvoice
      );
      onSave(response.data);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Error updating invoice:", error.response?.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProducts();
      setProducts(products);
    };
    fetchData();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-white">Edit Invoice</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Student Details Card */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {editedInvoice.user.name}
                  </h1>
                  <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                    <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ID: {editedInvoice.user.admissionNumber}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {editedInvoice.user?.class?.name} -{" "}
                      {editedInvoice.user?.class?.section}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Invoice Items
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {editedInvoice.items.length} item
                  {editedInvoice.items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                        Item
                      </th>
                      <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                        Price
                      </th>
                      <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                        Total
                      </th>
                      <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium sr-only">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {editedInvoice.items.map((item: any, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {item.product.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          ₹{item.product.price}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            min="1"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          ₹{item.product.price * item.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-800/20"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {editedInvoice.items.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          No items added to this invoice yet
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {editedInvoice.items.length > 0 && (
                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-right font-medium text-gray-800 dark:text-gray-100"
                        >
                          Subtotal
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          ₹
                          {editedInvoice.items.reduce(
                            (sum, item) =>
                              sum + item.product.price * item.quantity,
                            0
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Add New Product */}
            <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                Add Item
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={newProduct?.title || ""}
                  onChange={(e) => {
                    const selectedProduct = products.find(
                      (p) => p.title === e.target.value
                    );
                    setNewProduct(selectedProduct || null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.title} value={product.title}>
                      {product.title} (₹{product.price})
                    </option>
                  ))}
                </select>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg">
                    Qty
                  </span>
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    min="1"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!newProduct}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-4 shadow-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
