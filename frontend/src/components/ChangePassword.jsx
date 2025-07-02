import React, { useState } from "react";
import "./style/ChangePassword.css";

function ChangePassword() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("رمز عبور جدید و تکرار آن یکسان نیستند.");
      return;
    }
    alert("رمز عبور با موفقیت تغییر کرد.");
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
        <h2 className="title">تغییر رمز عبور</h2>

        <label className="label">ایمیل</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          dir="ltr"
          className="input"
        />

        <label className="label">رمز عبور جدید</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          dir="ltr"
          className="input"
        />

        <label className="label">تکرار رمز عبور جدید</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          dir="ltr"
          className="input"
        />

        <button type="submit" className="submit-button">
          ثبت
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
