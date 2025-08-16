// import React, { useState, useEffect } from "react";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { format } from "date-fns";
// import axiosInstance from "../axiosInstance";
// import "./style/SetTimes.css";

// const toEnglishDigits = (str) => str.replace(/[\u06F0-\u06F9]/g, (d) => "0123456789"["\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d)]);

// const SetTimes = () => {
//   const [ranges, setRanges] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchAllRanges = async () => {
//     try {
//       const res = await axiosInstance.get("/timeslots/my/");
//       const serverRanges = res.data;

//       const detailed = await Promise.all(
//         serverRanges.map(async (range) => {
//           const detail = await axiosInstance.get(`/timeslots/range/?range_id=${range.id}`);
//           return {
//             id: Date.now() + Math.random(),
//             serverId: range.id,
//             date: detail.data.date,
//             from_time: range.from_time.substring(0, 5),
//             to_time: range.to_time.substring(0, 5),
//             duration: range.duration,
//             slots: detail.data.slots.map((s) => ({
//               id: s.id,
//               start: s.start_time.substring(0, 5),
//               end: s.end_time.substring(0, 5),
//               is_reserved: s.is_reserved,
//             })),
//           };
//         })
//       );

//       setRanges(detailed);
//     } catch (err) {
//       alert("خطا در دریافت بازه‌ها");
//     }
//   };

//   useEffect(() => {
//     fetchAllRanges();
//   }, []);

//   const addRange = () => {
//     const now = format(new Date(), "HH:mm");
//     setRanges((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         date: null,
//         from_time: now,
//         to_time: now,
//         duration: "",
//         slots: [],
//         serverId: null,
//       },
//     ]);
//   };

//   const updateRange = (id, key, value) => {
//     setRanges((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
//   };

//   const removeRange = async (id) => {
//     const range = ranges.find((r) => r.id === id);
//     if (range.serverId) {
//       try {
//         await axiosInstance.delete(`/timeslots/range/${range.serverId}`);
//         fetchAllRanges();
//       } catch {
//         alert("خطا در حذف بازه");
//       }
//     } else {
//       setRanges((prev) => prev.filter((r) => r.id !== id));
//     }
//   };

//   const generateSlots = async (id) => {
//     setLoading(true);
//     const r = ranges.find((range) => range.id === id);
//     const duration = parseInt(r.duration);

//     if (!r.date || !r.from_time || !r.to_time || isNaN(duration) || duration <= 0) {
//       alert("لطفاً همه فیلدها را کامل و درست وارد کنید.");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       date: toEnglishDigits(r.date.format("YYYY-MM-DD")),
//       from_time: `${r.from_time}:00`,
//       to_time: `${r.to_time}:00`,
//       duration_minutes: duration,
//     };

//     try {
//       const res = await axiosInstance.post("/timeslots/", payload);
//       setRanges((prev) =>
//         prev.map((rr) => (rr.id === id ? { ...rr, serverId: res.data.range_id } : rr))
//       );
//       fetchAllRanges();
//     } catch (err) {
//       alert("خطا در ذخیره بازه جدید");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const today = new Date();

//   return (
//     <div className="set-times-container">
//       <h2 className="title">مدیریت بازه‌های زمانی</h2>

//       {ranges.map((r) => (
//         <div key={r.id} className="range-block">
//           {!r.serverId ? (
//             <div className="inputs">
//               <DatePicker
//                 calendar={persian}
//                 locale={persian_fa}
//                 format="YYYY/MM/DD"
//                 calendarPosition="bottom-right"
//                 value={r.date}
//                 onChange={(val) => updateRange(r.id, "date", val)}
//                 minDate={today}
//               />
//               <input
//                 type="text"
//                 placeholder="ساعت شروع"
//                 value={r.from_time}
//                 onChange={(e) => updateRange(r.id, "from_time", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="ساعت پایان"
//                 value={r.to_time}
//                 onChange={(e) => updateRange(r.id, "to_time", e.target.value)}
//               />
//               <input
//                 type="number"
//                 placeholder="مدت (دقیقه)"
//                 value={r.duration}
//                 onChange={(e) => updateRange(r.id, "duration", e.target.value)}
//               />
//               <div className="btn-group">
//                 <button onClick={() => generateSlots(r.id)} disabled={loading}>✔️ تایید</button>
//                 <button onClick={() => removeRange(r.id)} disabled={loading}>🗑 حذف</button>
//               </div>
//             </div>
//           ) : (
//             <div className="existing-range">
//               <div className="range-header">
//                 <strong>
//                   تاریخ: {new Date(r.date).toLocaleDateString("fa-IR")}، از {r.from_time} تا {r.to_time}
//                 </strong>
//                 <button className="btn btn-danger" onClick={() => removeRange(r.id)}>حذف کل بازه</button>
//               </div>
//               <table className="existing-table">
//                 <thead>
//                   <tr>
//                     <th>ساعت</th>
//                     <th>وضعیت</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {r.slots.map((slot) => (
//                     <tr key={slot.id}>
//                       <td>{slot.start} - {slot.end}</td>
//                       <td>{slot.is_reserved ? "رزرو شده" : "آزاد"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ))}

//       <button className="btn btn-warning" onClick={addRange} disabled={loading}>
//         ➕ افزودن بازه جدید
//       </button>
//     </div>
//   );
// };

// export default SetTimes;










// import React, { useState, useEffect, useMemo } from "react";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { format } from "date-fns";
// import axiosInstance from "../axiosInstance";
// import "./style/SetTimes.css";

// /** تبدیل اعداد فارسی به انگلیسی */
// const toEnglishDigits = (str) =>
//   String(str).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

// /** کمک‌کننده: بسازDate از (dateStr YYYY-MM-DD, timeStr HH:mm) */
// const buildDateTime = (dateStr, timeStr) => {
//   // dateStr ممکنه از سرور بیاد (YYYY-MM-DD)
//   // timeStr به شکل HH:mm
//   try {
//     const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
//     const [hh, mm] = timeStr.split(":").map((n) => parseInt(n, 10));
//     return new Date(y, m - 1, d, hh, mm, 0, 0);
//   } catch {
//     return null;
//   }
// };

// /** true اگر رنج منقضی شده: وقتی انتهای رنج قبل از الان باشد */
// const isRangeExpired = (range) => {
//   if (!range?.date || !range?.to_time) return false;
//   const end = buildDateTime(range.date, range.to_time);
//   return end ? end.getTime() < Date.now() : false;
// };

// /** true اگر اسلات منقضی شده */
// const isSlotExpired = (rangeDate, slot) => {
//   const end = buildDateTime(rangeDate, slot.end);
//   return end ? end.getTime() < Date.now() : false;
// };

// const SetTimes = () => {
//   const [ranges, setRanges] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /** دریافت رنج‌ها + اسلات‌ها و فیلتر منقضی‌شده‌ها */
//   const fetchAllRanges = async () => {
//     try {
//       const res = await axiosInstance.get("/timeslots/my/");
//       const serverRanges = res.data || [];

//       const detailed = await Promise.all(
//         serverRanges.map(async (range) => {
//           const detail = await axiosInstance.get(
//             `/timeslots/range/?range_id=${range.id}`
//           );

//           // تاریخ رنج از detail.data.date میاد (فرض: YYYY-MM-DD)
//           const rangeDate = detail.data.date;

//           // اسلات‌ها را بسازیم و اسلات‌های منقضی‌شده را حذف کنیم
//           const slots = (detail.data.slots || [])
//             .map((s) => ({
//               id: s.id,
//               start: (s.start_time || "").substring(0, 5), // HH:mm
//               end: (s.end_time || "").substring(0, 5), // HH:mm
//               // فعلاً فقط is_reserved داریم؛ بعداً اگر status اضافه شد از آن استفاده کن
//               is_reserved: !!s.is_reserved,
//               // placeholder: status: s.status || "free"
//             }))
//             .filter((slot) => !isSlotExpired(rangeDate, slot));

//           return {
//             id: Date.now() + Math.random(), // کلید لوکال
//             serverId: range.id,
//             date: rangeDate, // نگه داریم YYYY-MM-DD
//             from_time: (range.from_time || "").substring(0, 5),
//             to_time: (range.to_time || "").substring(0, 5),
//             duration: range.duration,
//             slots,
//           };
//         })
//       );

//       // رنج‌های منقضی‌شده را حذف کنیم (و اگر همه اسلات‌هایش منقضی شده، نمایش ندهیم)
//       const activeRanges = detailed
//         .map((r) => ({ ...r, slots: r.slots.filter((s) => true) }))
//         .filter((r) => !isRangeExpired(r) && r.slots.length > 0);

//       setRanges(activeRanges);
//     } catch (err) {
//       console.error(err);
//       alert("خطا در دریافت بازه‌ها");
//     }
//   };

//   useEffect(() => {
//     fetchAllRanges();
//     // پیشنهاد: هر 60ثانیه یک بار رفرش شود تا وضعیت‌ها آپدیت شوند
//     const t = setInterval(fetchAllRanges, 60000);
//     return () => clearInterval(t);
//   }, []);

//   const addRange = () => {
//     const now = format(new Date(), "HH:mm");
//     setRanges((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         date: null,
//         from_time: now,
//         to_time: now,
//         duration: "",
//         slots: [],
//         serverId: null,
//       },
//     ]);
//   };

//   const updateRange = (id, key, value) => {
//     setRanges((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
//   };

//   const removeRange = async (id) => {
//     const range = ranges.find((r) => r.id === id);
//     if (range?.serverId) {
//       try {
//         await axiosInstance.delete(`/timeslots/range/${range.serverId}`);
//         fetchAllRanges();
//       } catch {
//         alert("خطا در حذف بازه");
//       }
//     } else {
//       setRanges((prev) => prev.filter((r) => r.id !== id));
//     }
//   };

//   const generateSlots = async (id) => {
//     setLoading(true);
//     const r = ranges.find((range) => range.id === id);
//     const duration = parseInt(r.duration);

//     if (!r.date || !r.from_time || !r.to_time || isNaN(duration) || duration <= 0) {
//       alert("لطفاً همه فیلدها را کامل و درست وارد کنید.");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       date: toEnglishDigits(r.date.format("YYYY-MM-DD")),
//       from_time: `${r.from_time}:00`,
//       to_time: `${r.to_time}:00`,
//       duration_minutes: duration,
//     };

//     try {
//       const res = await axiosInstance.post("/timeslots/", payload);
//       setRanges((prev) =>
//         prev.map((rr) => (rr.id === id ? { ...rr, serverId: res.data.range_id } : rr))
//       );
//       fetchAllRanges();
//     } catch (err) {
//       console.error(err);
//       alert("خطا در ذخیره بازه جدید");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const today = useMemo(() => new Date(), []);

//   return (
//     <div className="set-times-container">
//       <h2 className="title">مدیریت بازه‌های زمانی</h2>

//       {ranges.map((r) => (
//         <div key={r.id} className="range-block">
//           {!r.serverId ? (
//             <div className="inputs">
//               <DatePicker
//                 calendar={persian}
//                 locale={persian_fa}
//                 format="YYYY/MM/DD"
//                 calendarPosition="bottom-right"
//                 value={r.date}
//                 onChange={(val) => updateRange(r.id, "date", val)}
//                 minDate={today}
//               />
//               <input
//                 type="text"
//                 placeholder="ساعت شروع (HH:mm)"
//                 value={r.from_time}
//                 onChange={(e) => updateRange(r.id, "from_time", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="ساعت پایان (HH:mm)"
//                 value={r.to_time}
//                 onChange={(e) => updateRange(r.id, "to_time", e.target.value)}
//               />
//               <input
//                 type="number"
//                 placeholder="مدت (دقیقه)"
//                 value={r.duration}
//                 onChange={(e) => updateRange(r.id, "duration", e.target.value)}
//                 min={1}
//               />
//               <div className="btn-group">
//                 <button className="btn btn-primary" onClick={() => generateSlots(r.id)} disabled={loading}>
//                   ✔️ تایید
//                 </button>
//                 <button className="btn btn-danger" onClick={() => removeRange(r.id)} disabled={loading}>
//                   🗑 حذف
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="existing-range">
//               <div className="range-header">
//                 <strong>
//                   تاریخ: {new Date(r.date).toLocaleDateString("fa-IR")}، از {r.from_time} تا {r.to_time}
//                 </strong>
//                 <button className="btn btn-danger" onClick={() => removeRange(r.id)}>
//                   حذف کل بازه
//                 </button>
//               </div>

//               <table className="existing-table">
//                 <thead>
//                   <tr>
//                     <th>ساعت</th>
//                     <th>وضعیت</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {r.slots.map((slot) => {
//                     // الان فقط is_reserved داریم
//                     const isExpired = isSlotExpired(r.date, slot);
//                     const status = isExpired
//                       ? "expired"
//                       : slot.is_reserved
//                       ? "approved" // یا "booked"
//                       : "free";

//                     return (
//                       <tr key={slot.id} className={`row-${status}`}>
//                         <td>{slot.start} - {slot.end}</td>
//                         <td>
//                           {status === "expired" && <span className="badge badge-gray">منقضی</span>}
//                           {status === "free" && <span className="badge badge-green">آزاد</span>}
//                           {status === "approved" && <span className="badge badge-red">رزرو شده</span>}
//                           {/* اگر بعداً status="pending" از سرور بیاد: */}
//                           {/* {status === "pending" && <span className="badge badge-yellow">در انتظار</span>} */}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ))}

//       <button className="btn btn-warning" onClick={addRange} disabled={loading}>
//         ➕ افزودن بازه جدید
//       </button>
//     </div>
//   );
// };

// export default SetTimes;






// import React, { useEffect, useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // کمکی: تشخیص منقضی بودن اسلات
//   const isExpired = (slot) => {
//     if (!slot?.date || !slot?.start_time) return false;
//     // تلاش برای ساخت Date دقیق
//     try {
//       // اگر start_time به صورت "HH:MM" بود:
//       const time = slot.start_time.length <= 5 ? `${slot.start_time}:00` : slot.start_time;
//       // اگر Z ندارد، به عنوان local parse می‌شود. اگر Z دارد، UTC است.
//       const isoLike = time.endsWith("Z") ? `${slot.date}T${time}` : `${slot.date}T${time}`;
//       const start = new Date(isoLike);
//       return isNaN(start.getTime()) ? false : start.getTime() < Date.now();
//     } catch {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await axiosInstance.get(`/public/counselor/${id}`);
//         setCounselor(res.data || null);

//         const raw = Array.isArray(res.data?.free_slots) ? res.data.free_slots : [];
//         // حذف اسلات‌های منقضی
//         const futureOnly = raw.filter((s) => !isExpired(s));
//         setSlots(futureOnly);
//       } catch (e) {
//         setError("خطا در دریافت اطلاعات مشاور");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]);

//   const bookAppointment = async (slotId) => {
//     try {
//       await axiosInstance.post("/appointments/book/", {
//         slot_id: slotId,
//         notes: "درخواست رزرو توسط دانش‌آموز",
//       });
//       // رزرو موفق: همان اسلات را قرمز/رزرو شده کن
//       setSlots((prev) =>
//         prev.map((s) => (s.id === slotId ? { ...s, is_reserved: true } : s))
//       );
//       alert("✅ وقت با موفقیت رزرو شد");
//     } catch (err) {
//       console.error("❌ خطا در رزرو:", err.response?.data || err.message);
//       alert("❌ خطا در رزرو وقت: " + (err.response?.data?.detail || "نامشخص"));
//     }
//   };

//   const visibleSlots = useMemo(() => slots, [slots]);

//   if (loading) return <p>در حال بارگذاری...</p>;
//   if (error) return <p>{error}</p>;
//   if (!counselor) return null;

//   return (
//     <div className="counselor-profile dark-mode">
//       <div className="counselor-header">
//         <img src={counselor.profile_image_url} alt="Profile" className="counselor-image" />
//         <div className="counselor-info">
//           <h2>{counselor.firstname} {counselor.lastname}</h2>
//           <p><strong>ایمیل:</strong> {counselor.email}</p>
//           <p><strong>حوزه:</strong> {counselor.department}</p>
//           <p><strong>استان:</strong> {counselor.province}</p>
//           <p><strong>شهر:</strong> {counselor.city}</p>
//         </div>
//       </div>

//       <h3 className="slots-title">🕒 زمان‌های مشاور</h3>

//       {visibleSlots.length === 0 ? (
//         <p style={{ color: "#ccc" }}>زمان آزادی یافت نشد.</p>
//       ) : (
//         <table className="slots-table">
//           <thead>
//             <tr>
//               <th>تاریخ</th>
//               <th>از</th>
//               <th>تا</th>
//               <th>وضعیت</th>
//             </tr>
//           </thead>
//           <tbody>
//             {visibleSlots.map((slot) => (
//               <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//                 <td>{slot.date}</td>
//                 <td>{slot.start_time?.substring(0, 5)}</td>
//                 <td>{slot.end_time?.substring(0, 5)}</td>
//                 <td>
//                   {slot.is_reserved ? (
//                     <span className="reserved-label">رزرو شده</span>
//                   ) : (
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => bookAppointment(slot.id)}
//                     >
//                       رزرو
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }







// import React, { useState, useEffect } from "react";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { format } from "date-fns";
// import axiosInstance from "../axiosInstance";
// import "./style/SetTimes.css";

// // تبدیل اعداد فارسی به انگلیسی برای تاریخ‌پیکر
// const toEnglishDigits = (str) =>
//   str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

// const timeToMinutes = (hhmm) => {
//   if (!hhmm) return 0;
//   const [h, m] = hhmm.substring(0, 5).split(":").map(Number);
//   return (h || 0) * 60 + (m || 0);
// };

// const isRangeExpired = (dateStr, toTimeHHMM) => {
//   // dateStr = "YYYY-MM-DD"
//   const today = new Date();
//   const d = new Date(dateStr + "T00:00:00");
//   today.setHours(0, 0, 0, 0);
//   d.setHours(0, 0, 0, 0);

//   if (d < today) return true; // قبل از امروز
//   if (d > today) return false; // آینده
//   // امروز → اگر ساعت پایان گذشته باشد
//   const minutesNow = new Date().getHours() * 60 + new Date().getMinutes();
//   return timeToMinutes(toTimeHHMM) <= minutesNow;
// };

// const isSlotExpired = (dateStr, endHHMM) => {
//   const today = new Date();
//   const d = new Date(dateStr + "T00:00:00");
//   today.setHours(0, 0, 0, 0);
//   d.setHours(0, 0, 0, 0);

//   if (d < today) return true;
//   if (d > today) return false;
//   const minutesNow = new Date().getHours() * 60 + new Date().getMinutes();
//   return timeToMinutes(endHHMM) <= minutesNow;
// };

// export default function SetTimes() {
//   const [ranges, setRanges] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // const fetchAllRanges = async () => {
//   //   try {
//   //     const res = await axiosInstance.get("/timeslots/my/");
//   //     const serverRanges = res.data || [];

//   //     const detailed = await Promise.all(
//   //       serverRanges.map(async (range) => {
//   //         const detail = await axiosInstance.get(
//   //           `/timeslots/range/?range_id=${range.id}`
//   //         );

//   //         const dateStr = detail.data.date; // "YYYY-MM-DD"
//   //         const fromHHMM = (range.from_time || "").substring(0, 5);
//   //         const toHHMM = (range.to_time || "").substring(0, 5);

//   //         const slotsRaw = (detail.data.slots || []).map((s) => {
//   //           const start = (s.start_time || "").substring(0, 5);
//   //           const end = (s.end_time || "").substring(0, 5);
//   //           return {
//   //             id: s.id,
//   //             start,
//   //             end,
//   //             is_reserved: !!s.is_reserved,
//   //           };
//   //         });

//   //         // فقط اسلات‌های آینده
//   //         const futureSlots = slotsRaw.filter(
//   //           (s) => !isSlotExpired(dateStr, s.end)
//   //         );

//   //         return {
//   //           id: Date.now() + Math.random(),
//   //           serverId: range.id,
//   //           date: dateStr,
//   //           from_time: fromHHMM,
//   //           to_time: toHHMM,
//   //           duration: range.duration,
//   //           slots: futureSlots,
//   //         };
//   //       })
//   //     );

//   //     // رنج‌های گذشته حذف
//   //     setRanges(detailed.filter((r) => !isRangeExpired(r.date, r.to_time)));
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("❌ خطا در دریافت بازه‌ها");
//   //   }
//   // };

//   const fetchAllRanges = async () => {
//     try {
//       const res = await axiosInstance.get("/timeslots/my/");
//       const serverRanges = Array.isArray(res.data) ? res.data : [];
  
//       const detailedResults = await Promise.allSettled(
//         serverRanges.map(async (range) => {
//           try {
//             const detail = await axiosInstance.get(`/timeslots/range/`, {
//               params: { range_id: range.id },
//             });
  
//             const d = detail.data;
//             // محافظت در برابر تاریخ/زمان ناقص
//             const dateStr = d?.date || range?.date || null;
//             const from = (range?.from_time || "").substring?.(0,5) || "";
//             const to   = (range?.to_time || "").substring?.(0,5) || "";
  
//             return {
//               ok: true,
//               value: {
//                 id: Date.now() + Math.random(),
//                 serverId: range.id,
//                 date: dateStr,
//                 from_time: from,
//                 to_time: to,
//                 duration: range.duration,
//                 slots: (d?.slots || []).map((s) => ({
//                   id: s.id,
//                   start: s.start_time?.substring?.(0,5) || "",
//                   end: s.end_time?.substring?.(0,5) || "",
//                   is_reserved: !!s.is_reserved,
//                 })),
//               }
//             };
//           } catch (err) {
//             console.warn("❗️خطا در دریافت جزئیات رنج", range.id, err);
//             return { ok: false, reason: err };
//           }
//         })
//       );
  
//       const detailed = detailedResults
//         .filter(r => r.status === "fulfilled" && r.value?.ok)
//         .map(r => r.value.value);
  
//       setRanges(detailed);
//     } catch (err) {
//       console.error("خطا در دریافت بازه‌ها:", err);
//       alert("خطا در دریافت بازه‌ها");
//     }
//   };
  

//   useEffect(() => {
//     fetchAllRanges();
//   }, []);

//   const addRange = () => {
//     const now = format(new Date(), "HH:mm");
//     setRanges((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         date: null,
//         from_time: now,
//         to_time: now,
//         duration: "",
//         slots: [],
//         serverId: null,
//       },
//     ]);
//   };

//   const updateRange = (id, key, value) => {
//     setRanges((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
//   };

//   const removeRange = async (id) => {
//     const range = ranges.find((r) => r.id === id);
//     if (range?.serverId) {
//       try {
//         await axiosInstance.delete(`/timeslots/range/${range.serverId}`);
//         await fetchAllRanges();
//       } catch {
//         alert("❌ خطا در حذف بازه");
//       }
//     } else {
//       setRanges((prev) => prev.filter((r) => r.id !== id));
//     }
//   };

//   const generateSlots = async (id) => {
//     setLoading(true);
//     const r = ranges.find((range) => range.id === id);
//     const duration = parseInt(r.duration, 10);

//     if (!r.date || !r.from_time || !r.to_time || isNaN(duration) || duration <= 0) {
//       alert("لطفاً همه فیلدها را کامل و درست وارد کنید.");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       date: toEnglishDigits(r.date.format("YYYY-MM-DD")),
//       from_time: `${r.from_time}:00`,
//       to_time: `${r.to_time}:00`,
//       duration_minutes: duration,
//     };

//     try {
//       await axiosInstance.post("/timeslots/", payload);
//       // به پاسخ تکیه نکن؛ کل لیست را دوباره بگیر که با API سازگار بماند
//       await fetchAllRanges();
//     } catch (err) {
//       console.error(err);
//       alert("❌ خطا در ذخیره بازه جدید");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const today = new Date();

//   return (
//     <div className="set-times-container">
//       <h2 className="title">مدیریت بازه‌های زمانی</h2>

//       {ranges.map((r) => (
//         <div key={r.id} className="range-block">
//           {!r.serverId ? (
//             <div className="inputs">
//               <div>
//                 <label>تاریخ:</label>
//                 <br />
//                 <DatePicker
//                   calendar={persian}
//                   locale={persian_fa}
//                   format="YYYY/MM/DD"
//                   calendarPosition="bottom-right"
//                   value={r.date}
//                   onChange={(val) => updateRange(r.id, "date", val)}
//                   minDate={today}
//                 />
//               </div>

//               <div>
//                 <label>ساعت شروع:</label>
//                 <br />
//                 <input
//                   type="text"
//                   placeholder="hh:mm"
//                   value={r.from_time}
//                   onChange={(e) => updateRange(r.id, "from_time", e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label>ساعت پایان:</label>
//                 <br />
//                 <input
//                   type="text"
//                   placeholder="hh:mm"
//                   value={r.to_time}
//                   onChange={(e) => updateRange(r.id, "to_time", e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label>مدت (دقیقه):</label>
//                 <br />
//                 <input
//                   type="number"
//                   placeholder="مثلاً 30"
//                   value={r.duration}
//                   onChange={(e) => updateRange(r.id, "duration", e.target.value)}
//                 />
//               </div>

//               <div className="btn-group">
//                 <button onClick={() => generateSlots(r.id)} disabled={loading}>
//                   ✔️ تایید
//                 </button>
//                 <button onClick={() => removeRange(r.id)} disabled={loading}>
//                   🗑 حذف
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="existing-range">
//               <div className="range-header">
//                 <strong>
//                   تاریخ: {new Date(r.date).toLocaleDateString("fa-IR")}، از {r.from_time} تا {r.to_time}
//                 </strong>
//                 <button className="btn btn-danger" onClick={() => removeRange(r.id)}>
//                   حذف کل بازه
//                 </button>
//               </div>
//               <table className="existing-table">
//                 <thead>
//                   <tr>
//                     <th>ساعت</th>
//                     <th>وضعیت</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {r.slots.map((slot) => (
//                     <tr key={slot.id}>
//                       <td>
//                         {slot.start} - {slot.end}
//                       </td>
//                       <td>{slot.is_reserved ? "رزرو شده" : "آزاد"}</td>
//                     </tr>
//                   ))}
//                   {r.slots.length === 0 && (
//                     <tr>
//                       <td colSpan={2} style={{ textAlign: "center", opacity: 0.7 }}>
//                         اسلات فعالی وجود ندارد
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ))}

//       <button className="btn btn-warning" onClick={addRange} disabled={loading}>
//         ➕ افزودن بازه جدید
//       </button>
//     </div>
//   );
// }


// src/components/SetTimes.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { format } from "date-fns";
import axiosInstance from "../axiosInstance";
import "./style/SetTimes.css";

/** اعداد فارسی -> انگلیسی */
const toEnglishDigits = (str = "") =>
  String(str).replace(/[\u06F0-\u06F9]/g, (d) =>
    "0123456789"["\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d)]
  );

/** گرفتن HH:MM -> دقیقه */
const timeToMinutes = (hhmm = "") => {
  const [h, m] = (hhmm.substring?.(0, 5) || "").split(":").map((n) => parseInt(n || "0", 10));
  return (h || 0) * 60 + (m || 0);
};

/** تاریخ YYYY-MM-DD + ساعت پایان => آیا منقضی شده؟ */
const isRangeExpired = (dateStr, toTimeHHMM) => {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(`${dateStr}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  if (d < today) return true;
  if (d > today) return false;

  const minutesNow = new Date().getHours() * 60 + new Date().getMinutes();
  return timeToMinutes(toTimeHHMM) <= minutesNow;
};

/** اسلات منقضی؟ */
const isSlotExpired = (dateStr, endHHMM) => {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(`${dateStr}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  if (d < today) return true;
  if (d > today) return false;

  const minutesNow = new Date().getHours() * 60 + new Date().getMinutes();
  return timeToMinutes(endHHMM) <= minutesNow;
};

/** تاریخ خروجی از DatePicker -> YYYY-MM-DD */
const formatDateForApi = (val) => {
  // اگر آبجکت DateObject باشه:
  if (val && typeof val?.format === "function") {
    return toEnglishDigits(val.format("YYYY-MM-DD"));
  }
  // اگر رشته باشه، سعی می‌کنیم تمیزش کنیم
  if (typeof val === "string") {
    // نمونه ورودی: 1403/05/20 -> تبدیل به 2025-08-11 رو خود DatePicker انجام میده معمولا
    // اگر از قبل میلادیه مثل 2025-08-11 همان را برگردان
    return toEnglishDigits(val).replace(/\//g, "-");
  }
  return null;
};

export default function SetTimes() {
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(false);

  /** همه‌ی بازه‌های خود مشاور + جزئیات اسلات‌ها */
  const fetchAllRanges = async () => {
    try {
      const res = await axiosInstance.get("/timeslots/my/");
      const serverRanges = Array.isArray(res.data) ? res.data : [];

      const details = await Promise.all(
        serverRanges.map(async (range) => {
          const { data } = await axiosInstance.get("/timeslots/range/", {
            params: { range_id: range.id },
          });

          const dateStr = data?.date || range?.date || null;
          const from = (range?.from_time || "").substring(0, 5);
          const to = (range?.to_time || "").substring(0, 5);

          const slots = (data?.slots || []).map((s) => ({
            id: s.id,
            start: s.start_time?.substring?.(0, 5) || "",
            end: s.end_time?.substring?.(0, 5) || "",
            is_reserved: !!s.is_reserved,
          }));

          // فقط اسلات‌های آینده
          const futureSlots = slots.filter((s) => !isSlotExpired(dateStr, s.end));

          return {
            id: Date.now() + Math.random(), // کلید محلی
            serverId: range.id,
            date: dateStr, // YYYY-MM-DD
            from_time: from,
            to_time: to,
            duration: range.duration,
            slots: futureSlots,
          };
        })
      );

      // رنج‌های منقضی حذف
      setRanges(details.filter((r) => !isRangeExpired(r.date, r.to_time)));
    } catch (err) {
      console.error("❌ خطا در دریافت بازه‌ها:", err);
      alert("❌ خطا در دریافت بازه‌ها");
    }
  };

  useEffect(() => {
    fetchAllRanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRange = () => {
    const now = format(new Date(), "HH:mm");
    setRanges((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: null,
        from_time: now,
        to_time: now,
        duration: "",
        slots: [],
        serverId: null,
      },
    ]);
  };

  const updateRange = (id, key, value) => {
    setRanges((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const removeRange = async (id) => {
    const range = ranges.find((r) => r.id === id);
    if (range?.serverId) {
      try {
        await axiosInstance.delete(`/timeslots/range/${range.serverId}`);
        await fetchAllRanges();
      } catch (e) {
        console.error(e);
        alert("❌ خطا در حذف بازه");
      }
    } else {
      setRanges((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // اعداد فارسی → انگلیسی
  const toEnglishDigits = (str = "") =>
  String(str).replace(/[\u06F0-\u06F9]/g, (d) =>
    "0123456789"["\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d)]
  );

  // چون بکند تاریخ جلالی می‌خواد، تبدیل تقویم انجام نمی‌دیم؛ فقط اعداد رو انگلیسی می‌کنیم
  const formatJalaliForApi = (val) => {
  // val از DatePicker با تقویم Persian معمولاً DateObject جلالی هست
  if (val && typeof val?.format === "function") {
    // خروجی: 1404-05-20
    return toEnglishDigits(val.format("YYYY-MM-DD"));
  }
  // اگر رشته بود (fallback)
  return toEnglishDigits(String(val)).replace(/\//g, "-");
  };

  // زمان رو نرمال کن به HH:mm:ss
  const normalizeTime = (t) => {
  if (!t) return null;
  const hhmm = String(t).slice(0,5);     // "HH:mm"
  const [h, m] = hhmm.split(":");
  if (!h || !m) return null;
  const pad = (x) => x.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:00`;
  };


  const generateSlots = async (id) => {
    setLoading(true);
    try {
      const r = ranges.find((range) => range.id === id);
      const duration = Number(r.duration);

      const dateForApi = formatDateForApi(r.date);
      if (!dateForApi || !r.from_time || !r.to_time || !duration || duration <= 0) {
        alert("لطفاً تاریخ، ساعت شروع/پایان و مدت (دقیقه) را صحیح وارد کنید.");
        return;
      }

      const payload = {
        date: formatJalaliForApi(r.date),           // مثلا "1404-05-20" (جلالی)
        from_time: normalizeTime(r.from_time),      // "HH:mm:ss"
        to_time: normalizeTime(r.to_time),          // "HH:mm:ss"
        duration_minutes: Number(r.duration),       // عدد معتبر
      };
      
      if (!payload.date || !payload.from_time || !payload.to_time || !payload.duration_minutes) {
        alert("لطفاً تاریخ، ساعات و مدت را به‌درستی وارد کنید.");
        setLoading(false);
        return;
      }
      
      try {
        const res = await axiosInstance.post("/timeslots/", payload);
        // برای دیباگ دقیق‌تر:
        console.log("POST /timeslots payload:", payload, "resp:", res.data);
        await fetchAllRanges();
      } catch (err) {
        console.error("❌ POST /timeslots error:", err?.response?.data || err.message);
        alert("❌ خطا در ذخیره بازه: " + (err?.response?.data?.detail || "نامشخص"));
      } finally {
        setLoading(false);
      }
      

      // await axiosInstance.post("/timeslots/", payload);
      await fetchAllRanges();
    } catch (err) {
      console.error("❌ خطا در ایجاد بازه:", err);
      // اگر CORS دیدی + 500، مشکل اصلی بکندِ 500 هست. لاگ سرور رو چک کن.
      alert("❌ خطا در ذخیره بازه جدید");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();

  return (
    <div className="set-times-container">
      <h2 className="title">مدیریت بازه‌های زمانی</h2>

      {ranges.map((r) => (
        <div key={r.id} className="range-block">
          {!r.serverId ? (
            <div className="inputs">
              <div>
                <label>تاریخ:</label>
                <br />
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY-MM-DD"
                  calendarPosition="bottom-right"
                  value={r.date}
                  onChange={(val) => updateRange(r.id, "date", val)}
                  minDate={today}
                />
              </div>

              <div>
                <label>ساعت شروع:</label>
                <br />
                <input
                  type="text"
                  placeholder="HH:MM"
                  value={r.from_time}
                  onChange={(e) => updateRange(r.id, "from_time", e.target.value)}
                />
              </div>

              <div>
                <label>ساعت پایان:</label>
                <br />
                <input
                  type="text"
                  placeholder="HH:MM"
                  value={r.to_time}
                  onChange={(e) => updateRange(r.id, "to_time", e.target.value)}
                />
              </div>

              <div>
                <label>مدت (دقیقه):</label>
                <br />
                <input
                  type="number"
                  placeholder="مثلاً 30"
                  value={r.duration}
                  onChange={(e) => updateRange(r.id, "duration", e.target.value)}
                />
              </div>

              <div className="btn-group">
                <button onClick={() => generateSlots(r.id)} disabled={loading}>
                  ✔️ تایید
                </button>
                <button onClick={() => removeRange(r.id)} disabled={loading}>
                  🗑 حذف
                </button>
              </div>
            </div>
          ) : (
            <div className="existing-range">
              <div className="range-header">
                <strong>
                  تاریخ: {r.date ? new Date(r.date).toLocaleDateString("fa-IR") : "-"}، از {r.from_time} تا {r.to_time}
                </strong>
                <button className="btn btn-danger" onClick={() => removeRange(r.id)}>
                  حذف کل بازه
                </button>
              </div>

              <table className="existing-table">
                <thead>
                  <tr>
                    <th>ساعت</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {r.slots.map((slot) => (
                    <tr key={slot.id}>
                      <td>{slot.start} - {slot.end}</td>
                      <td>{slot.is_reserved ? "رزرو شده" : "آزاد"}</td>
                    </tr>
                  ))}
                  {r.slots.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ textAlign: "center", opacity: 0.7 }}>
                        اسلات فعالی وجود ندارد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <button className="btn btn-warning" onClick={addRange} disabled={loading}>
        ➕ افزودن بازه جدید
      </button>
    </div>
  );
}
