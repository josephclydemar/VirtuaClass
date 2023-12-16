import './css/Popup.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUserContext';
import NewActivityPopupContext from "../../../contexts/NewActivityPopupContext";

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';




const Popup = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [currentUserChanged, setCurrentUserChanged] = useState(false);

  const { isNewActivityPopupAppearedOnce, setIsNewActivityPopupAppearedOnce } = useContext(NewActivityPopupContext);

  const [allCourses, setAllCourses] = useState(null);
  const [allActivities, setAllActivities] = useState(null);

  const [activities, setActivities] = useState(null);
  const [activitiesToRender, setActivitiesToRender] = useState(null);

  const [newActivities, setNewActivities] = useState(null);
  const [isNewActivitiesEmpty, setIsNewActivitiesEmpty] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const [currentDateInMilis, setCurrentDateInMillis] = useState((new Date()).getTime());

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
    fetch(`${DEVELOPMENT_HOST}/api/activities`)
    .then(result => result.json())
    .then(value => {
      setAllActivities(prev => value);
    });
  }, []);

  useEffect(() => {
    if(allActivities !== null && currentUser !== null && allCourses !== null) {
      let studentActivities = currentUser.activities;
      setActivities(prev => allActivities.map(item => {
        for(let i=0; i<studentActivities.length; i++) {
          if(studentActivities[i].activity_id === item._id) {
            const currentActivityCourse = allCourses.filter(filterItem => filterItem._id === item.course_id)[0];
            return {
              ...item,
              activity_course_title: currentActivityCourse.name
            };
          }
        }
      }).filter(item => item !== undefined)
      );
    }
  }, [allActivities, currentUser, allCourses]);

  useEffect(() => {
    if(activities !== null) {
      setNewActivities(activities.filter(filterItem => (new Date(filterItem.deadline)).getTime() > currentDateInMilis));
    }
  }, [activities]);

  useEffect(() => {
    console.log('MY NEW ACTIVITIES ------------------------------------------>');
    console.log(newActivities);
    if(newActivities !== null) {
      setActivitiesToRender(prev => newActivities.filter(item => (item.title).toLowerCase()));
    }
  }, [newActivities]);

  useEffect(() => {
    if(newActivities !== null) {
      setIsNewActivitiesEmpty(prev => newActivities.length > 0);
    }
  }, [newActivities]);



  return (
    <>
    { isNewActivityPopupAppearedOnce === false && isNewActivitiesEmpty === true && isClosed !== true ?
      <div className="popupOverlay">
      <div className="popup">
        <div className="popupHeader">
          <h2>New Activities!</h2>
        </div>
        <div className="popupContent">
          <div className="popupListContainer">
            <div className="popupListTableContainer">
              <table>
                <thead>
                  <th>Activity Title</th>
                  <th>Course Title</th>
                  <th>Deadline</th>
                </thead>
                <tbody>
                  { activitiesToRender !== null ? activitiesToRender.map(item => {
                    return (
                      <tr>
                        <td>{ item.title }</td>
                        <td>{ item.activity_course_title }</td>
                        <td>{ new Date(item.deadline).toUTCString() }</td>
                      </tr>
                    );
                  }) : '' }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <button className="loginButton" onClick={() => {
                                                    setIsClosed(prev => true);
                                                    setIsNewActivityPopupAppearedOnce(prev => true);
                                                  }}>Close</button>
        </div>
      </div>
    </div>
    : ''}
    </>
  );
};

export default Popup;
