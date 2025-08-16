// // src/components/CounselorStudentPlan.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/Planning.css";

// const ENDPOINTS = {
//   create: "/study-plan/counselor/create", // POST { student_id, activities: [...] }
//   finalize: (planId) => `/study-plan/counselor/finalize/${planId}`, // POST
//   review: (studentId) => `/study-plan/counselor/review/${studentId}`, // GET
//   feedback: "/study-plan/counselor/submit-feedback", // POST { plan_id, feedback }
//   score: "/study-plan/counselor/score", // POST { plan_id, score }
//   recommend: "/study-plan/counselor/recommend", // POST { student_id, suggested_course }
// };

// const DAYS_FA = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

// export default function CounselorStudentPlan() {
//   const { studentId } = useParams();
//   const sid = useMemo(() => parseInt(studentId, 10), [studentId]);

//   const [banner, setBanner] = useState({ type: "", text: "" });
//   const [loading, setLoading] = useState(true);

//   // state برای ساخت برنامه
//   const [week, setWeek] = useState(() => buildNext7Days());
//   const [activities, setActivities] = useState(() => initActivities(week));

//   // state برای نسخه موجود/بازبینی‌شونده
//   const [currentPlan, setCurrentPlan] = useState(null); // {plan_id, activities:[...]}
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState("");
//   const [recommendText, setRecommendText] = useState("");

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         // اگر برنامه‌ای برای این دانش‌آموز در حالت review وجود داشته باشد
//         const res = await axiosInstance.get(ENDPOINTS.review(sid), {
//           headers: { Accept: "application/json" },
//         });
//         if (!mounted) return;
//         if (res?.data) {
//           // انتظار: سرور یک آبجکت برنامه با activities برمی‌گرداند
//           const normalized = normalizeReview(res.data);
//           setCurrentPlan(normalized);
//         } else {
//           setCurrentPlan(null);
//         }
//       } catch (e) {
//         // اگر هنوز برنامه‌ای نیست، اشکال ندارد
//         setCurrentPlan(null);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [sid]);

//   const onAddRow = (dateKey) => {
//     setActivities((prev) => {
//       const map = { ...prev };
//       const arr = map[dateKey] ? [...map[dateKey]] : [];
//       arr.push(blankRow());
//       map[dateKey] = arr;
//       return map;
//     });
//   };

//   const onChangeCell = (dateKey, idx, field, value) => {
//     setActivities((prev) => {
//       const map = { ...prev };
//       const arr = [...(map[dateKey] || [])];
//       const row = { ...arr[idx], [field]: value };
//       arr[idx] = row;
//       map[dateKey] = arr;
//       return map;
//     });
//   };

//   const onRemoveRow = (dateKey, idx) => {
//     setActivities((prev) => {
//       const map = { ...prev };
//       const arr = [...(map[dateKey] || [])];
//       arr.splice(idx, 1);
//       map[dateKey] = arr;
//       return map;
//     });
//   };

//   const onCreatePlan = async () => {
//     try {
//       // تبدیل state به payload API
//       const payload = {
//         student_id: sid,
//         activities: toPayloadActivities(activities),
//       };
//       await axiosInstance.post(ENDPOINTS.create, payload);
//       setBanner({ type: "success", text: "برنامه ایجاد شد. برای نهایی کردن، دکمه «نهایی‌سازی برنامه» را بزنید." });

//       // پس از ساخت، دوباره review را بخوانیم تا plan_id بگیریم
//       const res = await axiosInstance.get(ENDPOINTS.review(sid));
//       if (res?.data) setCurrentPlan(normalizeReview(res.data));
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "ایجاد برنامه با خطا مواجه شد." });
//     }
//   };

//   const onFinalize = async () => {
//     try {
//       if (!currentPlan?.plan_id) {
//         setBanner({ type: "warning", text: "برنامه‌ای برای نهایی‌سازی پیدا نشد." });
//         return;
//       }
//       await axiosInstance.post(ENDPOINTS.finalize(currentPlan.plan_id));
//       setBanner({ type: "success", text: "برنامه نهایی شد و برای دانش‌آموز قابل مشاهده است." });
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "نهایی‌سازی با خطا مواجه شد." });
//     }
//   };

//   const onSubmitFeedback = async () => {
//     try {
//       if (!currentPlan?.plan_id) {
//         setBanner({ type: "warning", text: "ابتدا برنامه را ایجاد/نهایی کنید." });
//         return;
//       }
//       await axiosInstance.post(ENDPOINTS.feedback, {
//         plan_id: currentPlan.plan_id,
//         feedback: (feedback || "").trim(),
//       });
//       setBanner({ type: "success", text: "بازخورد ثبت شد." });
//       setFeedback("");
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "ثبت بازخورد با خطا مواجه شد." });
//     }
//   };

//   const onSubmitScore = async () => {
//     try {
//       if (!currentPlan?.plan_id) {
//         setBanner({ type: "warning", text: "ابتدا برنامه را ایجاد/نهایی کنید." });
//         return;
//       }
//       const val = Number(score);
//       if (!Number.isFinite(val)) {
//         setBanner({ type: "warning", text: "نمره معتبر نیست." });
//         return;
//       }
//       await axiosInstance.post(ENDPOINTS.score, {
//         plan_id: currentPlan.plan_id,
//         score: val,
//       });
//       setBanner({ type: "success", text: "نمره ثبت شد." });
//       setScore("");
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "ثبت نمره با خطا مواجه شد." });
//     }
//   };

//   const onRecommend = async () => {
//     try {
//       const text = (recommendText || "").trim();
//       if (!text) {
//         setBanner({ type: "warning", text: "متن توصیه را وارد کنید." });
//         return;
//       }
//       await axiosInstance.post(ENDPOINTS.recommend, {
//         student_id: sid,
//         suggested_course: text,
//       });
//       setBanner({ type: "success", text: "توصیه برای دانش‌آموز ثبت شد." });
//       setRecommendText("");
//     } catch (e) {
//       console.error(e);
//       setBanner({ type: "error", text: "ثبت توصیه با خطا مواجه شد." });
//     }
//   };

//   if (loading) return <div className="planning-page"><p className="muted">در حال بارگذاری…</p></div>;

//   return (
//     <div className="planning-page">
//       <h2>برنامه‌ریزی دانش‌آموز #{sid}</h2>

//       {banner.text && (
//         <div className={`banner ${banner.type}`}>
//           {banner.text}
//           <button className="banner-close" onClick={() => setBanner({ type: "", text: "" })}>×</button>
//         </div>
//       )}

//       {/* اگر برنامه‌ای برای بازبینی وجود دارد، نشان بده */}
//       {currentPlan && (
//         <div className="card">
//           <h3>برنامه فعلی (برای بازبینی)</h3>
//           <PlanReadonly activities={currentPlan.activities} />
//         </div>
//       )}

//       {/* سازنده‌ی برنامه‌ی جدید */}
//       <div className="card">
//         <h3>ساخت برنامه‌ی جدید (۷ روز آینده)</h3>

//         {week.map((d) => (
//           <DayEditor
//             key={d.key}
//             day={d}
//             rows={activities[d.key] || []}
//             onAdd={() => onAddRow(d.key)}
//             onRemove={(idx) => onRemoveRow(d.key, idx)}
//             onChange={(idx, field, value) => onChangeCell(d.key, idx, field, value)}
//           />
//         ))}

//         <div className="actions">
//           <button className="btn primary" onClick={onCreatePlan}>ایجاد/به‌روزرسانی برنامه</button>
//           <button className="btn secondary" onClick={onFinalize}>نهایی‌سازی برنامه</button>
//         </div>
//       </div>

//       {/* بازخورد و نمره و توصیه */}
//       <div className="card">
//         <h3>بازخورد و نمره و توصیه</h3>

//         <div className="grid-3">
//           <div>
//             <label>بازخورد به برنامه</label>
//             <textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="بازخورد شما…" />
//             <button className="btn secondary" onClick={onSubmitFeedback}>ثبت بازخورد</button>
//           </div>

//           <div>
//             <label>نمره برنامه</label>
//             <input type="number" step="1" value={score} onChange={(e) => setScore(e.target.value)} placeholder="مثلاً 100" />
//             <button className="btn secondary" onClick={onSubmitScore}>ثبت نمره</button>
//           </div>

//           <div>
//             <label>توصیه/منبع پیشنهادی</label>
//             <input type="text" value={recommendText} onChange={(e) => setRecommendText(e.target.value)} placeholder="مثلاً دوره ریاضی پیشرفته" />
//             <button className="btn secondary" onClick={onRecommend}>ثبت توصیه</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------- زیرکامپوننت‌ها ----------------- */

// function DayEditor({ day, rows, onAdd, onRemove, onChange }) {
//   return (
//     <div className="day-card">
//       <div className="day-header">
//         {day.titleFa} <span className="muted">{day.jdate}</span>
//         <button className="btn ghost small" onClick={onAdd}>+ فعالیت</button>
//       </div>
//       <div className="day-body">
//         <table>
//           <thead>
//             <tr>
//               <th>شروع</th>
//               <th>پایان</th>
//               <th>عنوان</th>
//               <th>توضیح</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {(rows || []).map((r, idx) => (
//               <tr key={idx}>
//                 <td><input type="time" value={r.start_time} onChange={(e) => onChange(idx, "start_time", e.target.value)} /></td>
//                 <td><input type="time" value={r.end_time} onChange={(e) => onChange(idx, "end_time", e.target.value)} /></td>
//                 <td><input type="text" value={r.title} onChange={(e) => onChange(idx, "title", e.target.value)} placeholder="مثلاً: ریاضی" /></td>
//                 <td><input type="text" value={r.description} onChange={(e) => onChange(idx, "description", e.target.value)} placeholder="اختیاری" /></td>
//                 <td><button className="btn danger small" onClick={() => onRemove(idx)}>حذف</button></td>
//               </tr>
//             ))}
//             {(!rows || rows.length === 0) && (
//               <tr><td colSpan="5" className="muted">فعالیّتی ثبت نشده.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function PlanReadonly({ activities }) {
//   // انتظار: activities آرایه‌ای از: { activity_id, date, start_time, end_time, title, description }
//   const grouped = groupBy(activities || [], (a) => a.date);
//   const keys = Object.keys(grouped).sort();
//   return (
//     <div className="plan-readonly">
//       {keys.length === 0 ? <p className="muted">برنامه‌ای پیدا نشد.</p> : keys.map((date) => (
//         <div className="day-card" key={date}>
//           <div className="day-header">{formatFaDate(date)}</div>
//           <div className="day-body">
//             <table>
//               <thead><tr><th>شروع</th><th>پایان</th><th>عنوان</th><th>توضیح</th></tr></thead>
//               <tbody>
//                 {grouped[date].map((a) => (
//                   <tr key={a.activity_id}>
//                     <td>{a.start_time?.slice(0,5) || "—"}</td>
//                     <td>{a.end_time?.slice(0,5) || "—"}</td>
//                     <td>{a.title || "—"}</td>
//                     <td>{a.description || "—"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ----------------- helperها ----------------- */

// function buildNext7Days() {
//   const today = new Date();
//   return Array.from({ length: 7 }).map((_, i) => {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
//     return {
//       key,
//       titleFa: DAYS_FA[d.getDay()],
//       jdate: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d),
//     };
//   });
// }

// function initActivities(week) {
//   const obj = {};
//   week.forEach((d) => { obj[d.key] = []; });
//   return obj;
// }

// function blankRow() {
//   return { start_time: "", end_time: "", title: "", description: "" };
// }

// function toPayloadActivities(map) {
//   // تبدیل state به شکل موردنیاز API: {date, start_time, end_time, title, description}
//   const out = [];
//   Object.entries(map).forEach(([date, arr]) => {
//     (arr || []).forEach((r) => {
//       if (!r.title && !r.start_time && !r.end_time) return;
//       out.push({
//         date,
//         start_time: toIsoTime(r.start_time),
//         end_time: toIsoTime(r.end_time),
//         title: r.title || "",
//         description: r.description || "",
//       });
//     });
//   });
//   return out;
// }

// function toIsoTime(t) {
//   // "HH:MM" → "HH:MM:00.000Z" (مطابق نمونه swagger)
//   if (!t) return "00:00:00.000Z";
//   const [h, m] = t.split(":");
//   return `${h.padStart(2,"0")}:${m.padStart(2,"0")}:00.000Z`;
// }

// function groupBy(arr, fn) {
//   return arr.reduce((acc, x) => {
//     const k = fn(x);
//     (acc[k] ||= []).push(x);
//     return acc;
//   }, {});
// }

// function normalizeReview(api) {
//   // توقع: api حاوی plan_id و activities
//   const plan_id = api?.plan_id ?? api?.id ?? api?.planId ?? null;
//   const acts = Array.isArray(api?.activities) ? api.activities : [];
//   return {
//     plan_id,
//     activities: acts.map((a) => ({
//       activity_id: a.activity_id ?? a.id ?? undefined,
//       date: a.date,
//       start_time: a.start_time,
//       end_time: a.end_time,
//       title: a.title,
//       description: a.description,
//     })),
//   };
// }

// function formatFaDate(yyyy_mm_dd) {
//   try {
//     const d = new Date(`${yyyy_mm_dd}T00:00:00Z`);
//     return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
//   } catch {
//     return yyyy_mm_dd;
//   }
// }



// src/components/CounselorStudentPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style/Planning.css";

const ENDPOINTS = {
  create: "/study-plan/counselor/create",                     // POST { student_id, activities:[...] }
  finalize: (planId) => `/study-plan/counselor/finalize/${planId}`, // POST
  review: (studentId) => `/study-plan/counselor/review/${studentId}`, // GET → { plan_id?, activities:[...] }
  feedback: "/study-plan/counselor/submit-feedback",          // POST { plan_id, feedback }
  score: "/study-plan/counselor/score",                       // POST { plan_id, score }
  recommend: "/study-plan/counselor/recommend",               // POST { student_id, suggested_course }
};

const DAYS_FA = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"];

export default function CounselorStudentPlan() {
  const { studentId } = useParams();
  const sid = useMemo(() => parseInt(studentId, 10), [studentId]);

  const [banner, setBanner] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  // ساخت برنامه جدید
  const [week, setWeek] = useState(() => buildNext7Days());
  const [activities, setActivities] = useState(() => initActivities(week));

  // برنامه موجود برای بازبینی/نهایی‌سازی
  const [currentPlan, setCurrentPlan] = useState(null); // { plan_id, activities: [...] }

  // فرم‌های جانبی
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [recommendText, setRecommendText] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(ENDPOINTS.review(sid), { headers: { Accept: "application/json" } });
        if (!mounted) return;
        if (res?.data) setCurrentPlan(normalizeReview(res.data));
        else setCurrentPlan(null);
      } catch {
        setCurrentPlan(null); // برنامه‌ای برای ریویو وجود ندارد؛ اشکال نیست
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [sid]);

  /* --------- CRUD برنامه --------- */
  const onAddRow = (dateKey) => {
    setActivities((prev) => {
      const map = { ...prev };
      map[dateKey] = [...(map[dateKey] || []), blankRow()];
      return map;
    });
  };
  const onChangeCell = (dateKey, idx, field, value) => {
    setActivities((prev) => {
      const map = { ...prev };
      const arr = [...(map[dateKey] || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      map[dateKey] = arr;
      return map;
    });
  };
  const onRemoveRow = (dateKey, idx) => {
    setActivities((prev) => {
      const map = { ...prev };
      const arr = [...(map[dateKey] || [])];
      arr.splice(idx, 1);
      map[dateKey] = arr;
      return map;
    });
  };

  const onCreatePlan = async () => {
    try {
      const payload = { student_id: sid, activities: toPayloadActivities(activities) };
      if (payload.activities.length === 0) {
        setBanner({ type: "warning", text: "حداقل یک فعالیت وارد کنید." });
        return;
      }
      await axiosInstance.post(ENDPOINTS.create, payload, { headers: { "Content-Type": "application/json" } });
      setBanner({ type: "success", text: "پیش‌نویس برنامه ثبت شد. برای نمایش به دانش‌آموز باید «نهایی‌سازی» انجام شود." });

      // برای گرفتن plan_id
      const res = await axiosInstance.get(ENDPOINTS.review(sid), { headers: { Accept: "application/json" } });
      setCurrentPlan(res?.data ? normalizeReview(res.data) : null);
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "ایجاد/به‌روزرسانی برنامه با خطا مواجه شد." });
    }
  };

  const onFinalize = async () => {
    try {
      if (!currentPlan?.plan_id) {
        setBanner({ type: "warning", text: "برنامه‌ای برای نهایی‌سازی پیدا نشد. ابتدا پیش‌نویس بسازید." });
        return;
      }
      await axiosInstance.post(ENDPOINTS.finalize(currentPlan.plan_id));
      setBanner({ type: "success", text: "✅ برنامه نهایی شد و دانش‌آموز آن را در صفحه‌ی خودش می‌بیند." });
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "نهایی‌سازی با خطا مواجه شد." });
    }
  };

  /* --------- بازخورد/نمره/توصیه --------- */
  const onSubmitFeedback = async () => {
    try {
      if (!currentPlan?.plan_id) {
        setBanner({ type: "warning", text: "ابتدا برنامه را ایجاد و plan_id دریافت کنید." });
        return;
      }
      await axiosInstance.post(ENDPOINTS.feedback, {
        plan_id: currentPlan.plan_id,
        feedback: (feedback || "").trim(),
      });
      setBanner({ type: "success", text: "بازخورد ثبت شد." });
      setFeedback("");
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "ثبت بازخورد با خطا مواجه شد." });
    }
  };

  const onSubmitScore = async () => {
    try {
      if (!currentPlan?.plan_id) {
        setBanner({ type: "warning", text: "ابتدا برنامه را ایجاد و plan_id دریافت کنید." });
        return;
      }
      const val = Number(score);
      if (!Number.isFinite(val)) {
        setBanner({ type: "warning", text: "نمره معتبر نیست." });
        return;
      }
      await axiosInstance.post(ENDPOINTS.score, { plan_id: currentPlan.plan_id, score: val });
      setBanner({ type: "success", text: "نمره ثبت شد." });
      setScore("");
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "ثبت نمره با خطا مواجه شد." });
    }
  };

  const onRecommend = async () => {
    try {
      const text = (recommendText || "").trim();
      if (!text) {
        setBanner({ type: "warning", text: "متن توصیه را وارد کنید." });
        return;
      }
      await axiosInstance.post(ENDPOINTS.recommend, { student_id: sid, suggested_course: text });
      setBanner({ type: "success", text: "توصیه برای دانش‌آموز ثبت شد. (دانش‌آموز در صفحه خودش می‌بیند)" });
      setRecommendText("");
    } catch (e) {
      console.error(e);
      setBanner({ type: "error", text: "ثبت توصیه با خطا مواجه شد." });
    }
  };

  if (loading) return <div className="planning-page"><p className="muted">در حال بارگذاری…</p></div>;

  return (
    <div className="planning-page">
      <h2>برنامه‌ریزی دانش‌آموز #{sid}</h2>

      {banner.text && (
        <div className={`banner ${banner.type}`}>
          {banner.text}
          <button className="banner-close" onClick={() => setBanner({ type: "", text: "" })}>×</button>
        </div>
      )}

      {/* اگر برنامه‌ای برای ریویو هست، نشان بده (دانش‌آموز تا نهایی‌سازی نبینه) */}
      {currentPlan && (
        <div className="card">
          <h3>پیش‌نویس/برنامه‌ی در بازبینی</h3>
          {!currentPlan.plan_id && (
            <p className="muted">plan_id موجود نیست؛ بعد از «ایجاد برنامه» دوباره بررسی کنید.</p>
          )}
          <PlanReadonly activities={currentPlan.activities} />
          <div className="actions">
            <button className="btn secondary" onClick={onFinalize} disabled={!currentPlan?.plan_id}>
              نهایی‌سازی برنامه
            </button>
          </div>
          <p className="muted" style={{marginTop:8}}>
            * تا زمانی که نهایی‌سازی انجام نشود، دانش‌آموز این برنامه را در «برنامه‌ریزی من» نمی‌بیند.
          </p>
        </div>
      )}

      {/* سازنده‌ی برنامه‌ی جدید */}
      <div className="card">
        <h3>ساخت برنامه‌ی جدید (۷ روز آینده)</h3>
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
          <button className="btn primary" onClick={onCreatePlan}>ایجاد/به‌روزرسانی برنامه</button>
        </div>
      </div>

      {/* بازخورد / نمره / توصیه */}
      <div className="card">
        <h3>بازخورد، نمره، توصیه</h3>
        <div className="grid-3">
          <div>
            <label>بازخورد به برنامه</label>
            <textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="بازخورد شما…" />
            <button className="btn secondary" onClick={onSubmitFeedback}>ثبت بازخورد</button>
          </div>
          <div>
            <label>نمره برنامه</label>
            <input type="number" step="1" value={score} onChange={(e) => setScore(e.target.value)} placeholder="مثلاً 100" />
            <button className="btn secondary" onClick={onSubmitScore}>ثبت نمره</button>
          </div>
          <div>
            <label>توصیه/منبع پیشنهادی برای دانش‌آموز</label>
            <input type="text" value={recommendText} onChange={(e) => setRecommendText(e.target.value)} placeholder="مثلاً دوره ریاضی پیشرفته" />
            <button className="btn secondary" onClick={onRecommend}>ثبت توصیه</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- زیرکامپوننت‌ها ---------------- */
function DayEditor({ day, rows, onAdd, onRemove, onChange }) {
  return (
    <div className="day-card">
      <div className="day-header">
        {day.titleFa} <span className="muted">{day.jdate}</span>
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
          {(!rows || rows.length === 0) && <tr><td colSpan="5" className="muted">فعالیّتی ثبت نشده.</td></tr>}
        </tbody>
        </table>
      </div>
    </div>
  );
}

function PlanReadonly({ activities }) {
  const grouped = groupBy(activities || [], (a) => a.date);
  const keys = Object.keys(grouped).sort();
  return keys.length === 0 ? (
    <p className="muted">برنامه‌ای پیدا نشد.</p>
  ) : (
    <div className="plan-readonly">
      {keys.map((date) => (
        <div className="day-card" key={date}>
          <div className="day-header">{formatFaDate(date)} <span className="muted">{date}</span></div>
          <div className="day-body">
            <table>
              <thead><tr><th>شروع</th><th>پایان</th><th>عنوان</th><th>توضیح</th></tr></thead>
              <tbody>
                {grouped[date].map((a, i) => (
                  <tr key={a.activity_id ?? i}>
                    <td>{(a.start_time || "").slice(0,5) || "—"}</td>
                    <td>{(a.end_time || "").slice(0,5) || "—"}</td>
                    <td>{a.title || "—"}</td>
                    <td>{a.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- helperها ---------------- */
function buildNext7Days() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      titleFa: DAYS_FA[d.getDay()],
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
function normalizeReview(api) {
  const plan_id = api?.plan_id ?? api?.id ?? api?.planId ?? null;
  const acts = Array.isArray(api?.activities) ? api.activities : [];
  return {
    plan_id,
    activities: acts.map((a, idx) => ({
      activity_id: a.activity_id ?? a.id ?? idx + 1,
      date: a.date,
      start_time: a.start_time,
      end_time: a.end_time,
      title: a.title,
      description: a.description,
    })),
  };
}
function groupBy(arr, fn) {
  return arr.reduce((acc, x) => {
    const k = fn(x);
    (acc[k] ||= []).push(x);
    return acc;
  }, {});
}
function formatFaDate(yyyy_mm_dd) {
  try {
    const d = new Date(`${yyyy_mm_dd}T00:00:00Z`);
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  } catch {
    return yyyy_mm_dd;
  }
}
