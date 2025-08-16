// src/admin/pages/users/AdminUserForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../services/http';

export default function AdminUserForm({ mode='create' }){
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', password: '', role: 'student'
  });
  const [loading, setLoading] = useState(false);

  const isEdit = mode === 'edit';

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        // فرض: /admin/users لیست بر می‌گردونه؛ برای نمونه ساده از لیست می‌گیریم
        const res = await http.get('/admin/users');
        const found = (Array.isArray(res.data) ? res.data : res.data?.items || []).find(u=>String(u.userid)===String(id));
        if (found) {
          setForm({
            firstname: found.firstname || '',
            lastname:  found.lastname  || '',
            email:     found.email     || '',
            password:  '',
            role:      found.role      || 'student',
          });
        }
      } finally { setLoading(false); }
    };
    load();
  }, [isEdit, id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await http.put(`/admin/users/${id}`, {
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email
        });
      } else {
        await http.post('/admin/users', form);
      }
      navigate('/admin/users', { replace: true });
    } catch (e) {
      alert(e?.response?.data?.detail || 'خطا در ثبت');
    }
  };

  return (
    <div>
      <h5 style={{ color:'#ffcc00' }}>{isEdit ? 'ویرایش کاربر' : 'کاربر جدید'}</h5>
      {loading ? '...' : (
        <form className="row g-3 mt-1" onSubmit={submit}>
          <div className="col-md-6">
            <label className="form-label">نام</label>
            <input className="form-control" value={form.firstname} onChange={e=>setForm({...form, firstname:e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">نام‌خانوادگی</label>
            <input className="form-control" value={form.lastname} onChange={e=>setForm({...form, lastname:e.target.value})} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">ایمیل</label>
            <input type="email" className="form-control" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </div>
          {!isEdit && (
            <>
              <div className="col-md-6">
                <label className="form-label">رمزعبور</label>
                <input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">نقش</label>
                <select className="form-select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
                  <option value="student">student</option>
                  <option value="counselor">counselor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </>
          )}
          <div className="col-12">
            <button className="btn" style={{ background:'#ffcc00' }}>{isEdit ? 'ذخیره' : 'ایجاد'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
