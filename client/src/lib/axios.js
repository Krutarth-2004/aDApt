import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://adapt-4en0.onrender.com/api"
      : "/api",
  withCredentials: true,
});
