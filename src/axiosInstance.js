// // src/axiosInstance.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL, // از ENV می‌خونه
//   headers: { "Content-Type": "application/json" }
// });

// // اینترسپتور برای اضافه کردن توکن
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token"); // فقط این کلید رو همه‌جا استفاده کن
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;


// import axios from "axios";

// // CRA:
// const BASE_URL = process.env.REACT_APP_API_URL
//   // Vite:
//   || import.meta?.env?.VITE_API_URL
//   // fallback (اختیاری):
//   || "https://nit-academic-counseling.liara.run";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL.replace(/\/+$/, ""), // انتهای / اضافه نباشه
//   withCredentials: false, // اگه کوکی/سشن لازم داری، true کن و CORS رو مطابقش تنظیم کن
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token") || localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   config.headers.Accept = "application/json";
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // هندل 401 (اختیاری)
//     // if (err?.response?.status === 401) { ... }
//     return Promise.reject(err);
//   }
// );

// export default axiosInstance;


// import axios from "axios";

// const BASE_URL = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, ""); // حذف / انتهایی

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: false, // چون Bearer Token داری، نیاز به کوکی نیست
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token") || localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   config.headers.Accept = "application/json";
//   return config;
// });

// export default axiosInstance;


import axios from "axios";

const BASE_URL = (process.env.REACT_APP_API_URL || "https://nit-academic-counseling.liara.run")
  .replace(/\/+$/, ""); // حذف / انتهایی

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: { Accept: "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default axiosInstance;
