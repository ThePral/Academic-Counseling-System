import React, { useState } from "react";
import "./style/LoginSignup.css";
import { Link, useNavigate } from "react-router-dom";

function LoginSignup() {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="LoginSignup-body">
      <div className="LoginSignup-container">
        <input
          type="checkbox"
          id="flip"
          checked={isFlipped}
          onChange={() => setIsFlipped(!isFlipped)}
        />
        <div className="cover">
          <div className="front">
            <img src="bckimage.jpg" alt="Logo" />
            <div className="text"></div>
          </div>
        </div>

        <div className="LoginSignup-forms">
          <div className={`LoginSignup-form-content ${isFlipped ? "flipped" : ""}`}>
            {/* ورود */}
            <div className="login-form">
              <div className="title">ورود</div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fa fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="ایمیل"
                      
                      required
                    />
                  </div>
                  <div className="input-box">
                    <i className="fa fa-lock"></i>
                    <input type="password" placeholder="رمز عبور" required />
                  </div>
                  <div className="text">
                    <Link to="/forgetpass">رمز عبور خود را فراموش کردید؟</Link>
                  </div>
                  <div className="button input-box">
                    <input type="submit" value="ورود" />
                  </div>
                  <div className="text sign-up-text">
                    حساب کاربری ندارید؟{" "}
                    <label onClick={() => setIsFlipped(true)}>ثبت‌نام کنید</label>
                  </div>
                </div>
              </form>
            </div>

            {/* ثبت نام */}
            <div className="signup-form">
              <div className="title">ثبت نام</div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                <div className="input-boxes">
                  <div className="name-inputs">
                    <div className="input-box">
                      <i className="fa fa-user"></i>
                      <input type="text" placeholder="نام" required />
                    </div>
                    <div className="input-box">
                      <i className="fa fa-user"></i>
                      <input type="text" placeholder="نام خانوادگی" required />
                    </div>
                  </div>
                  <div className="input-box">
                    <i className="fa fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="ایمیل"
                      required
                    />
                  </div>
                  <div className="input-box">
                    <i className="fa fa-lock"></i>
                    <input type="password" placeholder="رمز عبور" required />
                  </div>
                  <div className="input-box">
                    <i className="fa fa-user-circle"></i>
                    <select required defaultValue="">
                      <option value="" disabled>
                        نقش خود را انتخاب کنید
                      </option>
                      <option value="advisor">مشاور</option>
                      <option value="student">دانشجو</option>
                      <option value="school-student">دانش‌آموز</option>
                    </select>
                  </div>

                  <div className="button input-box">
                    <input type="submit" value="ثبت نام" />
                  </div>
                  <div className="text sign-up-text">
                    قبلاً ثبت‌نام کرده‌اید؟{" "}
                    <label onClick={() => setIsFlipped(false)}>وارد شوید </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="back-icon">
          <Link to="/" className="back-link">
            <i className="fa fa-arrow-left"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
