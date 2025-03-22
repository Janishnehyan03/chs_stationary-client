import { Upload } from "lucide-react";
import { useState } from "react";

interface BillUploadFormProps {
  purchase: any;
  shops: any[];
  onUpload: (purchaseId: string, billFile: File) => Promise<void>;
  onCancel: () => void;
}

const BillUploadForm = ({
  purchase,
  shops,
  onUpload,
  onCancel,
}: BillUploadFormProps) => {
  const [billFile, setBillFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBillFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!billFile) return;
    setIsUploading(true);
    try {
      await onUpload(purchase._id, billFile);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white/70 p-6 rounded-xl shadow-neo transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Bill</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-800 font-medium mb-2">
            Bill for{" "}
            {shops.find((s) => s._id === purchase.shop._id)?.name || "Unknown"}
          </label>
          <label className="flex items-center justify-center w-full p-3 bg-gray-100/50 rounded-lg shadow-inner cursor-pointer hover:bg-gray-200/50 transition-all duration-200">
            <Upload className="mr-2 text-gray-600" />
            <span className="text-gray-600">
              {billFile ? billFile.name : "Select Bill File"}
            </span>
            <input type="file" onChange={handleBillChange} className="hidden" />
          </label>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500/80 text-white py-2 rounded-lg shadow-neo hover:shadow-inner hover:bg-green-500 transition-all duration-200 font-medium disabled:bg-green-300/80"
            disabled={!billFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Bill"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500/80 text-white py-2 rounded-lg shadow-neo hover:shadow-inner hover:bg-gray-500 transition-all duration-200 font-medium"
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillUploadForm;
