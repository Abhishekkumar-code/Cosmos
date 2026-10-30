import axios from "axios";

// const arenaApi = axios.create({
//     baseURL: "http://localhost:3000",
//     withCredentials: true,
// });
const arenaApi = axios.create({
    baseURL: "https://cosmos-qlbq.onrender.com",
    withCredentials: true,
});

arenaApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const invokeArena = async (input) => {
    const response = await arenaApi.post("/invoke", { input });
    return response.data;
};
