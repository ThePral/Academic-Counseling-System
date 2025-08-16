// // src/components/AdvisorLayout.jsx
// import { useState } from "react";
// import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
// import {
//   faTachometerAlt,
//   faClock,
//   faCog,
//   faCreditCard,
//   faSignOutAlt,
//   faBars,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "./style/AdvisorLayout.css";
// import { useUser } from "./UserContext";

// export default function AdvisorLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, role } = useUser();

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };


//   // useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

//   return (
//     <div className="app-layout d-flex flex-column flex-md-row position-relative">
//       {/* نوار موبایل */}
//       <div className="d-md-none bg-primary text-white p-2 d-flex justify-content-between align-items-center">
//         <button className="btn btn-light" onClick={toggleSidebar}>
//           <FontAwesomeIcon icon={faBars} />
//         </button>
//       </div>

//       {/* بک‌دراپ موبایل */}
//       {sidebarOpen && (
//         <div className="mobile-backdrop d-md-none" onClick={toggleSidebar} />
//       )}

//       {/* سایدبار */}
//       <aside
//         className={`sidebar text-white p-3 ${
//           sidebarOpen ? "d-flex" : "d-none"
//         } d-md-flex flex-column`}
//       >
//         {user && (
//           <div className="user-box">
//             <div className="avatar-border">
//               <img
//                 src={user.profile_image_url || "/placeholder-avatar.png"}
//                 alt="عکس پروفایل"
//                 className="avatar-img"
//                 onError={(e) => {
//                   e.currentTarget.src = "/placeholder-avatar.png";
//                 }}
//               />
//             </div>
//             <div className="user-name">
//               {user.firstname} {user.lastname}
//               <div className="user-role">
//                 {role === "student" ? "دانش‌آموز" : "مشاور"}
//               </div>
//             </div>
//           </div>
//         )}

//         <nav className="nav-links d-flex flex-column text-end px-3 gap-3 mt-4">
//           <NavItem to="AdvisorDashboard" icon={faTachometerAlt} label="داشبورد" onNavigate={() => setSidebarOpen(false)} />
//           <NavItem to="AdvisorEditprof" icon={faCog} label="تنظیمات پروفایل" onNavigate={() => setSidebarOpen(false)} />
//           <NavItem to="MyStudents" icon={faCreditCard} label="دانش‌آموز‌های من" onNavigate={() => setSidebarOpen(false)} />
//           <NavItem to="SetTimes" icon={faClock} label="تنظیم زمان‌های مشاوره" onNavigate={() => setSidebarOpen(false)} />

//           <button
//             className="nav-link d-flex align-items-center gap-2 bg-transparent border-0 text-start"
//             onClick={handleLogout}
//           >
//             <FontAwesomeIcon icon={faSignOutAlt} />
//             <span>خروج</span>
//           </button>
//         </nav>

//         <div className="logo text-center mt-auto pb-3">
//           <img src="/rahpoo-logo.png" alt="رهپو" className="footer-logo" />
//         </div>
//       </aside>

//       <main className="main-content flex-grow-1 p-4">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// function NavItem({ to, icon, label, onNavigate }) {
//   return (
//     <NavLink
//       to={to} 
//       className={({ isActive }) =>
//         `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
//       }
//       onClick={onNavigate}
//       end
//     >
//       <FontAwesomeIcon icon={icon} />
//       <span>{label}</span>
//     </NavLink>
//   );
// }


// src/components/AdvisorLayout.jsx
import { useState, useMemo } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  faTachometerAlt,
  faClock,
  faCog,
  faCreditCard,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style/AdvisorLayout.css";
import { useUser } from "./UserContext";

const API_BASE   = process.env.REACT_APP_API_BASE_URL   || "";
const FILES_BASE = process.env.REACT_APP_FILES_BASE_URL || API_BASE;

function toAbsoluteUrl(raw) {
  if (!raw) return "/placeholder-avatar.png";
  let u = String(raw).trim();

  // اصلاح URLهای ناقص
  if (u.startsWith("https//")) u = u.replace(/^https\/\//i, "https://");
  if (u.startsWith("http//"))  u = u.replace(/^http\/\//i, "http://");

  // اگر مطلق بود، همونو بده
  if (/^https?:\/\//i.test(u)) return u;

  // در غیر این صورت، به BASE مناسب بچسبان
  return `${FILES_BASE}${u.startsWith("/") ? u : `/${u}`}`;
}

export default function AdvisorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useUser();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // اگر تصویر پروفایل نسبی بود، کاملش کن
  // const avatarSrc = useMemo(() => {
  //   const raw = user?.profile_image_url;
  //   if (!raw) return "/placeholder-avatar.png"; // از public سرو می‌شود
  //   if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  //   return `${API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
  // }, [user?.profile_image_url]);

  const avatarSrc = useMemo(() => toAbsoluteUrl(user?.profile_image_url), [user?.profile_image_url]);


  return (
    <div className="app-layout d-flex flex-column flex-md-row position-relative">
      {/* نوار موبایل */}
      <div className="d-md-none bg-primary text-white p-2 d-flex justify-content-between align-items-center">
        <button className="btn btn-light" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* بک‌دراپ موبایل */}
      {sidebarOpen && (
        <div className="mobile-backdrop d-md-none" onClick={toggleSidebar} />
      )}

      {/* سایدبار */}
      <aside
        className={`sidebar text-white p-3 ${sidebarOpen ? "d-flex" : "d-none"} d-md-flex flex-column`}
      >
        {user && (
          <div className="user-box">
            <div className="avatar-border">
             <img
            //  src={user?.profile_image_url || "/placeholder-avatar.png"}
              src={avatarSrc}
              alt="عکس پروفایل"
              className="avatar-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />


            </div>
            <div className="user-name">
              {user.firstname} {user.lastname}
              <div className="user-role">
                {role === "student" ? "دانش‌آموز" : "مشاور"}
              </div>
            </div>
          </div>
        )}

        <nav className="nav-links d-flex flex-column text-end px-3 gap-3 mt-4">
          <NavItem to="AdvisorDashboard" icon={faTachometerAlt} label="داشبورد" onNavigate={() => setSidebarOpen(false)} />
          <NavItem to="AdvisorEditprof" icon={faCog} label="تنظیمات پروفایل" onNavigate={() => setSidebarOpen(false)} />
          <NavItem to="MyStudents" icon={faCreditCard} label="دانش‌آموز‌های من" onNavigate={() => setSidebarOpen(false)} />
          <NavItem to="SetTimes" icon={faClock} label="تنظیم زمان‌های مشاوره" onNavigate={() => setSidebarOpen(false)} />

          <button className="nav-link d-flex align-items-center gap-2 bg-transparent border-0 text-start" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>خروج</span>
          </button>
        </nav>

        <div className="logo text-center mt-auto pb-3">
          <img src="/rahpoo-logo.png" alt="رهپو" className="footer-logo" />
        </div>
      </aside>

      <main className="main-content flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
      }
      onClick={onNavigate}
      end
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </NavLink>
  );
}
