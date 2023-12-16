import './css/OfferedCourses.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import OfferedCoursesContext from '../../../contexts/OfferedCoursesContext';

import { updateButtonColorState } from '../../../utils/styleFunctions';
// import click_sound from './click_sound.wav';
// const clickSound = new Audio(click_sound);

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';


const OfferedCourses = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { offeredCourses, setOfferedCourses } = useContext(OfferedCoursesContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(true);
    
    const [timeSlots, setTimeSlots] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);

    const [daysOfWeek, setDaysOfWeek] = useState(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
    const [daysOfWeekButtonColor, setDaysOfWeekButtonColor] = useState(['#3f5','#3f5','#3f5','#3f5','#3f5','#3f5']);
    const [daysOfWeekButtonTextColor, setDaysOfWeekButtonTextColor] = useState(['#3f5','#3f5','#3f5','#3f5','#3f5','#3f5']);

    const [offeredCoursesHtml, setOfferedCoursesHtml] = useState(null);
    const [timeSlotsHtml, setTimeSlotsHtml] = useState(null);

    const [updateType, setUpdateType] = useState('add');
    const [courseId, setCourseId] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const [courseTimeSlotId, setCourseTimeSlotId] = useState('');
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');

    const [inputChanged, setInputChanged] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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


    // * Fetch all Time Slots
    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/time_slots`)
            .then(result => result.json())
            .then(value => setTimeSlots(value));
    }, []);


    // * Fetch Instructor's offered Courses
    useEffect(() => {
        // console.log(currentUser);
        if(currentUser !== null && currentUser !== undefined) {
            fetch(`${DEVELOPMENT_HOST}/api/courses?instructor_id=${currentUser._id}`)
                .then(result => result.json())
                .then(value => setOfferedCourses(value));
                console.log(currentUser);
        }
    }, [currentUser, timeSlots]);




    // * Filtering & HTML generation
    useEffect(() => {
        // console.log(offeredCourses);
        if(offeredCourses !== null && offeredCourses !== undefined) {
            setOfferedCoursesHtml(offeredCourses
                                        .filter(item => {
                                            return (`${item.name}`.toLowerCase()).includes(search.toLowerCase());
                                        })
                                        .map(item => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <button onClick={() => {
                                                            const daysOfWeekLocal = {
                                                                MON: 0,
                                                                TUE: 1,
                                                                WED: 2,
                                                                THU: 3,
                                                                FRI: 4,
                                                                SAT: 5
                                                            };
                                                            setUpdateType(prev => 'change');
                                                            setCourseId(prev => item._id);
                                                            setCourseName(prev => item.name);
                                                            setCourseDescription(prev => item.description);
                                                            setCourseFee(prev => item.fee);
                                                            setCourseTimeSlotId(prev => item.time_slot_id);
                                                            setSelectedTimeSlotId(prev => '');

                                                            setSelectedDayOfWeek(prev => daysOfWeekLocal[
                                                                (timeSlots.filter(filterItem => filterItem._id === item.time_slot_id)[0]).day_of_week
                                                            ]);
                                                        }}
                                                        className="courseListIndividualButton">{ item.name }</button>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => {
                                                            const daysOfWeekLocal = {
                                                                MON: 0,
                                                                TUE: 1,
                                                                WED: 2,
                                                                THU: 3,
                                                                FRI: 4,
                                                                SAT: 5
                                                            };
                                                            setUpdateType(prev => 'change');
                                                            setCourseId(prev => item._id);
                                                            setCourseName(prev => item.name);
                                                            setCourseDescription(prev => item.description);
                                                            setCourseFee(prev => item.fee);
                                                            setCourseTimeSlotId(prev => item.time_slot_id);
                                                            setSelectedTimeSlotId(prev => '');

                                                            setSelectedDayOfWeek(prev => daysOfWeekLocal[
                                                                (timeSlots.filter(filterItem => filterItem._id === item.time_slot_id)[0]).day_of_week
                                                            ]);
                                                        }}
                                                        className="courseListIndividualButton">P{ item.fee }</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
            );
            // console.log(search);
        }
    }, [offeredCourses, search]);


    // Filter Time Slots
    useEffect(() => {
        if(currentUser !== null && timeSlots !== null) {
            setTimeSlotsHtml(timeSlots.filter(item => item.day_of_week === daysOfWeek[selectedDayOfWeek])
                                      .map(item => {
                                        return (
                                            <tr>
                                                {/* <td>{ item._id }</td> */}
                                                <td>
                                                    <button 
                                                        style={(() => {
                                                            if((currentUser.schedule_ids).includes(item._id)) {
                                                                return {
                                                                    backgroundColor: '#555'
                                                                };
                                                            } else if(selectedTimeSlotId === item._id) {
                                                                return {
                                                                    backgroundColor: '#c20',
                                                                    color: '#fff'
                                                                };
                                                            } else {
                                                                return {
                                                                    backgroundColor: '#3f5'
                                                                };
                                                            }
                                                        })()}
                                                        onClick={() => {
                                                            setSelectedTimeSlotId(prev => item._id);
                                                        }}
                                                        disabled={(currentUser.schedule_ids).includes(item._id)}>{ item.time_of_day }</button>
                                                </td>
                                            </tr>
                                        );
                                      }));
        }
        // console.log(timeSlots);
    }, [timeSlots, currentUser, selectedDayOfWeek, selectedTimeSlotId]);



    useEffect(() => {
        // console.log(selectedDayOfWeek);
        let tempDaysOfWeekButtonColors = ['#3f5', '#3f5', '#3f5', '#3f5', '#3f5', '#3f5'];
        let tempDaysOfWeekButtonTextColors = ['#000', '#000', '#000', '#000', '#000', '#000'];
        for(let i=0; i<tempDaysOfWeekButtonColors.length; i++) {
            if(i === parseInt(selectedDayOfWeek)) {
                tempDaysOfWeekButtonColors[i] = '#c20';
                tempDaysOfWeekButtonTextColors[i] = '#fff';
                continue;
            }
            tempDaysOfWeekButtonColors[i] = '#3f5';
            tempDaysOfWeekButtonTextColors[i] = '#000';
        }
        // console.log(tempDaysOfWeekButtonColors);
        setDaysOfWeekButtonColor(tempDaysOfWeekButtonColors);
        setDaysOfWeekButtonTextColor(tempDaysOfWeekButtonTextColors);
    }, [selectedDayOfWeek]);



    useEffect(() => {
        console.log('-----------------------------------------------------------------');
        console.log(`Update Type: -> ${updateType}`);
        console.log(`Course Time Slot ID: -> ${courseTimeSlotId}`);
        console.log(`Selected Time Slot ID: -> ${selectedTimeSlotId}`);
        console.log(`Course Name: -> ${courseName}`);
        console.log(`Course Description: -> ${courseDescription}`);
        console.log(`Course Fee: -> ${courseFee}`);
        console.log(`Course Field Changed: -> ${inputChanged}`);
        console.log('-----------------------------------------------------------------');
    }, [updateType, courseName, courseDescription, courseFee, courseTimeSlotId, selectedTimeSlotId, inputChanged]);



    return (
        <div className="offeredCoursesBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            {
                (currentUser !== null) ? (
                    (currentUser.is_blocked === false) ? (
                        <>
                        <div className="offeredCoursesListContainer">
                            <h1>Offered Courses</h1>
                            <div className="offeredCoursesSearchBox">
                                <input 
                                    type="search" 
                                    placeholder="Search for your Courses"
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)}/>
                            </div>
                            <div className="offeredCoursesListBox">
                                <table>
                                    <thead>
                                        <th>Title</th>
                                        <th>Fee</th>
                                    </thead>
                                    <tbody>
                                        { offeredCoursesHtml !== null ? offeredCoursesHtml : '' }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="offeredCoursesCrudContainer">
                            <h1>Course Operations</h1>
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Course Title"
                                    value={courseName}
                                    onChange={(e) => setCourseName(prev => e.target.value)}
                                    onKeyDown={() => setInputChanged(prev => true)}/>
                            </div>
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Course Description"
                                    value={courseDescription}
                                    onChange={(e) => setCourseDescription(prev => e.target.value)}
                                    onKeyDown={() => setInputChanged(prev => true)}/>
                            </div>
                            <div>
                                <input
                                    type="number" 
                                    min={0}
                                    placeholder="Fee"
                                    value={courseFee}
                                    onChange={(e) => setCourseFee(prev => e.target.value)}
                                    onKeyDown={() => setInputChanged(prev => true)}/>
                            </div>
                            <div className="scheduleInputContainer">
                                <div className="daysOfWeekButtonsContainer">
                                    <button
                                        style={{
                                            backgroundColor: daysOfWeekButtonColor[0],
                                            color: daysOfWeekButtonTextColor[0]
                                        }}
                                        className="daysOfWeekInput"
                                        value={0}
                                        onClick={(e) => setSelectedDayOfWeek(e.target.value)}>MON</button>
                                    <button
                                        style={{
                                            backgroundColor: daysOfWeekButtonColor[1],
                                            color: daysOfWeekButtonTextColor[1]
                                        }}
                                        className="daysOfWeekInput"
                                        value={1}
                                        onClick={(e) => setSelectedDayOfWeek(e.target.value)}>TUE</button>
                                    <button
                                        style={{
                                            backgroundColor: daysOfWeekButtonColor[2],
                                            color: daysOfWeekButtonTextColor[2]
                                        }}
                                        className="daysOfWeekInput"
                                        value={2}
                                        onClick={(e) => setSelectedDayOfWeek(e.target.value)}>WED</button>
                                    <button
                                        style={{
                                            backgroundColor: daysOfWeekButtonColor[3],
                                            color: daysOfWeekButtonTextColor[3]
                                        }}
                                        className="daysOfWeekInput"
                                        value={3}
                                        onClick={(e) => setSelectedDayOfWeek(e.target.value)}>THU</button>
                                    <button
                                        style={{
                                            backgroundColor: daysOfWeekButtonColor[4],
                                            color: daysOfWeekButtonTextColor[4]
                                        }}
                                        className="daysOfWeekInput"
                                        value={4}
                                        onClick={(e) => setSelectedDayOfWeek(e.target.value)}>FRI</button>
                                    <button
                                        style={{
                                            backgroundColor: daysOfWeekButtonColor[5],
                                            color: daysOfWeekButtonTextColor[5]
                                        }}
                                        className="daysOfWeekInput"
                                        value={5}
                                        onClick={(e) => setSelectedDayOfWeek(e.target.value)}>SAT</button>
                                </div>
                                <div className="timeSlotButtonsContainer">
                                    <table>
                                        <tbody>
                                            { timeSlotsHtml !== null ? timeSlotsHtml : '' }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>



                        <div className="offeredCoursesButtonsContainer">
                            <div className="addCourseButtonContainer">
                                <button 
                                    style={updateButtonColorState({
                                        callback: () => {
                                            return {
                                                backgroundColor: '#79f'
                                            };
                                        },
                                        isButtonDisabled: isButtonDisabled
                                    })}
                                    disabled={isButtonDisabled}
                                    onClick={() => {
                                        if(currentUser !== null) {
                                            if(updateType === 'add') {
                                                if(courseName !== '' && courseDescription !== '' && courseFee !== '' && selectedTimeSlotId !== '') {
                                                    setIsButtonDisabled(prev => true);
                                                    fetch(`${DEVELOPMENT_HOST}/api/instructors/${currentUser._id}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        redirect: 'follow',
                                                        body: JSON.stringify({
                                                            update_type: 'add',
                                                            course_name: courseName,
                                                            course_fee: courseFee,
                                                            course_description: courseDescription,
                                                            course_time_slot_id: selectedTimeSlotId
                                                        })
                                                    })
                                                    .then(result => result.json())
                                                    .then(value => {
                                                        console.log(value);
                                                        setIsButtonDisabled(prev => false);

                                                        setUpdateType(prev => 'add');
                                                        setCourseId(prev => null);
                                                        setCourseName(prev => '');
                                                        setCourseDescription(prev => '');
                                                        setCourseFee(prev => '');
                                                        setCourseTimeSlotId(prev => '');
                                                        setInputChanged(prev => false);

                                                        setCurrentUserChanged(prev => true);
                                                    })
                                                }
                                            } else {
                                                setUpdateType(prev => 'add');
                                                setCourseId(prev => null);
                                                setCourseName(prev => '');
                                                setCourseDescription(prev => '');
                                                setCourseFee(prev => '');
                                                setCourseTimeSlotId(prev => '');
                                                setInputChanged(prev => false);
                                                return;
                                            }
                                        }
                                    }}>
                                    Add New Course
                                </button>
                            </div>

                            <div className="updateCourseButtonContainer">
                                <button 
                                    style={updateButtonColorState({
                                        callback: () => {
                                            return {
                                                backgroundColor: '#79f'
                                            };
                                        },
                                        isButtonDisabled: isButtonDisabled
                                    })}
                                    disabled={isButtonDisabled}
                                    onClick={() => {
                                        if(currentUser !== null) {
                                            setIsButtonDisabled(prev => true);
                                            if(updateType === 'change') {
                                                if(inputChanged || (courseName !== '' && courseDescription !== '' && courseFee !== '' && courseTimeSlotId !== '' && selectedTimeSlotId !== '')) {
                                                    fetch(`${DEVELOPMENT_HOST}/api/instructors/${currentUser._id}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        redirect: 'follow',
                                                        body: JSON.stringify({
                                                            update_type: 'change',
                                                            course_name: courseName,
                                                            course_fee: courseFee,
                                                            course_description: courseDescription,
                                                            course_time_slot_id: courseTimeSlotId,
                                                            new_course_time_slot_id: selectedTimeSlotId
                                                        })
                                                    })
                                                    .then((result) => result.json())
                                                    .then((value) => {
                                                        console.log(value);
                                                        setIsButtonDisabled(prev => false);

                                                        setUpdateType(prev => 'add');
                                                        setCourseId(prev => null);
                                                        setCourseName(prev => '');
                                                        setCourseDescription(prev => '');
                                                        setCourseFee(prev => '');
                                                        setCourseTimeSlotId(prev => '');
                                                        setSelectedTimeSlotId(prev => '');

                                                        setInputChanged(prev => false);
                                                        setCurrentUserChanged(prev => true);
                                                    });
                                                }
                                            }
                                        }
                                    }}>
                                    Update Course
                                </button>
                            </div>

                            <div className="clearFormButtonContainer">
                                <button 
                                    style={updateButtonColorState({
                                        callback: () => {
                                            return {
                                                backgroundColor: '#79f'
                                            };
                                        },
                                        isButtonDisabled: isButtonDisabled
                                    })}
                                    disabled={isButtonDisabled}
                                    onClick={(e) => {
                                        // clickSound.play();
                                        setUpdateType(prev => 'add');
                                        setCourseId(prev => null);
                                        setCourseName(prev => '');
                                        setCourseDescription(prev => '');
                                        setCourseFee(prev => '');
                                        setCourseTimeSlotId(prev => '');
                                        setInputChanged(prev => false);
                                    }}>
                                    Clear Form
                                </button>
                            </div>

                            <div className="deleteCourseButtonContainer">
                                <button 
                                    style={updateButtonColorState({
                                        callback: () => {
                                            return {
                                                backgroundColor: '#e50'
                                            };
                                        },
                                        isButtonDisabled: isButtonDisabled
                                    })}
                                    disabled={isButtonDisabled}
                                    onClick={() => {
                                        if(currentUser !== null && courseTimeSlotId !== '') {
                                            setIsButtonDisabled(prev => true);
                                            fetch(`${DEVELOPMENT_HOST}/api/instructors/${currentUser._id}`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                redirect: 'follow',
                                                body: JSON.stringify({
                                                    update_type: 'remove',
                                                    course_time_slot_id: courseTimeSlotId
                                                })
                                            })
                                            .then(result => result.json())
                                            .then(value => {
                                                setIsButtonDisabled(prev => false);
                                                setCurrentUserChanged(prev => true);

                                                setUpdateType(prev => 'add');
                                                setCourseId(prev => null);
                                                setCourseName(prev => '');
                                                setCourseDescription(prev => '');
                                                setCourseFee(prev => '');
                                                setCourseTimeSlotId(prev => '');
                                                setInputChanged(prev => false);
                                            });
                                            return;
                                        }
                                    }}>
                                    Delete Course
                                </button>
                            </div>
                        </div>
                        </>
                    ) : (
                        <div className="blockedMessageContainer">
                            <h1>You are Blocked</h1>
                        </div>
                    )
                ) : (
                    <div className='loadingPageContainer'>
                        <h1>Page is Loading...</h1>
                    </div>
                )
            }
        </div>
    );
}

export default OfferedCourses;