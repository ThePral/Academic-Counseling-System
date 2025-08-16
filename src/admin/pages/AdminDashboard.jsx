// src/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import http from '../services/http';
import './AdminDashboard.css';


export default function AdminDashboard(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await http.get('/admin/dashboard');
        if (!cancel) setData(res.data);
      } catch (e) {
        setErr(e?.response?.data?.detail || 'خطا در دریافت داشبورد');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (err) return <div className="text-danger">{err}</div>;

  return (
    <div>
      <h4 style={{ color:'#ffcc00' }}>داشبورد ادمین</h4>
      <div className="row g-3 mt-2">
        <div className="col-12 col-md-4">
          <div className="card p-3 bg-dark border-secondary text-light">
            <div>کاربران فعال</div>
            <h3 className="mt-2">{data?.active_users ?? '-'}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card p-3 bg-dark border-secondary text-light">
            <div>نوبت‌های انجام‌شده هفته قبل</div>
            <h3 className="mt-2">{data?.done_appointments_last_week ?? '-'}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card p-3 bg-dark border-secondary text-light">
            <div>برترین مشاورها</div>
            <ul className="mt-2 mb-0">
              {(data?.top_counselors || []).map((c,i)=>(
                <li key={i}>{c.firstname} {c.lastname} – {c.session_count}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
