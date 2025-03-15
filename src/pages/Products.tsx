import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Axios from "../Axios";
import { ProductTable } from "../components/products/ProductTable";
import { ProductForm } from "../components/products/ProductForm";
import { Product } from "../utils/types/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.productCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
    <div className="max-w-6xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-600 bg-gray-700 text-white px-4 py-2 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-teal-600 hover:bg-teal-500 cursor-pointer text-white px-6 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <PlusCircle size={20} /> Add Product
        </button>
      </div>
  
      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        onEditClick={handleEditClick} // Pass edit handler to the table
      />
    </div>
  
    {isModalOpen && (
      <ProductForm
        newProduct={newProduct}
        onInputChange={handleInputChange}
        onSaveProduct={isEditing ? editProduct : addProduct} // Use editProduct or addProduct based on mode
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        isEditing={isEditing} // Pass isEditing flag to the form
      />
    )}
  </div>
  
  );
}
