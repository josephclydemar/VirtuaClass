import './css/Blocked.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import CurrentUserContext from '../../../contexts/CurrentUserContext';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const Blocked = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [currentUserChanged, setCurrentUserChanged] = useState(true);


    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
        if(sessionData) {
            if(currentUserChanged) {
                console.log('HERE 5555');
                fetch(`${DEVELOPMENT_HOST}/api/${sessionData.account_type}/${sessionData._id}`)
                    .then((result) => result.json())
                    .then((value) => {
                        console.table(value);
                        setCurrentUserChanged(prev => false);
                        sessionStorage.setItem('currentUser', JSON.stringify(value));
                    });
            } else {
                setCurrentUser(prev => sessionData);
            }
        } else {
            navigate('/');
        }
    }, [currentUserChanged]);

    return (
        <div className='blockedBody'>
            <h1>Your account is blocked.</h1>
            <h2>Please contact an Administrator.</h2>
        </div>
    );
}

export default Blocked;