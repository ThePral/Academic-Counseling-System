import React from "react";
import "./style/ResetCode.css";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const ResetCode = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = e.target[0].value;
    if (!/^\d{6}$/.test(code)) {
      alert("6 رقم");
      return;
    }
  
    console.log("کدملی معتبر:", code);
    // navigate("/");
  };

  return (
    <div className="Reset-body">
      <div className="Reset-container">
        <div className="Reset-forms">
          <div className="Reset-form-content">
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="Resetinput-boxes">
                  <div className="Reset-input-box">
                    <input
                      type="text"
                      placeholder="کد:"
                      required
                      pattern="\d{6}"
                      maxLength={6}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, ''); // حذف غیر عددی
                      }}
                    />
                  </div>
                  <div className="button Reset-input-box">
                    <input type="submit" value="ارسال"  />                    
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

export default ResetCode;
