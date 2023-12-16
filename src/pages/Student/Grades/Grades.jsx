import './css/Grades.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import CurrentUserContext from '../../../contexts/CurrentUserContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const Grades = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [currentUserChanged, setCurrentUserChanged] = useState(true);

    const [allCourses, setAllCourses] = useState(null);
    const [coursesFiltered, setCoursesFiltered] = useState(null);
    const [coursesToRender, setCoursesToRender] = useState(null);
    const [courses, setCourses] = useState(null);
    const [search, setSearch] = useState('');

    const [allInstructors, setAllInstructors] = useState(null);
    const [activities, setActivities] = useState(null);


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
                setActivities(prev => sessionData.activities);
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
        if(coursesFiltered !== null && allInstructors !== null && activities !== null){
            console.log('COURSE LIST---------------------------------------->');
            setCoursesToRender(prev => coursesFiltered.map((mapItem) => {
                const currentCourseActivities = activities.filter((item) => item.activity_course_id === mapItem._id);
                let grade = null;
                if(currentCourseActivities.length !== 0){
                    grade = currentCourseActivities.reduce((accumulator, item) => accumulator + item.activity_score, 0)/currentCourseActivities.length;
                } 
        
                return (
                    <tr>
                        <td>{ mapItem.name }</td>
                        <td>{ `${allInstructors.filter((item) => item._id === mapItem.instructor_id)[0].firstname} ${allInstructors.filter((item) => item._id === mapItem.instructor_id)[0].lastname}`  }</td>
                        <td>{ grade !== null ? grade : 'No Activities Yet'}</td>
                    </tr>
                )
            }))
        }
    }, [coursesFiltered, courses, activities])

   

    return (
        <>
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.name}` : '' }</button>
                </span>
            </nav>
            
            <div className='gradesBody'>
                <div className='gradesContainer'>
                    <h1>Grades</h1>
                    <div className='gradeSearchBox'>
                        <input
                            type='search'
                            placeholder='Search enrolled courses'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className='gradesBox'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Instructor</th>
                                    <th>Grade</th>
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

export default Grades;
