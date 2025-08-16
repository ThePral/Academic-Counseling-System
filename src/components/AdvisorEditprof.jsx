import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import provinces from "../data/provinces";
import { useNavigate } from "react-router-dom";
import "./style/AdvisorEditprof.css";

function EditAdvisorProfile() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    province: "",
    city: "",
    department: "",
    profileImage: null,
    profileImageUrl: "",
  });

  const navigate = useNavigate();


  useEffect(() => {
    const fetchAdvisorData = async () => {
      try {
        const res = await axiosInstance.get("/counselors/me/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const user = res.data;

        setFormData((prev) => ({
          ...prev,
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          province: user.province || "",
          city: user.city || "",
          department: user.department || "",
          profileImageUrl: user.profile_image_url
            ? `${user.profile_image_url}?t=${Date.now()}`
            : "",
        }));
      } catch (err) {
        console.error("خطا در دریافت اطلاعات مشاور", err);
      }
    };

    fetchAdvisorData();
  }, []);



  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "profileImage") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  

  const validatePhone = (phone) => /^09\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      firstname,
      lastname,
      email,
      phone_number,
      province,
      city,
      department,
      profileImage,
    } = formData;
  
    const data = {
      firstname,
      lastname,
      email,
      phone_number,
      province,
      city,
      department,
    };
  
    try {
      await axiosInstance.put("/counselors/update-profile/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (profileImage) {
        const imageForm = new FormData();
        imageForm.append("file", profileImage);
  
        await axiosInstance.put("/counselors/upload-profile/", imageForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      alert("اطلاعات با موفقیت ذخیره شد.");
  
      const res = await axiosInstance.get("/counselors/me/");
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: res.data.profile_image_url
          ? `${res.data.profile_image_url}?t=${Date.now()}`
          : "",
        profileImage: null,
      }));
    } catch (err) {
      console.error("خطا در ذخیره‌سازی اطلاعات مشاور", err);
      alert("خطا در ذخیره اطلاعات. لطفاً مجدداً تلاش کنید.");
    }
  };
  
  

  const cities = provinces.find((p) => p.name === formData.province)?.cities || [];

  return (
    <div className="edit-profile-body">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="profile-pic-upload">
          <label htmlFor="profileImage" className="circle-upload">
            {formData.profileImage ? (
              <img src={URL.createObjectURL(formData.profileImage)} alt="Profile" />
            ) : formData.profileImageUrl ? (
              <img src={formData.profileImageUrl} alt="Profile" />
            ) : (
              <span>+</span>
            )}
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            hidden
            onChange={handleChange}
          />
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>نام</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>نام خانوادگی</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              style={{ backgroundColor: "#eee", cursor: "not-allowed" }}
            />
          </div>
          <div className="input-box">
            <label>شماره تماس</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-box">
            <label>استان</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            >
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

        <div className="input-row">
          <div className="input-box">
            <label>حوزه / رشته</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="مثلاً: تجربی، انسانی، ..."
            />
          </div>
        </div>

        <div className="action-buttons">
        <button
            type="button"
            className="change-password-btn"
            onClick={() => navigate("/Advisor/ChangePassword")}
        >
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

export default EditAdvisorProfile;






// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance";
// import provinces from "../data/provinces";
// import { useNavigate } from "react-router-dom";
// import "./style/AdvisorEditprof.css";

// function EditAdvisorProfile() {
//   const [formData, setFormData] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     phone_number: "",
//     province: "",
//     city: "",
//     department: "",
//     profileImage: null,
//     profileImageUrl: "",
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAdvisorData = async () => {
//       try {
//         const res = await axiosInstance.get("/counselors/me/", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         const user = res.data;

//         setFormData((prev) => ({
//           ...prev,
//           firstname: user.firstname || "",
//           lastname: user.lastname || "",
//           email: user.email || "",
//           phone_number: user.phone_number || "",
//           province: user.province || "",
//           city: user.city || "",
//           department: user.department || "",
//           profileImageUrl: user.profile_image_url
//             ? `${user.profile_image_url}?t=${Date.now()}`
//             : "",
//         }));
//       } catch (err) {
//         console.error("خطا در دریافت اطلاعات مشاور", err);
//       }
//     };

//     fetchAdvisorData();
//   }, []);

//   const validatePhone = (phone) => /^09\d{9}$/.test(phone);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "profileImage") {
//       const file = files?.[0];
//       if (!file) return;

//       // اعتبارسنجی ساده‌ی نوع و سایز (۲ مگابایت)
//       if (!file.type.startsWith("image/")) {
//         alert("فایل انتخابی باید تصویر باشد.");
//         return;
//       }
//       const MAX_SIZE = 2 * 1024 * 1024;
//       if (file.size > MAX_SIZE) {
//         alert("حجم تصویر باید حداکثر 2MB باشد.");
//         return;
//       }

//       setFormData((prev) => ({ ...prev, profileImage: file }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       firstname,
//       lastname,
//       email,
//       phone_number,
//       province,
//       city,
//       department,
//       profileImage,
//     } = formData;

//     if (!validatePhone(phone_number)) {
//       alert("شماره موبایل معتبر نیست. قالب صحیح: 09XXXXXXXXX");
//       return;
//     }

//     const data = {
//       firstname,
//       lastname,
//       email,
//       phone_number,
//       province,
//       city,
//       department,
//     };

//     try {
//       // 1) آپدیت اطلاعات متنی
//       await axiosInstance.put("/counselors/update-profile/", data, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // 2) آپلود تصویر در صورت وجود
//       if (profileImage) {
//         const imageForm = new FormData();
//         // نام صحیح فیلد سمت سرور
//         imageForm.append("profile_image", profileImage);

//         // Content-Type را تنظیم نکنید تا axios خودش boundary بگذارد
//         await axiosInstance.post("/counselors/upload-profile/", imageForm, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//       }

//       // 3) دریافت مجدد اطلاعات برای رفرش عکس (با ضدکش)
//       const res = await axiosInstance.get("/counselors/me/", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       });

//       setFormData((prev) => ({
//         ...prev,
//         profileImageUrl: res.data.profile_image_url
//           ? `${res.data.profile_image_url}?t=${Date.now()}`
//           : "",
//         profileImage: null,
//       }));

//       alert("اطلاعات با موفقیت ذخیره شد.");
//     } catch (err) {
//       console.error(
//         "خطا در ذخیره‌سازی اطلاعات مشاور",
//         err.response?.status,
//         err.response?.data || err.message
//       );
//       alert(
//         err.response?.data?.detail ||
//           "خطا در ذخیره اطلاعات. لطفاً مجدداً تلاش کنید."
//       );
//     }
//   };

//   const cities =
//     provinces.find((p) => p.name === formData.province)?.cities || [];

//   return (
//     <div className="edit-profile-body">
//       <form className="edit-profile-form" onSubmit={handleSubmit}>
//         <div className="profile-pic-upload">
//           <label htmlFor="profileImage" className="circle-upload">
//             {formData.profileImage ? (
//               <img
//                 src={URL.createObjectURL(formData.profileImage)}
//                 alt="Profile"
//               />
//             ) : formData.profileImageUrl ? (
//               <img src={formData.profileImageUrl} alt="Profile" />
//             ) : (
//               <span>+</span>
//             )}
//           </label>
//           <input
//             type="file"
//             id="profileImage"
//             name="profileImage"
//             accept="image/*"
//             hidden
//             onChange={handleChange}
//           />
//         </div>

//         <div className="input-row">
//           <div className="input-box">
//             <label>نام</label>
//             <input
//               type="text"
//               name="firstname"
//               value={formData.firstname}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="input-box">
//             <label>نام خانوادگی</label>
//             <input
//               type="text"
//               name="lastname"
//               value={formData.lastname}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="input-row">
//           <div className="input-box">
//             <label>ایمیل</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               disabled
//               style={{ backgroundColor: "#eee", cursor: "not-allowed" }}
//             />
//           </div>
//           <div className="input-box">
//             <label>شماره تماس</label>
//             <input
//               type="text"
//               name="phone_number"
//               value={formData.phone_number}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="input-row">
//           <div className="input-box">
//             <label>استان</label>
//             <select
//               name="province"
//               value={formData.province}
//               onChange={handleChange}
//               required
//             >
//               <option value="">انتخاب استان</option>
//               {provinces.map((p) => (
//                 <option key={p.name} value={p.name}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="input-box">
//             <label>شهر</label>
//             <select
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               required
//               disabled={!formData.province}
//             >
//               <option value="">انتخاب شهر</option>
//               {cities.map((city) => (
//                 <option key={city} value={city}>
//                   {city}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="input-row">
//           <div className="input-box">
//             <label>حوزه / رشته</label>
//             <input
//               type="text"
//               name="department"
//               value={formData.department}
//               onChange={handleChange}
//               placeholder="مثلاً: تجربی، انسانی، ..."
//             />
//           </div>
//         </div>

//         <div className="action-buttons">
//           <button
//             type="button"
//             className="change-password-btn"
//             onClick={() => navigate("/Advisor/ChangePassword")}
//           >
//             تغییر رمز عبور
//           </button>
//           <button type="submit" className="submit-btn">
//             اعمال تغییرات
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditAdvisorProfile;
