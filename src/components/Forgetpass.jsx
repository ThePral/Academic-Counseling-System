
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // ⬅️ مهم: به جای axios خام
import "./style/Forgetpass.css";

const Forgetpass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/password-reset/send-code", { email });
      localStorage.setItem("resetEmail", email);
      navigate("/NewPass");
    } catch (err) {
      console.error("خطا در ارسال کد:", err?.response || err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "ارسال کد با خطا مواجه شد.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Forgetpass-body">
      <div className="Forgetpass-container">
        <div className="Forgetpass-forms">
          <div className="Forgetpass-form-content">
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
                  <div className="button pass-input-box">
                    <input type="submit" value={loading ? "در حال ارسال..." : "ارسال"} disabled={loading} />
                  </div>
                </div>
              </form>
              {/* اختیاری: راهنمایی کوچک */}
              {/* <small style={{opacity:.7}}>کد ۶ رقمی به ایمیل شما ارسال می‌شود.</small> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgetpass;
