// src/components/AdvisorStudentDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style/AdvisorStudentDetail.css";

// const ENDPOINTS = {
//   studentInfo: (id) => `/counselors/students/${id}`,

//   createPlan: "/study-plan/counselor/create",
//   reviewPlan: (id) => `/study-plan/counselor/review/${id}`,
//   finalizePlan: (planId) => `/study-plan/counselor/finalize/${planId}`,

//   setGrade: (id) => `/counselors/students/${id}/grade`,

//   recommend: "/study-plan/counselor/recommend", 
// };

const ENDPOINTS = {
    studentInfo: (id) => `/counselors/students/${id}`,
    createPlan: "/study-plan/counselor/create",
    reviewPlan: (id) => `/study-plan/counselor/review/${id}`,
    finalizePlan: (planId) => `/study-plan/counselor/finalize/${planId}`,
    setGrade: (id) => `/counselors/students/${id}/grade`,
    recommend: "/study-plan/counselor/recommend",
    // ⬇️ اضافه شد: تاریخچه برای فالبک plan_id
    history: (id) => `/study-plan/counselor/history/${id}`,
};
  

export default function AdvisorStudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const prefillStudent = state?.student;

  const [banner, setBanner] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState(null);

  // فرم‌ها
  const [grade, setGrade] = useState({ score: "", note: "" });
  const [suggested, setSuggested] = useState(""); // ← برای توصیه

  // برنامه
  const sid = useMemo(() => parseInt(studentId, 10), [studentId]);
  const [week, setWeek] = useState(() => buildNext7Days());
  const [activities, setActivities] = useState(() => initActivities(week));
  const [currentPlanId, setCurrentPlanId] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [infoRes, reviewRes] = await Promise.allSettled([
          axiosInstance.get(ENDPOINTS.studentInfo(sid)),
          axiosInstance.get(ENDPOINTS.reviewPlan(sid)),
        ]);

        if (!mounted) return;

        // پروفایل
        if (infoRes.status === "fulfilled") {
          setStudent(normalizeStudent(infoRes.value.data, prefillStudent));
        } else {
          setStudent(normalizeStudent({}, prefillStudent));
          console.error("student info failed:", infoRes.reason);
        }

        // پیش‌نویس برنامه (اختیاری)
        if (reviewRes.status === "fulfilled" && reviewRes.value?.data) {
          const { plan_id, activities: acts } = normalizeReview(reviewRes.value.data);
          if (plan_id) setCurrentPlanId(plan_id);
          if (Array.isArray(acts) && acts.length > 0) {
            const dates = [...new Set(acts.map((a) => a.date))].sort();
            if (dates.length > 0) {
              const first = dates[0];
              setWeek(buildWeekFrom(first));
              setActivities(fillActivitiesFromApi(acts));
            }
          }
        }
      } catch (e) {
        console.error(e);
        setBanner({ type: "error", text: "خطا در بارگذاری اطلاعات." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [sid]);

  /* ---------- برنامه ---------- */
  const onAddRow = (dateKey) => {
    setActivities((prev) => {
      const next = { ...prev };
      next[dateKey] = [...(next[dateKey] || []), blankRow()];
      return next;
    });
  };
  const onChangeCell = (dateKey, idx, field, value) => {
    setActivities((prev) => {
      const next = { ...prev };
      const arr = [...(next[dateKey] || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      next[dateKey] = arr;
      return next;
    });
  };
  const onRemoveRow = (dateKey, idx) => {
    setActivities((prev) => {
      const next = { ...prev };
      const arr = [...(next[dateKey] || [])];
      arr.splice(idx, 1);
      next[dateKey] = arr;
      return next;
    });
  };

//   const onCreatePlan = async () => {
//     try {
//       const payload = { student_id: sid, activities: toPayloadActivities(activities) };
//       if (payload.activities.length === 0) {
//         setBanner({ type: "warning", text: "حداقل یک فعالیت وارد کنید." });
//         return;
//       }
//       await axiosInstance.post(ENDPOINTS.createPlan, payload, { headers: { "Content-Type": "application/json" } });
//       setBanner({ type: "success", text: "پیش‌نویس برنامه ثبت/به‌روزرسانی شد." });

//       const rev = await axiosInstance.get(ENDPOINTS.reviewPlan(sid));
//       const { plan_id } = normalizeReview(rev?.data || {});
//       setCurrentPlanId(plan_id || null);
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "ثبت برنامه با خطا مواجه شد." });
//     }
//   };

const onCreatePlan = async () => {
    try {
      const payload = { student_id: sid, activities: toPayloadActivities(activities) };
      if (payload.activities.length === 0) {
        setBanner({ type: "warning", text: "حداقل یک فعالیت وارد کنید." });
        return;
      }
      const createRes = await axiosInstance.post(ENDPOINTS.createPlan, payload, {
        headers: { "Content-Type": "application/json" },
      });
      // تلاش اول: از create
      let pid = extractPlanId(createRes?.data);
      if (!pid) {
        // تلاش دوم: review
        const rev = await axiosInstance.get(ENDPOINTS.reviewPlan(sid));
        pid = normalizeReview(rev?.data).plan_id;
      }
      if (!pid) {
        // تلاش سوم: history
        const hist = await axiosInstance.get(ENDPOINTS.history(sid));
        pid = extractPlanId(hist?.data);
      }
  
      setCurrentPlanId(pid || null);
      setBanner({ type: "success", text: "پیش‌نویس برنامه ثبت/به‌روزرسانی شد." });
    } catch (e) {
      console.error("create error:", e?.response?.status, e?.response?.data, e);
      setBanner({ type: "error", text: "ثبت برنامه با خطا مواجه شد." });
    }
  };
  

//   const onCreateAndFinalize = async () => {
//     try {
//       // 1) create/update
//       const payload = { student_id: sid, activities: toPayloadActivities(activities) };
//       if (payload.activities.length === 0) {
//         setBanner({ type: "warning", text: "حداقل یک فعالیت وارد کنید." });
//         return;
//       }
//       await axiosInstance.post(ENDPOINTS.createPlan, payload, { headers: { "Content-Type": "application/json" } });
//       // 2) review → plan_id
//       const rev = await axiosInstance.get(ENDPOINTS.reviewPlan(sid));
//       const { plan_id } = normalizeReview(rev?.data || {});
//       if (!plan_id) {
//         setBanner({ type: "error", text: "plan_id یافت نشد. پاسخ review را بررسی کنید." });
//         return;
//       }
//       setCurrentPlanId(plan_id);
//       // 3) finalize
//       await axiosInstance.post(ENDPOINTS.finalizePlan(plan_id));
//       setBanner({ type: "success", text: "برنامه نهایی شد و برای دانش‌آموز قابل مشاهده است." });
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "ثبت/نهایی‌سازی با خطا مواجه شد." });
//     }
//   };

const onCreateAndFinalize = async () => {
    try {
      const payload = { student_id: sid, activities: toPayloadActivities(activities) };
      if (payload.activities.length === 0) {
        setBanner({ type: "warning", text: "حداقل یک فعالیت وارد کنید." });
        return;
      }
      const createRes = await axiosInstance.post(ENDPOINTS.createPlan, payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      let pid = extractPlanId(createRes?.data);
      if (!pid) {
        const rev = await axiosInstance.get(ENDPOINTS.reviewPlan(sid));
        pid = normalizeReview(rev?.data).plan_id;
      }
      if (!pid) {
        const hist = await axiosInstance.get(ENDPOINTS.history(sid));
        pid = extractPlanId(hist?.data);
      }
  
      if (!pid) {
        setBanner({ type: "error", text: "plan_id یافت نشد. پاسخ‌ها را بررسی کنید." });
        return;
      }
      setCurrentPlanId(pid);
      await axiosInstance.post(ENDPOINTS.finalizePlan(pid));
      setBanner({ type: "success", text: "برنامه نهایی شد و برای دانش‌آموز قابل مشاهده است." });
    } catch (e) {
      console.error("finalize error:", e?.response?.status, e?.response?.data, e);
      setBanner({ type: "error", text: "ثبت/نهایی‌سازی با خطا مواجه شد." });
    }
  };
  

  const onFinalizeOnly = async () => {
    try {
      let planId = currentPlanId;
      if (!planId) {
        const rev = await axiosInstance.get(ENDPOINTS.reviewPlan(sid));
        planId = normalizeReview(rev?.data || {}).plan_id || null;
        setCurrentPlanId(planId);
      }
      if (!planId) {
        setBanner({ type: "warning", text: "هیچ پیش‌نویس فعالی برای نهایی‌سازی یافت نشد." });
        return;
      }
      await axiosInstance.post(ENDPOINTS.finalizePlan(planId));
      setBanner({ type: "success", text: "برنامه نهایی شد." });
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "نهایی‌سازی با خطا مواجه شد." });
    }
  };

  /* ---------- تمره ---------- */
  const onSubmitGrade = async (e) => {
    e.preventDefault();
    try {
      const payload = { score: toFloat(grade.score), note: (grade.note || "").trim() };
      await axiosInstance.post(ENDPOINTS.setGrade(sid), payload);
      setBanner({ type: "success", text: "نمره ثبت شد." });
      setGrade({ score: "", note: "" });
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "ثبت نمره با خطا مواجه شد." });
    }
  };

  /* ----------  منابع ---------- */
  const onSubmitRecommend = async (e) => {
    e.preventDefault();
    const text = (suggested || "").trim();
    if (!text) {
      setBanner({ type: "warning", text: "متن توصیه را وارد کنید." });
      return;
    }
    try {
      await axiosInstance.post(ENDPOINTS.recommend, { student_id: sid, suggested_course: text });
      setBanner({ type: "success", text: "توصیه برای دانش‌آموز ثبت شد." });
      setSuggested("");
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "ثبت توصیه با خطا مواجه شد." });
    }
  };

  if (loading) {
    return <div className="advisor-student-detail dark-mode"><p className="muted">در حال بارگذاری…</p></div>;
  }

  return (
    <div className="advisor-student-detail dark-mode">
      <div className="page-header">
        <div className="left">
          <button className="btn back" onClick={() => navigate(-1)}>بازگشت</button>
          <h2>دانش‌آموز #{sid}</h2>
        </div>
        {banner.text && (
          <div className={`banner ${banner.type}`}>
            {banner.text}
            <button className="banner-close" onClick={() => setBanner({ type: "", text: "" })}>×</button>
          </div>
        )}
      </div>

      {/* اطلاعات دانش‌آموز */}
      <section className="card">
        <div className="profile">
          <img
            src={student?.profile_image_url || "https://placehold.co/120x120?text=No+Img"}
            alt="avatar"
            className="avatar"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/120x120?text=No+Img"; }}
          />
          <div className="grid">
            <Field label="نام" value={student?.firstname} />
            <Field label="نام خانوادگی" value={student?.lastname} />
            <Field label="ایمیل" value={student?.email} />
            <Field label="تلفن" value={student?.phone_number} />
            <Field label="استان" value={student?.province} />
            <Field label="شهر" value={student?.city} />
            <Field label="مقطع/سال" value={student?.education_year} />
            <Field label="رشته" value={student?.field_of_study} />
            <Field label="نیمسال/سال" value={student?.semester_or_year} />
            <Field label="معدل" value={formatGpa(student?.gpa)} />
          </div>
        </div>
      </section>

      {/* سازنده برنامه متنی */}
      <section className="card">
        <h3>برنامه (۷ روز آینده یا از روی پیش‌نویس)</h3>

        {week.map((d) => (
          <DayEditor
            key={d.key}
            day={d}
            rows={activities[d.key] || []}
            onAdd={() => onAddRow(d.key)}
            onRemove={(idx) => onRemoveRow(d.key, idx)}
            onChange={(idx, field, value) => onChangeCell(d.key, idx, field, value)}
          />
        ))}

        <div className="actions">
          <button className="btn secondary" onClick={onCreatePlan}>ثبت/به‌روزرسانی پیش‌نویس</button>
          <button className="btn primary" onClick={onCreateAndFinalize}>ثبت و نهایی‌سازی</button>
          <button className="btn ghost" onClick={onFinalizeOnly} disabled={!currentPlanId}>نهایی‌سازی پیش‌نویس فعلی</button>
        </div>
        {currentPlanId && <div className="muted" style={{marginTop:8}}>plan_id فعلی: {currentPlanId}</div>}
      </section>

      {/* ثبت نمره */}
      <section className="card">
        <h3>ثبت نمره</h3>
        <form className="grade-form" onSubmit={onSubmitGrade}>
          <div className="row">
            <div className="col">
              <label>نمره</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="20"
                value={grade.score}
                onChange={(e) => setGrade((g) => ({ ...g, score: e.target.value }))}
                placeholder="مثلاً 18.25"
              />
            </div>
            <div className="col">
              <label>یادداشت (اختیاری)</label>
              <input
                type="text"
                value={grade.note}
                onChange={(e) => setGrade((g) => ({ ...g, note: e.target.value }))}
                placeholder="توضیح کوتاه…"
              />
            </div>
            <div className="col fit">
              <button className="btn primary" type="submit">ثبت</button>
            </div>
          </div>
        </form>
      </section>

      {/* متابع پیشتهادی */}
      <section className="card">
        <h3>توصیه/منبع پیشنهادی</h3>
        <form onSubmit={onSubmitRecommend} className="resource-form">
          <div className="row">
            <div className="col stretch">
              <label>متن توصیه</label>
              <input
                type="text"
                value={suggested}
                onChange={(e) => setSuggested(e.target.value)}
                placeholder="مثلاً: دوره حل‌تمرین فصل ۳ ریاضی"
                required
              />
            </div>
            <div className="col fit">
              <button className="btn primary" type="submit">ثبت توصیه</button>
            </div>
          </div>
        </form>
        <p className="muted" style={{marginTop:8}}>
          * در Swagger فعلی، فقط ثبت توصیه داریم و لیست/نمایش آرشیو منابع تعریف نشده. اگر لازم داری، بک‌اند باید مسیر GET اضافه کند.
        </p>
      </section>
    </div>
  );
}

/* ---------- زیرکامپوننت‌های برنامه ---------- */
function DayEditor({ day, rows, onAdd, onRemove, onChange }) {
  return (
    <div className="day-card">
      <div className="day-header">
        {day.titleFa}
        <span className="muted">{day.jdate}</span>
        <button className="btn ghost small" onClick={onAdd}>+ فعالیت</button>
      </div>
      <div className="day-body">
        <table>
          <thead>
            <tr>
              <th>شروع</th>
              <th>پایان</th>
              <th>عنوان</th>
              <th>توضیح</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r, idx) => (
              <tr key={idx}>
                <td><input type="time" value={r.start_time} onChange={(e) => onChange(idx, "start_time", e.target.value)} /></td>
                <td><input type="time" value={r.end_time} onChange={(e) => onChange(idx, "end_time", e.target.value)} /></td>
                <td><input type="text" value={r.title} onChange={(e) => onChange(idx, "title", e.target.value)} placeholder="مثلاً: ریاضی" /></td>
                <td><input type="text" value={r.description} onChange={(e) => onChange(idx, "description", e.target.value)} placeholder="اختیاری" /></td>
                <td><button className="btn danger small" onClick={() => onRemove(idx)}>حذف</button></td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan="5" className="muted">فعالیّتی ثبت نشده.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- UI Bits ---------- */
function Field({ label, value }) {
  const val = (value === null || value === undefined || String(value).trim() === "") ? "—" : String(value);
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{val}</div>
    </div>
  );
}

/* ---------- Helper---------- */
function buildNext7Days() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      titleFa: ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"][d.getDay()],
      jdate: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d),
    };
  });
}

function extractPlanId(any) {
    if (!any) return null;
    // حالت آبجکت با plan_id یا id
    if (typeof any === "object" && !Array.isArray(any)) {
      return any.plan_id ?? any.id ?? null;
    }
    // حالت آرایه: دنبال آخرین/بزرگترین plan_id
    if (Array.isArray(any)) {
      const cand = any
        .map(x => (x?.plan_id ?? x?.id))
        .filter(Boolean)
        .map(Number)
        .filter(Number.isFinite);
      if (cand.length) return Math.max(...cand);
      return null;
    }
    // اگر string بود و عدد بود
    const n = Number(any);
    return Number.isFinite(n) ? n : null;
}

  
function buildWeekFrom(firstYmd) {
  const start = new Date(`${firstYmd}T00:00:00Z`);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      titleFa: ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"][d.getDay()],
      jdate: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d),
    };
  });
}
function initActivities(week) {
  const obj = {};
  week.forEach((d) => { obj[d.key] = []; });
  return obj;
}
function blankRow() {
  return { start_time: "", end_time: "", title: "", description: "" };
}
function toPayloadActivities(map) {
  const out = [];
  Object.entries(map).forEach(([date, arr]) => {
    (arr || []).forEach((r) => {
      if (!r.title && !r.start_time && !r.end_time) return;
      out.push({
        date,
        start_time: toIsoTime(r.start_time),
        end_time: toIsoTime(r.end_time),
        title: r.title || "",
        description: r.description || "",
      });
    });
  });
  return out;
}
function toIsoTime(t) {
  if (!t) return "00:00:00.000Z";
  const [h, m] = String(t).split(":");
  return `${h.padStart(2,"0")}:${m.padStart(2,"0")}:00.000Z`;
}
function fromIsoToInput(isoLike) {
  if (!isoLike) return "";
  const hhmm = String(isoLike).slice(0, 5);
  return /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : "";
}
function fillActivitiesFromApi(apiActs) {
  const map = {};
  apiActs.forEach((a) => {
    const key = a.date;
    (map[key] ||= []);
    map[key].push({
      start_time: fromIsoToInput(a.start_time),
      end_time: fromIsoToInput(a.end_time),
      title: a.title || "",
      description: a.description || "",
    });
  });
  return map;
}
function normalizeStudent(api, fallback) {
  const f = fallback || {};
  return {
    student_id: toInt(api?.student_id) ?? toInt(f?.student_id),
    firstname: coalesce(api?.firstname, f?.firstname),
    lastname: coalesce(api?.lastname, f?.lastname),
    email: coalesce(api?.email, f?.email),
    phone_number: coalesce(api?.phone_number, f?.phone_number),
    province: coalesce(api?.province, f?.province),
    city: coalesce(api?.city, f?.city),
    education_year: coalesce(api?.education_year, f?.education_year),
    field_of_study: coalesce(api?.field_of_study, f?.field_of_study),
    semester_or_year: coalesce(api?.semester_or_year, f?.semester_or_year),
    gpa: toFloat(api?.gpa ?? f?.gpa),
    profile_image_url: coalesce(api?.profile_image_url, f?.profile_image_url),
  };
}
// function normalizeReview(api) {
//   return {
//     plan_id: api?.plan_id ?? api?.id ?? null,
//     activities: Array.isArray(api?.activities) ? api.activities : [],
//   };
// }

function normalizeReview(api) {
    // ممکنه آبجکت باشه
    if (api && typeof api === "object" && !Array.isArray(api)) {
      return {
        plan_id: extractPlanId(api),
        activities: Array.isArray(api.activities) ? api.activities : [],
      };
    }
    // ممکنه آرایه‌ای از پلن‌ها باشه
    if (Array.isArray(api)) {
      const plan_id = extractPlanId(api);
      // اگر آرایهٔ پلن‌هاست، آخرینش را برای نمایش برگردون
      const latest = api[0] || {};
      return {
        plan_id,
        activities: Array.isArray(latest.activities) ? latest.activities : [],
      };
    }
    // یا حتی string
    return { plan_id: extractPlanId(api), activities: [] };
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
