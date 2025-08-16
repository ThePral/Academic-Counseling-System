// import React from "react";
// import "./style/Dashboard.css";
// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   return (
//     <div className="dashboard-page d-flex flex-column align-items-center gap-4">
//       <Link to="/planning" className="dashboard-btn">
//         برنامه‌ریزی‌ها
//       </Link>
//       <Link to="/payment" className="dashboard-btn">
//         پرداخت‌ها
//       </Link>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance";
// import "./style/Dashboard.css"; // فرض بر اینکه این فایل مشابه استایل‌های قبلی باشه

// export default function NotificationsPanel() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user")); // گرفتن user_id

//   useEffect(() => {
//     if (user?.userid) {
//       fetchNotifications();
//     }
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await axiosInstance.get(`/notifications/${user.userid}`);
//       setNotifications(res.data.reverse()); // جدیدها بالا
//     } catch (err) {
//       console.error("خطا در دریافت نوتیفیکیشن‌ها:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="notifications-panel dark-mode">
//       <h3>📩 اعلان‌ها</h3>
//       {loading ? (
//         <p>در حال بارگذاری...</p>
//       ) : notifications.length === 0 ? (
//         <p>اعلانی برای نمایش وجود ندارد.</p>
//       ) : (
//         <ul className="notification-list">
//           {notifications.map((n) => (
//             <li key={n.id} className={`notification-item ${n.read ? "read" : "unread"}`}>
//               <span>{n.message}</span>
//               <span className="timestamp">
//                 {new Date(n.created_at).toLocaleString("fa-IR")}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// src/components/Dashboard.jsx
import React from "react";
import "./style/Dashboard.css";
import NotificationsPanel from "./NotificationsPanel";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        {/* سایر کارت‌های داشبوردت */}
        <div className="dashboard-card">
          <h3>سلام! 👋</h3>
          <p>به داشبورد خوش آمدی.</p>
        </div>

        {/* پنل اعلان‌ها */}
        <NotificationsPanel />
      </div>
    </div>
  );
}
