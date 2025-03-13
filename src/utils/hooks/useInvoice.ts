import { useState, useEffect } from "react";
import Axios from "../../Axios";
import { Invoice } from "../types/types";

export const useInvoices = (studentId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!studentId) return;

      setLoading(true);
      setError(null);

      try {
        let url = `/invoices/user/${studentId}`;

        const response = await Axios.get(url);
        setInvoices(response.data.invoices);
        setTotalPaid(response.data.totalPaidAmount);
        setTotalDue(response.data.totalDueAmount);
        setTotalAmount(
          response.data.invoices.reduce(
            (sum: any, inv: any) => sum + inv.totalAmount,
            0
          )
        );
      } catch (err) {
        setError("Failed to fetch invoices. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [studentId]);

  return { invoices, loading, error, totalAmount, totalPaid, totalDue };
};
