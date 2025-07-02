import React from "react";
import "./style/Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard-page d-flex flex-column align-items-center gap-4">
      <Link to="/planning" className="dashboard-btn">
        برنامه‌ریزی‌ها
      </Link>
      <Link to="/payment" className="dashboard-btn">
        پرداخت‌ها
      </Link>
    </div>
  );
}
