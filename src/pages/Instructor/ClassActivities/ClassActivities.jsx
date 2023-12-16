import './css/ClassActivities.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import CurrentCourseClassContext from '../../../contexts/CurrentCourseClassContext';
// import { v4 as uuid } from 'uuid';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

function ClassActivities() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { currentCourseClass, setCurrentCourseClass } = useContext(CurrentCourseClassContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(false);

    const [activities, setActivities] = useState(null);
    const [isActivitiesChanged, setIsActivitiesChanged] = useState(false);
    const [filteredActivities, setFilteredActivities] = useState(null);
    const [search, setSearch] = useState('');

    const [isAddNewActivity, setIsAddNewActivity] = useState(false);
    const [isUpdateRowActivity, setIsUpdateRowActivity] = useState(false);
    const [isDeleteRowActivity, setIsDeleteRowActivity] = useState(false);

    const [activityId, setActivityId] = useState(null);
    const [activityTitle, setActivityTitle] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [activityDocumentsLink, setActivityDocumentsLink] = useState('');
    const [activityDeadline, setActivityDeadline] = useState('');

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
                        setCurrentUser(prev => value);
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


    useEffect(() => {
        if(currentCourseClass !== null || isActivitiesChanged === true) {
            fetch(`${DEVELOPMENT_HOST}/api/activities?course_id=${currentCourseClass._id}`)
            .then(result => result.json())
            .then(value => {
                setActivities(prev => value);
                setIsActivitiesChanged(prev => false);
            });
        } else {
            const sessionCurrentCourseClass = JSON.parse(sessionStorage.getItem('currentCourseClass'));
            if(sessionCurrentCourseClass) {
                setCurrentCourseClass(prev => sessionCurrentCourseClass);
            }
        }
    }, [currentCourseClass, isActivitiesChanged]);

    useEffect(() => {
        if(activities !== null) {
            setFilteredActivities(prev => activities.filter(item => (item.title).toLowerCase().includes(search.toLowerCase())));
        }
        // console.log(filteredActivities);
    }, [activities, search]);

    useEffect(() => {
        console.log(activityTitle);
        console.log(activityDescription);
        console.log(activityDocumentsLink);
        console.log(activityDeadline);
        console.log(currentCourseClass);
    }, [activityTitle, activityDescription, activityDocumentsLink, activityDeadline]);



    return (
        <div className="classActivitiesBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            <div className="classActivitiesContainer">
                <h1 className="classActivitiesContainerHeader">Class Activities</h1>
                <div className="classActivitiesSearchBarContainer">
                    <input 
                        type="search" 
                        value={search}
                        onChange={(e) => setSearch(prev => e.target.value)}/>
                </div>
                <div className="classActivitiesListContainer">
                    <h1>{ currentCourseClass !== null ? currentCourseClass.name : '' } Activities</h1>
                    <br/>
                    <div className="classActivitiesListTableContainer">
                        <table>
                            <thead>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Documents Link</th>
                                <th>Time Given</th>
                                <th>Deadline</th>
                                <th>Update Button</th>
                                <th>Delete Button</th>
                            </thead>
                            <tbody>
                                { filteredActivities !== null ? filteredActivities.map(item => {
                                    return (
                                        <tr>
                                            <td>{ item.title }</td>
                                            <td>{ item.description }</td>
                                            <td><a href={ `${item.documents_link}` } target="_blank">{ item.shortened_documents_link }</a></td>
                                            <td>{ (new Date(item.createdAt)).toUTCString() }</td>
                                            <td>{ (new Date(item.deadline)).toUTCString() }</td>
                                            <td className="classActivityUpdateButtonColumn">
                                                <button onClick={() => {
                                                    setActivityId(prev => item._id);
                                                    setActivityTitle(prev => item.title);
                                                    setActivityDescription(prev => item.description);
                                                    setActivityDocumentsLink(prev => item.documents_link);
                                                    setActivityDeadline(prev => item.deadline);
                                                    setIsUpdateRowActivity(prev => true);
                                                }}>Update Row</button>
                                            </td>
                                            <td className="classActivityDeleteButtonColumn">
                                                <button onClick={() => {
                                                    setActivityId(prev => item._id);
                                                    setActivityTitle(prev => item.title);
                                                    setIsDeleteRowActivity(prev => true);
                                                }}>Delete Row</button>
                                            </td>
                                        </tr>
                                    );
                                }) : '' }
                            </tbody>
                        </table>
                    </div>

                    { isUpdateRowActivity === true ? 
                        <div className="classActivitiesUpdateActivityContainer">
                            <h3>Update Activity</h3>
                            <div className="updateActivityInputFieldsContainer">
                                <div>
                                    <input type="text" placeholder="Title" value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)}/>
                                </div>
                                <div>
                                    <input type="text" placeholder="Description" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)}/>
                                </div>
                                <div>
                                    <input type="text" placeholder="Documents Link" value={activityDocumentsLink} onChange={(e) => setActivityDocumentsLink(e.target.value)}/>
                                </div>
                                <div>
                                    <input type="datetime-local" min={(new Date().toISOString()).split('.')[0]} value={activityDeadline.split('.')[0]} onChange={(e) => setActivityDeadline(e.target.value)}/>
                                </div>
                            </div>
                            <button onClick={() => {
                                if(activityId !== null && activityTitle !== '' && activityDescription !== '' && activityDocumentsLink !== '' && activityDeadline !== '') {
                                    fetch(`${DEVELOPMENT_HOST}/api/activities/${activityId}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        redirect: 'follow',
                                        body: JSON.stringify({
                                            title: activityTitle,
                                            description: activityDescription,
                                            documents_link: activityDocumentsLink,
                                            deadline: activityDeadline
                                        })
                                    })
                                    .then(result => result.json())
                                    .then(value => {
                                        setIsActivitiesChanged(prev => true);
                                        setActivityId(prev => null);
                                    });
                                    // console.log('HAHAHA');
                                    setIsUpdateRowActivity(prev => false);
                                }
                            }}>Update</button>
                            <button onClick={() => {
                                setActivityId(prev => null);
                                setActivityTitle(prev => '');
                                setActivityDescription(prev => '');
                                setActivityDocumentsLink(prev => '');
                                setActivityDeadline(prev => '');
                                setIsUpdateRowActivity(prev => false);
                                // console.log((new Date().toISOString()).split('.')[0]);
                            }}>Cancel</button>
                        </div> : '' }


                    { isAddNewActivity === true ? 
                        <div className="classActivitiesAddActivityContainer">
                            <h3>Add a New Activity</h3>
                            <div className="addActivityInputFieldsContainer">
                                <div>
                                    <input type="text" placeholder="Title" value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)}/>
                                </div>
                                <div>
                                    <input type="text" placeholder="Description" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)}/>
                                </div>
                                <div>
                                    <input type="text" placeholder="Documents Link" value={activityDocumentsLink} onChange={(e) => setActivityDocumentsLink(e.target.value)}/>
                                </div>
                                <div>
                                    <input type="datetime-local" min={(new Date().toISOString()).split('.')[0]} value={activityDeadline} onChange={(e) => setActivityDeadline(e.target.value)}/>
                                </div>
                            </div>
                            <button onClick={() => {
                                if(currentCourseClass !== null && activityTitle !== '' && activityDescription !== '' && activityDocumentsLink !== '' && activityDeadline !== '') {
                                    fetch(`${DEVELOPMENT_HOST}/api/activities`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        redirect: 'follow',
                                        body: JSON.stringify({
                                            title: activityTitle,
                                            description: activityDescription,
                                            documents_link: activityDocumentsLink,
                                            deadline: activityDeadline,
                                            course_id: currentCourseClass._id
                                        })
                                    })
                                    .then(result => result.json())
                                    .then(value => setIsActivitiesChanged(prev => true));
                                    setIsAddNewActivity(prev => false);
                                }
                            }}>Add</button>
                            <button onClick={() => {
                                setActivityTitle(prev => '');
                                setActivityDescription(prev => '');
                                setActivityDocumentsLink(prev => '');
                                setActivityDeadline(prev => '');
                                setIsAddNewActivity(prev => false);
                            }}>Cancel</button>
                        </div> : '' }


                        { isDeleteRowActivity === true ? 
                            <div className="classActivitiesDeleteActivityContainer">
                                <h3>Delete { `${activityTitle}` }?</h3>
                                <button onClick={() => {
                                    if(activityId !== null) {
                                        fetch(`${DEVELOPMENT_HOST}/api/activities/${activityId}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            redirect: 'follow'
                                        })
                                        .then(result => result.json())
                                        .then(value => setIsActivitiesChanged(prev => true));
                                        setIsDeleteRowActivity(prev => false);
                                    }
                                }}>Confirm</button>
                                <button onClick={() => {
                                    setActivityId(prev => null);
                                    setActivityTitle(prev => '');
                                    setIsDeleteRowActivity(prev => false);
                                }}>Cancel</button>
                            </div> : '' }
                </div>

                <div className="addActivityButtonContainer">
                    <button onClick={() => {
                        setActivityTitle(prev => '');
                        setActivityDescription(prev => '');
                        setActivityDocumentsLink(prev => '');
                        setActivityDeadline(prev => '');
                        setIsAddNewActivity(prev => true);
                    }}>Add New Activity</button>
                </div>
            </div>
        </div>
    );
}

export default ClassActivities;