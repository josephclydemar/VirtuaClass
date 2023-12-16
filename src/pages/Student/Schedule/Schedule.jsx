import './css/Schedule.css';

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUserContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

function Schedule() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(false);

    const [allTimeSlots, setAllTimeSlots] = useState(null);
    const [allTimeSlotsWithCourseTitle, setAllTimeSlotsWithCourseTitle] = useState(null);
    const [allTimeSlotsToRender, setAllTimeSlotsToRender] = useState(null);

    const [allCourses, setAllCourses] = useState(null);


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
        fetch(`${DEVELOPMENT_HOST}/api/courses`)
        .then(result => result.json())
        .then(value => {
          setAllCourses(prev => value);
        });
    }, []);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/time_slots`)
        .then(result => result.json())
        .then(value => setAllTimeSlots(prev => value));
    }, []);
    


    useEffect(() => {
        if(currentUser !== null && allCourses !== null && allTimeSlots !== null) {
            const x = allCourses.filter(item => currentUser.courses_taken_id.includes(item._id));
            setAllTimeSlotsWithCourseTitle(prev => allTimeSlots.map(item => {
                const y = x.filter(filterItem => item._id === filterItem.time_slot_id);
                return y.length > 0 ? {
                    ...item,
                    course_title: y[0].name
                } : {
                    ...item,
                    course_title: ''
                };
            }));
        }
    }, [allTimeSlots, allCourses, currentUser]);

    useEffect(() => {
        console.log(allTimeSlotsWithCourseTitle);
        if(allTimeSlotsWithCourseTitle !== null) {
            setAllTimeSlotsToRender(prev => []);
            setAllTimeSlotsToRender(prev => [...prev, [...allTimeSlotsWithCourseTitle.filter(item => item.day_of_week === 'MON')]]);
            setAllTimeSlotsToRender(prev => [...prev, [...allTimeSlotsWithCourseTitle.filter(item => item.day_of_week === 'TUE')]]);
            setAllTimeSlotsToRender(prev => [...prev, [...allTimeSlotsWithCourseTitle.filter(item => item.day_of_week === 'WED')]]);
            setAllTimeSlotsToRender(prev => [...prev, [...allTimeSlotsWithCourseTitle.filter(item => item.day_of_week === 'THU')]]);
            setAllTimeSlotsToRender(prev => [...prev, [...allTimeSlotsWithCourseTitle.filter(item => item.day_of_week === 'FRI')]]);
            setAllTimeSlotsToRender(prev => [...prev, [...allTimeSlotsWithCourseTitle.filter(item => item.day_of_week === 'SAT')]]);
        }
    }, [allTimeSlotsWithCourseTitle]);

    useEffect(() => {
        console.log(allTimeSlotsToRender);
    }, [allTimeSlotsToRender]);
    
    return (
        <div className="scheduleBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? currentUser.name : '' }</button>
                </span>
            </nav>
            <div className="scheduleContainer">
                <h1 className="scheduleContainerHeader">Schedule</h1>
                <div className="scheduleListContainer">
                    <div>
                        <h1 className="dayOfWeekHeaderMON">MONDAY</h1>
                        <h1 className="dayOfWeekHeaderTUE">TUESDAY</h1>
                        <h1 className="dayOfWeekHeaderWED">WEDNESDAY</h1>
                        <h1 className="dayOfWeekHeaderTHU">THURSDAY</h1>
                        <h1 className="dayOfWeekHeaderFRI">FRIDAY</h1>
                        <h1 className="dayOfWeekHeaderSAT">SATURDAY</h1>

                        <h1 className="timeOfDayHeader1">07:30AM-09:30AM</h1>
                        <h1 className="timeOfDayHeader2">09:30AM-11:30AM</h1>
                        <h1 className="timeOfDayHeader3">12:30PM-02:30PM</h1>
                        <h1 className="timeOfDayHeader4">02:30PM-04:30PM</h1>
                        <h1 className="timeOfDayHeader5">04:30PM-06:30PM</h1>
                        <h1 className="timeOfDayHeader6">06:30PM-08:30PM</h1>
                        { allTimeSlotsToRender !== null ? allTimeSlotsToRender.map(item1 => {
                            let count = 0;
                            return item1.map(item2 => {
                                return (
                                    <div className={ `timeSlotCell ${item2.day_of_week}_TimeSlot row${count += 1} ${item2.course_title !== '' ? 'occupiedTimeSlots' : 'unoccupiedTimeSlots'}` }>
                                        <div>{ item2.course_title }</div>
                                    </div>
                                );
                            });
                        }) : '' }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;