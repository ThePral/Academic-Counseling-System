// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/StudentProfile.css";

// const StudentProfile = () => {
//   const { id } = useParams();
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axiosInstance
//       .get(`/students/${id}`)
//       .then((res) => {
//         setStudent(res.data);
//       })
//       .catch(() => setError("❌ خطا در دریافت اطلاعات دانش‌آموز"))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <p>در حال بارگذاری...</p>;
//   if (error) return <p>{error}</p>;
//   if (!student) return null;

//   return (
//     <div className="student-profile">
//       <img src={student.profile_image_url} alt="Profile" className="profile-image" />

//       <h2>{student.firstname} {student.lastname}</h2>
//       <p><strong>ایمیل:</strong> {student.email}</p>
//       <p><strong>شماره تماس:</strong> {student.phone_number}</p>
//       <p><strong>استان:</strong> {student.province}</p>
//       <p><strong>شهر:</strong> {student.city}</p>
//       <p><strong>پایه/سال تحصیلی:</strong> {student.academic_year}</p>
//       <p><strong>رشته:</strong> {student.major}</p>
//       <p><strong>معدل:</strong> {student.gpa}</p>
//     </div>
//   );
// };

// export default StudentProfile;



import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style/StudentProfile.css";

export default function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const fullName = useMemo(() => {
    if (!data) return "";
    const f = data.firstname?.trim() || "";
    const l = data.lastname?.trim() || "";
    return `${f} ${l}`.trim();
  }, [data]);

  useEffect(() => {
    let ignore = false;
    const fetchStudent = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axiosInstance.get(`/counselors/students/${studentId}`, {
          headers: { Accept: "application/json" }, // فقط جهت شفافیت
        });
        if (!ignore) setData(res?.data || null);
      } catch (e) {
        console.error("خطا در دریافت اطلاعات دانش‌آموز:", e);
        if (!ignore) {
          // نمایش پیام مناسب برای Validation Error یا سایر خطاها
          const status = e?.response?.status;
          if (status === 422) setErr("شناسه دانش‌آموز نامعتبر است (422).");
          else if (status === 404) setErr("دانش‌آموز یافت نشد (404).");
          else setErr("خطا در دریافت اطلاعات دانش‌آموز.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchStudent();
    return () => { ignore = true; };
  }, [studentId]);

  if (loading) return <div className="student-profile page"><p className="muted">در حال بارگذاری پروفایل…</p></div>;

  if (err) {
    return (
      <div className="student-profile page">
        <div className="header">
          <button className="btn back" onClick={() => navigate(-1)}>بازگشت</button>
          <h2>پروفایل دانش‌آموز</h2>
        </div>
        <div className="error-box">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="student-profile page">
        <div className="header">
          <button className="btn back" onClick={() => navigate(-1)}>بازگشت</button>
          <h2>پروفایل دانش‌آموز</h2>
        </div>
        <p className="muted">داده‌ای برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div className="student-profile page">
      <div className="header">
        <button className="btn back" onClick={() => navigate(-1)}>بازگشت</button>
        <h2>پروفایل دانش‌آموز</h2>
      </div>

      <div className="card">
        <div className="avatar">
          <img
            src={data.profile_image_url || "https://placehold.co/160x160?text=No+Image"}
            alt={fullName || "student"}
            onError={(e) => { e.currentTarget.src = "https://placehold.co/160x160?text=No+Image"; }}
          />
        </div>

        <div className="grid">
          <Field label="نام" value={data.firstname} />
          <Field label="نام خانوادگی" value={data.lastname} />
          <Field label="ایمیل" value={data.email} copyable />
          <Field label="شماره تماس" value={data.phone_number} copyable />
          <Field label="استان" value={data.province} />
          <Field label="شهر" value={data.city} />
          <Field label="سال تحصیلی" value={data.education_year} />
          <Field label="رشته تحصیلی" value={data.field_of_study} />
          <Field label="نیمسال/سال" value={data.semester_or_year} />
          <Field label="معدل (GPA)" value={formatGpa(data.gpa)} />
          <Field label="شناسه" value={String(data.student_id)} copyable />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, copyable = false }) {
  const val = (value === null || value === undefined || value === "") ? "—" : String(value);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(val === "—" ? "" : val);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">
        {val}
        {copyable && (
          <button className="copy-btn" onClick={copy} title="کپی">
            {copied ? "کپی شد" : "کپی"}
          </button>
        )}
      </div>
    </div>
  );
}

function formatGpa(num) {
  if (num === null || num === undefined || Number.isNaN(num)) return "—";
  // نمایش تا دو رقم اعشار
  const n = Number(num);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}
