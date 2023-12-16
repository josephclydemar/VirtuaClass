import "./css/ManageCourses.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import OfferedCoursesContext from "../../../contexts/OfferedCoursesContext";
import CurrentCourseClassContext from "../../../contexts/CurrentCourseClassContext";

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

function ManageCourses() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { offeredCourses, setOfferedCourses } = useContext(OfferedCoursesContext);
    const { setCurrentCourseClass } = useContext(CurrentCourseClassContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(false);

    const [search, setSearch] = useState('');
    const [filteredOfferedCourses, setFilteredOfferedCourses] = useState(null);


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
            navigate('/login');
        }
    }, [currentUserChanged]);

    // * Fetch Instructor's offered Courses
    useEffect(() => {
        // console.log(currentUser);
        if(currentUser !== null && currentUser !== undefined) {
            fetch(`${DEVELOPMENT_HOST}/api/courses?instructor_id=${currentUser._id}`)
                .then(result => result.json())
                .then(value => setOfferedCourses(value));
                console.log(currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        if(offeredCourses !== null) {
            setFilteredOfferedCourses(prev => offeredCourses
                                                .filter(item => (item.name).toLowerCase().includes(search.toLowerCase()))
                                     );
        }
    }, [offeredCourses, search]);

    return (
        <div className="manageCoursesBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            <div className="classCoursesContainer">
                <h1>Manage Courses</h1>
                <div className="classCoursesSearchBarContainer">
                    <input 
                        type="search" 
                        value={search}
                        onChange={(e) => setSearch(prev => e.target.value)}/>
                </div>
                <div className="classCoursesListContainer">
                    <table>
                        <thead>
                            <th>Title</th>
                            <th>Fee</th>
                            <th>Class Record</th>
                        </thead>
                        <tbody>
                            { filteredOfferedCourses !== null ? filteredOfferedCourses.map((item) => {
                                return (
                                    <tr>
                                        <td>{ item.name }</td>
                                        <td>{ item.fee }</td>
                                        <td>
                                            <button className="blue-button"onClick={() => {
                                                // console.log(item.name);
                                                setCurrentCourseClass(prev => item);
                                                sessionStorage.setItem('currentCourseClass', JSON.stringify(item));
                                                navigate('/instructors/class_records');
                                            }}>
                                                Click to see Class Record
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : '' }
                        </tbody>
                    </table>
                </div>

                
            </div>
        </div>
    );
}

export default ManageCourses;