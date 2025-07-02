import React, { useState } from "react";
import { Calendar } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import "./style/Planning.css";


export default function Planning() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="container text-center mt-4">
      <h4 className="text-primary mb-3">برنامه‌ریزی روزانه</h4>
      <Calendar
        value={selectedDay}
        onChange={setSelectedDay}
        locale="fa"
        shouldHighlightWeekends
        colorPrimary="#007bff"
        calendarClassName="custom-calendar"
      />

      {selectedDay && (
        <div className="mt-4 p-4 border border-warning rounded shadow text-end">
          <h5>
            برنامه روز {selectedDay.year}/{selectedDay.month}/{selectedDay.day}
          </h5>
          <div className="form-group mt-3">
            <label>درس (اجباری)</label>
            <input type="text" className="form-control" required />
          </div>
          <div className="form-group mt-2">
            <label>ساعت مطالعه</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group mt-2">
            <label>منبع</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group mt-2">
            <label>توضیحات</label>
            <textarea className="form-control" />
          </div>
          <div className="form-check mt-2">
            <input className="form-check-input" type="checkbox" id="done" />
            <label className="form-check-label" htmlFor="done">مطالعه انجام شد</label>
          </div>
        </div>
      )}
    </div>
  );
}
