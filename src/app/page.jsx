"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createRepair,
  deleteProduct,
  fetchProducts,
  createProduct,
  updateProduct,
  fetchUsers,
} from "@/utils/api";
import RepairFormModal from "./components/RepairFormModal";
import useAuthStore from "@/store/authStore";

// Product Form Modal Component
const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    model: "",
    brand: "",
    year: "",
    price: "",
    fuelType: "Petrol",
    description: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-black/40 z-50 px-4 overflow-y-scroll">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg mt-80 ">
        <h2 className="text-xl font-bold mb-4 text-center">
          {initialData ? "Update Product" : "Create Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              id="model"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Enter model"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Enter brand"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="e.g. 2023"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

const Home = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [repairingProduct, setRepairingProduct] = useState(null);
  const [actionPopup, setActionPopup] = useState(false);
  useEffect(() => {
    const authData = localStorage.getItem("auth-store");
    if (!authData) router.replace("/login");
    else {
      const parsedData = JSON.parse(authData);
      if (!parsedData.state?.user) router.replace("/login");
    }
  }, [router]);

  const { email } = useAuthStore();
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
  // console.log(users, "users")

  const currentUser = users?.find(u => u.email === email);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const repairMutation = useMutation({
    mutationFn: createRepair,
    onSuccess: () => toast.success("Repair created"),
    onError: () => toast.error("Failed to create repair"),
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => toast.error("Failed to create product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const handleSubmitProduct = (formData) => {
    if (editingProduct) {
      console.log(editingProduct, "editingProduct")
      updateMutation.mutate({ id: editingProduct._id, data: formData });
      setEditingProduct(null);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading products</p>;

  return (
    <div className="md:p-4 ">
      {/* Header with title + Add Product button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Products</h1>

        <button
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto ">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white text-sm sm:text-base">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Model</th>
              <th className="py-2 px-4 text-left">Brand</th>
              <th className="py-2 px-4 text-left">Year</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-t text-xs md:text-base">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.model}</td>
                <td className="py-2 px-4">{product.brand}</td>
                <td className="py-2 px-4">{product.year}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4">
                  {/* Show inline buttons on md+ */}
                  <div className="hidden md:flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setRepairingProduct(product);
                        setRepairModalOpen(true);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Repair
                    </button>
                  </div>

                  {/* Mobile Action Popup Trigger */}
                  <div className="md:hidden flex justify-center">
                    <button
                      onClick={() => setActionPopup(product)}
                      className="px-3 py-1 bg-gray-700 text-white rounded text-xs"
                    >
                      Actions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        initialData={editingProduct}
      />

      {/* Repair Modal */}
      <RepairFormModal
        isOpen={repairModalOpen}
        onClose={() => {
          setRepairModalOpen(false);
          setRepairingProduct(null);
        }}
        currentUser={currentUser}
        product={repairingProduct}
      />

      {/* Mobile Action Popup */}
      {actionPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-4">
            <h2 className="text-base font-semibold mb-3 text-gray-800 text-center">
              {actionPopup.name}
            </h2>
            <div className="flex flex-col gap-2 items-center">
              <button
                onClick={() => {
                  setEditingProduct(actionPopup);
                  setModalOpen(true);
                  setActionPopup(null);
                }}
                className="w-3/4 bg-blue-500 text-white py-1 px-3 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(actionPopup._id);
                  setActionPopup(null);
                }}
                className="w-3/4 bg-red-500 text-white py-1 px-3 rounded text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setRepairingProduct(actionPopup);
                  setRepairModalOpen(true);
                  setActionPopup(null);
                }}
                className="w-3/4 bg-yellow-500 text-white py-1 px-3 rounded text-sm"
              >
                Repair
              </button>
              <button
                onClick={() => setActionPopup(null)}
                className="w-3/4 bg-gray-400 text-white py-1 px-3 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default Home;
