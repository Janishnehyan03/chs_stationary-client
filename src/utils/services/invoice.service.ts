import Axios from "../../Axios";
import { Invoice } from "../types/types";

interface HandlePaymentParams {
  invoiceId: string;
  amount: number | "";
  method: "cash" | "online" | "balance" | "other";
  useBalance: boolean;
  pendingAmount: number;
  studentBalance: number;
  fetchInvoices: () => void;
  setInvoicePaid: (paid: boolean) => void;
  setLoading: (loading: boolean) => void;
  setShowPayment: (show: boolean) => void;
  setAmount: (amount: number | "") => void;
}

interface EditPaymentParams {
  invoiceId: string;
  paymentId: string;
  newAmount: number | "";
  newMethod: "cash" | "online" | "balance" | "other";
  fetchInvoices: () => void;
}

export const handlePayment = async ({
  invoiceId,
  amount,
  method,
  useBalance,
  pendingAmount,
  studentBalance,
  fetchInvoices,
  setInvoicePaid,
  setLoading,
  setShowPayment,
  setAmount,
}: HandlePaymentParams) => {
  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (amount > pendingAmount) {
    alert(`Amount (₹${amount}) exceeds pending amount (₹${pendingAmount}).`);
    return;
  }

  if (useBalance && studentBalance < amount) {
    alert(`Insufficient student balance (₹${studentBalance}).`);
    return;
  }

  setLoading(true);
  try {
    const response = await Axios.patch(`/invoices/pay/${invoiceId}`, {
      amount,
      method,
      useBalance,
    });

    if (response.data.status === "paid") {
      setInvoicePaid(true);
    }

    fetchInvoices();
    setShowPayment(false);
    setAmount("");
    setInvoicePaid(true);
    alert("Payment successful!");
    window.location.reload();
  } catch (error: any) {
    console.error("Payment error:", error);
    alert(error.response?.data?.message || "Failed to process payment.");
  } finally {
    setLoading(false);
  }
};

export const editPayment = async ({
  invoiceId,
  paymentId,
  newAmount,
  newMethod,
  fetchInvoices,
}: EditPaymentParams) => {
  if (!newAmount || newAmount <= 0) {
    throw new Error("Please enter a valid amount.");
  }

  try {
    await Axios.patch(`/invoices/edit-payment/${invoiceId}/${paymentId}`, {
      newAmount,
      newMethod,
    });

    fetchInvoices();
    alert("Payment corrected successfully!");
    window.location.reload();
  } catch (error: any) {
    console.error("Edit payment error:", error);
    throw new Error(error.response?.data?.message || "Failed to edit payment.");
  }
};

export const fetchInvoices = async () => {
  try {
    const response = await Axios.get<Invoice[]>("/invoices");
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PurchaseInvoice {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  // Add other invoice fields as needed
}

interface ApiResponse {
  data: PurchaseInvoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPurchases = async (
  params: PaginationParams
): Promise<ApiResponse> => {
  const response = await Axios.get<ApiResponse>("/invoices/purchases/all", {
    params,
  });
  return response.data;
};
