import ReactCalendar from 'react-calendar';
import './css/InstructorDashboard.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import "react-calendar/dist/Calendar.css";


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const InstructorDashboard = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [currentUserChanged, setCurrentUserChanged] = useState(true);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/instructors/${sessionData._id}`)
                    .then((result) => result.json())
                    .then((value) => {
                        console.table(value);
                        setCurrentUserChanged(prev => false);
                        sessionStorage.setItem('currentUser', JSON.stringify(value));
                        if(value.is_blocked){
                            navigate('/blocked');
                        }
                    });
            } else {
                setCurrentUser(prev => sessionData);
            }
        } else {
            navigate('/');
        }
    }, [currentUserChanged]);
    
    // Define state variables for the selected date and events
    const [selectedDate, setSelectedDate] = useState(null);
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState(null);

    useEffect( 
        () => {
        fetch(`${DEVELOPMENT_HOST}/api/events`)
            .then(result =>{return result.json()})
            .then(value =>{setEvents(value)});
        }, []);


    // Function to handle date selection
    const handleDateChange = (date) => {
        console.log(date);
        setSelectedDate(date);
        for (let i=0; i<events.length; i++) {
        if (events[i].date === date.toDateString()){
            setEvent(events[i]);
            break;
        }else {
            setEvent(null);
        }
        }
    }
    return (
        <>
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            
            <div className="dashboard">
                <div className="button-column">
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/instructors/offered_courses')}>
                        Offered Courses
                    </button>
                    <br/>
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/instructors/manage_courses')}>
                        Manage Courses
                    </button>
                    <br/>
                </div>
                    <div>
                        <div className="calendar-container">
                            <div className="calendar-heading">
                                <h2>School Calendar</h2>
                            </div>
                            <ReactCalendar 
                                onChange={handleDateChange} 
                                value={selectedDate} 
                                className="enlarged-calendar" />
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
            </div>
        </>
    );
};


export default InstructorDashboard;