import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // اگر توکن نباشه، ادمین نیست
    const token = localStorage.getItem("access_token");
    // اگر فلگ قبلی‌ت هم هست، نگه می‌داریم تا چیزی نشکنه
    const adminFlag = localStorage.getItem("acs_admin_user");
    setIsAdmin(!!token && !!adminFlag);
  }, []);

  // وقتی لاگین ادمین می‌کنی، هم فلگ رو بزن هم (در جای دیگه) توکن رو ذخیره کن
  const loginAsAdmin = (email) => {
    localStorage.setItem("acs_admin_user", email || "admin");
    // توجه: ذخیره‌ی توکن باید بعد از لاگینِ واقعی API انجام بشه:
    // localStorage.setItem("access_token", tokenFromAPI)
    const hasToken = !!localStorage.getItem("access_token");
    setIsAdmin(hasToken); // فقط وقتی با توکن همراه باشه، ادمین میشه
  };

  const logoutAdmin = () => {
    localStorage.removeItem("acs_admin_user");
    localStorage.removeItem("access_token"); // هم‌زمان توکن رو هم بردار
    setIsAdmin(false);
  };

  const value = useMemo(() => ({ isAdmin, loginAsAdmin, logoutAdmin }), [isAdmin]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => useContext(AdminAuthContext);
