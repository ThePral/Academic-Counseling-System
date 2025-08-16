import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  faTachometerAlt,
  faClock,
  faBook,
  faComments,
  faCog,
  faUserTie,
  faCreditCard,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style/Layout.css";
import { useUser } from './UserContext';
import { useNavigate } from "react-router-dom";




export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // const user = useUser();
  const { user, role } = useUser();


  const navigate = useNavigate();


  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // در صورت unmount
    };
  }, [sidebarOpen]);


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/");
  };




  return (
    <div className="app-layout d-flex flex-column flex-md-row position-relative">
      {/* نوار برای موبایل */}
      <div className="d-md-none bg-primary text-white p-2 d-flex justify-content-between align-items-center">
        <button className="btn btn-light" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <span className="fw-bold">رهپو</span>
      </div>

      {/* بک‌دراپ موبایل */}
      {sidebarOpen && (
        <div className="mobile-backdrop d-md-none" onClick={toggleSidebar}></div>
      )}

      {/* سایدبار */}
      <aside
        className={`sidebar text-white p-3 ${sidebarOpen ? "d-flex" : "d-none"
          } d-md-flex flex-column`}
      >

        {user && (
          <div className="user-box">
            <div className="avatar-border">
              <img
                src={user.profile_image_url}
                alt="عکس پروفایل"
                className="avatar-img"
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
          <NavItem to="/Dashboard" icon={faTachometerAlt} label="داشبورد" />
          <NavItem to="/Planning" icon={faClock} label="برنامه ریزی" />
          <NavItem to="/StudentRecommendations" icon={faBook} label="منابع" />
          <NavItem to="/Messages" icon={faComments} label="پیام رسانی" />
          <NavItem to="/Editprof" icon={faCog} label="تنظیمات پروفایل" />
          <NavItem to="/AdvisorSelector" icon={faUserTie} label="انتخاب مشاور" />
          <NavItem to="/Payment" icon={faCreditCard} label="پرداخت" />
          {/* <NavItem to="/logout" icon={faSignOutAlt} label="خروج" /> */}
          <button
            className="nav-link d-flex align-items-center gap-2 bg-transparent border-0 text-start"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>خروج</span>
          </button>

        </nav>

        <div className="logo text-center mt-auto pb-3">
          <img src="/rahpoo-logo.png" alt="رهپو" className="footer-logo logo" />
          {/* <div className="fw-bold mt-2">رهپو</div> */}
        </div>
      </aside>

      <main className="main-content flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
      }
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </NavLink>
  );
}
