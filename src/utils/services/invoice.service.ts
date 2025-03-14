import Axios from "../../Axios";
import { Invoice } from "../types/types";

interface HandlePaymentParams {
  invoiceId: string;
  amount: number | "";
  useBalance: boolean;
  pendingAmount: number;
  studentBalance: number;
  fetchInvoices: () => void;
  setInvoicePaid: (paid: boolean) => void;
  setLoading: (loading: boolean) => void;
  setShowPayment: (show: boolean) => void;
  setAmount: (amount: number | "") => void;
}

export const handlePayment = async ({
  invoiceId,
  amount,
  useBalance,
  pendingAmount,
  studentBalance,
  fetchInvoices,
  setInvoicePaid,
  setLoading,
  setShowPayment,
  setAmount,
}: HandlePaymentParams) => {
  if (!amount || isNaN(Number(amount))) {
    alert("Please enter a valid amount.");
    return;
  }

  const paymentAmount = Number(amount);
  if (paymentAmount <= 0 || paymentAmount > pendingAmount) {
    alert(`Please enter an amount between ₹1 and ₹${pendingAmount}.`);
    return;
  }

  if (useBalance && studentBalance < paymentAmount) {
    alert("Insufficient balance. Please use another payment method.");
    return;
  }

  setLoading(true);
  try {
    await Axios.patch(`/invoices/pay/${invoiceId}`, {
      amount: paymentAmount,
      useBalance,
    });
    alert("Payment successful!");
    setShowPayment(false);
    setAmount("");
    fetchInvoices();
    setInvoicePaid(true);
  } catch (error) {
    console.error("Payment failed:", error);
    alert("Payment failed. Please try again.");
  } finally {
    setLoading(false);
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
