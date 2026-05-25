import axios from 'axios'

// Prefer env variable, fallback to correct URLs
const envBaseUrl = import.meta.env.VITE_API_BASE_URL

const baseURL =
  envBaseUrl ||
  (import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://capstoneproject-dl0j.onrender.com')

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api