// src/admin/pages/AdminAppointments.jsx
import React, { useEffect, useState } from 'react';
import http from '../services/http';

export default function AdminAppointments(){
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true); setErr('');
    try {
      const res = await http.get('/admin/appointments', { params: status ? { status } : {} });
      setItems(Array.isArray(res.data) ? res.data : res.data?.items || []);
    } catch (e) {
      setErr(e?.response?.data?.detail || 'خطا در دریافت نوبت‌ها');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [status]);

  const removeItem = async (id) => {
    if (!window.confirm('حذف نوبت؟')) return;
    try {
      await http.delete(`/admin/appointments/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || 'خطا در حذف');
    }
  };

  return (
    <div>
      <h5 style={{ color:'#ffcc00' }}>نوبت‌ها</h5>
      <div className="d-flex gap-2 mt-2">
        <input className="form-control" style={{ maxWidth:240 }} placeholder="status (اختیاری)" value={status} onChange={e=>setStatus(e.target.value)} />
        <button className="btn btn-secondary" onClick={load}>بروزرسانی</button>
      </div>

      {loading ? <div className="mt-3">...</div> : err ? <div className="text-danger mt-3">{err}</div> : (
        <div className="table-responsive mt-3">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>داده</th>
                <th>اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a, idx)=>(
                <tr key={a.id ?? idx}>
                  <td>{a.id ?? idx+1}</td>
                  <td><code>{JSON.stringify(a)}</code></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(a.id)}>حذف</button></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="3" className="text-center">چیزی نیست</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
