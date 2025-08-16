

// src/admin/services/http.js
import axios from "axios";

const BASE_URL = (
  process.env.REACT_APP_API_URL ||       // ترجیحاً از این استفاده کن
  process.env.REACT_APP_API_BASE_URL ||  // اگر قبلاً اینو استفاده می‌کردی
  "https://nit-academic-counseling.liara.run" // fallback امن برای پروداکشن
).replace(/\/+$/, ""); // حذف / انتهایی

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,            // چون Bearer داریم
  timeout: 20000,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // اختیاری: اگر 401 بود، هدایت به لاگین/رفرش توکن
    // if (err?.response?.status === 401) { ... }
    return Promise.reject(err);
  }
);

export default http;
