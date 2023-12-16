import FormInput from "../../../components/FormInput";
import CourseListWithSelection from "../../../components/CourseListWithSelection";
import SelectedCourses from "../../../components/SelectedCourses";
import NavBar from '../../../components/NavBar';
import "./css/EnrollmentForm.css";
import React, { useEffect, useState, useContext } from 'react';
import SchoolInfoContext from '../../../contexts/SchoolInfoContext';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const EnrollmentForm = ({ courses, setCourses, getAllCourses, getAllInstructors  }) => {
    const { schoolInfo } = useContext(SchoolInfoContext);
    
    // Initialize state variables for form data
    const [coursesExpanded, setCoursesExpanded] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [courseChoices, setCourseChoices] = useState([]);
    const [selectedCoursesIds, setSelectedCoursesIds] = useState([]);
    const [formData, setFormData] = useState({
        StudentFirstName: "",
        StudentMiddleInitial: "",
        StudentLastName: "",
        StudentEmailAddress: "",
        GuardianFirstName: "",
        GuardianMiddleInitial: "",
        GuardianLastName: "",
        GuardianContactNumber: ""
    });

    useEffect(() => {
        ((async () => {
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
          return temp;
        })()).then(result => setCourseChoices(result));
        
    }, []);
        
    // useEffect(() => {
    //     // console.log(courses);
        
    // }, []);

    
    

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        const response = await fetch(`${DEVELOPMENT_HOST}/api/enrollments`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        firstname: formData.StudentFirstName,
                        middleInitial: formData.StudentMiddleInitial,
                        lastname: formData.StudentLastName,
                        email: formData.StudentEmailAddress,
                        
                        guardianFirstname: formData.GuardianFirstName,
                        guardianMiddleInitial: formData.GuardianMiddleInitial,
                        guardianLastname: formData.GuardianLastName,
                        guardianContactNumber: formData.GuardianContactNumber,
                        coursesTakenIds: selectedCoursesIds
                    }
                ),
                redirect: 'follow'
            }
        );
        console.log(await response.json());
        window.location.reload();
    }

    // Handle input field changes and update the state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    return (
        <>
            <NavBar  schoolInfo={schoolInfo}/>
            <section className="enrollment__section">
                <SelectedCourses 
                            setCourses={setCourseChoices} 
                            setSelectedCoursesIds={setSelectedCoursesIds} 
                            selectedCourses={ selectedCourses } 
                            setSelectedCourses={setSelectedCourses} />
                <div className="courseListWithSelection_Cont">
                    <CourseListWithSelection  
                        courses={ courseChoices } 
                        setCourses={ setCourseChoices } 
                        setSelectedCoursesIds={setSelectedCoursesIds} 
                        coursesExpanded={ coursesExpanded } 
                        setCoursesExpanded={ setCoursesExpanded } 
                        selectedCourses={ selectedCourses } 
                        setSelectedCourses={ setSelectedCourses } />
                </div>
                <div className="form_cont">
                    <div className="enrollment__heading">
                        <h1>Please fill out this form to enroll.</h1>
                        <p>And press "Submit" when you've completed this form</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <FormInput 
                            name="StudentFirstName" 
                            placeholder="Student's first name"
                            value={formData.StudentFirstName}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="StudentMiddleInitial" 
                            placeholder="Student's middle initial"
                            value={formData.StudentMiddleInitial}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="StudentLastName" 
                            placeholder="Student's last name"
                            value={formData.StudentLastName}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="StudentEmailAddress" 
                            placeholder="Student's email address"
                            value={formData.StudentEmailAddress}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="GuardianFirstName" 
                            placeholder="Guardian's first name"
                            value={formData.GuardianFirstName}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="GuardianMiddleInitial" 
                            placeholder="Guardian's middle initial"
                            value={formData.GuardianMiddleInitial}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="GuardianLastName" 
                            placeholder="Guardian's last name"
                            value={formData.GuardianLastName}
                            onChange={handleInputChange}
                        />
                        <FormInput 
                            name="GuardianContactNumber" 
                            placeholder="Guardian's contact number"
                            value={formData.GuardianContactNumber}
                            onChange={handleInputChange}
                        />
                        <button className="enrollButton">Submit</button>
                    </form>
                </div>
            </section>
            {/* <button onClick={() => {
                console.log(courses);
                console.log(selectedCoursesIds);
                }}>Show Courses</button> */}
        </>
    );
};

export default EnrollmentForm;