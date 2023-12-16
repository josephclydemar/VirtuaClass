import './css/Schedule.css';

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUserContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

function Schedule() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(false);

    const [timeSlots, setTimeSlots] = useState(null);
    const [studentCourses, setStudentCourses] = useState(null);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                fetch(`${DEVELOPMENT_HOST}/api/students/${sessionData._id}`)
                    .then((result) => result.json())
                    .then((value) => {
                        console.table(value);
                        setCurrentUserChanged(prev => false);
                        sessionStorage.setItem('currentUser', JSON.stringify(value));
                        if(value.is_blocked) {
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

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/time_slots`)
        .then(result => result.json())
        .then(value => setTimeSlots(prev => value));
    }, []);

    useEffect(() => {
        console.log(timeSlots);
    }, [timeSlots]);
    
    return (
        <div className="scheduleBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? currentUser.name : '' }</button>
                </span>
            </nav>
            <div className="scheduleContainer">
                <table>
                    <table>
                        <thead>
                            <th>Time Slots</th>
                        </thead>
                        <tbody>
                            { timeSlots !== null ? timeSlots.map(item => {
                                return (
                                    <tr>
                                        <td>{ item._id }</td>
                                    </tr>
                                );
                            }) : '' }
                        </tbody>
                    </table>
                </table>
            </div>
        </div>
    );
}

export default Schedule;