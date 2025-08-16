// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updatedSlots, setUpdatedSlots] = useState([]);

//   useEffect(() => {
//     axiosInstance
//       .get(`/public/counselor/${id}`)
//       .then((res) => {
//         setCounselor(res.data);
//         setUpdatedSlots(res.data.free_slots);
//       })
//       .catch(() => setError("خطا در دریافت اطلاعات مشاور"))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const bookAppointment = async (slotId) => {
//     try {
//       await axiosInstance.post("/appointments/book/", {
//         slot_id: slotId,
//       });
//       alert("✅ وقت با موفقیت رزرو شد");
//       setUpdatedSlots((prev) =>
//         prev.map((slot) =>
//           slot.id === slotId ? { ...slot, is_reserved: true } : slot
//         )
//       );
//     } catch (err) {
//       alert("❌ خطا در رزرو وقت: " + (err.response?.data?.detail || "نامشخص"));
//     }
//   };

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
//       <table className="slots-table">
//         <thead>
//           <tr>
//             <th>تاریخ</th>
//             <th>از</th>
//             <th>تا</th>
//             <th>وضعیت</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedSlots.map((slot) => (
//             <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//               <td>{slot.date}</td>
//               <td>{slot.start_time?.substring(0, 5)}</td>
//               <td>{slot.end_time?.substring(0, 5)}</td>
//               <td>
//                 {slot.is_reserved ? (
//                   <span className="reserved-label">رزرو شده</span>
//                 ) : (
//                   <button className="btn btn-primary" onClick={() => bookAppointment(slot.id)}>
//                     📅 رزرو
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updatedSlots, setUpdatedSlots] = useState([]);
//   const [pendingSlotIds, setPendingSlotIds] = useState([]);

//   useEffect(() => {
//     axiosInstance
//       .get(`/public/counselor/${id}`)
//       .then((res) => {
//         setCounselor(res.data);
//         setUpdatedSlots(res.data.free_slots);
//       })
//       .catch(() => setError("خطا در دریافت اطلاعات مشاور"))
//       .finally(() => setLoading(false));
//   }, [id]);

  
//   const bookAppointment = async (slotId) => {
//     try {
//       await axiosInstance.post("/appointments/book/", {
//         slot_id: slotId,
//         notes: "درخواست رزرو توسط دانش‌آموز",
//       });
//       alert("✅ درخواست رزرو با موفقیت ثبت شد. منتظر تایید مشاور باشید.");
//       setPendingSlotIds((prev) => [...prev, slotId]);
//     } catch (err) {
//       alert("❌ خطا در رزرو وقت: " + (err.response?.data?.detail || "نامشخص"));
//     }
//   };

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
//       <table className="slots-table">
//         <thead>
//           <tr>
//             <th>تاریخ</th>
//             <th>از</th>
//             <th>تا</th>
//             <th>وضعیت</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedSlots.map((slot) => {
//             const isPending = pendingSlotIds.includes(slot.id);
//             return (
//               <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//                 <td>{slot.date}</td>
//                 <td>{slot.start_time?.substring(0, 5)}</td>
//                 <td>{slot.end_time?.substring(0, 5)}</td>
//                 <td>
//                   {slot.is_reserved ? (
//                     <span className="reserved-label">رزرو شده</span>
//                   ) : isPending ? (
//                     <span className="pending-label">در انتظار تایید</span>
//                   ) : (
//                     <button className="btn btn-primary" onClick={() => bookAppointment(slot.id)}>
//                       📅 رزرو
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updatedSlots, setUpdatedSlots] = useState([]);

//   useEffect(() => {
//     axiosInstance
//       .get(`/public/counselor/${id}`)
//       .then((res) => {
//         setCounselor(res.data);
//         setUpdatedSlots(res.data.free_slots);
//       })
//       .catch(() => setError("خطا در دریافت اطلاعات مشاور"))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const bookAppointment = async (slotId) => {
//     try {
//       const res = await axiosInstance.post("/appointments/book/", {
//         slot_id: slotId,
//         notes: "درخواست رزرو توسط دانش‌آموز",
//       });

//       console.log("📦 پاسخ سرور از رزرو:", res.data); 

//       alert("✅ وقت با موفقیت رزرو شد");

//       setUpdatedSlots((prev) =>
//         prev.map((slot) =>
//           slot.id === slotId ? { ...slot, is_reserved: true } : slot
//         )
//       );
//     } catch (err) {
//       console.error("❌ خطا در رزرو:", err.response?.data || err.message);
//       alert("❌ خطا در رزرو وقت: " + (err.response?.data?.detail || "نامشخص"));
//     }
//   };

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
//       <table className="slots-table">
//         <thead>
//           <tr>
//             <th>تاریخ</th>
//             <th>از</th>
//             <th>تا</th>
//             <th>وضعیت</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedSlots.map((slot) => (
//             <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//               <td>{slot.date}</td>
//               <td>{slot.start_time?.substring(0, 5)}</td>
//               <td>{slot.end_time?.substring(0, 5)}</td>
//               <td>
//                 {slot.is_reserved ? (
//                   <span className="reserved-label">رزرو شده</span>
//                 ) : (
//                   <button className="btn btn-primary" onClick={() => bookAppointment(slot.id)}>
//                     📅 رزرو
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }








// import React, { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [updatedSlots, setUpdatedSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bookingIds, setBookingIds] = useState(new Set()); // برای قفل کردن دکمه همان اسلات

//   const loadCounselor = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`/public/counselor/${id}`);
//       setCounselor(res.data);
//       setUpdatedSlots(res.data.free_slots || []);
//     } catch (e) {
//       setError("خطا در دریافت اطلاعات مشاور");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadCounselor();
//   }, [loadCounselor]);

//   const bookAppointment = async (slotId) => {
//     try {
//       const res = await axiosInstance.post("/appointments/book/", {
//         slot_id: slotId,
//         notes: "درخواست رزرو توسط دانش‌آموز",
//       });
  
//       // فقط اگر موفق بود:
//       setUpdatedSlots(prev =>
//         prev.map(s => s.id === slotId ? { ...s, is_reserved: true } : s)
//       );
//     } catch (err) {
//       console.error("❌ خطا در رزرو:", err.response?.data || err.message);
//       const msg = err.response?.data?.detail || "خطای سرور";
//       alert("❌ رزرو ناموفق: " + msg);
//     }
//   };

  
  


//   if (loading) return <p>در حال بارگذاری...</p>;
//   if (error) return <p>{error}</p>;
//   if (!counselor) return null;

//   const safeTime = (t) => (t ? t.substring(0, 5) : "");

//   return (
//     <div className="counselor-profile dark-mode">
//       <div className="counselor-header">
//         <img
//           src={counselor.profile_image_url}
//           alt="Profile"
//           className="counselor-image"
//         />
//         <div className="counselor-info">
//           <h2>
//             {counselor.firstname} {counselor.lastname}
//           </h2>
//           <p>
//             <strong>ایمیل:</strong> {counselor.email}
//           </p>
//           <p>
//             <strong>حوزه:</strong> {counselor.department}
//           </p>
//           <p>
//             <strong>استان:</strong> {counselor.province}
//           </p>
//           <p>
//             <strong>شهر:</strong> {counselor.city}
//           </p>
//         </div>
//       </div>

//       <h3 className="slots-title">🕒 زمان‌های مشاور</h3>
//       <table className="slots-table">
//         <thead>
//           <tr>
//             <th>تاریخ</th>
//             <th>از</th>
//             <th>تا</th>
//             <th>وضعیت</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedSlots.map((slot) => {
//             const disabled = bookingIds.has(slot.id) || slot.is_reserved;
//             return (
//               <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//                 <td>{slot.date}</td>
//                 <td>{safeTime(slot.start_time)}</td>
//                 <td>{safeTime(slot.end_time)}</td>
//                 <td>
//                   {slot.is_reserved ? (
//                     <span className="reserved-label">رزرو شده</span>
//                   ) : (
//                     <button
//                       className="btn btn-primary"
//                       disabled={disabled}
//                       onClick={() => bookAppointment(slot.id)}
//                     >
//                       {bookingIds.has(slot.id) ? "در حال ارسال..." : "📅 رزرو"}
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//           {updatedSlots.length === 0 && (
//             <tr>
//               <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
//                 اسلاتی برای نمایش وجود ندارد
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }



// // src/components/CounselorProfile.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [updatedSlots, setUpdatedSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // قفل پر-اسلات برای جلوگیری از چندبار ارسال
//   const [bookingIds, setBookingIds] = useState(new Set());

//   const loadCounselor = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`/public/counselor/${id}`);
//       setCounselor(res.data);
//       setUpdatedSlots(res.data.free_slots || []);
//       setError(null);
//     } catch (e) {
//       console.error("❌ خطا در دریافت اطلاعات مشاور:", e?.response?.data || e.message);
//       setError("خطا در دریافت اطلاعات مشاور");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadCounselor();
//   }, [loadCounselor]);

//   const bookAppointment = async (slotId) => {
//     // اگر همین الآن در حال رزرو همین اسلات هستیم، دوباره نزن
//     if (bookingIds.has(slotId)) return;

//     // قفل کن
//     setBookingIds((prev) => {
//       const next = new Set(prev);
//       next.add(slotId);
//       return next;
//     });

//     try {
//       const payload = { slot_id: Number(slotId), notes: "درخواست رزرو توسط دانش‌آموز" };
//       const res = await axiosInstance.post("/appointments/book/", payload);
//       console.log("✅ رزرو موفق:", res.data);

//       // ترجیح: وضعیت را از سرور دوباره بخوان تا دقیق باشد
//       await loadCounselor();

//       // اگر نمی‌خوای دوباره بخوانی، می‌تونی فقط همان اسلات را علامت‌گذاری کنی:
//       // setUpdatedSlots(prev => prev.map(s => s.id === slotId ? { ...s, is_reserved: true } : s));
//     } catch (err) {
//       const status = err?.response?.status;
//       const detail = err?.response?.data?.detail;

//       if (status === 400 || status === 409) {
//         alert("❌ این اسلات قبلاً رزرو شده یا قابل رزرو نیست.");
//         await loadCounselor();
//       } else if (status === 404) {
//         alert("❌ اسلات پیدا نشد یا حذف شده است.");
//         await loadCounselor();
//       } else if (status === 401) {
//         alert("❌ ورود شما منقضی شده. لطفاً دوباره وارد شوید.");
//       } else {
//         console.error("❌ خطا در رزرو:", err?.response?.data || err.message);
//         alert("❌ خطای سرور هنگام رزرو. بعداً دوباره تلاش کنید.");
//       }
//     } finally {
//       // قفل را باز کن
//       setBookingIds((prev) => {
//         const next = new Set(prev);
//         next.delete(slotId);
//         return next;
//       });
//     }
//   };

//   if (loading) return <p>در حال بارگذاری...</p>;
//   if (error) return <p>{error}</p>;
//   if (!counselor) return null;

//   const safeTime = (t) => (t ? t.substring(0, 5) : "");

//   return (
//     <div className="counselor-profile dark-mode">
//       <div className="counselor-header">
//         <img
//           src={counselor.profile_image_url}
//           alt="Profile"
//           className="counselor-image"
//         />
//         <div className="counselor-info">
//           <h2>
//             {counselor.firstname} {counselor.lastname}
//           </h2>
//           <p>
//             <strong>ایمیل:</strong> {counselor.email}
//           </p>
//           <p>
//             <strong>حوزه:</strong> {counselor.department}
//           </p>
//           <p>
//             <strong>استان:</strong> {counselor.province}
//           </p>
//           <p>
//             <strong>شهر:</strong> {counselor.city}
//           </p>
//         </div>
//       </div>

//       <h3 className="slots-title">🕒 زمان‌های مشاور</h3>
//       <table className="slots-table">
//         <thead>
//           <tr>
//             <th>تاریخ</th>
//             <th>از</th>
//             <th>تا</th>
//             <th>وضعیت</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedSlots.map((slot) => {
//             const disabled = bookingIds.has(slot.id) || slot.is_reserved;
//             return (
//               <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//                 <td>{slot.date}</td>
//                 <td>{safeTime(slot.start_time)}</td>
//                 <td>{safeTime(slot.end_time)}</td>
//                 <td>
//                   {slot.is_reserved ? (
//                     <span className="reserved-label">رزرو شده</span>
//                   ) : (
//                     <button
//                       className="btn btn-primary"
//                       disabled={disabled}
//                       onClick={() => bookAppointment(slot.id)}
//                     >
//                       {bookingIds.has(slot.id) ? "در حال ارسال..." : "📅 رزرو"}
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//           {updatedSlots.length === 0 && (
//             <tr>
//               <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
//                 اسلاتی برای نمایش وجود ندارد
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }






// // src/components/CounselorProfile.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import "./style/CounselorProfile.css";

// export default function CounselorProfile() {
//   const { id } = useParams();
//   const [counselor, setCounselor] = useState(null);
//   const [updatedSlots, setUpdatedSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // قفل پر-اسلات برای جلوگیری از چندبار ارسال
//   const [bookingIds, setBookingIds] = useState(new Set());

//   // زمان امن برای نمایش
//   const safeTime = (t) => (t ? t.substring(0, 5) : "");

//   // تشخیص انقضای اسلات (تاریخ گذشته یا امروز با پایان گذشته)
//   const isSlotExpired = (dateStr, endHHMM) => {
//     if (!dateStr) return false;
//     const today = new Date();
//     const d = new Date(`${dateStr}T00:00:00`);
//     today.setHours(0, 0, 0, 0);
//     d.setHours(0, 0, 0, 0);

//     if (d < today) return true;      // تاریخ گذشته
//     if (d > today) return false;     // تاریخ آینده

//     // امروز: پایان اسلات <= الان؟
//     const [eh, em] = (endHHMM || "00:00").slice(0, 5).split(":").map((n) => parseInt(n || "0", 10));
//     const now = new Date();
//     const nowMin = now.getHours() * 60 + now.getMinutes();
//     return eh * 60 + em <= nowMin;
//   };

//   const loadCounselor = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`/public/counselor/${id}`);
//       setCounselor(res.data);

//       // فقط اسلات‌های آینده را نگه دار
//       const all = res.data.free_slots || [];
//       const future = all.filter((s) => !isSlotExpired(s.date, safeTime(s.end_time)));
//       setUpdatedSlots(future);

//       setError(null);
//     } catch (e) {
//       console.error("❌ خطا در دریافت اطلاعات مشاور:", e?.response?.data || e.message);
//       setError("خطا در دریافت اطلاعات مشاور");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadCounselor();
//   }, [loadCounselor]);

//   const bookAppointment = async (slotId) => {
//     if (bookingIds.has(slotId)) return;

//     // قبل از رزرو مطمئن شو هنوز منقضی نشده
//     const slot = updatedSlots.find((s) => s.id === slotId);
//     if (!slot || isSlotExpired(slot.date, safeTime(slot.end_time)) || slot.is_reserved) {
//       alert("❌ این اسلات دیگر قابل رزرو نیست. لیست به‌روز می‌شود.");
//       await loadCounselor();
//       return;
//     }

//     // قفل کن
//     setBookingIds((prev) => {
//       const next = new Set(prev);
//       next.add(slotId);
//       return next;
//     });

//     try {
//       const payload = { slot_id: Number(slotId), notes: "درخواست رزرو توسط دانش‌آموز" };
//       const res = await axiosInstance.post("/appointments/book/", payload);
//       console.log("✅ رزرو موفق:", res.data);

//       // بعد از رزرو، لیست را دوباره از سرور بگیر و مجدداً فقط future را نمایش بده
//       await loadCounselor();
//     } catch (err) {
//       const status = err?.response?.status;

//       if (status === 400 || status === 409) {
//         alert("❌ این اسلات قبلاً رزرو شده یا قابل رزرو نیست.");
//       } else if (status === 404) {
//         alert("❌ اسلات پیدا نشد یا حذف شده است.");
//       } else if (status === 401) {
//         alert("❌ ورود شما منقضی شده. لطفاً دوباره وارد شوید.");
//       } else {
//         console.error("❌ خطا در رزرو:", err?.response?.data || err.message);
//         alert("❌ خطای سرور هنگام رزرو. بعداً دوباره تلاش کنید.");
//       }
//       await loadCounselor();
//     } finally {
//       setBookingIds((prev) => {
//         const next = new Set(prev);
//         next.delete(slotId);
//         return next;
//       });
//     }
//   };

//   if (loading) return <p>در حال بارگذاری...</p>;
//   if (error) return <p>{error}</p>;
//   if (!counselor) return null;

//   return (
//     <div className="counselor-profile dark-mode">
//       <div className="counselor-header">
//         <img
//           src={counselor.profile_image_url}
//           alt="Profile"
//           className="counselor-image"
//         />
//         <div className="counselor-info">
//           <h2>
//             {counselor.firstname} {counselor.lastname}
//           </h2>
//           <p>
//             <strong>ایمیل:</strong> {counselor.email}
//           </p>
//           <p>
//             <strong>حوزه:</strong> {counselor.department}
//           </p>
//           <p>
//             <strong>استان:</strong> {counselor.province}
//           </p>
//           <p>
//             <strong>شهر:</strong> {counselor.city}
//           </p>
//         </div>
//       </div>

//       <h3 className="slots-title">🕒 زمان‌های مشاور</h3>
//       <table className="slots-table">
//         <thead>
//           <tr>
//             <th>تاریخ</th>
//             <th>از</th>
//             <th>تا</th>
//             <th>وضعیت</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedSlots.map((slot) => {
//             const expired = isSlotExpired(slot.date, safeTime(slot.end_time));
//             const disabled = bookingIds.has(slot.id) || slot.is_reserved || expired;

//             return (
//               <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
//                 <td>{slot.date}</td>
//                 <td>{safeTime(slot.start_time)}</td>
//                 <td>{safeTime(slot.end_time)}</td>
//                 <td>
//                   {slot.is_reserved ? (
//                     <span className="reserved-label">رزرو شده</span>
//                   ) : expired ? (
//                     <span className="expired-label">منقضی</span>
//                   ) : (
//                     <button
//                       className="btn btn-primary"
//                       disabled={disabled}
//                       onClick={() => bookAppointment(slot.id)}
//                     >
//                       {bookingIds.has(slot.id) ? "در حال ارسال..." : "📅 رزرو"}
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//           {updatedSlots.length === 0 && (
//             <tr>
//               <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
//                 اسلاتی برای نمایش وجود ندارد
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// src/components/CounselorProfile.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style/CounselorProfile.css";

export default function CounselorProfile() {
  const { id } = useParams();
  const [counselor, setCounselor] = useState(null);
  const [updatedSlots, setUpdatedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingIds, setBookingIds] = useState(new Set());

  // ---- Helpers: Jalali-aware ------------------------------------------------
  const toEnglishDigits = (str = "") =>
    String(str).replace(/[\u06F0-\u06F9]/g, (d) =>
      "0123456789"["\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d)]
    );

  const getTodayJalaliYMD = () => {
    // خروجی مثل ۱۴۰۴/۰۵/۲۲ → تبدیل به 1404-05-22
    const fmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    return toEnglishDigits(fmt).replace(/\//g, "-"); // "1404-05-22"
  };

  const parseJalaliYMD = (ymd = "") => {
    const [y, m, d] = toEnglishDigits(ymd).split("-").map((x) => parseInt(x || "0", 10));
    return { y, m, d };
  };

  const jalaliLess = (a, b) => {
    // آیا تاریخ a < b است؟ (هر دو "YYYY-MM-DD" جلالی)
    const A = parseJalaliYMD(a), B = parseJalaliYMD(b);
    if (A.y !== B.y) return A.y < B.y;
    if (A.m !== B.m) return A.m < B.m;
    return A.d < B.d;
  };

  const isSameJalaliDate = (a, b) => {
    const A = parseJalaliYMD(a), B = parseJalaliYMD(b);
    return A.y === B.y && A.m === B.m && A.d === B.d;
  };

  const safeTime = (t) => (t ? t.substring(0, 5) : "00:00");

  const isSlotExpired = (jalaliDateStr, endHHMM) => {
    if (!jalaliDateStr) return false;
    const todayJ = getTodayJalaliYMD();

    // اگر تاریخ جلالیِ اسلات قبل از امروز است → منقضی
    if (jalaliLess(jalaliDateStr, todayJ)) return true;
    // اگر بعد از امروز است → آینده
    if (jalaliLess(todayJ, jalaliDateStr)) return false;

    // امروز: پایان اسلات <= الان؟
    const [eh, em] = safeTime(endHHMM).split(":").map((n) => parseInt(n || "0", 10));
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return eh * 60 + em <= nowMin;
  };
  // ---------------------------------------------------------------------------

  const loadCounselor = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/public/counselor/${id}`);
      setCounselor(res.data);

      const all = res.data.free_slots || [];
      // فقط اسلات‌های آینده/کنونی (که هنوز تمام نشده) را نگه دار
      const future = all.filter((s) => !isSlotExpired(s.date, s.end_time));
      setUpdatedSlots(future);

      setError(null);
    } catch (e) {
      console.error("❌ خطا در دریافت اطلاعات مشاور:", e?.response?.data || e.message);
      setError("خطا در دریافت اطلاعات مشاور");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCounselor();
  }, [loadCounselor]);

  const bookAppointment = async (slotId) => {
    if (bookingIds.has(slotId)) return;

    const slot = updatedSlots.find((s) => s.id === slotId);
    if (!slot || isSlotExpired(slot.date, slot.end_time) || slot.is_reserved) {
      alert("❌ این اسلات دیگر قابل رزرو نیست. لیست به‌روز می‌شود.");
      await loadCounselor();
      return;
    }

    setBookingIds((prev) => {
      const next = new Set(prev);
      next.add(slotId);
      return next;
    });

    try {
      const payload = { slot_id: Number(slotId), notes: "درخواست رزرو توسط دانش‌آموز" };
      await axiosInstance.post("/appointments/book/", payload);
      await loadCounselor();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400 || status === 409) {
        alert("❌ این اسلات قبلاً رزرو شده یا قابل رزرو نیست.");
      } else if (status === 404) {
        alert("❌ اسلات پیدا نشد یا حذف شده است.");
      } else if (status === 401) {
        alert("❌ ورود شما منقضی شده. لطفاً دوباره وارد شوید.");
      } else {
        console.error("❌ خطا در رزرو:", err?.response?.data || err.message);
        alert("❌ خطای سرور هنگام رزرو. بعداً دوباره تلاش کنید.");
      }
      await loadCounselor();
    } finally {
      setBookingIds((prev) => {
        const next = new Set(prev);
        next.delete(slotId);
        return next;
      });
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>{error}</p>;
  if (!counselor) return null;

  return (
    <div className="counselor-profile dark-mode">
      <div className="counselor-header">
        <img
          src={counselor.profile_image_url}
          alt="Profile"
          className="counselor-image"
        />
        <div className="counselor-info">
          <h2>
            {counselor.firstname} {counselor.lastname}
          </h2>
          <p><strong>ایمیل:</strong> {counselor.email}</p>
          <p><strong>حوزه:</strong> {counselor.department}</p>
          <p><strong>استان:</strong> {counselor.province}</p>
          <p><strong>شهر:</strong> {counselor.city}</p>
        </div>
      </div>

      <h3 className="slots-title">🕒 زمان‌های مشاور</h3>
      <table className="slots-table">
        <thead>
          <tr>
            <th>تاریخ</th>
            <th>از</th>
            <th>تا</th>
            <th>وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {updatedSlots.map((slot) => {
            const expired = isSlotExpired(slot.date, slot.end_time);
            const disabled = bookingIds.has(slot.id) || slot.is_reserved || expired;

            return (
              <tr key={slot.id} className={slot.is_reserved ? "reserved" : "free"}>
                <td>{slot.date}</td>
                <td>{safeTime(slot.start_time)}</td>
                <td>{safeTime(slot.end_time)}</td>
                <td>
                  {slot.is_reserved ? (
                    <span className="reserved-label">رزرو شده</span>
                  ) : expired ? (
                    <span className="expired-label">منقضی</span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      disabled={disabled}
                      onClick={() => bookAppointment(slot.id)}
                    >
                      {bookingIds.has(slot.id) ? "در حال ارسال..." : "📅 رزرو"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {updatedSlots.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                اسلاتی برای نمایش وجود ندارد
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
