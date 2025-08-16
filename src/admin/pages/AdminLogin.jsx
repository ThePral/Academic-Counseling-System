// src/admin/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../auth/AdminAuthContext';

const Inner = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { isAdmin, loginAsAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'admin@example.com';

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminPassword = 'Zahra@!?1234';

    if (
        email.trim().toLowerCase() === adminEmail.toLowerCase() &&
        pass === adminPassword
    ) {
        loginAsAdmin(email);
        navigate('/admin/dashboard', { replace: true });
    } else {
        alert('ایمیل یا پسوورد ادمین نادرست است.');
    }
  };

  return (
    <div className="container" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#121212' }}>
      <div className="card p-4" style={{ maxWidth:420, width:'100%', background:'#1e1e1e', color:'#fff', border:'1px solid #333' }}>
        <h5 className="mb-3" style={{ color:'#ffcc00' }}>ورود ادمین</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ایمیل ادمین</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder={adminEmail} />
          </div>
          <div className="mb-4">
            <label className="form-label">رمزعبور</label>
            <input type="password" className="form-control" value={pass} onChange={e=>setPass(e.target.value)} />
          </div>
          <button className="btn w-100" style={{ background:'#ffcc00' }}>ورود</button>
        </form>
      </div>
    </div>
  );
};

export default function AdminLogin(){
  return (
    <AdminAuthProvider>
      <Inner />
    </AdminAuthProvider>
  );
}
