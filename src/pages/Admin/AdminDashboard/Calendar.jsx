import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './Calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-heading">
        <h2>School Calendar</h2>
      </div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="enlarged-calendar" // Add this className if needed
      />
    </div>
  );
};

export default CalendarComponent;
