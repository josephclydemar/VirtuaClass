import { useEffect, useState } from "react";
import Course from "./Course";

const SelectCourse = ({ courseObj, setCourses, setSelectedCoursesIds, courseExpanded, selectedCourses, setSelectedCourses }) => {
    const [checkBoxStatus, setCheckBoxStatus] = useState(false);

    
    return (
        <>
            <Course 
                key={ courseObj.id } 
                courseObj={ courseObj } 
                allExpanded={ courseExpanded } 
                checkBox={
                    <button 
                        className="addCourseButton"
                        onClick={() => {
                            console.log(courseObj.id);
                            setSelectedCourses([...selectedCourses, courseObj]);
                            setSelectedCoursesIds(prev => [...prev, courseObj.id]);
                            setCourses(prev => [...prev.filter(item => item.id !== courseObj.id)]);
                        }}
                        >Add Course</button>
                }
            />
            {/* <button onClick={() => console.log(courseObj)}>Show Course</button> */}
        </>
    );
}

export default SelectCourse;