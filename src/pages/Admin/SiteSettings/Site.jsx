import React, { useState } from 'react';
import './Site.css'; // Import your CSS file for styling
import Calendar from 'react-calendar';
import FAQ from './faq';

const Site = () => {
  const [headers, setHeaders] = useState([
    'School Name',
    'Mission',
    'Vision',
    'Objectives',
    'Payment Link',
    'Contact Information',
  ]);

  const [events, setEvents] = useState([]); // State to store events
  const [newEvent, setNewEvent] = useState(''); // State to capture the new event input

  // Function to add a new event to the events list
  const addEvent = () => {
    if (newEvent) {
      setEvents([...events, newEvent]);
      setNewEvent(''); // Clear the input field after adding the event
    }
  };

  // Function to delete an event
  const deleteEvent = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  // Function for the button in the left column
  const handleLeftColumnButtonClick = () => {
    // Add your logic here for the button in the left column
  };

  return (
    <div className="dashboard">
      <div className="left-column">
        <h1>Site Settings</h1>
        <button onClick={handleLeftColumnButtonClick} className="left-column-button">
          Update
        </button>
        <div className="input-column">
          {headers.map((header, index) => (
            <div key={index}>
              <h2>{header}</h2>
              <textarea
                className={`header-input input-for-${index}`} // Assign class based on the index
                placeholder={`Input for ${header}`}
                rows="4" // Number of visible text lines
              />
            </div>
          ))}
        </div>
        <FAQ />
      </div>
      <div className="calendar-container">
        <div className='calendar-heading'>
          <h2>School Calendar</h2>
        </div>
        <Calendar className="calendar" />
        {/* Form to add events */}
        <form onSubmit={(e) => { e.preventDefault(); addEvent(); }}>
          <textarea
            placeholder="Add an event"
            rows="4"
            style={{ width: '100%', height: '80px' }} // Adjust width and height
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button type="submit" className="add-button">Add</button>
          </div>
        </form>
        {/* Display the list of events with Delete buttons */}
        <div className="event-list">
          <h3>Events:</h3>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                {event}
                <button onClick={() => deleteEvent(index)} className="delete-button">
                  DELETE GDSHDSHDH
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Site;
