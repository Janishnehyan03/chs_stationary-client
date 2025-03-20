import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Axios from "../../Axios";

interface ImportProductsProps {
  isOpen: boolean;
  onClose: () => void;
  fetchProducts: () => void;
}

interface Product {
  title: string;
  price: number;
  productCode: string;
  wholeSalePrice?: number;
  description?: string;
  stock: number;
}

export default function ImportProducts({
  isOpen,
  onClose,
  fetchProducts,
}: ImportProductsProps) {
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result;
      if (!binaryStr) return;

      try {
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const parsedProducts: Product[] = (jsonData as any[]).map((row) => ({
          title: row["Title"] || "",
          price: row["Price"] || 0,
          productCode: row["Product Code"] || "",
          wholeSalePrice: row["Wholesale Price"] || undefined,
          description: row["Description"] || undefined,
          stock: row["Stock"] || 0,
        }));

        if (parsedProducts.length === 0) {
          alert("No valid product data found in the file.");
          return;
        }

        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Invalid file format. Please upload a valid Excel file.");
      }
    };

    reader.readAsBinaryString(file);
  }, []);

  const uploadProducts = async () => {
    if (products.length === 0) {
      alert("No products to upload. Please select a file first.");
      return;
    }

    const confirmUpload = window.confirm(
      `Are you sure you want to upload ${products.length} products?`
    );
    if (!confirmUpload) return;

    setUploading(true);

    try {
      await Axios.post("/products/bulk", products);
      alert("Products imported successfully!");
      setProducts([]); // Clear products after successful upload
      onClose(); // Close modal after successful upload
      fetchProducts(); // Fetch products after successful upload
    } catch (error) {
      console.error("Error importing products:", error);
      alert("Failed to import products.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      <div className="w-full max-w-4xl shadow-xl border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 space-y-6 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center">Import Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* File Dropzone */}
        <div
          {...getRootProps()}
          className="cursor-pointer p-5 border border-dashed border-gray-400 dark:border-gray-500 rounded-lg text-center bg-white/10 dark:bg-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/30 transition"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 dark:text-gray-300">
            Drag & drop an Excel file here, or click to select
          </p>
        </div>

        {/* Display Parsed Products */}
        {products.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Title
                  </th>
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Price
                  </th>
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Product Code
                  </th>
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Wholesale Price
                  </th>
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Description
                  </th>
                  <th className="p-2 text-left text-gray-800 dark:text-gray-200">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {product.title}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {product.price}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {product.productCode}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {product.wholeSalePrice || "-"}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {product.description || "-"}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* File Upload Button */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={products.length === 0 || uploading}
          onClick={uploadProducts}
        >
          {uploading ? "Uploading..." : "Upload Products"}
        </button>
      </div>
    </div>
  );
}
