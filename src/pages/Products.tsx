import { useState, useEffect } from "react";
import { PlusCircle, Upload } from "lucide-react"; // Added Upload icon
import Axios from "../Axios";
import { ProductTable } from "../components/products/ProductTable";
import { ProductForm } from "../components/products/ProductForm";
import { Product } from "../utils/types/types";
import { useHasPermission } from "../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../utils/permissions";
import ImportProducts from "../components/products/ImportProductModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // State for import modal
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<Record<string, string>>({
    title: "",
    price: "",
    productCode: "",
    wholeSalePrice: "",
    description: "",
    stock: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null); // Track the product being edited

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.productCode)
      return;
    try {
      await Axios.post("/products", newProduct);
      resetForm();
      fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error adding product", error.response);
    }
  };

  const editProduct = async () => {
    if (
      !editingProductId ||
      !newProduct.title ||
      !newProduct.price ||
      !newProduct.productCode
    )
      return;
    try {
      await Axios.patch(`/products/${editingProductId}`, newProduct);
      resetForm();
      fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error updating product", error.response);
    }
  };

  const resetForm = () => {
    setNewProduct({
      title: "",
      price: "",
      productCode: "",
      wholeSalePrice: "",
      description: "",
      stock: "",
    });
    setIsEditing(false);
    setEditingProductId(null);
  };

  const handleEditClick = (product: Product) => {
    setNewProduct({
      title: product.title,
      price: product.price.toString(),
      productCode: product.productCode,
      wholeSalePrice: product.wholeSalePrice?.toString() || "",
      description: product.description || "",
      stock: product.stock.toString(),
    });
    setIsEditing(true);
    setEditingProductId(product._id.toString());
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.productCode.toLowerCase().includes(search.toLowerCase())
  );
  const canCreateProduct = useHasPermission(PERMISSIONS.products.create);

  return (
    <div className="p-8 bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-300">
      <div className="mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2 md:gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg h-10 w-full md:max-w-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {canCreateProduct && (
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <button
                className="text-blue-500 px-4 py-2 h-10 rounded-xl flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-md hover:shadow-lg"
                onClick={() => window.open("/files/Product-format.xlsx")}
              >
                <span className="font-medium">Download Excel Format</span>
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600 text-white px-4 py-2 h-10 rounded-lg flex items-center gap-2 transition shadow-md"
              >
                <PlusCircle size={20} /> Add Product
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 h-10 rounded-lg flex items-center gap-2 transition shadow-md"
              >
                <Upload size={20} /> Import Products
              </button>
            </div>
          )}
        </div>

        <ProductTable
          products={filteredProducts}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          fetchProducts={fetchProducts}
        />
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <ProductForm
          newProduct={newProduct}
          onInputChange={handleInputChange}
          onSaveProduct={isEditing ? editProduct : addProduct}
          onClose={() => {
            resetForm();
            setIsModalOpen(false);
          }}
          isEditing={isEditing}
        />
      )}

      {/* Import Products Modal */}
      {isImportModalOpen && (
        <ImportProducts
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          fetchProducts={fetchProducts} // Pass the function to refetch products after upload
        />
      )}
    </div>
  );
}
