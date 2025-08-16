// src/admin/pages/users/AdminUsersList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../services/http';

export default function AdminUsersList(){
  const [items, setItems] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await http.get('/admin/users', { params: role ? { role } : {} });
      setItems(Array.isArray(res.data) ? res.data : res.data?.items || []);
    } catch (e) {
      setErr(e?.response?.data?.detail || 'خطا در دریافت کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [role]);

  const removeUser = async (id) => {
    if (!window.confirm('حذف کاربر قطعی است؟')) return;
    try {
      await http.delete(`/admin/users/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || 'خطا در حذف');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h5 style={{ color:'#ffcc00' }}>کاربران</h5>
        <Link to="/admin/users/new" className="btn btn-sm" style={{ background:'#ffcc00' }}>
          کاربر جدید
        </Link>
      </div>

      <div className="mt-3 d-flex gap-2">
        <select className="form-select" style={{ maxWidth:220 }} value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">همه نقش‌ها</option>
          <option value="student">student</option>
          <option value="counselor">counselor</option>
          <option value="admin">admin</option>
        </select>
        <button className="btn btn-secondary" onClick={load}>بروزرسانی</button>
      </div>

      {loading ? <div className="mt-3">در حال بارگذاری...</div> : err ? (
        <div className="mt-3 text-danger">{err}</div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>نام</th>
                <th>ایمیل</th>
                <th>نقش</th>
                <th style={{ width:160 }}>اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u, idx) => (
                <tr key={u.userid ?? idx}>
                  <td>{u.userid ?? idx+1}</td>
                  <td>{u.firstname} {u.lastname}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <Link to={`/admin/users/${u.userid}`} className="btn btn-sm btn-outline-warning me-2">ویرایش</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>removeUser(u.userid)}>حذف</button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan="5" className="text-center">داده‌ای یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
