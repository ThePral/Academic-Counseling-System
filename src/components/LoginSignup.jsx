// import React, { useState } from "react";
// import "./style/LoginSignup.css";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import { useUser } from ".//UserContext"; 


// function LoginSignup() {
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [signupData, setSignupData] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     password: "",
//     role: "",
//   });

//   const { setRole, fetchUser } = useUser(); 
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await axiosInstance.post("/auth/login/", loginData);
//       const { access_token, refresh_token } = res.data;
  
//       localStorage.setItem("access_token", access_token);
//       localStorage.setItem("refresh_token", refresh_token);
//       axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
//       const role = await detectUserRole();
//       if (!role) {
//         alert("نقش کاربر قابل تشخیص نیست.");
//         return;
//       }
  
//       localStorage.setItem("user_role", role);
  
//       setRole(role);     
//       await fetchUser();   

//       if (role === "student") {
//         navigate("/dashboard");
//       } else if (role === "counselor") {
//         navigate("/advisor/AdvisorDashboard");
//       }
//       window.location.reload();

  
//     } catch (error) {
//       const msg = error.response?.data?.detail || "ورود ناموفق. لطفاً اطلاعات را بررسی کنید.";
//       alert(msg);
//     }
//   };
  
//   const detectUserRole = async () => {
//     try {
//       await axiosInstance.get("/students/me/");
//       return "student";
//     } catch (err1) {
//       if (!err1.response || err1.response.status !== 404) throw err1;
//       try {
//         await axiosInstance.get("/counselors/me/");
//         return "counselor";
//       } catch (err2) {
//         console.error("تشخیص نقش شکست خورد:", err2);
//         return null;
//       }
//     }
//   };
  
  
  

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     console.log("Signup data to send:", signupData);
//     try {
//       await axiosInstance.post("/auth/register/", signupData);
//       alert("ثبت‌نام موفق بود. حالا وارد شوید.");
//       setIsFlipped(false);
//     } catch (error) {
//       const msg =
//         error.response?.data?.detail ||
//         "ثبت‌نام ناموفق. لطفاً اطلاعات را بررسی کنید یا ایمیل ممکن است قبلاً ثبت شده باشد.";
//       alert(msg);
//     }
//   };

//   return (
//     <div className="LoginSignup-body">
//       <div className="LoginSignup-container">
//         <input
//           type="checkbox"
//           id="flip"
//           checked={isFlipped}
//           onChange={() => setIsFlipped(!isFlipped)}
//         />
//         <div className="cover">
//           <div className="front">
//             <img src="bckimage.jpg" alt="Logo" />
//           </div>
//         </div>

//         <div className="LoginSignup-forms">
//           <div className={`LoginSignup-form-content ${isFlipped ? "flipped" : ""}`}>
//             {/* ورود */}
//             <div className="login-form">
//               <div className="title">ورود</div>
//               <form onSubmit={handleLogin}>
//                 <div className="input-boxes">
//                   <div className="input-box">
//                     <i className="fa fa-envelope"></i>
//                     <input
//                       type="email"
//                       placeholder="ایمیل"
//                       required
//                       value={loginData.email}
//                       onChange={(e) =>
//                         setLoginData({ ...loginData, email: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="input-box">
//                     <i className="fa fa-lock"></i>
//                     <input
//                       type="password"
//                       placeholder="رمز عبور"
//                       required
//                       value={loginData.password}
//                       onChange={(e) =>
//                         setLoginData({ ...loginData, password: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="text">
//                     <Link to="/ForgetPass">رمز عبور خود را فراموش کردید؟</Link>
//                   </div>
//                   <div className="button input-box">
//                     <input type="submit" value="ورود" />
//                   </div>
//                   <div className="text sign-up-text">
//                     حساب کاربری ندارید؟{" "}
//                     <label onClick={() => setIsFlipped(true)}>ثبت‌نام کنید</label>
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* ثبت نام */}
//             <div className="signup-form">
//               <div className="title">ثبت‌نام</div>
//               <form onSubmit={handleSignup}>
//                 <div className="input-boxes">
//                   <div className="name-inputs">
//                     <div className="input-box">
//                       <i className="fa fa-user"></i>
//                       <input
//                         type="text"
//                         placeholder="نام"
//                         required
//                         value={signupData.firstname}
//                         onChange={(e) =>
//                           setSignupData({ ...signupData, firstname: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="input-box">
//                       <i className="fa fa-user"></i>
//                       <input
//                         type="text"
//                         placeholder="نام خانوادگی"
//                         required
//                         value={signupData.lastname}
//                         onChange={(e) =>
//                           setSignupData({ ...signupData, lastname: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                   <div className="input-box">
//                     <i className="fa fa-envelope"></i>
//                     <input
//                       type="email"
//                       placeholder="ایمیل"
//                       required
//                       value={signupData.email}
//                       onChange={(e) =>
//                         setSignupData({ ...signupData, email: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="input-box">
//                     <i className="fa fa-lock"></i>
//                     <input
//                       type="password"
//                       placeholder="رمز عبور"
//                       required
//                       value={signupData.password}
//                       onChange={(e) =>
//                         setSignupData({ ...signupData, password: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="input-box">
//                     <i className="fa fa-user-circle"></i>
//                     <select
//                       required
//                       value={signupData.role}
//                       onChange={(e) =>
//                         setSignupData({ ...signupData, role: e.target.value })
//                       }
//                     >
//                       <option value="" disabled>
//                         نقش خود را انتخاب کنید
//                       </option>
//                       <option value="counselor">مشاور</option>
//                       <option value="student">دانشجو/دانش‌آموز</option>
//                     </select>
//                   </div>

//                   <div className="button input-box">
//                     <input type="submit" value="ثبت نام" />
//                   </div>
//                   <div className="text sign-up-text">
//                     قبلاً ثبت‌نام کرده‌اید؟{" "}
//                     <label onClick={() => setIsFlipped(false)}>وارد شوید </label>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         <div className="back-icon">
//           <Link to="/" className="back-link">
//             <i className="fa fa-arrow-left"></i>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginSignup;





import React, { useState } from "react";
import "./style/LoginSignup.css";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useUser } from "./UserContext";

// Helper: extract role from JWT
const getRoleFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || null;
  } catch {
    return null;
  }
};

function LoginSignup() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });

  const { setRole, fetchUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login/", loginData);
      const { access_token, refresh_token } = res.data;

      // Save tokens + set default header
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // 1) Read role from JWT
      const tokenRole = getRoleFromToken(access_token);

      if (tokenRole === "admin") {
        // Admin: skip student/counselor probes
        localStorage.setItem("user_role", "admin");
        setRole("admin");
        // اگر AdminAuthContext هم داری و نیاز به flag جداست:
        localStorage.setItem("acs_admin_user", loginData.email);
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // 2) Non-admin: detect role by endpoints
      const role = await detectUserRole();
      if (!role) {
        alert("نقش کاربر قابل تشخیص نیست.");
        return;
      }

      localStorage.setItem("user_role", role);
      setRole(role);

      // فقط برای student/counselor پروفایل را بگیر
      await fetchUser?.();

      if (role === "student") {
        navigate("/Dashboard", { replace: true });
      } else if (role === "counselor") {
        navigate("/Advisor/AdvisorDashboard", { replace: true });
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "ورود ناموفق. لطفاً اطلاعات را بررسی کنید.";
      alert(msg);
    }
  };

  const detectUserRole = async () => {
    try {
      await axiosInstance.get("/students/me/");
      return "student";
    } catch (err1) {
      // اگر 404 نبود، یعنی خطای دیگری است؛ همونو throw کن
      if (!err1.response || err1.response.status !== 404) throw err1;
      try {
        await axiosInstance.get("/counselors/me/");
        return "counselor";
      } catch (err2) {
        // اگر 404 بود یعنی هیچ‌کدوم نیست؛ در غیر این صورت پیام خطای واقعی
        if (!err2.response || err2.response.status !== 404) {
          console.error("تشخیص نقش شکست خورد:", err2);
        }
        return null;
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register/", signupData);
      alert("ثبت‌نام موفق بود. حالا وارد شوید.");
      setIsFlipped(false);
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        "ثبت‌نام ناموفق. لطفاً اطلاعات را بررسی کنید یا ایمیل ممکن است قبلاً ثبت شده باشد.";
      alert(msg);
    }
  };

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
          </div>
        </div>

        <div className="LoginSignup-forms">
          <div className={`LoginSignup-form-content ${isFlipped ? "flipped" : ""}`}>
            {/* ورود */}
            <div className="login-form">
              <div className="title">ورود</div>
              <form onSubmit={handleLogin}>
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fa fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="ایمیل"
                      required
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-box">
                    <i className="fa fa-lock"></i>
                    <input
                      type="password"
                      placeholder="رمز عبور"
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                    />
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
              <div className="title">ثبت‌نام</div>
              <form onSubmit={handleSignup}>
                <div className="input-boxes">
                  <div className="name-inputs">
                    <div className="input-box">
                      <i className="fa fa-user"></i>
                      <input
                        type="text"
                        placeholder="نام"
                        required
                        value={signupData.firstname}
                        onChange={(e) =>
                          setSignupData({ ...signupData, firstname: e.target.value })
                        }
                      />
                    </div>
                    <div className="input-box">
                      <i className="fa fa-user"></i>
                      <input
                        type="text"
                        placeholder="نام خانوادگی"
                        required
                        value={signupData.lastname}
                        onChange={(e) =>
                          setSignupData({ ...signupData, lastname: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="input-box">
                    <i className="fa fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="ایمیل"
                      required
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-box">
                    <i className="fa fa-lock"></i>
                    <input
                      type="password"
                      placeholder="رمز عبور"
                      required
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-box">
                    <i className="fa fa-user-circle"></i>
                    <select
                      required
                      value={signupData.role}
                      onChange={(e) =>
                        setSignupData({ ...signupData, role: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        نقش خود را انتخاب کنید
                      </option>
                      <option value="counselor">مشاور</option>
                      <option value="student">دانشجو/دانش‌آموز</option>
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
