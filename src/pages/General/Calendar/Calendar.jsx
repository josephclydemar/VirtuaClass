import React, { useEffect, useState, useContext } from 'react';
import ReactCalendar from 'react-calendar';
import NavBar from '../../../components/NavBar';
import './css/Calendar.css';
import SchoolInfoContext from '../../../contexts/SchoolInfoContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const Calendar = () => {
  const { schoolInfo } = useContext(SchoolInfoContext);
  // Define state variables for the selected date and events
  const [selectedDate, setSelectedDate] = useState(null);
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect( 
    () => {
      fetch(`${DEVELOPMENT_HOST}/api/events`)
        .then(result =>{return result.json()})
        .then(value =>{setEvents(value)});
    }, []
  )

  // Function to handle date selection
  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
    for (let i=0; i<events.length; i++) {
      if (events[i].date === date.toDateString()){
        setEvent(events[i]);
        break;
      }
      else {
        setEvent(null);
      }
    }
    
    // You can add additional logic here, such as fetching events for the selected date.
  };

  return (
    <>
      <NavBar  schoolInfo={schoolInfo}/>
      <div className="calendar-container">
        <div className="centered-content">
          <ReactCalendar onChange={handleDateChange} value={selectedDate} />
          <div>
            {selectedDate && (
              <p>Selected Date: {selectedDate.toDateString()}</p>
            )}
            {
              <p>{event !== null ? `Event: ${event.event}` : ''}</p>
            }
              
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;