import { useForm } from "react-hook-form";
import { createShop, updateShop } from "../../utils/services/shopService";

interface ShopFormProps {
  shop?: { _id: string; name: string; contact?: string; address?: string };
  onSuccess: () => void;
}

export default function ShopForm({ shop, onSuccess }: ShopFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: shop || { name: "", contact: "", address: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      shop ? await updateShop(shop._id, data) : await createShop(data);
      onSuccess();
      if (!shop) reset(); // Only reset on create, not update
    } catch (error) {
      console.error("Error submitting shop:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/70 p-6 rounded-xl shadow-neo transition-all duration-300"
    >
      {/* Shop Name */}
      <div className="mb-5">
        <label className="block text-gray-800 font-medium mb-2">
          Shop Name
        </label>
        <input
          {...register("name")}
          className="w-full p-3 bg-gray-100/50 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400/50 border-none transition-all duration-200"
          required
          placeholder="Enter shop name"
        />
      </div>

      {/* Contact */}
      <div className="mb-5">
        <label className="block text-gray-800 font-medium mb-2">Contact</label>
        <input
          {...register("contact")}
          className="w-full p-3 bg-gray-100/50 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400/50 border-none transition-all duration-200"
          placeholder="Enter contact details"
        />
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="block text-gray-800 font-medium mb-2">Address</label>
        <input
          {...register("address")}
          className="w-full p-3 bg-gray-100/50 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400/50 border-none transition-all duration-200"
          placeholder="Enter shop address"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`${
          shop ? "bg-yellow-400 text-yellow-900" : "bg-blue-500 text-white" 
        } px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:bg-opacity-90`}
      >
        {shop ? "Update Shop" : "Add Shop"}
      </button>
    </form>
  );
}

/* Add these custom styles to your CSS or Tailwind config */
