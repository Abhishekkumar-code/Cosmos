import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api/auth",
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: "https://cosmos-qlbq.onrender.com/api/auth",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDevelopers = async () => {
  const response = await api.get("/admin/developers");
  return response.data;
};

export const getDeveloperMessages = async (id) => {
  const response = await api.get(`/admin/developers/${id}/messages`);
  return response.data;
};

export const deleteDeveloper = async (id) => {
  const response = await api.delete(`/admin/developers/${id}`);
  return response.data;
};

