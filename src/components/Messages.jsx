import React from "react";
import "./style/Messages.css";

const Messages = () => {
  return (
    <div className="chat-placeholder-container">
      <div className="chat-box">
        <h2>💬 چت با مشاور</h2>
        <p>این قابلیت به‌زودی در آپدیت‌های بعدی اضافه خواهد شد.</p>
        <p className="email-tip">
          فعلاً برای ارتباط با مشاور، از ایمیل او استفاده نمایید.
        </p>
        <div className="chat-soon-pulse" />
      </div>
    </div>
  );
};

export default Messages;
