import React, { useState } from "react";
import { X, CreditCard, History, Package, Trash2, Check, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import InvoiceDetails from "./InvoiceDetails";
import { handlePayment } from "../../utils/services/invoice.service";
import { useHasPermission } from "../../utils/hooks/useHasPermission";
import { PERMISSIONS } from "../../utils/permissions";
import Axios from "../../Axios";

interface InvoiceDrawerProps {
    invoice: any;
    isOpen: boolean;
    onClose: () => void;
    fetchInvoices: () => void;
}

const InvoiceDrawer: React.FC<InvoiceDrawerProps> = ({
    invoice,
    isOpen,
    onClose,
    fetchInvoices,
}) => {
    const [activeTab, setActiveTab] = useState<"items" | "payment" | "history">("items");
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<number | "">("");
    const [method, setMethod] = useState<"cash" | "online" | "balance" | "other">("cash");
    const [useBalance, setUseBalance] = useState(false);

    const canDeleteInvoice = useHasPermission(PERMISSIONS.invoice.delete);

    const totalAmount = invoice?.totalAmount || 0;
    const paidAmount = invoice?.amountPaid || 0;
    const pendingAmount = Number(Math.max(totalAmount - paidAmount, 0).toFixed(2));
    const studentBalance = Number((invoice?.user?.balance || 0).toFixed(2));

    const handleUseBalanceChange = (checked: boolean) => {
        setUseBalance(checked);
        setAmount(checked ? Math.min(pendingAmount, studentBalance) : "");
        if (checked) setMethod("balance");
    };

    const onPayment = async () => {
        setLoading(true);
        await handlePayment({
            invoiceId: invoice._id,
            amount,
            method,
            useBalance,
            studentBalance,
            fetchInvoices,
            setInvoicePaid: () => { }, // Handled by refresh
            setLoading,
            setShowPayment: () => onClose(),
            setAmount,
        });
    };

    const onDeleteInvoice = async () => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;
        try {
            await Axios.delete(`/invoices/${invoice._id}`);
            toast.success("Invoice deleted");
            fetchInvoices();
            onClose();
        } catch (err) {
            toast.error("Failed to delete invoice");
        }
    };

    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Details</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {invoice.user?.name} • {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Paid</p>
                        <p className="text-sm font-bold text-blue-600">₹{paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Due</p>
                        <p className={`text-sm font-bold ${pendingAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                            ₹{pendingAmount.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    {[
                        { id: "items", label: "Items", icon: Package },
                        { id: "payment", label: "Pay", icon: CreditCard },
                        { id: "history", label: "History", icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab.id
                                ? "border-blue-600 text-blue-600 bg-blue-50/10"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "items" && (
                        <div className="space-y-8 pb-10">
                            <InvoiceDetails invoice={invoice} totalAmount={totalAmount} />

                            {canDeleteInvoice && (
                                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={onDeleteInvoice}
                                        className="group w-full flex items-center justify-between p-4 px-6 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-rose-900/30 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                                                <Trash2 size={16} />
                                            </div>
                                            Terminate Record
                                        </div>
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </button>
                                    <p className="mt-3 text-[10px] text-gray-400 text-center font-bold px-8 leading-relaxed italic">
                                        Danger: This action is permanent and will remove all billing and payment history associated with this record.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="space-y-6">
                            {pendingAmount <= 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                                        <Check size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Invoice Fully Paid</h4>
                                    <p className="text-gray-500 text-sm mt-1">No pending amount for this invoice.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                            Note: Payments exceeding the due amount will automatically clear other pending invoices or be added to student balance.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount (₹)</label>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(Number(e.target.value) || "")}
                                                placeholder={`Enter amount (Due: ₹${pendingAmount})`}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                                                disabled={useBalance}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["cash", "online", "other", "balance"].map((m) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setMethod(m as any)}
                                                        disabled={useBalance && m !== "balance"}
                                                        className={`py-3 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${method === m
                                                            ? "bg-blue-600 border-blue-600 text-white"
                                                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"
                                                            } disabled:opacity-30`}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {studentBalance > 0 && (
                                            <button
                                                onClick={() => handleUseBalanceChange(!useBalance)}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${useBalance ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "border-gray-100 dark:border-gray-800"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${useBalance ? "bg-green-600 border-green-600 text-white" : "border-gray-300"}`}>
                                                        {useBalance && <Check size={12} />}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Use Student Balance</span>
                                                </div>
                                                <span className="text-xs font-black text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">₹{studentBalance}</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={onPayment}
                                            disabled={loading || !amount}
                                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all disabled:opacity-50 mt-4 text-lg"
                                        >
                                            {loading ? "Processing..." : "Complete Payment"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className="space-y-4">
                            {!invoice.paymentHistory || invoice.paymentHistory.length === 0 ? (
                                <div className="py-12 text-center text-gray-500 italic text-sm">No payment history found.</div>
                            ) : (
                                invoice.paymentHistory.map((payment: any, idx: number) => (
                                    <div key={payment._id || idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{payment.method} • {new Date(payment.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {payment.corrected && (
                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase">Voided</span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDrawer;
