import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { CurrentUserProvider } from "./contexts/CurrentUserContext";

// Contexts
import SchoolInfoContext from "./contexts/SchoolInfoContext";


// General Components
import CourseListPage from "./pages/General/CourseListPage/CourseListPage";
import EnrollmentForm from "./pages/General/EnrollmentForm/EnrollmentForm";
import Faq from "./pages/General/FAQ/Faq";
import Calendar from "./pages/General/Calendar/Calendar";
import GeneralSchoolInformation from "./pages/General/GeneralSchoolInfo/GeneralSchoolInfo";
import PaymentLink from "./pages/General/PaymentLink/PaymentLink";
import LoginScreen from "./pages/General/LoginScreen/LoginScreen";
import Blocked from "./pages/General/Blocked/Blocked";


// Admin
import Admin from './pages/Admin/Admin';

// Instructor
import Instructor from "./pages/Instructor/Instructor";

// Student
import Student from "./pages/Student/Student";



const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';


const getAllCourses = async () => {
  const response = await fetch(`${DEVELOPMENT_HOST}/api/courses`);
  return await response.json();
};
const getAllInstructors = async () => {
  const response = await fetch(`${DEVELOPMENT_HOST}/api/instructors`);
  return await response.json();
};

const App = () => {
    const { setSchoolInfo } = useContext(SchoolInfoContext);
    
    useEffect(
      () => {
        fetch(`${DEVELOPMENT_HOST}/api/school`)
        .then(result =>{return result.json()})
        .then(value =>{setSchoolInfo(value)});
      }, []
    )

    
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      (async () => {
        const allCourses = await getAllCourses();
        const allInstructors = await getAllInstructors();
        let temp = [];
        for (let i=0; i<allCourses.length; i++) {
          
          // console.log(instructorData);
          let instructorData = allInstructors.filter(instructor => instructor._id === allCourses[i].instructor_id)[0];
          temp.push({
            id: allCourses[i]._id,
            name: allCourses[i].name,
            fee: allCourses[i].fee,
            description: allCourses[i].description,
            instructor: `${instructorData.firstname} ${instructorData.lastname}`,
            email: instructorData.email
          });
        }
        // console.log(temp);
        setCourses(temp);
      })();
      
    }, []);


    
    return (
        <>
          <CurrentUserProvider>
            <BrowserRouter>
                
                <Routes>
                    <Route path='/' element={<GeneralSchoolInformation/>} />
                    <Route path='/courses' element={<CourseListPage 
                                                    courses={ courses }
                                                    setCourses={ setCourses } />} />
                    <Route path='/faq' element={<Faq />} />
                    <Route path='/calendar' element={<Calendar/>} />
                    <Route path='/enrollment' element={<EnrollmentForm 
                                                    courses={ courses }
                                                    setCourses={ setCourses } 
                                                    getAllCourses={getAllCourses} 
                                                    getAllInstructors={getAllInstructors} />} />
                    <Route path='/paymentlinks' element={<PaymentLink/>} />
                    <Route path='/login' element={<LoginScreen/>} />
                    <Route path='/blocked' element={<Blocked/>} />
                    

                    <Route path="/admins/*" element={<Admin />} />
                    <Route path="/instructors/*" element={<Instructor />}/>
                    <Route path="/students/*" element={<Student />}/>
                </Routes>
            </BrowserRouter>
          </CurrentUserProvider>
        </>
    );
};

export default App;