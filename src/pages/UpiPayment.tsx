import { QRCodeCanvas } from "qrcode.react";
import { useState, useRef } from "react";

const UpiPayment = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const upiId = import.meta.env.VITE_UPI_ID;
  const adminContact = import.meta.env.VITE_ADMIN_CONTACT_NUMBER;
  const qrRef = useRef<HTMLDivElement>(null);

  const generateUpiUrl = () => {
    const params = new URLSearchParams();
    if (amount) params.append("am", amount);
    if (note) params.append("tn", note);
    params.append("pn", import.meta.env.VITE_APP_NAME);
    params.append("cu", "INR");
    return `upi://pay?pa=${encodeURIComponent(upiId)}&${params.toString()}`;
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `upi_payment_qr_${amount}.png`;
      link.click();
    }
  };

  const closeModal = () => {
    window.location.reload(); // Reload the page to close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full  overflow-y-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-md"
        >
          ✕
        </button>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 text-center">
          UPI Payment
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Amount (INR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg bg-blue-50 text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Payment for..."
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg bg-purple-50 text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
          </div>

          {amount && (
            <div className="text-center">
              <div
                className="flex justify-center mb-4 p-4 bg-gray-100 rounded-lg border-2 border-blue-400"
                ref={qrRef}
              >
                <QRCodeCanvas
                  value={generateUpiUrl()}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="rounded-md"
                />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                Scan to pay ₹{amount}
              </p>
              <p className="text-sm text-gray-700">UPI ID: {upiId}</p>
              <button
                onClick={downloadQRCode}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-md"
              >
                Download QR Code
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-700">
              After payment, please send a screenshot to{" "}
              <a
                href={`tel:${adminContact}`}
                className="text-purple-600 font-semibold underline hover:text-purple-800 transition"
              >
                {adminContact}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
