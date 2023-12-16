import { Routes, Route } from 'react-router-dom';

// Contexts
import { NewActivityPopupProvider } from "../../contexts/NewActivityPopupContext";

// Instructor Components
import StudentDashboard from "./StudentDashboard/StudentDashboard";
import CourseList from './CourseList/CourseList';
import ChangePassword from './ChangePassword/ChangePassword';
import PendingActivities from './PendingActivities/PendingActivities';
import Grades from './Grades/Grades';
import Schedule from './Schedule/Schedule';

function Student() {
  return (
    <>
      <NewActivityPopupProvider>
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/course_list" element={<CourseList/>}/>
          <Route path="/change_password" element={<ChangePassword/>}/>
          <Route path="/pending_activities" element={<PendingActivities />} />
          <Route path="/grades" element={<Grades/>}/>
          <Route path="/schedule" element={<Schedule/>}/>
        </Routes>
      </NewActivityPopupProvider>
    </>
  )
}

export default Student;