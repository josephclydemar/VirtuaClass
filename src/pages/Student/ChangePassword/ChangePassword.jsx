import './css/ChangePassword.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import CurrentUserContext from '../../../contexts/CurrentUserContext';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const ChangePassword = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [currentUserChanged, setCurrentUserChanged] = useState(true);

    const [updateType, setUpdateType] = useState('change');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    return (
        <>
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.name}` : '' }</button>
                </span>
            </nav>

            <div className='changePasswordBody'>
                <div className='changePasswordContainer'>
                    <h1 className='header'
                    >Change Password</h1>
                    <div className='oldPasswordInputBox'>
                        <input 
                            type='password'
                            placeholder='Enter old password'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}/>
                    </div>
                    <div className='newPasswordInputBox'>
                        <input 
                            type='password'
                            placeholder='Enter new password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <div className='changePasswordButtonContainer'>
                        <button onClick={() => {
                            if(currentUser !== null) {
                                if(updateType === 'change') {
                                    if(oldPassword !== '' && oldPassword === currentUser.password && newPassword !== '') {
                                        fetch(`${DEVELOPMENT_HOST}/api/students/${currentUser._id}`, {
                                            method:'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            redirect: 'follow',
                                            body: JSON.stringify({
                                                update_type: 'change_password',
                                                password: newPassword
                                            })
                                        })
                                        .then(result => result.json())
                                        .then(value => {
                                            console.log(value);
                                            setUpdateType(prev => 'change_password');
                                            setOldPassword(prev =>'');
                                            setNewPassword(prev =>'');
                                            window.location.reload();
                                        })
                                    } else {
                                        alert("Incorrect old password!");
                                    }
                                } 
                            }
                        }}>Update Password</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;