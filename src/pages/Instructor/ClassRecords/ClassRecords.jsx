import './css/ClassRecords.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import CurrentCourseClassContext from '../../../contexts/CurrentCourseClassContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

function ClassRecords() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { currentCourseClass, setCurrentCourseClass } = useContext(CurrentCourseClassContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(false);

    const [students, setStudents] = useState(null);
    const [filteredStudents, setFilteredStudents] = useState(null);
    const [search, setSearch] = useState('');

    const [classAllCourseActivities, setClassAllCourseActivities] = useState(null);
    // const [classActivities, setClassActivities] = useState(null);
    const [classRowActivityToUpdate, setClassRowActivityToUpdate] = useState(null);
    const [suwat, setSuwat] = useState(false);
    const [isActivitiesChanged, setIsActivitiesChanged] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isUpdateStudentActivityRow, setIsUpdateStudentActivityRow] = useState(false);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        console.log(sessionData);
        if(sessionData) {
            if(currentUserChanged) {
                // console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/instructors/${sessionData._id}`)
                    .then((result) => result.json())
                    .then((value) => {
                        console.table(value);
                        setCurrentUserChanged(prev => false);
                        setCurrentUser(prev => value);
                        sessionStorage.setItem('currentUser', JSON.stringify(value));
                        if(value.is_blocked) {
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

    useEffect(() => {
        if(currentCourseClass === null) {
            const sessionCurrentCourseClass = JSON.parse(sessionStorage.getItem('currentCourseClass'));
            if(sessionCurrentCourseClass) {
                setCurrentCourseClass(prev => sessionCurrentCourseClass);
            }
        }
    }, []);

    useEffect(() => {
        if(currentCourseClass !== null) {
            fetch(`${DEVELOPMENT_HOST}/api/activities?course_id=${currentCourseClass._id}`)
            .then(result => result.json())
            .then(value => {
                console.log(value);
                setClassAllCourseActivities(prev => value);
            });
        }
    }, [currentCourseClass]);

    useEffect(() => {
        if(currentCourseClass !== null || isActivitiesChanged === true) {
            fetch(`${DEVELOPMENT_HOST}/api/students?course_id=${currentCourseClass._id}`)
            .then(result => result.json())
            .then(value => {
                setStudents(prev => value);
                console.log(value);
                setIsActivitiesChanged(prev => false);
            });
        }
    }, [currentCourseClass, isActivitiesChanged]);


    useEffect(() => {
        if(students !== null) {
            setFilteredStudents(prev => students.filter(item => (item.name).toLowerCase().includes(search.toLowerCase())));
        }
    }, [students, search]);


    useEffect(() => {
        console.table(classRowActivityToUpdate);
    }, [suwat]);

    return (
        <div className="classRecordsBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            <div className="classRecordsContainer">
                <h1 className="classRecordsContainerHeader">Class Records</h1>
                <div className="classRecordsSearchBarContainer">
                    <input 
                        type="search" 
                        value={search}
                        onChange={(e) => setSearch(prev => e.target.value)}/>
                </div>
                <div className="classRecordsListContainer">
                    <h1>{ currentCourseClass !== null ? currentCourseClass.name : '' }</h1>
                    <br/>
                    <div className="classRecordsListTableContainer">
                        <table>
                            <thead>
                                <th>Name</th>
                                <th>Email</th>
                                { filteredStudents !== null 
                                    && classAllCourseActivities !== null 
                                    && currentCourseClass !== null 
                                    && filteredStudents[0] !== undefined ? 
                                        filteredStudents[0].activities
                                                                .filter(filterItem => filterItem.activity_course_id === currentCourseClass._id)
                                                                .map(item => {
                                                                    return <th>{ classAllCourseActivities
                                                                                            .filter(filterItem => filterItem._id === item.activity_id)[0] !== undefined 
                                                                                                ? classAllCourseActivities
                                                                                                                .filter(filterItem => filterItem._id === item.activity_id)[0].title : '' }</th>;
                                                                }) : '' }
                                <th>Update Button</th>
                            </thead>
                            <tbody>
                                { filteredStudents !== null && currentCourseClass !== null ? filteredStudents.map(item => {
                                    return (
                                        <tr>
                                            <td>{ item.name }</td>
                                            <td>{ item.email }</td>
                                            { item.activities.filter(filterItem => filterItem.activity_course_id === currentCourseClass._id).map(mapItem => {
                                                return (
                                                        <td className="classRecordsStudentsActivityScoreColumn">{ mapItem.activity_score }</td>
                                                );
                                            }) }
                                            <td className="classRecordsUpdateButtonColumn">
                                                <button onClick={() => {
                                                    let tempStudentActivitiesId = item.activities
                                                                                            .filter(filterItem => filterItem.activity_course_id === currentCourseClass._id)
                                                                                            .map(mapItem => mapItem.activity_id);
                                                    console.log(tempStudentActivitiesId);
                                                    const tempStudentAct = classAllCourseActivities
                                                                                                .filter(filterItem => tempStudentActivitiesId.includes(filterItem._id))
                                                                                                .map(mapItem => {
                                                                                                    for(let i=0; i<item.activities.length; i++) {
                                                                                                        if(item.activities[i].activity_id === mapItem._id) {
                                                                                                            return {
                                                                                                                ...mapItem,
                                                                                                                activity_score: item.activities[i].activity_score
                                                                                                            };
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                    setClassRowActivityToUpdate(prev => []);
                                                    for(let i=0; i<tempStudentAct.length; i++) {
                                                        setClassRowActivityToUpdate(prev => [...prev, {
                                                            activity_id: tempStudentAct[i]._id,
                                                            activity_title: tempStudentAct[i].title,
                                                            activity_score: tempStudentAct[i].activity_score
                                                        }]);
                                                        console.log(classRowActivityToUpdate);
                                                    }
                                                    setSelectedStudent(prev => item);
                                                    setIsUpdateStudentActivityRow(prev => true);
                                                }}>Update Row</button>
                                            </td>
                                        </tr>
                                    );
                                }) : '' }
                            </tbody>
                        </table>
                    </div>
                    { isUpdateStudentActivityRow === true ? 
                                            <div className="classRecordsUpdateActivityContainer">
                                                <h3>Update Activities of</h3>
                                                <h2>{ selectedStudent !== null ? selectedStudent.name : '' }</h2>
                                                <div className="updateActivityInputFieldsContainer">
                                                    { classRowActivityToUpdate !== null ? classRowActivityToUpdate.map((item, index) => {
                                                        return (
                                                            <div>
                                                                <label htmlFor={ `${item.activity_id}` }>{ item.activity_title }</label>
                                                                <br/>
                                                                <input 
                                                                    id={ `${item.activity_id}` } 
                                                                    type='number' min={0} 
                                                                    placeholder={item.activity_score}
                                                                    // value={classRowActivityToUpdate[index].activity_score}
                                                                    // value={(function () {
                                                                    //     let x = item.activity_score;
                                                                    //     return x;
                                                                    // })()}
                                                                    onChange={(e) => {
                                                                        let tempClassRowActivityToUpdate = classRowActivityToUpdate;
                                                                        setClassRowActivityToUpdate(prev => {
                                                                                            tempClassRowActivityToUpdate[index].activity_score = parseInt(e.target.value);
                                                                                            return tempClassRowActivityToUpdate;
                                                                                        });
                                                                        // console.table(classRowActivityToUpdate);
                                                                        setSuwat(prev => !prev);
                                                                    }
                                                                             } />
                                                            </div>
                                                        );
                                                    }) : '' }
                                                </div>
                                                <button onClick={async () => {
                                                    if(selectedStudent !== null && classRowActivityToUpdate !== null) {
                                                        for(let i=0; i<classRowActivityToUpdate.length; i++) {
                                                            const response = await fetch(`${DEVELOPMENT_HOST}/api/students/${selectedStudent._id}`, {
                                                                method: 'PUT',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                redirect: 'follow',
                                                                body: JSON.stringify({
                                                                    update_type: 'change_activity',
                                                                    activity_id: classRowActivityToUpdate[i].activity_id,
                                                                    activity_score: classRowActivityToUpdate[i].activity_score
                                                                })
                                                            })
                                                            const result = await response.json();
                                                        }
                                                        setIsActivitiesChanged(prev => true);
                                                        setClassRowActivityToUpdate(prev => null);
                                                        setSelectedStudent(prev => null);
                                                        setIsUpdateStudentActivityRow(prev => false);
                                                        // setActivityId(prev => null);        
                                                    }
                                                }}>Update</button>
                                                <button onClick={() => {
                                                    setClassRowActivityToUpdate(prev => null);
                                                    setSelectedStudent(prev => null);
                                                    setIsUpdateStudentActivityRow(prev => false);
                                                }}>Cancel</button>
                                            </div> 
                                            : '' }
                </div>
                <div className="classRecordsGoToActivitiesButtonContainer">
                    <button onClick={() => {
                            navigate('/instructors/class_activities');
                        }}>
                        Class Activities
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClassRecords;