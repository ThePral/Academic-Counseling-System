import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/Forgetpass.css";

const Forgetpass = () => {
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }

    console.log("ایمیل معتبر:", email);
    navigate("/ResetCode");
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
                      required
                      style={{ direction: "rtl", textAlign: "right" }}
                    />
                  </div>
                  <div className="button pass-input-box">
                    <input type="submit" value="ارسال" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgetpass;
