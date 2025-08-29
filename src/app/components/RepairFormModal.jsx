"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createRepair } from "@/utils/api";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import useAuthStore from "@/store/authStore";

const RepairFormModal = ({ isOpen, onClose, product, currentUser }) => {
  // console.log(product, "product")
  const queryClient = useQueryClient();
  const [repairItems, setRepairItems] = useState([
    { name: "", description: "", cost: "" },
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user, token } = useAuthStore();

  const repairMutation = useMutation({
    mutationFn: createRepair,
    onSuccess: () => {
      toast.success("Repair created");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["repairs", product._id] });
      onClose();
    },
    onError: () => toast.error("Failed to create repair"),
  });

  const handleItemChange = (index, field, value) => {
    const updated = [...repairItems];
    updated[index][field] = value;
    setRepairItems(updated);
  };

  const handleAddItem = () => {
    setRepairItems([...repairItems, { name: "", description: "", cost: "" }]);
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // for preview
    }
  };

  const totalRepairCost = repairItems.reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile);
      } catch (err) {
        toast.error("Image upload failed");
        return;
      }
    }

    repairMutation.mutate({
      productName: product.name,
      productId: product._id,
      repairItems: repairItems.map((item) => ({
        name: item.name,
        description: item.description,
        cost: Number(item.cost),
      })),
      totalRepairCost,
      image: imageUrl, // Cloudinary URL
      createdBy: {
        _id: currentUser?._id,
        name: currentUser?.name,
      },
    });
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Add Repair for {product.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {repairItems.map((item, idx) => (
            <div key={idx} className="border p-3 rounded space-y-2">
              <input
                type="text"
                placeholder="Repair name"
                value={item.name}
                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Repair description"
                value={item.description}
                onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Repair cost"
                value={item.cost}
                onChange={(e) => handleItemChange(idx, "cost", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            + Add Item
          </button>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-semibold">Upload or Capture Image</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded"
              />
            )}
          </div>

          <p className="font-semibold">
            Total Repair Cost: ${totalRepairCost}
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={repairMutation.isLoading}
            >
              {repairMutation.isLoading ? "Saving..." : "Add Repair"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairFormModal;
