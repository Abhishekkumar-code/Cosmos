import axios from "axios";

const arenaApi = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export const invokeArena = async (input) => {
    const response = await arenaApi.post("/invoke", { input });
    return response.data;
};

