import './css/InstructorAccounts.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import { updateButtonColorState } from '../../../utils/styleFunctions';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';


const InstructorAccounts = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [instructors, setInstructors] = useState(null);
    const [instructorsHtml, setInstructorsHtml] = useState(null);
    const [search, setSearch] = useState('');

    const [instructorId, setInstructorId] = useState(null);
    const [instructorFirstname, setInstructorFirstname] = useState('');
    const [instructorLastname, setInstructorLastname] = useState('');
    const [instructorEmail, setInstructorEmail] = useState('');
    const [isInstructorBlocked, setIsInstructorBlocked] = useState(false);

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
        fetch(`${DEVELOPMENT_HOST}/api/instructors`)
            .then(result => result.json())
            .then(value => setInstructors(() => value));
    }, [inputChanged]);


    useEffect(() => {
        if(instructors !== null) {
            // <Content items={items.filter(item => ((item.title).toLowerCase()).includes(searchItem.toLowerCase()))}
            setInstructorsHtml(instructors.filter((item) => {
                return ((`${item.firstname} ${item.lastname}`).toLowerCase()).includes(search.toLowerCase());
            }).map((item) => {
                return (
                    <tr>
                        <td>
                            <button onClick={() => {
                                setInstructorId(() => item._id);
                                setInstructorFirstname(() => item.firstname);
                                setInstructorLastname(() => item.lastname);
                                setInstructorEmail(() => item.email);
                                setIsInstructorBlocked(() => item.is_blocked);
                            }}>
                                { `${item.firstname} ${item.lastname}` }
                            </button>
                        </td>
                        <td>
                            <button onClick={() => {
                                setInstructorId(() => item._id);
                                setInstructorFirstname(() => item.firstname);
                                setInstructorLastname(() => item.lastname);
                                setInstructorEmail(() => item.email);
                                setIsInstructorBlocked(() => item.is_blocked);
                            }}>
                                { item.email }
                            </button>
                        </td>
                    </tr>
                );
            }));
            console.log(instructors);
        }
    }, [instructors, search]);


    useEffect(() => {
        console.log('-----------------');
        console.log(`Instructor ID -> ${instructorId}`);
        console.log(`Instructor Firstname -> ${instructorFirstname}`);
        console.log(`Instructor Lastname -> ${instructorLastname}`);
        console.log(`Instructor Email -> ${instructorEmail}`)
        console.log(`Instructor Is Blocked -> ${isInstructorBlocked}`);
        console.log('-----------------');
    }, [instructorId, instructorFirstname, instructorLastname, instructorEmail, isInstructorBlocked]);
    

    
    return (
        <div className="instructorAccountsBody">
            <nav className="application__navbar">
                <span>
                    <p>Welcome</p>
                    <button>{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</button>
                </span>
            </nav>
            <div className="instructorsListContainer">
                <h1>Instructors</h1>
                <div className="searchBarContainer">
                    <input 
                        className="searchBar" 
                        type="search" 
                        placeholder="Search for Instructors"
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        />
                </div>
                <table className="instructorListTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        { instructorsHtml !== null ? instructorsHtml : '' }
                    </tbody>
                </table>
            </div>


            <div className="instructorAccountsCrudContainer">
                <h1>Instructor Accounts Operations</h1>
                <div>
                    <input className='First'
                        type="text"
                        placeholder="Instructor Firstname"
                        value={instructorFirstname}
                        onChange={(e) => setInstructorFirstname(prev => e.target.value)}/>
                </div>
                <div>
                    <input className='Last'
                        type="text"
                        placeholder="Instructor Lastname"
                        value={instructorLastname}
                        onChange={(e) => setInstructorLastname(prev => e.target.value)}/>
                </div>
                <div>
                    <input className='email'
                        type="email"
                        placeholder="Instructor Email"
                        value={instructorEmail}
                        onChange={(e) => setInstructorEmail(prev => e.target.value)}/>
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
                <div className="createInstructorButtonContainer">
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
                        if(instructorId === null) {
                            if(instructorFirstname !== '' && instructorLastname !== '' && instructorEmail !== '') {
                                setIsButtonDisabled(() => true);
                                fetch(`${DEVELOPMENT_HOST}/api/instructors`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    redirect: 'follow',
                                    body: JSON.stringify({
                                        firstname: instructorFirstname,
                                        lastname: instructorLastname,
                                        email: instructorEmail
                                    })
                                })
                                .then((result) => result.json())
                                .then((value) => {
                                    setInstructorId(() => value._id);
                                    setInstructorFirstname(() => value.firstname);
                                    setInstructorLastname(() => value.lastname);
                                    setInstructorEmail(() => value.email);
                                    setIsInstructorBlocked(() => value.is_blocked);
                                    setInputChanged(prev => !prev);
                                    setIsButtonDisabled(() => false);
                                });
                            }
                        } else {
                            setInstructorId(() => null);
                            setInstructorFirstname(() => '');
                            setInstructorLastname(() => '');
                            setInstructorEmail(() => '');
                            setIsInstructorBlocked(() => false);
                            setInputChanged(prev => !prev);
                        }
                    }}>
                        Create New Instructor
                    </button>
                </div>

                <div className="updateInstructorButtonContainer">
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
                        if(instructorId !== null) {
                            if(instructorFirstname !== '' && instructorLastname !== '' && instructorEmail !== '') {
                                setIsButtonDisabled(() => true);
                                fetch(`${DEVELOPMENT_HOST}/api/instructors`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    redirect: 'follow',
                                    body: JSON.stringify({
                                        update_type: 'change',
                                        id: instructorId,
                                        firstname: instructorFirstname,
                                        lastname: instructorLastname,
                                        email: instructorEmail
                                    })
                                })
                                .then((result) => result.json())
                                .then((value) => {
                                    fetch(`${DEVELOPMENT_HOST}/api/instructors/${instructorId}`)
                                    .then(result => result.json())
                                    .then((updatedInstructorValue) => {
                                        setInstructorId(() => updatedInstructorValue._id);
                                        setInstructorFirstname(() => updatedInstructorValue.firstname);
                                        setInstructorLastname(() => updatedInstructorValue.lastname);
                                        setInstructorEmail(() => updatedInstructorValue.email);
                                        setIsInstructorBlocked(() => updatedInstructorValue.is_blocked);
                                        setInputChanged(prev => !prev);
                                        setIsButtonDisabled(() => false);
                                    });
                                });
                            }
                        }
                    }}>Update Instructor</button>
                </div>

                <div className="blockInstructorButtonContainer">
                    <button 
                    style={updateButtonColorState({
                            callback: () => {
                                if(isInstructorBlocked === false) {
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
                        if(instructorId !== null && isInstructorBlocked !== null) {
                            setIsButtonDisabled(() => true);
                            fetch(`${DEVELOPMENT_HOST}/api/instructors`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                body: JSON.stringify({
                                    update_type: 'block',
                                    id: instructorId,
                                    is_blocked: !isInstructorBlocked
                                }),
                            })
                            .then((result) => result.json())
                            .then((value) => {
                                fetch(`${DEVELOPMENT_HOST}/api/instructors/${instructorId}`)
                                    .then(result => result.json())
                                    .then((updatedInstructorValue) => {
                                        setInstructorId(() => updatedInstructorValue._id);
                                        setInstructorFirstname(() => updatedInstructorValue.firstname);
                                        setInstructorLastname(() => updatedInstructorValue.lastname);
                                        setInstructorEmail(() => updatedInstructorValue.email);
                                        setIsInstructorBlocked(() => updatedInstructorValue.is_blocked);
                                        setInputChanged(prev => !prev);
                                        setIsButtonDisabled(() => false);
                                    });
                            });
                        }
                    }}>{ isInstructorBlocked ? 'Unblock Instructor' : 'Block Instructor' }</button>
                </div>

                <div className="deleteInstructorButtonContainer">
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
                        if(instructorId !== null) {
                            setIsButtonDisabled(() => true);
                            fetch(`${DEVELOPMENT_HOST}/api/instructors`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                body: JSON.stringify({
                                    id: instructorId
                                }),
                            })
                            .then((result) => result.json())
                            .then((value) => {
                                setInstructorId(() => null);
                                setInstructorFirstname(() => '');
                                setInstructorLastname(() => '');
                                setInstructorEmail(() => '');
                                setIsInstructorBlocked(() => false);
                                setInputChanged(prev => !prev);

                                setIsButtonDisabled(() => false);
                            });
                        }
                    }}
                    >
                        Delete Instructor
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InstructorAccounts;