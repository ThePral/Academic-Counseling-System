// src/admin/pages/counselors/AdminCounselorGrades.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../../services/http';

export default function AdminCounselorGrades(){
  const { id } = useParams();
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [err,setErr] = useState('');

  useEffect(()=>{
    let cancel=false;
    (async()=>{
      try{
        const res = await http.get(`/admin/counselors/${id}/grades`);
        if(!cancel) setItems(Array.isArray(res.data)? res.data : []);
      }catch(e){ setErr(e?.response?.data?.detail || 'خطا'); }
      finally{ if(!cancel) setLoading(false); }
    })();
    return ()=>{ cancel=true; }
  },[id]);

  if (loading) return '...';
  if (err) return <div className="text-danger">{err}</div>;
  return (
    <div>
      <h5 style={{ color:'#ffcc00' }}>نمره‌های دانشجویان مشاور #{id}</h5>
      <div className="table-responsive mt-3">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>نام</th>
              <th>نام‌خانوادگی</th>
              <th>امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s,idx)=>(
              <tr key={idx}>
                <td>{s.firstname}</td>
                <td>{s.lastname}</td>
                <td>{s.score}</td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="3" className="text-center">داده‌ای نیست</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
