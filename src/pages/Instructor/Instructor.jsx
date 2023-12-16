import { Routes, Route } from "react-router-dom";
import { OfferedCoursesProvider } from "../../contexts/OfferedCoursesContext";
import { CurrentCourseClassProvider } from "../../contexts/CurrentCourseClassContext";

// Instructor Components
import InstructorDashboard from "./InstructorDashboard/InstructorDashboard";
import OfferedCourses from "./OfferedCourses/OfferedCourses";
import ManageCourses from "./ManageCourses/ManageCourses";
import ClassRecords from "./ClassRecords/ClassRecords";
import ClassActivities from "./ClassActivities/ClassActivities";

function Instructor() {
  return (
    <>
        <OfferedCoursesProvider>
        <CurrentCourseClassProvider>
            <Routes>
                <Route path="/" element={<InstructorDashboard />} />
                <Route path="/offered_courses" element={<OfferedCourses/>}/>
                <Route path="/manage_courses" element={<ManageCourses/>}/>
                <Route path="/class_records" element={<ClassRecords/>} />
                <Route path="/class_activities" element={<ClassActivities/>} />
            </Routes>
            </CurrentCourseClassProvider>
        </OfferedCoursesProvider>
    </>
  )
}

export default Instructor;