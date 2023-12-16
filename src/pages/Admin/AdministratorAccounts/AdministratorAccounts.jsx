import './css/AdministratorAccounts.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import { updateButtonColorState } from '../../../utils/styleFunctions';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';


const AdministratorAccounts = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [administrators, setAdministrators] = useState(null);
    const [administratorsHtml, setAdministratorsHtml] = useState(null);
    const [search, setSearch] = useState('');

    const [administratorId, setAdministratorId] = useState(null);
    const [administratorFirstname, setAdministratorFirstname] = useState('');
    const [administratorLastname, setAdministratorLastname] = useState('');
    const [administratorEmail, setAdministratorEmail] = useState('');
    const [isAdministratorBlocked, setIsAdministratorBlocked] = useState(false);

    const [inputChanged, setInputChanged] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    

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
        fetch(`${DEVELOPMENT_HOST}/api/admins`)
            .then(result => result.json())
            .then(value => setAdministrators(value));
    }, [inputChanged]);


    useEffect(() => {
        if(administrators !== null) {
            // <Content items={items.filter(item => ((item.title).toLowerCase()).includes(searchItem.toLowerCase()))}
            setAdministratorsHtml(administrators.filter((item) => {
                return ((`${item.firstname} ${item.lastname}`).toLowerCase()).includes(search.toLowerCase());
            }).map((item) => {
                return (
                    <tr>
                        <td>
                            <button onClick={() => {
                                setAdministratorId(() => item._id);
                                setAdministratorFirstname(() => item.firstname);
                                setAdministratorLastname(() => item.lastname);
                                setAdministratorEmail(() => item.email);
                                setIsAdministratorBlocked(() => item.is_blocked);
                            }}>
                                { `${item.firstname} ${item.lastname}` }
                            </button>
                        </td>
                        <td>
                            <button onClick={() => {
                                setAdministratorId(() => item._id);
                                setAdministratorFirstname(() => item.firstname);
                                setAdministratorLastname(() => item.lastname);
                                setAdministratorEmail(() => item.email);
                                setIsAdministratorBlocked(() => item.is_blocked);
                            }}>
                                { item.email }
                            </button>
                        </td>
                    </tr>
                );
            }));
            console.log(administrators);
        }
    }, [administrators, search]);


    useEffect(() => {
        console.log('-----------------');
        console.log(`Administrator ID -> ${administratorId}`);
        console.log(`Administrator Firstname -> ${administratorFirstname}`);
        console.log(`Administrator Lastname -> ${administratorLastname}`);
        console.log(`Administrator Email -> ${administratorEmail}`)
        console.log(`Administrator Is Blocked -> ${isAdministratorBlocked}`);
        console.log('-----------------');
    }, [administratorId, administratorFirstname, administratorLastname, administratorEmail, isAdministratorBlocked]);
    

    
    return (
        <div className="administratorAccountsBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            <div className="administratorsListContainer">
                <h1>Administrators</h1>
                <div className="searchBarContainer">
                    <input 
                        className="searchBar" 
                        type="search" 
                        placeholder="Search for Administrators"
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        />
                </div>
                <table className="administratorListTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        { administratorsHtml !== null ? administratorsHtml : '' }
                    </tbody>
                </table>
            </div>

            
            <div className="administratorAccountsCrudContainer">
                <h1>Administrator Accounts Operations</h1>
                <div>
                    <input className='adminfirst'
                        type="text"
                        placeholder="Administrator Firstname"
                        value={administratorFirstname}
                        onChange={(e) => setAdministratorFirstname(prev => e.target.value)}/>
                </div>
                <div>
                    <input className='adminlast'
                        type="text"
                        placeholder="Administrator Lastname"
                        value={administratorLastname}
                        onChange={(e) => setAdministratorLastname(prev => e.target.value)}/>
                </div>
                <div>
                    <input className='adminemail'
                        type="email"
                        placeholder="Administrator Email"
                        value={administratorEmail}
                        onChange={(e) => setAdministratorEmail(prev => e.target.value)}/>
                </div>
                <div>
                    <button style={{
                        fontFamily: '\'Sofia Sans Condensed\', sans-serif',
                        fontSize: '1.1rem',
                        backgroundColor: '#79f',
                        padding: '2vh',
                        color: '#fff',
                        textAlign: 'center',
                        borderRadius: '5px'
                    }}>Clear Fields</button>
                </div>
            </div>


            <div className="offeredCoursesButtonsContainer">
                <div className="createAdministratorButtonContainer">
                    <button 
                    style={updateButtonColorState({
                            callback: () => {
                                return {
                                    backgroundColor: '#79f'
                                };
                            }, isButtonDisabled: isButtonDisabled
                    })}
                    disabled={isButtonDisabled}
                    onClick={() => {
                        if(administratorId === null) {
                            if(administratorFirstname !== '' && administratorLastname !== '' && administratorEmail !== '') {
                                setIsButtonDisabled(() => true);
                                fetch(`${DEVELOPMENT_HOST}/api/admins`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    redirect: 'follow',
                                    body: JSON.stringify({
                                        firstname: administratorFirstname,
                                        lastname: administratorLastname,
                                        email: administratorEmail
                                    })
                                })
                                .then((result) => result.json())
                                .then((value) => {
                                    setAdministratorId(() => value._id);
                                    setAdministratorFirstname(() => value.firstname);
                                    setAdministratorLastname(() => value.lastname);
                                    setAdministratorEmail(() => value.email);
                                    setIsAdministratorBlocked(() => value.is_blocked);
                                    setInputChanged(prev => !prev);
                                    setIsButtonDisabled(() => false);
                                });
                            }
                        } else {
                            setAdministratorId(() => null);
                            setAdministratorFirstname(() => '');
                            setAdministratorLastname(() => '');
                            setAdministratorEmail(() => '');
                            setIsAdministratorBlocked(() => false);
                            setInputChanged(prev => !prev);
                        }
                    }}>
                        Create New Administrator
                    </button>
                </div>

                <div className="updateAdministratorButtonContainer">
                    <button 
                    style={updateButtonColorState({
                            callback: () => {
                                return {
                                    backgroundColor: '#79f'
                                };
                            }, isButtonDisabled: isButtonDisabled
                    })}
                    disabled={isButtonDisabled}
                    onClick={() => {
                        if(administratorId !== null) {
                            if(administratorFirstname !== '' && administratorLastname !== '' && administratorEmail !== '') {
                                setIsButtonDisabled(() => true);
                                fetch(`${DEVELOPMENT_HOST}/api/admins`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    redirect: 'follow',
                                    body: JSON.stringify({
                                        update_type: 'change',
                                        id: administratorId,
                                        firstname: administratorFirstname,
                                        lastname: administratorLastname,
                                        email: administratorEmail
                                    })
                                })
                                .then((result) => result.json())
                                .then((value) => {
                                    fetch(`${DEVELOPMENT_HOST}/api/admins/${administratorId}`)
                                    .then(result => result.json())
                                    .then((updatedAdministratorValue) => {
                                        setAdministratorId(() => updatedAdministratorValue._id);
                                        setAdministratorFirstname(() => updatedAdministratorValue.firstname);
                                        setAdministratorLastname(() => updatedAdministratorValue.lastname);
                                        setAdministratorEmail(() => updatedAdministratorValue.email);
                                        setIsAdministratorBlocked(() => updatedAdministratorValue.is_blocked);
                                        setInputChanged(prev => !prev);
                                        setIsButtonDisabled(() => false);
                                    });
                                });
                            }
                        }
                    }}>Update Administrator</button>
                </div>

                <div className="blockAdministratorButtonContainer">
                    <button 
                    style={updateButtonColorState({
                            callback: () => {
                                if(isAdministratorBlocked === false) {
                                    return {
                                        backgroundColor: '#a44',
                                        opacity: 1
                                    };
                                } else {
                                    return {
                                        backgroundColor: '#484',
                                        opacity: 1
                                    };
                                }
                            }, isButtonDisabled: isButtonDisabled
                    })}
                    disabled={isButtonDisabled}
                    onClick={() => {
                        if(administratorId !== null && isAdministratorBlocked !== null) {
                            setIsButtonDisabled(() => true);
                            fetch(`${DEVELOPMENT_HOST}/api/admins`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                body: JSON.stringify({
                                    update_type: 'block',
                                    id: administratorId,
                                    is_blocked: !isAdministratorBlocked
                                }),
                            })
                            .then((result) => result.json())
                            .then((value) => {
                                fetch(`${DEVELOPMENT_HOST}/api/admins/${administratorId}`)
                                    .then(result => result.json())
                                    .then((updatedAdministratorValue) => {
                                        setAdministratorId(() => updatedAdministratorValue._id);
                                        setAdministratorFirstname(() => updatedAdministratorValue.firstname);
                                        setAdministratorLastname(() => updatedAdministratorValue.lastname);
                                        setAdministratorEmail(() => updatedAdministratorValue.email);
                                        setIsAdministratorBlocked(() => updatedAdministratorValue.is_blocked);
                                        setInputChanged(prev => !prev);
                                        setIsButtonDisabled(() => false);
                                    });
                            });
                        }
                    }}>{ isAdministratorBlocked ? 'Unblock Administrator' : 'Block Administrator' }</button>
                </div>

                <div className="deleteAdministratorButtonContainer">
                    <button 
                    style={updateButtonColorState({
                            callback: () => {
                                return {
                                    backgroundColor: '#e50'
                                }
                            }, isButtonDisabled: isButtonDisabled
                    })}
                    disabled={isButtonDisabled}
                    onClick={() => {
                        if(administratorId !== null) {
                            setIsButtonDisabled(() => true);
                            fetch(`${DEVELOPMENT_HOST}/api/admins`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                body: JSON.stringify({
                                    id: administratorId
                                }),
                            })
                            .then((result) => result.json())
                            .then((value) => {
                                setAdministratorId(() => null);
                                setAdministratorFirstname(() => '');
                                setAdministratorLastname(() => '');
                                setAdministratorEmail(() => '');
                                setIsAdministratorBlocked(() => false);
                                setInputChanged(prev => !prev);

                                setIsButtonDisabled(() => false);
                            });
                        }
                    }}
                    >
                        Delete Administrator
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdministratorAccounts;