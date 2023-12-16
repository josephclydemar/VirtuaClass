import ReactCalendar from 'react-calendar';
import './css/AdminDashboard.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import "react-calendar/dist/Calendar.css";


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const AdminDashboard = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/admins/${sessionData._id}`)
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
    
    // setCurrentUser(JSON.parse(sessionStorage.getItem('currentUser')));



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
        <div className="adminDashBody">
            <div>
                <header>
                    <div className="welcome">
                        Welcome, <span className="admin-box">{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</span>
                    </div>
                </header>
            </div>
            <div className="dashboard">
                <div>
                    <div className="button-column">
                        
                        <button className="dashboard-button" onClick={() => navigate('/admins/enrollment_applications')}>Enrollment Applications</button><br/>
                        <button className="dashboard-button" onClick={() => navigate('/admins/student_accounts')}>Student Accounts</button><br/>
                        <button className="dashboard-button" onClick={() => navigate('/admins/instructor_accounts')}>Instructor Accounts</button><br/>
                        <button className="dashboard-button" onClick={() => navigate('/admins/administrator_accounts')}>Administrator Accounts</button><br/>
                        <button className="dashboard-button" onClick={() => navigate('/admins/site_settings')}>Site Settings</button><br/>
                    </div>
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
        </div>
    );
};


export default AdminDashboard;