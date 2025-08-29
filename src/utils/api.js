import axios from "axios";

// const API = "https://product-management-iota-nine.vercel.app";
const API = "http://localhost:5000";

export const loginApi = async (data) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerApi = async (data) => {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
};

export const fetchUsers = async () => {
  const res = await axios.get(`${API}/users`);
  return res.data.data; // return array of users
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
// export const fetchRepairs = async (productId) => {
//   const res = await axios.get(`${API}/repairs/${productId}`);
//   return res.data;
// };

export const fetchRepairs = async () => {
  // const{ token} = useAuthStore();
  // const token = useAuthStore.getState().token;
  const res = await fetch(`${API}/repairs`, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  // console.log(res, "rip")
  if (!res.ok) throw new Error("Failed to fetch repairs");
  return res.json();
};

export const fetchRepairById = async (id) => {
  // const token = useAuthStore.getState().token;
  const res = await fetch(`${API}/repairs/${id}`, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch repair");
  return res.json();
};