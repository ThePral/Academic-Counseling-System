// import { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   const fetchUser = async () => {
//     const token = localStorage.getItem("access_token");
//     const savedRole = localStorage.getItem("user_role");

//     if (!token || !savedRole) return;

//     setRole(savedRole);

//     try {
//       let endpoint = null;

//       if (savedRole === "student") {
//         endpoint = "/students/me/";
//       } else if (savedRole === "counselor") {
//         endpoint = "/counselors/me/";
//       } else {
//         console.warn("⛔ نقش ناشناخته:", savedRole);
//         return;
//       }

//       const res = await axiosInstance.get(endpoint);
//       setUser(res.data);
//     } catch (err) {
//       console.error("❌ خطا در دریافت اطلاعات کاربر:", err);
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, role, setUser, setRole, fetchUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);


// // src/components/UserContext.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import axiosInstance from "../axiosInstance";

// const UserContext = createContext(null);
// export const useUser = () => useContext(UserContext);

// // کمک: نقش را از JWT بخوانیم
// const getRoleFromToken = (token) => {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload?.role || null;
//   } catch {
//     return null;
//   }
// };

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(localStorage.getItem("user_role") || null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       const tokenRole = getRoleFromToken(token);
//       const storedRole = localStorage.getItem("user_role");
//       const finalRole = storedRole || tokenRole || role;

//       // ⛳️ اگر ادمین است: هیچ endpoint پروفایلی نزن
//       if (finalRole === "admin") {
//         setRole("admin");
//         setUser({
//           role: "admin",
//           email: localStorage.getItem("acs_admin_user") || "admin",
//         });
//         return; // مهم: خروج
//       }

//       // دانش‌آموز
//       try {
//         const s = await axiosInstance.get("/students/me/");
//         setRole("student");
//         setUser({ role: "student", ...s.data });
//         return;
//       } catch (e1) {
//         if (!e1.response || e1.response.status !== 404) throw e1;
//       }

//       // مشاور
//       try {
//         const c = await axiosInstance.get("/counselors/me/");
//         setRole("counselor");
//         setUser({ role: "counselor", ...c.data });
//         return;
//       } catch (e2) {
//         if (!e2.response || e2.response.status !== 404) throw e2;
//       }

//       // اگر هیچکدوم نبود
//       setUser(null);
//       setRole(null);
//       // این لاگ رو غیرفعال یا دوستانه کن
//       // console.warn("نقش نامشخص است.");
//     } catch (err) {
//       console.error("❌ خطا در دریافت اطلاعات کاربر:", err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [role]);

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   const value = { user, role, setRole, fetchUser, loading };
//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// };





// // src/components/UserContext.jsx
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import axiosInstance from "../axiosInstance";

// const UserContext = createContext(null);
// export const useUser = () => useContext(UserContext);

// // نقش را از JWT بخوانیم
// const getRoleFromToken = (token) => {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload?.role || null;
//   } catch {
//     return null;
//   }
// };

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(localStorage.getItem("user_role") || null);
//   const [loading, setLoading] = useState(true);

//   // جلوگیری از دوباره‌خوانی (StrictMode/ری‌ندرها)
//   const fetchedOnce = useRef(false);

//   const fetchUser = useCallback(async () => {
//     if (fetchedOnce.current) return;
//     fetchedOnce.current = true;

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setUser(null);
//         setRole(null);
//         return;
//       }

//       const storedRole = localStorage.getItem("user_role");
//       const tokenRole = getRoleFromToken(token);
//       const finalRole = storedRole || tokenRole || role || null;

//       // ادمین: پروفایل جداگانه نمی‌زنیم
//       if (finalRole === "admin") {
//         setRole("admin");
//         setUser({
//           role: "admin",
//           email: localStorage.getItem("acs_admin_user") || "admin",
//         });
//         return;
//       }

//       // helper: درخواست پروفایل با مدیریت ارورها
//       const getProfile = async (path, setRoleValue) => {
//         try {
//           const { data } = await axiosInstance.get(path);
//           setRole(setRoleValue);
//           localStorage.setItem("user_role", setRoleValue);
//           setUser({ role: setRoleValue, ...data });
//           return true;
//         } catch (err) {
//           const s = err?.response?.status;
//           // 401 → خروج از حساب
//           if (s === 401) {
//             localStorage.removeItem("access_token");
//             localStorage.removeItem("user_role");
//             setUser(null);
//             setRole(null);
//             throw err;
//           }
//           // 403/404 یعنی این نقش نیست → اجازه بده مسیر بعدی تست شود
//           if (s === 403 || s === 404) return false;
//           // بقیه ارورها واقعی‌اند
//           throw err;
//         }
//       };

//       // اگر نقش مشخص است، مستقیم به همان endpoint بزن؛ در صورت 403/404، مسیر دیگر را هم تست کن
//       if (finalRole === "student") {
//         const ok = await getProfile("/students/me/", "student");
//         if (!ok) await getProfile("/counselors/me/", "counselor");
//         return;
//       }
//       if (finalRole === "counselor") {
//         const ok = await getProfile("/counselors/me/", "counselor");
//         if (!ok) await getProfile("/students/me/", "student");
//         return;
//       }

//       // نقش نامشخص: به‌ترتیب امتحان کن (403/404 را نادیده بگیر)
//       const asStudent = await getProfile("/students/me/", "student");
//       if (asStudent) return;

//       const asCounselor = await getProfile("/counselors/me/", "counselor");
//       if (asCounselor) return;

//       // هیچ‌کدام نبود
//       setUser(null);
//       setRole(null);
//     } catch (err) {
//       console.error("❌ خطا در دریافت اطلاعات کاربر:", err);
//       // وضعیت نهایی
//       setUser(null);
//       // role را پاک نکن مگر 401 (بالا هندل شد)
//     } finally {
//       setLoading(false);
//     }
//   }, []); // وابستگی خالی تا پایدار بماند

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   const value = { user, role, setRole, fetchUser, loading };
//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// };


// src/components/UserContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axiosInstance from "../axiosInstance";

window.axiosInstance = axiosInstance;
const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

// decode base64url safely
const b64urlDecode = (str) => {
  try {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (str.length % 4)) % 4;
    if (padLen) str += "=".repeat(padLen);
    return atob(str);
  } catch { return null; }
};


// نقش را از JWT بخوانیم
const getRoleFromToken = (token) => {
  try {
    const payloadStr = token?.split(".")?.[1] || "";
    const json = b64urlDecode(payloadStr);
    if (!json) return null;
    const payload = JSON.parse(json);
    return payload?.role || null;
  } catch {
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("user_role") || null);
  const [loading, setLoading] = useState(true);

  // جلوگیری از دوباره‌خوانی (StrictMode/ری‌ندرها)
  const fetchedOnce = useRef(false);
  const lastTokenRef = useRef(localStorage.getItem("access_token") || null);

  const fetchUser = useCallback(async () => {
    // اگر توکن عوض شده، اجازه بده دوباره fetch کنیم
    const currentToken = localStorage.getItem("access_token") || null;
    if (currentToken !== lastTokenRef.current) {
      lastTokenRef.current = currentToken;
      fetchedOnce.current = false;
    }

    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    // 🔎 دیباگ: مطمئن شو baseURL درست است
    // در اولین بار، لاگ بگیر
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
    }

    setLoading(true);
    try {
      const token = currentToken;
      if (!token) {
        setUser(null);
        setRole(null);
        return;
      }

      const storedRole = localStorage.getItem("user_role");
      const tokenRole = getRoleFromToken(token);
      const finalRole = storedRole || tokenRole || role || null;

      // ادمین: پروفایل جداگانه نمی‌زنیم
      if (finalRole === "admin") {
        setRole("admin");
        setUser({
          role: "admin",
          email: localStorage.getItem("acs_admin_user") || "admin",
        });
        return;
      }

      // helper: درخواست پروفایل با مدیریت ارورها
      const getProfile = async (path, setRoleValue) => {
        try {
          const { data } = await axiosInstance.get(path);
          setRole(setRoleValue);
          localStorage.setItem("user_role", setRoleValue);
          setUser({ role: setRoleValue, ...data });
          return true;
        } catch (err) {
          const s = err?.response?.status;
          if (s === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_role");
            setUser(null);
            setRole(null);
            throw err;
          }
          if (s === 403 || s === 404) return false;
          throw err;
        }
      };

      if (finalRole === "student") {
        const ok = await getProfile("/students/me/", "student");
        if (!ok) await getProfile("/counselors/me/", "counselor");
        return;
      }
      if (finalRole === "counselor") {
        const ok = await getProfile("/counselors/me/", "counselor");
        if (!ok) await getProfile("/students/me/", "student");
        return;
      }

      // نقش نامشخص: به‌ترتیب امتحان کن
      const asStudent = await getProfile("/students/me/", "student");
      if (asStudent) return;
      const asCounselor = await getProfile("/counselors/me/", "counselor");
      if (asCounselor) return;

      setUser(null);
      setRole(null);
    } catch (err) {
      console.error("❌ خطا در دریافت اطلاعات کاربر:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = { user, role, setRole, fetchUser, loading };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
