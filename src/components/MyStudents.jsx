// src/components/MyStudents.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style/MyStudents.css";

const ENDPOINTS = {
  list: "/counselors/my-students",
  detailsRoute: (studentId) => `/advisor/students/${studentId}`, // صفحه جزئیات
};

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ type: "", text: "" });
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.list, {
          headers: { Accept: "application/json" },
        });
        if (!mounted) return;
        const arr = Array.isArray(res?.data) ? res.data : [];
        setStudents(arr.map(normalize));
      } catch (e) {
        console.error(e);
        setBanner({ type: "error", text: "خطا در دریافت لیست دانش‌آموزها." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.firstname, s.lastname, s.email, s.city, s.province]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase())
        .some((token) => token.includes(q))
    );
  }, [students, query]);

  if (loading) {
    return <div className="my-students dark-mode"><p className="muted">در حال بارگذاری لیست…</p></div>;
  }

  return (
    <div className="my-students dark-mode">
      <div className="page-header">
        <h2>دانش‌آموزهای من</h2>
        {banner.text && (
          <div className={`banner ${banner.type}`}>
            {banner.text}
            <button className="banner-close" onClick={() => setBanner({ type: "", text: "" })}>×</button>
          </div>
        )}
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="جستجو بر اساس نام، ایمیل، شهر…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search"
        />
        <div className="count">تعداد: {filtered.length}</div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">دانش‌آموز تاییدشده‌ای یافت نشد.</p>
      ) : (
        <div className="student-grid">
          {filtered.map((s) => (
            <div key={s.student_id} className="student-card" onClick={() => navigate(ENDPOINTS.detailsRoute(s.student_id), { state: { student: s } })}>
              <div className="row1">
                <img
                  className="avatar"
                  src={s.profile_image_url || "https://placehold.co/80x80?text=No+Img"}
                  alt={(s.firstname && s.lastname) ? `${s.firstname} ${s.lastname}` : "student"}
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80?text=No+Img"; }}
                />
                <div className="info">
                  <div className="name">{coalesce(s.firstname, "—")} {coalesce(s.lastname, "")}</div>
                  <div className="meta">
                    <span>{coalesce(s.city, "—")}</span>
                    <span>•</span>
                    <span>{coalesce(s.province, "—")}</span>
                  </div>
                </div>
              </div>

              <div className="row2">
                <div className="kv">
                  <span className="k">ایمیل:</span>
                  <span className="v">{coalesce(s.email, "—")}</span>
                </div>
                <div className="kv">
                  <span className="k">تلفن:</span>
                  <span className="v">{coalesce(s.phone_number, "—")}</span>
                </div>
                <div className="kv">
                  <span className="k">مقطع/سال:</span>
                  <span className="v">{coalesce(s.education_year, "—")}</span>
                </div>
                <div className="kv">
                  <span className="k">رشته:</span>
                  <span className="v">{coalesce(s.field_of_study, "—")}</span>
                </div>
                <div className="kv">
                  <span className="k">نیمسال/سال:</span>
                  <span className="v">{coalesce(s.semester_or_year, "—")}</span>
                </div>
                <div className="kv">
                  <span className="k">GPA:</span>
                  <span className="v">{formatGpa(s.gpa)}</span>
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn ghost"
                  onClick={(e) => { e.stopPropagation(); navigate(`/students/${s.student_id}`); }}
                >
                  مشاهده پروفایل عمومی
                </button>
                <button
                  className="btn primary"
                  onClick={(e) => { e.stopPropagation(); navigate(ENDPOINTS.detailsRoute(s.student_id), { state: { student: s } }); }}
                >
                  ورود به صفحه دانش‌آموز
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function normalize(x) {
  return {
    student_id: toInt(x?.student_id),
    firstname: coalesce(x?.firstname),
    lastname: coalesce(x?.lastname),
    email: coalesce(x?.email),
    phone_number: coalesce(x?.phone_number),
    province: coalesce(x?.province),
    city: coalesce(x?.city),
    education_year: coalesce(x?.education_year),
    field_of_study: coalesce(x?.field_of_study),
    semester_or_year: coalesce(x?.semester_or_year),
    gpa: toFloat(x?.gpa),
    profile_image_url: coalesce(x?.profile_image_url),
  };
}
function coalesce(v, fallback = "") {
  if (v === null || v === undefined) return fallback;
  const s = String(v);
  return s.trim() === "" ? fallback : s;
}
function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}
function toFloat(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function formatGpa(n) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}
