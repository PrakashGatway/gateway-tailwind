import axios from "axios";

let mode = "devppppp"

export const serverInstance = axios.create({
    baseURL: mode == "dev" ? "http://localhost:5000/api/v1/" : "https://uat.gatewayabroadeducations.com/api/v1/",
    timeout: 60000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

export const baseUrl = mode == "dev" ? "http://localhost:5000" : "https://uat.gatewayabroadeducations.com";

const axiosInstance = axios.create({
    baseURL: mode == "dev" ? "http://localhost:5000/api/v1/" : "https://uat.gatewayabroadeducations.com/api/v1/",
    timeout: 60000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken") || null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem("accessToken");
                // window.location.href = "/auth";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
