// import React, { useEffect } from "react";
// import "./style/Planning.css";

// const Planning = () => {
//   useEffect(() => {
//     const container = document.getElementById("accordion");
//     container.innerHTML = ""; 

//     const today = new Date();

//     const days = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i); 

//       const jalaliDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       }).format(date);

//       const dayName = days[date.getDay()];

//       const dayHTML = `
//         <div>
//           <div class="day-header" onclick="toggleDay(this)">
//             ${dayName} ${jalaliDate} <span>⬇️</span>
//           </div>
//           <div class="day-body">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ساعت شروع</th>
//                   <th>ساعت پایان</th>
//                   <th>فعالیت</th>
//                   <th>وضعیت من</th>
//                   <th>یادداشت من</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td><input type="time" /></td>
//                   <td><input type="time" /></td>
//                   <td><input type="text" placeholder="عنوان فعالیت" /></td>
//                   <td>
//                     <select>
//                       <option>⏳ هنوز انجام ندادم</option>
//                       <option>✅ انجام دادم</option>
//                       <option>❌ انجام ندادم</option>
//                     </select>
//                   </td>
//                   <td><input type="text" placeholder="یادداشت اختیاری" /></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       `;
//       container.insertAdjacentHTML("beforeend", dayHTML);
//     }

//     window.toggleDay = function (header) {
//       const body = header.nextElementSibling;
//       const arrow = header.querySelector("span");

//       if (body.style.display === "block") {
//         body.style.display = "none";
//         arrow.textContent = "⬇️";
//       } else {
//         body.style.display = "block";
//         arrow.textContent = "⬆️";
//       }
//     };
//   }, []);

//   return (
//     <div className="planning-page">
//       <h2>📆 برنامه‌ریزی من (هفته آینده)</h2>
//       <div id="accordion"></div>
//       <div style={{ textAlign: "center" }}>
//         <button className="submit">📤 ثبت نهایی وضعیت‌های من</button>
//       </div>
//     </div>
//   );
// };

// export default Planning;


// // src/components/Planning.jsx
// import React, { useEffect } from "react";
// import axiosInstance from "../axiosInstance";
// import "./style/Planning.css";

// const ENDPOINTS = {
//   myPlan: "/study-plan/student/my",                 // GET
//   updateStatus: "/study-plan/student/update-status",// POST [ { activity_id, status, student_note } ]
//   submitStatus: "/study-plan/student/submit-status" // POST
// };

// const STATUS_LABELS = {
//   pending: "⏳ هنوز انجام ندادم",
//   done: "✅ انجام دادم",
//   not_done: "❌ انجام ندادم",
// };

// const STATUS_VALUES = ["pending", "done", "not_done"];

// const Planning = () => {
//   useEffect(() => {
//     const container = document.getElementById("accordion");
//     container.innerHTML = "";

//     // 1) گرفتن برنامه از API
//     (async () => {
//       try {
//         const res = await axiosInstance.get(ENDPOINTS.myPlan, {
//           headers: { Accept: "application/json" },
//         });

//         const activities = Array.isArray(res?.data?.activities) ? res.data.activities : [];

//         // گروه‌بندی بر اساس تاریخ
//         const byDate = activities.reduce((acc, a) => {
//           const date = a.date; // YYYY-MM-DD
//           (acc[date] ||= []).push(a);
//           return acc;
//         }, {});
//         const dates = Object.keys(byDate).sort();

//         if (dates.length === 0) {
//           container.insertAdjacentHTML("beforeend", `<p class="muted">برای این بازه برنامه‌ای وجود ندارد.</p>`);
//           return;
//         }

//         // 2) برای هر تاریخ یک آکاردئون بساز
//         dates.forEach((isoDate) => {
//           const dateObj = new Date(`${isoDate}T00:00:00Z`);
//           const jalaliDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//           }).format(dateObj);

//           const dayName = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"][dateObj.getDay()];

//           // ردیف‌های فعالیت
//           const rowsHTML = byDate[isoDate]
//             .map((a) => {
//               const st = a.status || "pending";
//               const note = a.student_note || "";
//               const start = (a.start_time || "").slice(0, 5) || "";
//               const end = (a.end_time || "").slice(0, 5) || "";
//               const title = a.title || "";
//               const desc = a.description || "";

//               return `
//                 <tr data-activity-id="${a.activity_id ?? a.id}">
//                   <td>${escapeHtml(start)}</td>
//                   <td>${escapeHtml(end)}</td>
//                   <td title="${escapeHtml(desc)}">${escapeHtml(title)}</td>
//                   <td>
//                     <select class="status-select">
//                       ${STATUS_VALUES.map(
//                         (val) =>
//                           `<option value="${val}" ${val === st ? "selected" : ""}>${STATUS_LABELS[val]}</option>`
//                       ).join("")}
//                     </select>
//                   </td>
//                   <td>
//                     <input type="text" class="note-input" placeholder="یادداشت اختیاری" value="${escapeAttr(
//                       note
//                     )}" />
//                   </td>
//                 </tr>
//               `;
//             })
//             .join("");

//           const dayHTML = `
//             <div class="day-card">
//               <div class="day-header" onclick="toggleDay(this)">
//                 ${dayName} ${jalaliDate}
//                 <span class="arrow">⬇️</span>
//               </div>
//               <div class="day-body">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>ساعت شروع</th>
//                       <th>ساعت پایان</th>
//                       <th>فعالیت</th>
//                       <th>وضعیت من</th>
//                       <th>یادداشت من</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${rowsHTML}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           `;
//           container.insertAdjacentHTML("beforeend", dayHTML);
//         });
//       } catch (e) {
//         console.error(e);
//         container.insertAdjacentHTML(
//           "beforeend",
//           `<div class="banner error">خطا در دریافت برنامه.</div>`
//         );
//       }
//     })();

//     // 3) توگل آکاردئون
//     window.toggleDay = function (header) {
//       const body = header.nextElementSibling;
//       const arrow = header.querySelector(".arrow");
//       if (body.style.display === "block") {
//         body.style.display = "none";
//         if (arrow) arrow.textContent = "⬇️";
//       } else {
//         body.style.display = "block";
//         if (arrow) arrow.textContent = "⬆️";
//       }
//     };

//     // 4) هندل «ثبت نهایی وضعیت‌ها»
//     const submitBtn = document.querySelector(".submit");
//     const onSubmit = async () => {
//       try {
//         // جمع‌آوری همه ردیف‌ها
//         const rows = container.querySelectorAll("tbody tr[data-activity-id]");
//         const payload = Array.from(rows).map((tr) => {
//           const id = Number(tr.getAttribute("data-activity-id"));
//           const status = tr.querySelector(".status-select")?.value || "pending";
//           const note = tr.querySelector(".note-input")?.value?.trim() || "";
//           return { activity_id: id, status, student_note: note };
//         });

//         // اول ذخیره وضعیت‌ها
//         await axiosInstance.post(ENDPOINTS.updateStatus, payload, {
//           headers: { "Content-Type": "application/json" },
//         });

//         // بعد ارسال نهایی
//         await axiosInstance.post(ENDPOINTS.submitStatus);

//         alert("✅ وضعیت‌ها با موفقیت ارسال شد.");
//       } catch (e) {
//         console.error(e);
//         alert("❌ ارسال وضعیت‌ها با خطا مواجه شد.");
//       }
//     };

//     submitBtn?.addEventListener("click", onSubmit);
//     return () => {
//       submitBtn?.removeEventListener("click", onSubmit);
//       // پاکسازی توابع global
//       delete window.toggleDay;
//     };
//   }, []);

//   return (
//     <div className="planning-page">
//       <h2>📆 برنامه‌ریزی من</h2>
//       <div id="accordion"></div>
//       <div style={{ textAlign: "center" }}>
//         <button className="submit">📤 ثبت نهایی وضعیت‌های من</button>
//       </div>
//     </div>
//   );
// };

// export default Planning;

// /* ---------- helpers ---------- */
// function escapeHtml(s) {
//   return String(s)
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;");
// }
// function escapeAttr(s) {
//   return escapeHtml(s).replaceAll('"', "&quot;");
// }


// // src/components/Planning.jsx
// import React, { useEffect } from "react";
// import axiosInstance from "../axiosInstance";
// import "./style/Planning.css";

// const ENDPOINTS = {
//   myPlan: "/study-plan/student/my",
//   updateStatus: "/study-plan/student/update-status",
//   submitStatus: "/study-plan/student/submit-status",
// };

// const STATUS_LABELS = {
//   pending: "⏳ هنوز انجام ندادم",
//   done: "✅ انجام دادم",
//   not_done: "❌ انجام ندادم",
// };
// const STATUS_VALUES = ["pending", "done", "not_done"];

// /** --- Normalizers --- */
// function normalizeActivities(raw) {
//   // سناریوهای محتمل بکند:
//   // 1) { activities: [...] }
//   // 2) [...]
//   // 3) { plan: { activities: [...] } }
//   // 4) { data: { activities: [...] } } یا اشکال مشابه

//   let acts = [];

//   if (raw && Array.isArray(raw.activities)) {
//     acts = raw.activities;
//   } else if (Array.isArray(raw)) {
//     acts = raw;
//   } else if (raw?.plan && Array.isArray(raw.plan.activities)) {
//     acts = raw.plan.activities;
//   } else if (raw?.data && Array.isArray(raw.data.activities)) {
//     acts = raw.data.activities;
//   } else {
//     // fallback: اگر بکند فعالیت‌ها را با کلید دیگری داده
//     const maybeArray =
//       raw?.data?.plan?.activities ||
//       raw?.plan?.items ||
//       raw?.items ||
//       raw?.rows;
//     if (Array.isArray(maybeArray)) acts = maybeArray;
//   }

//   // نرمال‌سازی هر آیتم
//   return acts.map((a, idx) => {
//     const id = a.activity_id ?? a.id ?? idx + 1;
//     const date = a.date || a.activity_date || "";
//     // زمان‌ها ممکنه "HH:MM", "HH:MM:SS", یا "HH:MM:SS.mmmZ" باشن
//     const st = toHHMM(a.start_time);
//     const et = toHHMM(a.end_time);

//     return {
//       activity_id: Number(id),
//       date,
//       start_time: st,
//       end_time: et,
//       title: a.title || a.name || "",
//       description: a.description || a.desc || "",
//       status: a.status || "pending",
//       student_note: a.student_note || a.note || "",
//     };
//   });
// }

// function toHHMM(t) {
//   if (!t) return "";
//   const s = String(t);
//   // "14:30", "14:30:00", "14:30:00.000Z"
//   if (/^\d{2}:\d{2}$/.test(s)) return s;
//   if (/^\d{2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 5);
//   return s.slice(0, 5);
// }

// /** --- Simple Escapers for innerHTML usage --- */
// function escapeHtml(s) {
//   return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
// }
// function escapeAttr(s) {
//   return escapeHtml(s).replaceAll('"', "&quot;");
// }

// const Planning = () => {
//   useEffect(() => {
//     const container = document.getElementById("accordion");
//     if (!container) return;
//     container.innerHTML = "";

//     (async () => {
//       try {
//         const res = await axiosInstance.get(ENDPOINTS.myPlan, {
//           headers: { Accept: "application/json" },
//         });

//         // لاگ کمک‌تشخیصی
//         console.log("[Planning] /student/my raw response:", res?.data);

//         const activities = normalizeActivities(res?.data);
//         console.log("[Planning] normalized activities:", activities);

//         // گروه‌بندی تاریخ
//         const byDate = activities.reduce((acc, a) => {
//           const d = a.date || "";
//           (acc[d] ||= []).push(a);
//           return acc;
//         }, {});
//         const dates = Object.keys(byDate).filter(Boolean).sort();

//         if (dates.length === 0) {
//           container.insertAdjacentHTML(
//             "beforeend",
//             `<p class="muted">برای این بازه برنامه‌ای وجود ندارد.</p>`
//           );
//           return;
//         }

//         dates.forEach((isoDate) => {
//           const dateObj = new Date(`${isoDate}T00:00:00Z`);
//           const jalaliDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//           }).format(dateObj);
//           const dayName =
//             ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"][dateObj.getDay()];

//           const rowsHTML = byDate[isoDate]
//             .map((a) => {
//               const st = a.status || "pending";
//               const note = a.student_note || "";
//               const start = a.start_time || "";
//               const end = a.end_time || "";
//               const title = a.title || "";
//               const desc = a.description || "";

//               return `
//                 <tr data-activity-id="${a.activity_id}">
//                   <td>${escapeHtml(start)}</td>
//                   <td>${escapeHtml(end)}</td>
//                   <td title="${escapeAttr(desc)}">${escapeHtml(title)}</td>
//                   <td>
//                     <select class="status-select">
//                       ${STATUS_VALUES.map(
//                         (val) =>
//                           `<option value="${val}" ${val === st ? "selected" : ""}>${STATUS_LABELS[val]}</option>`
//                       ).join("")}
//                     </select>
//                   </td>
//                   <td>
//                     <input type="text" class="note-input" placeholder="یادداشت اختیاری" value="${escapeAttr(
//                       note
//                     )}" />
//                   </td>
//                 </tr>
//               `;
//             })
//             .join("");

//           const dayHTML = `
//             <div class="day-card">
//               <div class="day-header" onclick="toggleDay(this)">
//                 ${dayName} ${jalaliDate}
//                 <span class="arrow">⬇️</span>
//               </div>
//               <div class="day-body">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>ساعت شروع</th>
//                       <th>ساعت پایان</th>
//                       <th>فعالیت</th>
//                       <th>وضعیت من</th>
//                       <th>یادداشت من</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${rowsHTML}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           `;
//           container.insertAdjacentHTML("beforeend", dayHTML);
//         });
//       } catch (e) {
//         console.error("[Planning] failed to fetch my plan:", e);
//         const detail = e?.response?.data?.detail || "خطا در دریافت برنامه.";
//         container.insertAdjacentHTML(
//           "beforeend",
//           `<div class="banner error">${escapeHtml(detail)}</div>`
//         );
//       }
//     })();

//     // toggle
//     window.toggleDay = function (header) {
//       const body = header.nextElementSibling;
//       const arrow = header.querySelector(".arrow");
//       if (body.style.display === "block") {
//         body.style.display = "none";
//         if (arrow) arrow.textContent = "⬇️";
//       } else {
//         body.style.display = "block";
//         if (arrow) arrow.textContent = "⬆️";
//       }
//     };

//     const submitBtn = document.querySelector(".submit");
//     const onSubmit = async () => {
//       try {
//         const rows = container.querySelectorAll("tbody tr[data-activity-id]");
//         const payload = Array.from(rows).map((tr) => {
//           const id = Number(tr.getAttribute("data-activity-id"));
//           const status = tr.querySelector(".status-select")?.value || "pending";
//           const note = tr.querySelector(".note-input")?.value?.trim() || "";
//           return { activity_id: id, status, student_note: note };
//         });

//         // به‌روزرسانی وضعیت‌ها
//         await axiosInstance.post(ENDPOINTS.updateStatus, payload, {
//           headers: { "Content-Type": "application/json" },
//         });

//         // ارسال نهایی
//         await axiosInstance.post(ENDPOINTS.submitStatus);

//         alert("✅ وضعیت‌ها با موفقیت ارسال شد.");
//       } catch (e) {
//         console.error("[Planning] submit failed:", e);
//         const msg = e?.response?.data?.detail || "❌ ارسال وضعیت‌ها با خطا مواجه شد.";
//         alert(msg);
//       }
//     };

//     submitBtn?.addEventListener("click", onSubmit);
//     return () => {
//       submitBtn?.removeEventListener("click", onSubmit);
//       delete window.toggleDay;
//     };
//   }, []);

//   return (
//     <div className="planning-page">
//       <h2>📆 برنامه‌ریزی من</h2>
//       <div id="accordion"></div>
//       <div style={{ textAlign: "center" }}>
//         <button className="submit">📤 ثبت نهایی وضعیت‌های من</button>
//       </div>
//     </div>
//   );
// };

// export default Planning;










// // src/components/Planning.jsx
// import React, { useEffect } from "react";
// import axiosInstance from "../axiosInstance";
// import "./style/Planning.css";

// const ENDPOINTS = {
//   myPlan: "/study-plan/student/my",                  // GET
//   updateStatus: "/study-plan/student/update-status", // POST [ { activity_id, status, student_note } ]
//   submitStatus: "/study-plan/student/submit-status", // POST
//   myRecs: "/students/my-recommendations",            // GET [ { recommendation_id, suggested_course } ]
// };

// const STATUS_LABELS = {
//   pending: "⏳ هنوز انجام ندادم",
//   done: "✅ انجام دادم",
//   not_done: "❌ انجام ندادم",
// };
// const STATUS_VALUES = ["pending", "done", "not_done"];

// /* ---------------- Normalizers ---------------- */
// function normalizeActivities(raw) {
//   // سناریوهای محتمل:
//   // 1) { activities: [...] }
//   // 2) [...]
//   // 3) { plan: { activities: [...] } }
//   // 4) { data: { activities: [...] } }
//   let acts = [];
//   if (raw && Array.isArray(raw.activities)) acts = raw.activities;
//   else if (Array.isArray(raw)) acts = raw;
//   else if (raw?.plan && Array.isArray(raw.plan.activities)) acts = raw.plan.activities;
//   else if (raw?.data && Array.isArray(raw.data.activities)) acts = raw.data.activities;
//   else {
//     const maybe = raw?.data?.plan?.activities || raw?.plan?.items || raw?.items || raw?.rows;
//     if (Array.isArray(maybe)) acts = maybe;
//   }

//   return acts.map((a, idx) => ({
//     activity_id: Number(a.activity_id ?? a.id ?? idx + 1), // باید از بک‌اند activity_id بیاد
//     date: a.date || a.activity_date || "",
//     start_time: toHHMM(a.start_time),
//     end_time: toHHMM(a.end_time),
//     title: a.title || a.name || "",
//     description: a.description || a.desc || "",
//     status: a.status || "pending",
//     student_note: a.student_note || a.note || "",
//   }));
// }
// function toHHMM(t) {
//   if (!t) return "";
//   const s = String(t);
//   if (/^\d{2}:\d{2}$/.test(s)) return s;
//   if (/^\d{2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 5);
//   return s.slice(0, 5);
// }
// function escapeHtml(s) {
//   return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
// }
// function escapeAttr(s) {
//   return escapeHtml(s).replaceAll('"', "&quot;");
// }

// const Planning = () => {
//   useEffect(() => {
//     const container = document.getElementById("accordion");
//     const recsBox = document.getElementById("recommendations");
//     if (!container) return;
//     container.innerHTML = "";
//     if (recsBox) recsBox.innerHTML = "";

//     (async () => {
//       try {
//         const res = await axiosInstance.get(ENDPOINTS.myPlan, { headers: { Accept: "application/json" } });
//         console.log("[Planning] /student/my raw:", res?.data);
//         const activities = normalizeActivities(res?.data);
//         console.log("[Planning] normalized activities:", activities);

//         // گروه‌بندی بر اساس تاریخ
//         const byDate = activities.reduce((acc, a) => {
//           (acc[a.date || ""] ||= []).push(a);
//           return acc;
//         }, {});
//         const dates = Object.keys(byDate).filter(Boolean).sort();

//         if (dates.length === 0) {
//           container.insertAdjacentHTML(
//             "beforeend",
//             `<div class="banner warning">برای شما برنامه نهایی‌شده‌ای یافت نشد. اگر مشاور برنامه را «نهایی» نکرده باشد، اینجا نمایش داده نمی‌شود.</div>`
//           );
//         } else {
//           dates.forEach((isoDate) => {
//             const dateObj = new Date(`${isoDate}T00:00:00Z`);
//             const jalaliDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
//               year: "numeric",
//               month: "2-digit",
//               day: "2-digit",
//             }).format(dateObj);
//             const dayName = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"][dateObj.getDay()];

//             const rowsHTML = byDate[isoDate].map((a) => {
//               const st = a.status || "pending";
//               const note = a.student_note || "";
//               return `
//                 <tr data-activity-id="${a.activity_id}">
//                   <td>${escapeHtml(a.start_time)}</td>
//                   <td>${escapeHtml(a.end_time)}</td>
//                   <td title="${escapeAttr(a.description)}">${escapeHtml(a.title)}</td>
//                   <td>
//                     <select class="status-select">
//                       ${STATUS_VALUES.map(
//                         (val) => `<option value="${val}" ${val === st ? "selected" : ""}>${STATUS_LABELS[val]}</option>`
//                       ).join("")}
//                     </select>
//                   </td>
//                   <td><input type="text" class="note-input" placeholder="یادداشت اختیاری" value="${escapeAttr(note)}" /></td>
//                 </tr>
//               `;
//             }).join("");

//             const dayHTML = `
//               <div class="day-card">
//                 <div class="day-header" onclick="toggleDay(this)">
//                   ${dayName} ${jalaliDate}
//                   <span class="arrow">⬇️</span>
//                 </div>
//                 <div class="day-body">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>ساعت شروع</th>
//                         <th>ساعت پایان</th>
//                         <th>فعالیت</th>
//                         <th>وضعیت من</th>
//                         <th>یادداشت من</th>
//                       </tr>
//                     </thead>
//                     <tbody>${rowsHTML}</tbody>
//                   </table>
//                 </div>
//               </div>
//             `;
//             container.insertAdjacentHTML("beforeend", dayHTML);
//           });
//         }
//       } catch (e) {
//         console.error("[Planning] failed to fetch my plan:", e);
//         const detail = e?.response?.data?.detail || "خطا در دریافت برنامه.";
//         container.insertAdjacentHTML("beforeend", `<div class="banner error">${escapeHtml(detail)}</div>`);
//       }

//       // توصیه‌های مشاور
//       try {
//         const recs = await axiosInstance.get(ENDPOINTS.myRecs, { headers: { Accept: "application/json" } });
//         console.log("[Planning] my recommendations:", recs?.data);
//         const arr = Array.isArray(recs?.data) ? recs.data : [];
//         if (arr.length && recsBox) {
//           const ul = `
//             <ul class="rec-list">
//               ${arr.map((r) => `<li>📌 ${escapeHtml(r.suggested_course || "")}</li>`).join("")}
//             </ul>
//           `;
//           recsBox.insertAdjacentHTML("beforeend", ul);
//         } else if (recsBox) {
//           recsBox.insertAdjacentHTML("beforeend", `<p class="muted">توصیه‌ای ثبت نشده.</p>`);
//         }
//       } catch (e) {
//         console.warn("[Planning] recommendations fetch skipped/failed:", e);
//         if (recsBox) recsBox.insertAdjacentHTML("beforeend", `<p class="muted">توصیه‌ای در حال حاضر موجود نیست.</p>`);
//       }
//     })();

//     // toggle
//     window.toggleDay = function (header) {
//       const body = header.nextElementSibling;
//       const arrow = header.querySelector(".arrow");
//       const visible = body.style.display === "block";
//       body.style.display = visible ? "none" : "block";
//       if (arrow) arrow.textContent = visible ? "⬇️" : "⬆️";
//     };

//     // submit statuses
//     const submitBtn = document.querySelector(".submit");
//     const onSubmit = async () => {
//       try {
//         const rows = container.querySelectorAll("tbody tr[data-activity-id]");
//         const payload = Array.from(rows).map((tr) => ({
//           activity_id: Number(tr.getAttribute("data-activity-id")),
//           status: tr.querySelector(".status-select")?.value || "pending",
//           student_note: tr.querySelector(".note-input")?.value?.trim() || "",
//         }));

//         await axiosInstance.post(ENDPOINTS.updateStatus, payload, { headers: { "Content-Type": "application/json" } });
//         await axiosInstance.post(ENDPOINTS.submitStatus);
//         alert("✅ وضعیت‌ها با موفقیت ارسال شد.");
//       } catch (e) {
//         console.error("[Planning] submit failed:", e);
//         const msg = e?.response?.data?.detail || "❌ ارسال وضعیت‌ها با خطا مواجه شد.";
//         alert(msg);
//       }
//     };

//     submitBtn?.addEventListener("click", onSubmit);
//     return () => {
//       submitBtn?.removeEventListener("click", onSubmit);
//       delete window.toggleDay;
//     };
//   }, []);

//   return (
//     <div className="planning-page">
//       <h2>📆 برنامه‌ریزی من</h2>

//       <div className="card">
//         <h3>برنامه‌های نهایی‌شده</h3>
//         <div id="accordion"></div>
//         <div style={{ textAlign: "center", marginTop: 12 }}>
//           <button className="submit">📤 ثبت نهایی وضعیت‌های من</button>
//         </div>
//       </div>

//       <div className="card">
//         <h3>توصیه‌های مشاور</h3>
//         <div id="recommendations"></div>
//       </div>
//     </div>
//   );
// };

// export default Planning;



// src/components/Planning.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosInstance";
import "./style/Planning.css";

/* ---------- ENDPOINTS ---------- */
const ENDPOINTS = {
  myPlan: "/study-plan/student/my",                 // GET
  updateStatus: "/study-plan/student/update-status",// POST [ { activity_id, status, student_note } ]
  submitStatus: "/study-plan/student/submit-status",// POST
  myRecommendations: "/students/my-recommendations" // GET  [{ recommendation_id, suggested_course }]
};

const STATUS_LABELS = {
  pending: "⏳ هنوز انجام ندادم",
  done: "✅ انجام دادم",
  not_done: "❌ انجام ندادم",
};
const STATUS_VALUES = ["pending", "done", "not_done"];

/* ---------- Normalizers ---------- */
function toHHMM(t) {
  if (!t) return "";
  const s = String(t);
  if (/^\d{2}:\d{2}$/.test(s)) return s;
  if (/^\d{2}:\d{2}:\d{2}/.test(s)) return s.slice(0, 5);
  return s.slice(0, 5);
}

function normalizeActivities(raw) {
  // تلاش برای یافتن آرایه فعالیت‌ها در اشکال مختلف


  let acts = [];
  if (raw && Array.isArray(raw.activities)) acts = raw.activities;
  else if (Array.isArray(raw)) acts = raw;
  else if (raw?.plan && Array.isArray(raw.plan.activities)) acts = raw.plan.activities;
  else if (raw?.data && Array.isArray(raw.data.activities)) acts = raw.data.activities;
  else if (Array.isArray(raw?.items)) acts = raw.items;

  return acts.map((a, idx) => {
    const id = a.activity_id ?? a.id ?? (idx + 1);
    const date = a.date || a.activity_date || "";
    return {
      activity_id: Number(id),
      date,
      start_time: toHHMM(a.start_time),
      end_time: toHHMM(a.end_time),
      title: a.title || a.name || "",
      description: a.description || a.desc || "",
      status: a.status || "pending",
      student_note: a.student_note ?? a.note ?? "",
    };
  });
}

function groupBy(arr, keyFn) {
  return arr.reduce((acc, x) => {
    const k = keyFn(x);
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

/* ---------- Component ---------- */
export default function Planning() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(""); // نمایش خطای خواندن برنامه
  const [activities, setActivities] = useState([]); // normalized
  const [recs, setRecs] = useState([]);            // توصیه‌ها

  // برای ویرایش وضعیت/یادداشت قبل از ارسال
  const [local, setLocal] = useState({}); // activity_id -> { status, student_note }


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setFetchError("");

        // 1) برنامه‌ی نهایی‌شده
        let fetchedActs = [];
        try {
          const { data } = await axiosInstance.get(ENDPOINTS.myPlan, { headers: { Accept: "application/json" } });
          setActivities(Object.entries(data.activities_by_date))
        } catch (err) {
          // اگر 404 بود، یعنی هیچ برنامه نهایی نشده
          const status = err?.response?.status;
          const detail = err?.response?.data?.detail;
          console.warn("[Planning] myPlan error:", status, detail);
          if (status === 404) {
            fetchedActs = [];
          } else {
            setFetchError(detail || "خطا در دریافت برنامه.");
          }
        }

        // 2) توصیه‌های مشاور
        let fetchedRecs = [];
        try {
          const r = await axiosInstance.get(ENDPOINTS.myRecommendations, { headers: { Accept: "application/json" } });
          const arr = Array.isArray(r?.data) ? r.data : (Array.isArray(r?.data?.items) ? r.data.items : []);
          fetchedRecs = arr.map((x, i) => ({
            recommendation_id: x.recommendation_id ?? x.id ?? i + 1,
            suggested_course: x.suggested_course || x.text || "",
          })).filter((x) => x.suggested_course);
        } catch (err) {
          console.warn("[Planning] recommendations error:", err?.response?.status, err?.response?.data);
          // توصیه اجباری نیست؛ اگر خطا خورد، فقط لاگ کنیم
        }

        if (!mounted) return;

        setLocal(toLocalMap(fetchedActs));
        setRecs(fetchedRecs);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);






  const onChangeRow = (date, activity_id, field, newValue) => {
    const updated = activities.map(item => {
      const subActivites = item[1]
      const temp = Array.from(subActivites).map(act => {
        if (act.activity_id === activity_id) {
          act[field] = newValue
        }
        return act
      })
      item[1] = temp
      return item
    })
    setActivities([...updated])
  };

  const onSubmitAll = async () => {
    try {
      // اگر هیچ برنامه‌ای نیست، چیزی برای ارسال هم نیست
      if (activities.length === 0) {
        alert("فعلاً برنامه‌ای برای ارسال وضعیت وجود ندارد.");
        return;
      }

      const payload = activities.map(act => act[1]).reduce((a, b) => {
        const temp = Array.from(a)
        temp.push(...b)
        return temp
      })



      await axiosInstance.post(ENDPOINTS.updateStatus, payload, { headers: { "Content-Type": "application/json" } });
      await axiosInstance.post(ENDPOINTS.submitStatus);
      alert("✅ وضعیت‌ها با موفقیت ارسال شد.");
    } catch (e) {
      console.error("[Planning] submit failed:", e);
      const msg = e?.response?.data?.detail || "❌ ارسال وضعیت‌ها با خطا مواجه شد.";
      alert(msg);
    }
  };

  if (loading) return <div className="planning-page"><p className="muted">در حال بارگذاری…</p></div>;



  return (
    <div className="planning-page">
      <h2>📆 برنامه‌ریزی من</h2>

      {/* بخش برنامه نهایی‌شده */}
      <div className="card">
        <h3>برنامه‌های نهایی‌شده</h3>

        {fetchError && <div className="banner error">{fetchError}</div>}

        {
          activities.map((day) => {
            const date = day[0]
            const items = day[1]

            return <div className="day-card" key={day}>
              <div className="day-header">
                {formatFaDate(date)} <span className="muted">{date}</span>
              </div>
              <div className="day-body">
                <table>
                  <thead>
                    <tr>
                      <th>ساعت شروع</th>
                      <th>ساعت پایان</th>
                      <th>فعالیت</th>
                      <th>وضعیت من</th>
                      <th>یادداشت من</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((a) => {
                      const st = local[a.activity_id]?.status ?? a.status ?? "pending";
                      const note = local[a.activity_id]?.student_note ?? a.student_note ?? "";
                      return (
                        <tr key={a.activity_id}>
                          <td>{a.start_time || "—"}</td>
                          <td>{a.end_time || "—"}</td>
                          <td title={a.description || ""}>{a.title || "—"}</td>
                          <td>
                            <select
                              value={st}
                              onChange={(e) => onChangeRow(date, a.activity_id, "status", e.target.value)}
                            >
                              {STATUS_VALUES.map((v) => (
                                <option key={v} value={v}>{STATUS_LABELS[v]}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="یادداشت اختیاری"
                              defaultValue={note}
                              onChange={(e) => onChangeRow(date, a.activity_id, "student_note", e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          })
        }

        <div className="actions center">
          <button className="btn primary" onClick={onSubmitAll}>📤 ثبت نهایی وضعیت‌های من</button>
        </div>
      </div>

      {/* توصیه‌های مشاور */}
      <div className="card">
        <h3>توصیه‌های مشاور</h3>
        {recs.length === 0 ? (
          <p className="muted">توصیه‌ای ثبت نشده.</p>
        ) : (
          <ul className="recs">
            {recs.map((r) => (
              <li key={r.recommendation_id}>• {r.suggested_course}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function toLocalMap(acts) {
  const map = {};
  (acts || []).forEach((a) => {
    map[a.activity_id] = {
      status: a.status || "pending",
      student_note: a.student_note || "",
    };
  });
  return map;
}
