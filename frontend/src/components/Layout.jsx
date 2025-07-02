import { useState } from "react";
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

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-layout d-flex flex-column flex-md-row position-relative">
      {/* نوار بالایی فقط برای موبایل */}
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
        className={`sidebar text-white p-3 ${
          sidebarOpen ? "d-flex" : "d-none"
        } d-md-flex flex-column`}
      >
        <div className="user-info text-center py-4">
          <img src="/user.jpg" alt="User" className="user-img mb-2" />
          <h6 className="mb-0">سنا صادقی</h6>
          <small className="text-yellow">دانشجو</small>
        </div>

        <nav className="nav-links d-flex flex-column text-end px-3 gap-3 mt-4">
          <NavItem to="/Dashboard" icon={faTachometerAlt} label="داشبورد" />
          <NavItem to="/planning" icon={faClock} label="برنامه ریزی" />
          <NavItem to="/resources" icon={faBook} label="منابع" />
          <NavItem to="/messages" icon={faComments} label="پیام رسانی" />
          <NavItem to="/Editprof" icon={faCog} label="تنظیمات پروفایل" />
          <NavItem to="/AdvisorSelector" icon={faUserTie} label="انتخاب مشاور" />
          <NavItem to="/payment" icon={faCreditCard} label="پرداخت" />
          <NavItem to="/logout" icon={faSignOutAlt} label="خروج" />
        </nav>

        <div className="logo text-center mt-auto pb-3">
          <img src="/logo.png" alt="رهپو" className="footer-logo" />
          <div className="fw-bold mt-2">رهپو</div>
        </div>
      </aside>

      {/* محتوای اصلی */}
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
