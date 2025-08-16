// src/admin/pages/counselors/AdminCounselorStudents.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../../services/http';

export default function AdminCounselorStudents(){
  const { id } = useParams();
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [err,setErr] = useState('');

  useEffect(()=>{
    let cancel=false;
    (async()=>{
      try{
        const res = await http.get(`/admin/counselors/${id}/students`);
        if(!cancel) setData(res.data);
      }catch(e){ setErr(e?.response?.data?.detail || 'خطا'); }
      finally{ if(!cancel) setLoading(false); }
    })();
    return ()=>{ cancel=true; }
  },[id]);

  if (loading) return '...';
  if (err) return <div className="text-danger">{err}</div>;
  return (
    <div>
      <h5 style={{ color:'#ffcc00' }}>دانشجویان مشاور #{id}</h5>
      <pre className="bg-dark text-light p-3 rounded" style={{ maxHeight:500, overflow:'auto' }}>
{JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
