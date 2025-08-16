import React, { useState, useEffect } from "react";
import "./style/ChangePassword.css";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const role = localStorage.getItem("user_role");
        let endpoint = "";

        if (role === "student") {
          endpoint = "/students/me/";
        } else if (role === "counselor") {
          endpoint = "/counselors/me/";
        } else {
          throw new Error("نقش کاربر مشخص نیست");
        }

        const res = await axiosInstance.get(endpoint);
        setEmail(res.data.email);
      } catch (err) {
        console.error("خطا در گرفتن ایمیل:", err);
        alert("دریافت اطلاعات کاربری با مشکل مواجه شد.");
      }
    };

    fetchEmail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("رمز عبور جدید و تکرار آن یکسان نیستند.");
      return;
    }

    try {
      await axiosInstance.post("/auth/update-password/", {
        email: email,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });

      alert("رمز عبور با موفقیت تغییر کرد.");
      navigate("/");
    } catch (error) {
      console.error("خطا در تغییر رمز:", error);
      alert("تغییر رمز عبور با خطا مواجه شد.");
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
        <h2 className="title">تغییر رمز عبور</h2>

        <label className="label">ایمیل</label>
        <input
          type="email"
          value={email}
          readOnly
          dir="ltr"
          className="input input-disabled"
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
