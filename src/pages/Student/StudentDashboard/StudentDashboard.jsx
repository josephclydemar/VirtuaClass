import ReactCalendar from 'react-calendar';
import './css/StudentDashboard.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "react-calendar/dist/Calendar.css";
import Popup from '../Popup/Popup';

import CurrentUserContext from "../../../contexts/CurrentUserContext";

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const StudentDashboard = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [currentUserChanged, setCurrentUserChanged] = useState(true);

    // Define state variables for the selected date and events
    const [selectedDate, setSelectedDate] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    // const [isSetAllEvents, setIsSetAllEvents] = useState(false);

    const [allGeneralEvents, setAllGeneralEvents] = useState(null);

    const [studentActivityIds, setStudentActivityIds] = useState(null);
    const [allActivities, setAllActivities] = useState(null);
    const [allStudentActivites, setAllStudentActivites] = useState(null);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/students/${sessionData._id}`)
                    .then((result) => result.json())
                    .then((value) => {
                        // console.table(value);
                        setCurrentUserChanged(prev => false);
                        sessionStorage.setItem('currentUser', JSON.stringify(value));
                        if(value.is_blocked){
                            navigate('/blocked');
                        }
                    });
            } else {
                setCurrentUser(prev => sessionData);
                setStudentActivityIds(prev => (sessionData.activities).map(item => item.activity_id));
            }
        } else {
            navigate('/login');
        }
    }, [currentUserChanged]);

    // useEffect(() => setIsSetAllEvents(prev => false), [selectedDate]);



    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/events`)
            .then(result =>{return result.json()})
            .then(value =>{setAllGeneralEvents(value)});
    }, []);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/activities`)
            .then(result => result.json())
            .then(value => setAllActivities(prev => value));
    }, []);

    useEffect(() => {
        if(studentActivityIds !== null && allActivities !== null) {
            setAllStudentActivites(prev => allActivities.filter(item => studentActivityIds.includes(item._id)));
        }
    }, [studentActivityIds, allActivities]);

    useEffect(() => {
        console.log('YOOO');
        if(allStudentActivites !== null && allGeneralEvents !== null) {
            setAllEvents(prev => [...allStudentActivites
                                                .filter(item => {
                                                    console.log('TO COMPARE DATE ->:', item.deadline.split('T')[0]);
                                                    console.log('SELECTED DATE ->:', (new Date(selectedDate)).toISOString().split('T')[0]);
                                                    return item.deadline.split('T')[0] === (new Date(selectedDate)).toISOString().split('T')[0];
                                                })
                                                .map(item => {
                                                    return { event_name: item.title, event_datetime: item.deadline };
                                                })
                                 ]);
            setAllEvents(prev => [...prev, ...allGeneralEvents
                                                .filter(item => {
                                                    return item.event_datetime.split('T')[0] === (new Date(selectedDate)).toISOString().split('T')[0];
                                                })
                                                .map(item => {
                                                    return { event_name: item.event, event_datetime: item.event_datetime };
                                                })
        ]);
            console.log('HAHA');
        }
    }, [allStudentActivites, allGeneralEvents, selectedDate]);

    useEffect(() => console.log(allEvents), [allEvents]);






    // useEffect(() => {
    //     console.log('Student Activity Ids ->:', studentActivityIds);
    // }, [studentActivityIds]);

    // useEffect(() => {
    //     console.log('=------------------------------------------------=')
    //     console.log('ALL STUDENT ACTIVITIES ->:', allStudentActivites);
    //     console.log(allActivities);
    // }, [allStudentActivites]);

    // useEffect(() => {
    //     console.log('SELECTED DATE ->:', selectedDate);
    // }, [selectedDate]);
    return (
        <>
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.name}` : '' }</button>
                </span>
            </nav>
            <div className="dashboard">
                <div className="button-column">
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/students/course_list')}>
                        Course List
                    </button>
                    <br/>
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/students/schedule')}>
                        Schedule
                    </button>
                    <br/>
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/students/pending_activities')}>
                        Activites
                    </button>
                    <br/>
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/students/grades')}>
                        Grades
                    </button>
                    <br/>
                    <button 
                        className="dashboard-button" 
                        onClick={() => navigate('/students/change_password')}>
                        Change Password
                    </button>
                    <br/>
                </div>
                <div>
                    <div className="calendar-container">
                        <div className="calendar-heading">
                            <h2>School Calendar</h2>
                        </div>
                        <ReactCalendar 
                            onChange={(e) => setSelectedDate(e)} 
                            value={selectedDate} 
                            className="enlarged-calendar" />
                        <div>
                        { selectedDate !== null ? (<p>Selected Date: {selectedDate.toDateString()}</p>) : '' }
                        <div className="allEvents">
                            <table>
                                <thead>
                                    <th>Event Title</th>
                                    <th>Event Date</th>
                                </thead>
                                <tbody>
                                    { allEvents.map(item => {
                                        return (
                                            <tr>
                                                <td>{ item.event_name }</td>
                                                <td>{ (new Date(item.event_datetime)).toUTCString() }</td>
                                            </tr>
                                        );
                                    }) }
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Popup/>
                </div>
            </div>
        </>
    );
};


export default StudentDashboard;