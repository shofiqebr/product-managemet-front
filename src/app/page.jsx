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
} from "@/utils/api";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
  <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
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

  useEffect(() => {
    const authData = localStorage.getItem("auth-store");
    if (!authData) router.replace("/login");
    else {
      const parsedData = JSON.parse(authData);
      if (!parsedData.state?.user) router.replace("/login");
    }
  }, [router]);

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
    <div className="p-6">
      <div className="flex justify-between">

      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => setModalOpen(true)}
      >
        Add Product
      </button>
      </div>

      <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Model</th>
            <th className="py-2 px-4 text-left">Brand</th>
            <th className="py-2 px-4 text-left">Year</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product._id} className="border-t">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.model}</td>
              <td className="py-2 px-4">{product.brand}</td>
              <td className="py-2 px-4">{product.year}</td>
              <td className="py-2 px-4">${product.price}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setModalOpen(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    repairMutation.mutate({
                      productId: product._id,
                      description: "General maintenance",
                    })
                  }
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Repair
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        initialData={editingProduct}
      />
    </div>
  );
};

export default Home;
