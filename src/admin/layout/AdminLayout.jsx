// src/admin/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
  sidebar: { minHeight: '100vh', backgroundColor: '#0d0d0d' },
  brand: { color: '#ffcc00' },
  link: ({ isActive }) => ({
    display: 'block',
    padding: '0.75rem 1rem',
    color: isActive ? '#0d0d0d' : '#f0f0f0',
    background: isActive ? '#ffcc00' : 'transparent',
    textDecoration: 'none',
    borderRadius: '8px',
    marginBottom: '6px'
  })
};

export default function AdminLayout() {
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 col-lg-2 p-3" style={styles.sidebar}>
          <h5 className="mb-4" style={styles.brand}>ACS Admin</h5>

          <NavLink to="/admin/dashboard" style={styles.link}>داشبورد</NavLink>
          <NavLink to="/admin/users" style={styles.link}>کاربران</NavLink>
          <NavLink to="/admin/study-plans" style={styles.link}>برنامه‌های مطالعه</NavLink>
          <NavLink to="/admin/appointments" style={styles.link}>نوبت‌ها</NavLink>

          <hr className="border-secondary" />
          <button className="btn btn-sm" style={{ background:'#ffcc00' }} onClick={handleLogout}>
            خروج
          </button>
        </aside>

        {/* Content */}
        <main className="col-12 col-md-9 col-lg-10 p-4" style={{ background:'#121212', minHeight:'100vh', color:'#f5f5f5' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
