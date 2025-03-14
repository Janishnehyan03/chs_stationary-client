import React from "react";
import { Trash } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

interface DeleteInvoiceButtonProps {
  invoiceId: string;
  onDelete: (id: string) => void;
}

const DeleteInvoiceButton: React.FC<DeleteInvoiceButtonProps> = ({
  invoiceId,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleConfirmDelete = () => {
    onDelete(invoiceId); // Trigger the delete action
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 py-2 border bg-red-700 border-gray-200 text-gray-100 rounded-md hover:bg-red-800 cursor-pointer transition duration-200"
      >
        <Trash className="w-4 h-4" />
        <span>Delete Invoice</span>
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </>
  );
};

export default DeleteInvoiceButton;
