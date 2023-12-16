import './css/PendingActivities.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUserContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

function PendingActivities() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [currentUserChanged, setCurrentUserChanged] = useState(false);

  const [allInstructors, setAllInstructors] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const [allActivities, setAllActivities] = useState(null);

  const [activities, setActivities] = useState(null);
  const [activitiesToRender, setActivitiesToRender] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [activityDetails, setActivityDetails] = useState(null);

  const [search, setSearch] = useState('');


  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
    if(sessionData) {
        if(currentUserChanged) {
            console.log('HERE 5555');
            fetch(`${DEVELOPMENT_HOST}/api/students/${sessionData._id}`)
                .then((result) => result.json())
                .then((value) => {
                    console.table(value);
                    setCurrentUserChanged(prev => false);
                    sessionStorage.setItem('currentUser', JSON.stringify(value));
                    if(value.is_blocked) {
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
    .then(result => result.json())
    .then(value => {
      setAllCourses(prev => value);
    });
  }, []);

  useEffect(() => {
    fetch(`${DEVELOPMENT_HOST}/api/instructors`)
    .then(result => result.json())
    .then(value => {
      setAllInstructors(prev => value);
    });
  }, []);

  useEffect(() => {
    fetch(`${DEVELOPMENT_HOST}/api/activities`)
    .then(result => result.json())
    .then(value => {
      setAllActivities(prev => value);
    });
  }, []);


  useEffect(() => {
    if(allActivities !== null && currentUser !== null && allCourses !== null && allInstructors !== null) {
      let studentActivities = currentUser.activities;
      setActivities(prev => allActivities.map(item => {
        for(let i=0; i<studentActivities.length; i++) {
          if(studentActivities[i].activity_id === item._id) {
            const currentActivityCourse = allCourses.filter(filterItem => filterItem._id === item.course_id)[0];
            const currentActivityInstructor = allInstructors.filter(filterItem => filterItem._id === currentActivityCourse.instructor_id)[0];
            return {
              ...item,
              activity_course_instructor: `${currentActivityInstructor.firstname} ${currentActivityInstructor.lastname}`,
              activity_course_title: currentActivityCourse.name,
              activity_score: studentActivities[i].activity_score
            };
          }
        }
      }).filter(item => item !== undefined)
      );
    }
  }, [allActivities, currentUser, allCourses, allInstructors]);


  // useEffect(() => {
  //   console.log('ALL ACTIVITIES ----------------------------------------->');
  //   console.log(allActivities);
  // }, [allActivities]);

  useEffect(() => {
    console.log('MY ACTIVITIES ------------------------------------------>');
    console.log(activities);
    if(activities !== null) {
      setActivitiesToRender(prev => activities.filter(item => (item.title).toLowerCase().includes(search.toLowerCase())));
    }
  }, [activities, search]);



  
  return (
    <div className="pendingActivitiesBody">
      <nav className="application__navbar">
          <span>
              <p>Welcome</p>
              <button>{ currentUser !== null ? currentUser.name : '' }</button>
          </span>
      </nav>
      <div className="pendingActivitiesContainer">
        <h1 className="pendingActivitiesContainerHeader">Activities</h1>
        <div className="pendingActivitiesSearchBarContainer">
            <input 
                type="search" 
                value={search}
                onChange={(e) => setSearch(prev => e.target.value)}/>
        </div>
        <div className="pendingActivitiesListContainer">
          <div className="pendingActivitiesListTableContainer">
            <table>
              <thead>
                <th>Activity Title</th>
                <th>Course Title</th>
                <th>Instructor</th>
                <th>Score</th>
                <th>Details</th>
              </thead>
              <tbody>
                { activitiesToRender !== null ? activitiesToRender.map(item => {
                  return (
                    <tr>
                      <td>{ item.title }</td>
                      <td>{ item.activity_course_title }</td>
                      <td>{ item.activity_course_instructor }</td>
                      <td>{ item.activity_score }</td>
                      <td className="seeDetailsButtonColumn">
                        <button onClick={() => {
                          setShowDetails(prev => true);
                          setActivityDetails(prev => item);
                          console.log(item);
                        }}>See Details</button>
                      </td>
                    </tr>
                  );
                }) : '' }
              </tbody>
            </table>
            { showDetails === true ?
            <div className="activityDetailsContainer">
                <h1>{ activityDetails.title }</h1>
              <div>
                <h4>Deadline</h4>
                <p>{ new Date(activityDetails.deadline).toUTCString() }</p>
              </div>
              <div>
                <h4>Description</h4>
                <p className="activityDetailsDescription">{ activityDetails.description }</p>
              </div>
              <div>
                <h4>Documents Link</h4>
                <p><a target="_blank" href={ activityDetails.documents_link }>{ activityDetails.documents_link }</a></p>
              </div>
              <div>
                <h4>Course Title</h4>
                <p>{ activityDetails.activity_course_title }</p>
              </div>
              <div>
                <h4>Instructor</h4>
                <p>{ activityDetails.activity_course_instructor }</p>
              </div>
              <div className="activityDetailsButtonsContainer">
                <button onClick={() => {
                  setShowDetails(prev => false);
                  setActivityDetails(prev => null);
                }}>Close</button>
              </div>
            </div> : '' }
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingActivities;