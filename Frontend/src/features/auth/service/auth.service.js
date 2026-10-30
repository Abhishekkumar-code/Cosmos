import axios from "axios";

const authapiinstace = axios.create({
    baseURL: "https://cosmos-qlbq.onrender.com/api/auth",
    withCredentials: true
});
// const authapiinstace = axios.create({
//     baseURL: "http://localhost:3000/api/auth",
//     withCredentials: true
// });

authapiinstace.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({ email, username, password, isAdmin }) {
    const response = await authapiinstace.post("/register", {
        email,
        username,
        password,
        isAdmin
    });

    return response.data;
}

export async function login({ email, password }) {
    const response = await authapiinstace.post("/login", {
        email,
        password
    });

    if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
    }

    return response.data;
}

export async function getCurrentUser() {
    const response = await authapiinstace.get("/getme");
    return response.data.user;
}
