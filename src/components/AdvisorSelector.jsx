

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style/AdvisorSelector.css";

const toAbs = (url) => {
  if (!url) return "";
  const base = axiosInstance.defaults.baseURL?.replace(/\/$/, "") || "";
  return url.startsWith("http") ? url : `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizeAdvisor = (raw) => ({
  id: raw?.counselor_id ?? raw?.id ?? raw?.pk ?? null,
  firstname: raw?.firstname ?? raw?.first_name ?? "",
  lastname: raw?.lastname ?? raw?.last_name ?? "",
  department: raw?.department ?? raw?.major ?? "",
  profile_image_url: toAbs(raw?.profile_image_url ?? raw?.avatar ?? raw?.image ?? ""),
});

export default function AdvisorSelector() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true); setErrMsg("");
      try {
        const { data } = await axiosInstance.get("/counselors/");
        const listRaw = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
        const list = listRaw.map(normalizeAdvisor).filter(a => a.id != null);
        setAdvisors(list);
      } catch (err) {
        console.error("خطا در دریافت مشاوران:", err);
        setErrMsg("عدم امکان دریافت لیست مشاوران.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return advisors;
    return advisors.filter(a =>
      a.firstname.toLowerCase().includes(q) ||
      a.lastname.toLowerCase().includes(q) ||
      (a.department || "").toLowerCase().includes(q)
    );
  }, [searchQuery, advisors]);

  const handleSelect = (advisor) => {
    if (!advisor?.id) return;
    navigate(`/counselor/${advisor.id}`);
  };

  return (
    <div className="advisor-selector">
      <h2>لیست مشاوران</h2>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="جستجو بر اساس نام، نام خانوادگی یا حوزه..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="fas fa-search" />
      </div>

      {loading && <div className="state-text">در حال بارگذاری...</div>}
      {!loading && errMsg && <div className="state-text error">{errMsg}</div>}
      {!loading && !errMsg && filtered.length === 0 && <div className="state-text">مشاوری وجود ندارد.</div>}

      {!loading && !errMsg && filtered.length > 0 && (
        <div className="advisor-list">
          {filtered.map((a) => {
            const name = `${a.firstname} ${a.lastname}`.trim() || "بدون نام";
            return (
              <div
                key={a.id}
                className="advisor-card"
                onClick={() => handleSelect(a)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={a.profile_image_url || "/placeholder-avatar.png"}
                  alt={name}
                  onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
                />
                <div className="advisor-info">
                  <h3>{name}</h3>
                  {a.department && <p className="dept">{a.department}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
