// src/admin/pages/AdminStudyPlans.jsx
import React, { useEffect, useState } from 'react';
import http from '../services/http';

export default function AdminStudyPlans(){
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true); setErr('');
    try {
      const res = await http.get('/admin/study-plans', { params: status ? { status } : {} });
      setItems(Array.isArray(res.data) ? res.data : res.data?.items || []);
    } catch (e) {
      setErr(e?.response?.data?.detail || 'خطا در دریافت برنامه‌ها');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [status]);

  return (
    <div>
      <h5 style={{ color:'#ffcc00' }}>برنامه‌های مطالعه</h5>
      <div className="d-flex gap-2 mt-2">
        <input className="form-control" style={{ maxWidth:240 }} placeholder="status (اختیاری)" value={status} onChange={e=>setStatus(e.target.value)} />
        <button className="btn btn-secondary" onClick={load}>بروزرسانی</button>
      </div>

      {loading ? <div className="mt-3">...</div> : err ? <div className="text-danger mt-3">{err}</div> : (
        <pre className="mt-3 bg-dark text-light p-3 rounded" style={{ maxHeight:400, overflow:'auto' }}>
{JSON.stringify(items, null, 2)}
        </pre>
      )}
    </div>
  );
}
