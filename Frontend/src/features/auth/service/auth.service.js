import axios from "axios";

const authapiinstace = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function register({ email, username, password, isAdmin }) {
    const response = await authapiinstace.post("/register", {
        email,
        username,
        password,
        isAdmin
    })

    return response.data


}

export async function login({ email, password }) {

    const response = await authapiinstace.post("/login", {
        email,
        password
    })
    return response.data
}

export async function getCurrentUser() {
    const response = await authapiinstace.get("/getme")
    return response.data.user
}
