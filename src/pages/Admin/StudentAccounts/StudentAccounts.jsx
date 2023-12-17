import "./css/StudentAccounts.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IoIosAddCircle, IoIosRemoveCircle } from 'react-icons/io';
import CurrentUserContext from "../../../contexts/CurrentUserContext";

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';


const StudentAccounts = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [studentsUpdated, setStudentsUpdated] = useState(false);
    const [students, setStudents] = useState(null);
    const [studentsFiltered, setStudentsFiltered] = useState(null);
    const [studentsToRender, setStudentsToRender] = useState(null);
    const [search, setSearch] = useState('');

    const [updateType, setUpdateType] = useState('change');
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [name, setName] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [studentBlockState, setStudentBlockState] = useState(null);
    const [inputChanged, setInputChanged] = useState(false);

    const [allCourses, setAllCourses] = useState(null);
    const [takenCourses, setTakenCourses] = useState(null);
    const [availableCourses, setAvailableCourses] = useState(null);

    const [takenCoursesToRender, setTakenCoursesToRender] = useState(null);
    const [availableCoursesToRender, setAvailableCoursesToRender] = useState(null);

    const [currentUserChanged, setCurrentUserChanged] = useState(true);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/admins/${sessionData._id}`)
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
        .then((result) => result.json())
        .then((value) => {
            setAllCourses(() => value);
        });
    }, []);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/students`)
            .then(result => result.json())
            .then(value => {
                setStudents(prev => value);
                console.log(value);
            });
    }, [studentsUpdated]);

    useEffect(() => {
        if(students !== null) {
            setStudentsFiltered(students.filter((item) => ((item.name).toLowerCase()).includes(search.toLowerCase())));
            console.log(students);
        }
    }, [students]);

    useEffect(() => {
        console.log('STUDENTS FILTERED COURSES ------------------------------ >');
        if(studentsFiltered !== null) {
            console.log('STUDENTS FILTERED COURSES ------------------------------ >');
            setStudentsToRender(studentsFiltered.map((item) => {
                return (
                    <tr>
                        <td>
                            <button onClick={() => {
                                if(allCourses !== null) {
                                    setUpdateType('change');
                                    setSelectedStudentId(item._id);
                                    setName(item.name);
                                    setGuardianName(item.guardian_name);
                                    setEmail(item.email);
                                    setContact(item.contact);
                                    setStudentBlockState(item.is_blocked);
                                    setTakenCourses(prev => allCourses.filter(
                                            (filterItem) => (item.courses_taken_id).includes(filterItem._id))
                                        );

                                    setAvailableCourses(prev => allCourses.filter(
                                            (filterItem) => !(item.courses_taken_id).includes(filterItem._id))
                                        );
                                    console.log("student button pressed");
                                } else {
                                    console.log("fuckin nothing");
                                }
                            }}
                                className="studentAccountsIndividualButton">{ item.name }</button>
                            </td>
                            <td>{ item.email }</td>
                        </tr>
                    );
                }));
        }
    }, [studentsFiltered, students, allCourses]);

    useEffect(() => {
        console.log('TAKEN COURSES ------------------------------ >');
        if(takenCourses !== null) {
            console.log('TAKEN COURSES ------------------------------ >');
            setTakenCoursesToRender(prev => takenCourses.map((mapItem) => {
                return (
                    <tr>
                        <td>{ mapItem.name }</td>
                        <td>
                            <button onClick={() => {
                                console.log(selectedStudentId);
                                if(selectedStudentId !== null) {
                                    console.log(selectedStudentId);
                                    fetch(`${DEVELOPMENT_HOST}/api/students/${selectedStudentId}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        redirect: 'follow',
                                        body: JSON.stringify({
                                            update_type: 'remove',
                                            course_id: mapItem._id
                                        })
                                    })
                                    .then((result) => result.json())
                                    .then((value) => {
                                        setStudentsUpdated(prev => !prev);
                                        console.log("remove button");
     
                                    });
                                } else {
                                    console.log("remove, nothing happened");
                                }
                            }}>
                                {/* <IoIosRemoveCircle/> */}
                                REMOVE
                            </button>
                        </td>
                    </tr>
                );
            }));
        }
    }, [takenCourses, availableCourses, studentsUpdated]);

    useEffect(() => {
        console.log('AVAILABLE COURSES ------------------------------ >');
        if(availableCourses !== null) {
            console.log('AVAILABLE COURSES ------------------------------ >');
            setAvailableCoursesToRender(prev => availableCourses.map((mapItem) => {
                return (
                    <tr>
                        <td>{ mapItem.name }</td>
                        <td>
                            <button onClick={() => {
                                console.log(selectedStudentId);
                                if(selectedStudentId !== null) {
                                    console.log(selectedStudentId);
                                    fetch(`${DEVELOPMENT_HOST}/api/students/${selectedStudentId}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        redirect: 'follow',
                                        body: JSON.stringify({
                                            update_type: 'add',
                                            course_id: mapItem._id
                                        })
                                    })
                                    .then((result) => result.json())
                                    .then((value) => {
                                        setStudentsUpdated(prev => !prev)
                                        console.log("add button");
                                            
                                    });
                                    setStudentsUpdated(prev => !prev);
                                } else {
                                    console.log("add, nothing happened");
                                }
                            }}>
                                {/* <IoIosAddCircle/> */}
                                ADD
                            </button>
                        </td>
                    </tr>
                );
            }));
        }
    }, [availableCourses, takenCourses, studentsUpdated]);



    useEffect(() => {
        console.log(`Student ID ----> ${selectedStudentId}`);
        console.log(`Name ----> ${name}`);
        console.log(`Guardian Name ----> ${guardianName}`);
    }, [selectedStudentId, name, guardianName]);

    return (
        <div className="studentAccountsBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            <div className="studentAccountsListContainer">
                <h1>Student Accounts</h1>
                <div className="studentAccountsSearchBox">
                    <input className="studentsearch"
                        type="search"
                        placeholder="Search for Students"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />
                </div>
                <div className="studentAccountsListBox">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            { studentsToRender !== null ? studentsToRender : '' }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="studentAccountsCrudContainer">
                <h1>Student Account Operations</h1>
                <div>
                    <input className="studname"
                        type="text"
                        placeholder="Student Name"
                        value={name}
                        onChange={(e) => setName(prev => e.target.value)}
                        onKeyDown={() => setInputChanged(prev => true)}/>
                </div>
                <div>
                    <input className="studemail"
                        type="text"
                        placeholder="Student Email"
                        value={email}
                        onChange={(e) => setEmail(prev => e.target.value)}
                        onKeyDown={() => setInputChanged(prev => true)}/>
                </div>
                <div>
                    <input className="guardname"
                        type="text"
                        placeholder="Guardian Name"
                        value={guardianName}
                        onChange={(e) => setGuardianName(prev => e.target.value)}
                        onKeyDown={() => setInputChanged(prev => true)}/>
                </div>
                <div>
                    <input className="guardcontact"
                        type="text"
                        placeholder="Guardian Contact"
                        value={contact}
                        onChange={(e) => setContact(prev => e.target.value)}
                        onKeyDown={() => setInputChanged(prev => true)}/>
                </div>


                <div className="coursesTakenContainer">
                    <h2>Courses Taken</h2>
                    <table>
                        <tbody>
                            { takenCoursesToRender !== null ? takenCoursesToRender : ''}
                        </tbody>
                    </table>
                </div>

                <div className="coursesAvailableContainer">
                    <h2>Courses Available</h2>
                    <table>
                        <tbody>
                            { availableCoursesToRender !== null ? availableCoursesToRender : '' }
                        </tbody>
                    </table>
                </div>
                
            </div>










            <div className="studentAccountsButtonsContainer">
                <div className="updateStudentButtonContainer">
                    <button onClick={() => {
                        if(currentUser !== null) {
                            if(updateType === 'change') {
                                if(name !== '' && guardianName !== '' && email !== '' && contact !== '' && selectedStudentId !== null) {
                                    fetch(`${DEVELOPMENT_HOST}/api/students/${selectedStudentId}`, {
                                        method:'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        redirect: 'follow',
                                        body: JSON.stringify({
                                            update_type: 'change',
                                            email: email,
                                            name: name,
                                            guardian_name: guardianName,
                                            contact: contact
                                        })
                                    })
                                    .then(result => result.json())
                                    .then(value => {
                                        console.log(value);
                                        setUpdateType(prev => 'change');
                                        setName(prev => '');
                                        setGuardianName(prev => '');
                                        setEmail(prev => '');
                                        setContact(prev => '');
                                        setInputChanged(prev => false);
                                        // window.location.reload();
                                    })
                                }
                            } 
                        }
                    }}>Update Student</button>
                </div>

                <div className="blockStudentButtonContainer">
                    <button onClick={() => {
                        if(currentUser !== null && selectedStudentId !== null && studentBlockState !== null) {
                            fetch(`${DEVELOPMENT_HOST}/api/students/${selectedStudentId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                body: JSON.stringify({
                                    update_type: 'block',
                                    is_blocked: !studentBlockState
                                })
                            })
                            .then(result => result.json())
                            .then(value => window.location.reload());
                            return;
                        }
                    }}>{studentBlockState ? 'Unblock' : 'Block'}</button>
                </div>

                <div className="deleteStudentButtonContainer">
                <button onClick={() => {
                        if(currentUser !== null && selectedStudentId !== null) {
                            fetch(`${DEVELOPMENT_HOST}/api/students/${selectedStudentId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                body: JSON.stringify({
                                    update_type: 'remove',
                                })
                            })
                            .then(result => result.json())
                            .then(value => window.location.reload());
                            return;
                        }
                    }}>Delete Student</button>
                </div>
            </div>
        </div>
    );
}

export default StudentAccounts;