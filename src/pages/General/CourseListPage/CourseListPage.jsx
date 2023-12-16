import { useState, useContext } from "react"; 
import CourseList from "../../../components/CourseList";
import NavBar from '../../../components/NavBar';
import "./css/CourseListPage.css";
import SchoolInfoContext from '../../../contexts/SchoolInfoContext';


const CourseListPage = ({ courses, setCourses }) => {
    const { schoolInfo } = useContext(SchoolInfoContext);
    const [coursesExpanded, setCoursesExpanded] = useState(false);
    
    return (
        <>
            <NavBar  schoolInfo={schoolInfo}/>
            <CourseList
            courses={ courses } 
            coursesExpanded={ coursesExpanded }
            setCoursesExpanded={ setCoursesExpanded }/>
            {/* <SelectedCourses /> */}
        </>
    );
};

export default CourseListPage;

