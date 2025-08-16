import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "./NotificationsPanel"; 
import "./style/AdvisorDashboard.css";

export default function AdvisorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set()); 
  const [banner, setBanner] = useState({ type: "", text: "" }); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointments/pending");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("خطا در دریافت نوبت‌ها:", err);
      setBanner({ type: "error", text: "خطا در دریافت درخواست‌ها" });
    } finally {
      setLoading(false);
    }
  };

  const lock = (id, fn) => async () => {
    const next = new Set(processing); next.add(id); setProcessing(next);
    try { await fn(); }
    finally {
      const copy = new Set(processing); copy.delete(id); setProcessing(copy);
    }
  };

  const approve = (appointmentId, studentId) =>
    lock(appointmentId, async () => {
      try {
        await axiosInstance.post(`/appointments/${appointmentId}/approve`);
        await axiosInstance.post(
          `/notifications/notify/${studentId}?message=${encodeURIComponent("درخواست مشاوره شما تایید شد ✅")}`
        );

        setAppointments(prev => prev.filter(a => a.appointment_id !== appointmentId));
        setBanner({ type: "success", text: "درخواست با موفقیت تایید شد و اعلان ارسال گردید." });
      } catch (err) {
        console.error(err);
        setBanner({ type: "error", text: "خطا در تایید یا ارسال اعلان." });
      }
    })();

  const reject = (appointmentId, studentId) =>
    lock(appointmentId, async () => {
      try {
        await axiosInstance.delete(`/appointments/${appointmentId}/cancel`);
        await axiosInstance.post(
          `/notifications/notify/${studentId}?message=${encodeURIComponent("درخواست مشاوره شما رد شد ❌")}`
        );

        setAppointments(prev => prev.filter(a => a.appointment_id !== appointmentId));
        setBanner({ type: "success", text: "درخواست رد شد و اعلان ارسال گردید." });
      } catch (err) {
        console.error(err);
        setBanner({ type: "error", text: "خطا در رد کردن یا ارسال اعلان." });
      }
    })();

  const handleViewProfile = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const busy = useMemo(
    () => (id) => processing.has(id),
    [processing]
  );

  if (loading) return <p className="text-muted">در حال بارگذاری...</p>;

  return (
    <div className="advisor-dashboard dark-mode">
      <div className="page-header">
        <h2>درخواست‌های مشاوره در انتظار تایید</h2>
        {banner.text && (
          <div className={`banner ${banner.type}`}>
            {banner.text}
            <button className="banner-close" onClick={() => setBanner({ type: "", text: "" })}>×</button>
          </div>
        )}
      </div>

      {appointments.length === 0 ? (
        <p className="empty">درخواستی برای نمایش وجود ندارد.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((a) => (
            <div key={a.appointment_id} className="appointment-card">
              <div className="student-info">
                <h4>{a.firstname} {a.lastname}</h4>
                <p>
                  تاریخ: {a.date} | {a.start_time?.substring(0, 5)} تا {a.end_time?.substring(0, 5)}
                </p>
              </div>
              <div className="actions">
                <button
                  className="btn ghost"
                  onClick={() => handleViewProfile(a.student_id)}
                  disabled={busy(a.appointment_id)}
                >
                  مشاهده پروفایل
                </button>
                <button
                  className="btn approve"
                  onClick={() => approve(a.appointment_id, a.student_id)}
                  disabled={busy(a.appointment_id)}
                >
                  {busy(a.appointment_id) ? "درحال تایید..." : "تایید"}
                </button>
                <button
                  className="btn reject"
                  onClick={() => reject(a.appointment_id, a.student_id)}
                  disabled={busy(a.appointment_id)}
                >
                  {busy(a.appointment_id) ? "درحال رد..." : "رد"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="notif-section">
        <NotificationsPanel />
      </div>
    </div>
  );
}
