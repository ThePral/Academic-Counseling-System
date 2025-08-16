// src/components/StudentRecommendations.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import "./style/Planning.css"; // یا استایل دلخواهت

const ENDPOINTS = {
  myRecommendations: "/students/my-recommendations", // GET
};

export default function StudentRecommendations() {
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ type: "", text: "" });
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(ENDPOINTS.myRecommendations, {
          headers: { Accept: "application/json" },
        });
        if (!mounted) return;
        const arr = Array.isArray(res?.data) ? res.data : [];
        setItems(arr.map(normalizeRec));
      } catch (e) {
        console.error(e);
        setBanner({ type: "error", text: "خطا در دریافت توصیه‌ها." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="card"><p className="muted">در حال بارگذاری توصیه‌ها…</p></div>;

  return (
    <section className="card">
      <h3>📚 توصیه‌های مشاور</h3>

      {banner.text && (
        <div className={`banner ${banner.type}`}>
          {banner.text}
          <button className="banner-close" onClick={() => setBanner({ type: "", text: "" })}>×</button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="muted">هنوز توصیه‌ای برای شما ثبت نشده است.</p>
      ) : (
        <ul className="rec-list">
          {items.map((r) => (
            <li key={r.recommendation_id} className="rec-item">
              <span className="rec-text">{r.suggested_course}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function normalizeRec(api) {
  return {
    recommendation_id: api?.recommendation_id ?? api?.id ?? Math.random(),
    suggested_course: api?.suggested_course || "",
  };
}
