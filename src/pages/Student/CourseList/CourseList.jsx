import './css/CourseList.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import CurrentUserContext from '../../../contexts/CurrentUserContext';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const CourseList = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [currentUserChanged, setCurrentUserChanged] = useState(true);
    
    const [allCourses, setAllCourses] = useState(null);
    const [coursesFiltered, setCoursesFiltered] = useState(null);
    const [coursesToRender, setCoursesToRender] = useState(null);
    const [courses, setCourses] = useState(null);
    const [search, setSearch] = useState('');

    const [allInstructors, setAllInstructors] = useState(null);
    const [allTimeSlots, setAllTimeSlots] = useState(null);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/students/${sessionData._id}`)
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

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/courses`)
        .then(result => result.json())
        .then((value) => {
            setAllCourses(() => value);
        });
    }, []);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/instructors`)
        .then(result => result.json())
        .then((value) => {
            setAllInstructors(() => value);
        });
    }, []);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/time_slots`)
        .then(result => result.json())
        .then((value) => {
            setAllTimeSlots(() => value);
        });
    }, []);

    useEffect(() => {
        if(currentUser !== null && allCourses !== null) {
            setCourses(prev => allCourses.filter(
                (filterItem) => (currentUser.courses_taken_id).includes(filterItem._id))
            );
        }
    }, [allCourses]);

    useEffect(() => {
        if(courses !== null) {
            setCoursesFiltered(courses.filter((item) => ((item.name).toLowerCase()).includes(search.toLowerCase())));
            console.log(courses);
        }
    }, [search, courses]);


    useEffect(() => {
        console.log('COURSE LIST---------------------------------------->');
        if(coursesFiltered !== null && allTimeSlots !== null && allInstructors !== null){
            console.log('COURSE LIST---------------------------------------->');
            setCoursesToRender(prev => coursesFiltered.map((mapItem) => {
                return (
                    <tr>
                        <td>{ mapItem.name}</td>
                        <td>{ `${allInstructors.filter((item) => item._id === mapItem.instructor_id)[0].firstname} ${allInstructors.filter((item) => item._id === mapItem.instructor_id)[0].lastname}`  }</td>
                        <td>{ `${allTimeSlots.filter((item) => item._id === mapItem.time_slot_id)[0].day_of_week} ${allTimeSlots.filter((item) => item._id === mapItem.time_slot_id)[0].time_of_day}`}</td>
                    </tr>
                )
            }))
        }
    }, [coursesFiltered, courses, allInstructors, allTimeSlots]);

    return (
        <>
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.name}` : '' }</button>
                </span>
            </nav>
            
            <div className='courseListBody'>
                <div className='courseListContainer'>
                    <h1>Course List</h1>
                    <div className='courseSearchBox'>
                        <input
                            type='search'
                            placeholder='Search enrolled courses'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className='courseListBox'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Instructor</th>
                                    <th>Schedule</th>
                                </tr>
                            </thead>
                            <tbody>
                                { coursesToRender !== null ? coursesToRender : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
        

        
    );
};

export default CourseList;