import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // <<-- مهم: به جای axios خام
import "./style/NewPass.css";

const NewPass = () => {
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || "");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      alert("کد باید ۶ رقمی باشد.");
      return;
    }
    if (newPass.length < 8) {
      alert("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/password-reset/verify-and-reset", {
        email,
        code,
        new_password: newPass,
      });

      alert("رمز عبور با موفقیت تغییر کرد.");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err) {
      console.error("خطا در بازنشانی رمز:", err?.response || err);
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "بازنشانی رمز با خطا مواجه شد.";
      alert(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="NewPass-body">
      <div className="NewPass-container">
        <div className="NewPass-forms">
          <div className="NewPass-form-content">
            <div className="pass-login-form">
              <form onSubmit={handleSubmit}>
                <div className="pass-input-boxes">
                  <div className="pass-input-box">
                    <i className="fa fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="ایمیل"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ direction: "rtl", textAlign: "right" }}
                    />
                  </div>
                  <div className="pass-input-box">
                    <i className="fa fa-key"></i>
                    <input
                      type="text"
                      placeholder="کد ۶ رقمی"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={6}
                      required
                      style={{ direction: "rtl", textAlign: "right" }}
                    />
                  </div>
                  <div className="pass-input-box">
                    <i className="fa fa-lock"></i>
                    <input
                      type="password"
                      placeholder="رمز عبور جدید"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                      style={{ direction: "rtl", textAlign: "right" }}
                    />
                  </div>
                  <div className="button pass-input-box">
                    <input type="submit" value={loading ? "در حال ارسال..." : "تغییر رمز"} disabled={loading} />
                  </div>
                </div>
              </form>
              {/* اختیاری: لینک برگشت به ورود */}
              {/* <button className="link-btn" onClick={() => navigate("/login")}>بازگشت به ورود</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
