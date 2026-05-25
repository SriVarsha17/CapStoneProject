import axios from 'axios'

const envBaseUrl = import.meta.env.VITE_API_BASE_URL
const baseURL = envBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '')

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// Add Authorization header from localStorage token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
