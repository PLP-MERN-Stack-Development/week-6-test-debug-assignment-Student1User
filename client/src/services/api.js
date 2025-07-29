import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error.response?.data || error)
  },
)

// User API functions
export const fetchUsers = () => api.get("/users")

export const fetchUser = (id) => api.get(`/users/${id}`)

export const createUser = (userData) => api.post("/users", userData)

export const updateUser = ({ id, ...userData }) => api.put(`/users/${id}`, userData)

export const deleteUser = (id) => api.delete(`/users/${id}`)

// Auth API functions
export const login = (credentials) => api.post("/auth/login", credentials)

export const register = (userData) => api.post("/auth/register", userData)

export default api
