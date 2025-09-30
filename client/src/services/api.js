import axios from "axios";

const API_URL = "http://localhost:5000/api/";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post("/users/register", userData),
  login: (userData) => api.post("/users/login", userData),
};

// Design endpoints
export const designAPI = {
  getAll: () => api.get("/designs"),
  getById: (id) => api.get(`/designs/${id}`),
  create: (designData) => api.post("/designs", designData),
  update: (id, designData) => api.put(`/designs/${id}`, designData),
  delete: (id) => api.delete(`/designs/${id}`),
  duplicate: (id) => api.post(`/designs/${id}/duplicate`),
};

export default api;
