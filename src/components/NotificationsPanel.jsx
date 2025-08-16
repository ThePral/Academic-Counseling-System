// import React, { useEffect, useMemo, useState } from "react";
// import axiosInstance from "../axiosInstance";
// import "./style/Notifications.css";
// import { useUser } from "./UserContext";

// function decodeJwtSub(token) {
//   try {
//     const [, payload] = token.split(".");
//     if (!payload) return null;
//     const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
//     return json?.sub ? Number(json.sub) : null;
//   } catch {
//     return null;
//   }
// }

// export default function NotificationsPanel() {
//   const { user } = useUser(); // توقع: { userid, firstname, ... } اگر در Context ذخیره شده باشد
//   const [userId, setUserId] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(new Set());
//   const [error, setError] = useState("");

//   // سعی برای استخراج user_id
//   useEffect(() => {
//     const resolveUserId = async () => {
//       try {
//         // 1) از Context
//         if (user?.userid) {
//           setUserId(Number(user.userid));
//           return;
//         }
//         // 2) از localStorage
//         const lsUserRaw = localStorage.getItem("user");
//         if (lsUserRaw) {
//           const lsUser = JSON.parse(lsUserRaw);
//           if (lsUser?.userid) {
//             setUserId(Number(lsUser.userid));
//             return;
//           }
//         }
//         // 3) از access_token (JWT sub)
//         const access = localStorage.getItem("access_token");
//         if (access) {
//           const sub = decodeJwtSub(access);
//           if (sub) {
//             setUserId(Number(sub));
//             return;
//           }
//         }

//         throw new Error("شناسه کاربر پیدا نشد");
//       } catch (e) {
//         console.error(e);
//         setError("برای مشاهده اعلان‌ها ابتدا وارد حساب کاربری شوید.");
//         setLoading(false);
//       }
//     };
//     resolveUserId();
//   }, [user]);

//   // گرفتن لیست نوتیف‌ها
//   useEffect(() => {
//     if (!userId) return;
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosInstance.get(`/notifications/${userId}`);
//         setItems(Array.isArray(res.data) ? res.data : []);
//       } catch (e) {
//         console.error(e);
//         setError("خطا در دریافت اعلان‌ها");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId]);

//   const addBusy = (id) => {
//     const s = new Set(busy);
//     s.add(id);
//     setBusy(s);
//   };
//   const removeBusy = (id) => {
//     const s = new Set(busy);
//     s.delete(id);
//     setBusy(s);
//   };
//   const isBusy = useMemo(() => (id) => busy.has(id), [busy]);

//   const markRead = async (id) => {
//     try {
//       addBusy(id);
//       await axiosInstance.patch(`/notifications/${id}/read`);
//       setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
//     } catch (e) {
//       console.error(e);
//       alert("خطا در خوانده‌شدن اعلان");
//     } finally {
//       removeBusy(id);
//     }
//   };

//   const remove = async (id) => {
//     try {
//       addBusy(id);
//       await axiosInstance.delete(`/notifications/${id}`);
//       setItems((prev) => prev.filter((n) => n.id !== id));
//     } catch (e) {
//       console.error(e);
//       alert("خطا در حذف اعلان");
//     } finally {
//       removeBusy(id);
//     }
//   };

//   if (loading) return <div className="notif-widget"><p className="muted">در حال بارگذاری اعلان‌ها...</p></div>;
//   if (error) return <div className="notif-widget"><p className="muted">{error}</p></div>;

//   return (
//     <div className="notif-widget">
//       <div className="notif-header">
//         <h3>اعلان‌ها</h3>
//         <span className="badge">{items.filter(i => !i.read).length}</span>
//       </div>

//       {items.length === 0 ? (
//         <p className="muted">اعلان جدیدی ندارید.</p>
//       ) : (
//         <ul className="notif-list">
//           {items.map((n) => (
//             <li key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`}>
//               <div className="notif-main">
//                 <div className="notif-message">{n.message}</div>
//                 <div className="notif-time">
//                   {new Date(n.created_at).toLocaleString("fa-IR")}
//                 </div>
//               </div>
//               <div className="notif-actions">
//                 {!n.read && (
//                   <button
//                     className="btn btn-sm ghost"
//                     onClick={() => markRead(n.id)}
//                     disabled={isBusy(n.id)}
//                   >
//                     {isBusy(n.id) ? "..." : "خواندم"}
//                   </button>
//                 )}
//                 <button
//                   className="btn btn-sm danger"
//                   onClick={() => remove(n.id)}
//                   disabled={isBusy(n.id)}
//                 >
//                   {isBusy(n.id) ? "..." : "حذف"}
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// src/components/NotificationsPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosInstance";
import "./style/Notifications.css";
import { useUser } from "./UserContext";

function decodeJwtSub(token) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json?.sub ? Number(json.sub) : null;
  } catch {
    return null;
  }
}

export default function NotificationsPanel() {
  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(new Set());
  const [error, setError] = useState("");

  // استخراج userId
  useEffect(() => {
    const resolve = () => {
      // 1) از Context
      if (user?.userid) {
        setUserId(Number(user.userid));
        return;
      }
      // 2) از localStorage
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.userid) {
            setUserId(Number(parsed.userid));
            return;
          }
        } catch {}
      }
      // 3) از access_token (JWT sub)
      const access = localStorage.getItem("access_token");
      if (access) {
        const sub = decodeJwtSub(access);
        if (sub) {
          setUserId(Number(sub));
          return;
        }
      }
      setError("برای مشاهده اعلان‌ها ابتدا وارد حساب کاربری شوید.");
      setLoading(false);
    };
    resolve();
  }, [user]);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/notifications/${userId}`);
      const list = Array.isArray(res.data) ? res.data : [];
      // جدیدها بالاتر
      setItems([...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (e) {
      console.error(e);
      setError("خطا در دریافت اعلان‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // اگر خواستی پولینگ ۳۰ ثانیه‌ای:
    // const t = setInterval(fetchNotifications, 30000);
    // return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addBusy = (id) => setBusy((s) => new Set(s).add(id));
  const removeBusy = (id) =>
    setBusy((s) => {
      const c = new Set(s);
      c.delete(id);
      return c;
    });
  const isBusy = useMemo(() => (id) => busy.has(id), [busy]);

  const markRead = async (id) => {
    try {
      addBusy(id);
      await axiosInstance.patch(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error(e);
      alert("خطا در خوانده‌شدن اعلان");
    } finally {
      removeBusy(id);
    }
  };

  const remove = async (id) => {
    try {
      addBusy(id);
      await axiosInstance.delete(`/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error(e);
      alert("خطا در حذف اعلان");
    } finally {
      removeBusy(id);
    }
  };

  return (
    <div className="notif-widget">
      <div className="notif-header">
        <h3>📩 اعلان‌ها</h3>
        <div className="notif-header-actions">
          <span className="badge">{items.filter((i) => !i.read).length}</span>
          <button className="btn btn-sm ghost" onClick={fetchNotifications} disabled={loading}>
            {loading ? "..." : "تازه‌سازی"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="muted">در حال بارگذاری...</p>
      ) : error ? (
        <p className="muted">{error}</p>
      ) : items.length === 0 ? (
        <p className="muted">اعلان جدیدی ندارید.</p>
      ) : (
        <ul className="notif-list">
          {items.map((n) => (
            <li key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`}>
              <div className="notif-main">
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">
                  {new Date(n.created_at).toLocaleString("fa-IR")}
                </div>
              </div>
              <div className="notif-actions">
                {!n.read && (
                  <button
                    className="btn btn-sm ghost"
                    onClick={() => markRead(n.id)}
                    disabled={isBusy(n.id)}
                  >
                    {isBusy(n.id) ? "..." : "خواندم"}
                  </button>
                )}
                <button
                  className="btn btn-sm danger"
                  onClick={() => remove(n.id)}
                  disabled={isBusy(n.id)}
                >
                  {isBusy(n.id) ? "..." : "حذف"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
