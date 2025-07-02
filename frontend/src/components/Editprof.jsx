import React, { useState } from "react";
import provinces from "../data/provinces";
import { useNavigate } from "react-router-dom";
import "./style/Editprof.css";

function Editprof() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    educationLevel: "",
    educationGrade: "",
    universityFaculty: "",
    universityDegree: "",
    universityMajor: "",
    gpa: "",
    profileImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePhone = (phone) => /^09\d{9}$/.test(phone);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) {
      alert("شماره تماس باید با 09 شروع شده و 11 رقم باشد.");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("ایمیل وارد شده معتبر نیست.");
      return;
    }
    console.log("ارسال اطلاعات:", formData);
  };

  const cities = provinces.find((p) => p.name === formData.province)?.cities || [];

  return (
    <div className="edit-profile-body">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="profile-pic-upload">
          <label htmlFor="profileImage" className="circle-upload">
            {formData.profileImage ? (
              <img src={URL.createObjectURL(formData.profileImage)} alt="Profile" />
            ) : (
              <span>+</span>
            )}
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            hidden
          />
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>نام</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>نام خانوادگی</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              dir="rtl"
            />
          </div>
          <div className="input-box">
            <label>شماره تماس</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                if (/^\d{0,11}$/.test(e.target.value)) handleChange(e);
              }}
              required
              placeholder="*********09"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>استان</label>
            <select name="province" value={formData.province} onChange={handleChange} required>
              <option value="">انتخاب استان</option>
              {provinces.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label>شهر</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.province}
            >
              <option value="">انتخاب شهر</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* مقطع تحصیلی */}
        <div className="input-row">
          <div className="input-box">
            <label>مقطع تحصیلی</label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
            >
              <option value="">انتخاب مقطع</option>
              <option value="ابتدایی">ابتدایی</option>
              <option value="متوسطه اول">متوسطه اول</option>
              <option value="متوسطه دوم">متوسطه دوم</option>
              <option value="دانشجو">دانشجو</option>
            </select>
          </div>
        </div>

        {/* پایه تحصیلی */}
        {formData.educationLevel && formData.educationLevel !== "دانشجو" && (
          <div className="input-row">
            <div className="input-box">
              <label>پایه تحصیلی</label>
              <select
                name="educationGrade"
                value={formData.educationGrade}
                onChange={handleChange}
                required
              >
                <option value="">انتخاب پایه</option>
                {formData.educationLevel === "ابتدایی" &&
                  ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم"].map((g) => (
                    <option key={g} value={g}>پایه {g}</option>
                  ))}
                {formData.educationLevel === "متوسطه اول" &&
                  ["هفتم", "هشتم", "نهم"].map((g) => (
                    <option key={g} value={g}>پایه {g}</option>
                  ))}
                {formData.educationLevel === "متوسطه دوم" &&
                  [
                    "دهم تجربی", "دهم ریاضی", "دهم انسانی",
                    "یازدهم تجربی", "یازدهم ریاضی", "یازدهم انسانی",
                    "دوازدهم تجربی", "دوازدهم ریاضی", "دوازدهم انسانی",
                    "پشت کنکور تجربی", "پشت کنکور ریاضی", "پشت کنکور انسانی",
                  ].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {/* اطلاعات دانشگاهی برای دانشجو */}
        {formData.educationLevel === "دانشجو" && (
          <>
            <div className="input-row">
              <div className="input-box">
                <label>دانشکده</label>
                <select
                  name="universityFaculty"
                  value={formData.universityFaculty}
                  onChange={handleChange}
                >
                  <option value="">انتخاب دانشکده</option>
                  <option value="مهندسی">مهندسی</option>
                  <option value="پزشکی">پزشکی</option>
                </select>
              </div>
              <div className="input-box">
                <label>مقطع دانشگاهی</label>
                <select
                  name="universityDegree"
                  value={formData.universityDegree}
                  onChange={handleChange}
                >
                  <option value="">انتخاب مقطع</option>
                  <option value="کارشناسی">کارشناسی</option>
                  <option value="ارشد">ارشد</option>
                  <option value="دکتری">دکتری</option>
                </select>
              </div>
            </div>
            <div className="input-row">
              <div className="input-box">
                <label>رشته تحصیلی</label>
                <select
                  name="universityMajor"
                  value={formData.universityMajor}
                  onChange={handleChange}
                >
                  <option value="">انتخاب رشته</option>
                  {formData.universityFaculty === "مهندسی" && (
                    <>
                      <option value="کامپیوتر">کامپیوتر</option>
                      <option value="برق">برق</option>
                      <option value="عمران">عمران</option>
                      <option value="معماری">معماری</option>
                      <option value="مکانیک">مکانیک</option>
                    </>
                  )}
                  {formData.universityFaculty === "پزشکی" && (
                    <>
                      <option value="پزشکی">پزشکی</option>
                      <option value="دندان‌پزشکی">دندان‌پزشکی</option>
                      <option value="داروسازی">داروسازی</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </>
        )}

        {/* معدل */}
        <div className="input-row">
          <div className="input-box">
            <label>معدل (GPA)</label>
            <input
              type="number"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="20"
              placeholder="مثلاً: 18.75"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button type="button" className="change-password-btn" onClick={() => navigate("/ChangePassword")}>
            تغییر رمز عبور
          </button>
          <button type="submit" className="submit-btn">
            اعمال تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}

export default Editprof;
