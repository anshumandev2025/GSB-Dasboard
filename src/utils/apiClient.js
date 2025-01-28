import axios from "axios";

// Base URL for the API
export const baseURL = import.meta.env.VITE_BASE_URL; // Make sure VITE_BASE_URL is set in your .env file

// Create an Axios instance
const apiClient = axios.create({
  baseURL, // The base URL of your API
  timeout: 10000, // Timeout for requests (optional)
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or another secure place
    const token = localStorage.getItem("authToken"); // Replace with your token storage logic

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response; // Return the response if successful
  },
  (error) => {
    // Handle errors (e.g., token expiration, network errors)
    if (error.response?.status === 401) {
      console.error("Unauthorized: Token may have expired.");
      // Optionally, redirect to login or refresh the token
    }
    return Promise.reject(error);
  }
);

// Export reusable API methods
export const api = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  patch: (url, data) => apiClient.patch(url, data),
  delete: (url) => apiClient.delete(url),
};

export default apiClient;
