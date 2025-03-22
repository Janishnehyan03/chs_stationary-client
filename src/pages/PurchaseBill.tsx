import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getShops } from "../utils/services/shopService";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
} from "../utils/services/purchaseService";
import PurchaseTable from "../components/purchases/PurchaseTable";
import PurchaseForm from "../components/purchases/PurchaseForm";
import BillUploadForm from "../components/purchases/BillUploadForm";
import Axios from "../Axios";

const PurchasePage = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null); // For bill upload
  const [editingPurchase, setEditingPurchase] = useState<any>(null); // For editing purchase
  const [showForm, setShowForm] = useState(false);

  const initialFormState = {
    shop: "",
    price: "",
    paymentMethod: "Cash",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchasedBy: "",
  };
  const [form, setForm] = useState(initialFormState);

  // Form change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm(initialFormState);
    setEditingPurchase(null);
    setShowForm(false);
  };

  // Create or Update purchase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", form);
    if (form.shop && form.price && form.paymentMethod && form.purchaseDate) {
      try {
        if (editingPurchase) {
          const response = await updatePurchase(editingPurchase._id, form);
          setPurchases(
            purchases.map((p) =>
              p._id === editingPurchase._id ? response.data : p
            )
          );
        } else {
          const newPurchase = { ...form, billUrl: null };
          const response = await createPurchase(newPurchase);
          setPurchases([...purchases, response.data]);
        }
        resetForm();
        fetchPurchases();
      } catch (error) {
        console.error("Error handling purchase:", error);
      }
    }
  };

  // Update purchase with bill
  const handleBillUpload = async (purchaseId: string, billFile: File) => {
    const formData = new FormData();
    formData.append("bill", billFile);
    const response = await Axios.put(
      `/purchases/${purchaseId}/upload-bill`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const updatedPurchase = response.data;
    setPurchases(
      purchases.map((p) =>
        p._id === purchaseId ? { ...p, billUrl: updatedPurchase.billUrl } : p
      )
    );
    setSelectedPurchase(null);
  };

  const fetchPurchases = async () => {
    const response = await getPurchases();
    setPurchases(response.data);
  };

  const deletePurchaseRecord = async (purchaseId: string) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        await deletePurchase(purchaseId);
        setPurchases(purchases.filter((p) => p._id !== purchaseId));
      } catch (error) {
        console.error("Error deleting purchase:", error);
      }
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      const response = await getShops();
      setShops(response.data);
    };
    fetchShops();
    fetchPurchases();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-12 px-6 py-8 bg-white rounded-2xl shadow-md">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Purchase Records
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" /> New Purchase
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PurchaseTable
            purchases={purchases}
            shops={shops}
            onDelete={deletePurchaseRecord}
            onEdit={(purchase) => {
              setEditingPurchase(purchase);
              setForm({
                shop: purchase.shop._id || "",
                price: purchase.price.toString() || "",
                paymentMethod: purchase.paymentMethod || "Cash",
                purchaseDate:
                  new Date(purchase.purchaseDate).toISOString().split("T")[0] ||
                  "",
                purchasedBy: purchase.purchasedBy || "",
              });
              setShowForm(true);
            }}
            onUploadBill={setSelectedPurchase}
          />
        </div>

        <aside className="space-y-6">
          {showForm && (
            <PurchaseForm
              shops={shops}
              formData={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              isEditing={!!editingPurchase}
            />
          )}
          {selectedPurchase && (
            <BillUploadForm
              purchase={selectedPurchase}
              shops={shops}
              onUpload={handleBillUpload}
              onCancel={() => setSelectedPurchase(null)}
            />
          )}
        </aside>
      </div>
    </div>
  );
};

export default PurchasePage;
