import axios from "axios";

const API = "http://localhost:5000";

export const loginApi = async (data) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerApi = async (data) => {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
};



// Fetch all products
export const fetchProducts = async () => {
  const res = await axios.get(`${API}/products`);
  return res.data.data; // since response has { success, data }
};

// Create product
export const createProduct = async (product) => {
  const res = await axios.post(`${API}/products`, product);
  return res.data;
};

// Update product
export const updateProduct = async (id, updates) => {
  const res = await axios.patch(`${API}/products/${id}`, updates);
  return res.data;
};


// Delete product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API}/products/${id}`);
  return res.data;
};

// Create repair
export const createRepair = async (repair) => {
  const res = await axios.post(`${API}/repairs`, repair);
  return res.data;
};

// Get repairs for a product
export const fetchRepairs = async (productId) => {
  const res = await axios.get(`${API}/repairs/${productId}`);
  return res.data;
};
