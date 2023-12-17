// import './css/SiteSettings.css';
import './Site.css';
import { useNavigate } from 'react-router-dom';
import ReactCalendar from 'react-calendar';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useEffect, useState, useContext } from 'react';
import CurrentUserContext from '../../../contexts/CurrentUserContext';


const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const SiteSettings = () => {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
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

    const [schoolName, setSchoolName] = useState("")
    const [mission, setMission] = useState("")
    const [vision, setVision] = useState("")
    const [objectives, setObjectives] = useState("")
    const [paymentLink, setPaymentLink] = useState("")
    const [contactInformation, setContactInformation] = useState("")

    const [flickFaq, setFlickFaq] = useState(false);
    const [faqData, setFaqData] = useState(null);
    const [faqCount, setFaqCount] = useState(null);
    const [htmlFaqData, setHtmlFaqData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [temporaryHtmlFaqData, setTemporaryHtmlFaqData] = useState(null);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/school`)
        .then(result =>{return result.json()})
        .then( value =>
            {
                setSchoolName(value.schoolName);
                setMission(value.mission);
                setVision(value.vision);
                setObjectives(value.objectives);
                setPaymentLink(value.paymentLink);
                setContactInformation(value.contactInformation);
            }
        )
    }, []);
    // const [question, setQuestion] = useState('');
    // const [answer, setAnswer] = useState('');
    const questionStates = [
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null)
    ];
    const answerStates = [
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null),
        useState(null)
    ];
    const faqIds = [
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0'),
        useState('0')
    ];

    const [questionStateValues, setQuestionStateValues] = useState(null);
    const [answerStateValues, setAnswerStateValues] = useState(null);
    const [faqCountPreviosState, setFaqCountPreviosState] = useState(0);


    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/faqs`)
        .then(result =>{ return result.json() })
        .then( value =>
            {
                // console.log(questionStates);
                setFaqData(value);
                setFaqCount(value.length);
                for (let i=0; i<value.length; i++) {
                    questionStates[i][1](value[i].question);
                    answerStates[i][1](value[i].answer);
                    faqIds[i][1](value[i]._id);
                    // console.log(questionStates[i][1]);
                }
                setFlickFaq(prev => !prev);
                // console.log(value);
            }
        )
    }, []);

    useEffect(() => {
        setQuestionStateValues(questionStates.map(item => item[0]));
        setAnswerStateValues(answerStates.map(item => item[0]));
        setFaqCountPreviosState(faqCount);
    }, []);

    useEffect(() => {
        console.log(`COMPARISON: ${JSON.stringify(questionStates.map(item => item[0])) === JSON.stringify(questionStateValues)}`);
        // if (questionStateValues !== null) {
        //     console.log(`VALUES: ${questionStateValues}`);
        //     console.log(`STATES: ${questionStates.map(item => item[0])}`);
        // }
        if (JSON.stringify(questionStates.map(item => item[0])) !== JSON.stringify(questionStateValues) || JSON.stringify(answerStates.map(item => item[0])) !== JSON.stringify(answerStateValues) || faqCountPreviosState !== faqCount) {
            // console.log(faqIds);
            console.log(questionStates[0][0]);
            // console.log(`faqCount: ${faqCount}`);
            // console.log(answerStates);
            let temporaryHtmlFaqData = [];
            if(questionStates[0][0] && answerStates[0][0]) {
                for (let i=0; i<faqCount; i++) {
                    temporaryHtmlFaqData.push(
                        (
                            <tr>
                                <td>
                                    <input className='faqInputField' type='text' value={ questionStates[i][0] } onChange={(e) => questionStates[i][1](e.target.value)} />
                                </td>
                                <td>
                                    <input className='faqInputField' type='text' value={ answerStates[i][0] } onChange={(e) => answerStates[i][1](e.target.value)} />
                                </td>
                                <td>
                                    <button onClick={() => {
                                        fetch(`${DEVELOPMENT_HOST}/api/faqs`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ id: faqIds[i][0] }),
                                            redirect: 'follow'
                                        }).then(result => result.json()).then(value => {
                                            // console.log(value);
                                            window.location.reload();
                                        });
                                    }}>
                                        <MdOutlineDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        )
                    );
                }
                setHtmlFaqData(temporaryHtmlFaqData);
            }
            setQuestionStateValues(questionStates.map(item => item[0]));
            setAnswerStateValues(answerStates.map(item => item[0]));
            setFaqCountPreviosState(faqCount);
        }
    }, [flickFaq, questionStates.map(item => item[0]), answerStates.map(item => item[0]), faqCount]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        await fetch(`${DEVELOPMENT_HOST}/api/school`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: "6522a9f6d6ccb019a109d58b",
                    schoolName: schoolName,
                    mission: mission,
                    vision: vision,
                    objectives: objectives,
                    paymentLink: paymentLink,
                    contactInformation: contactInformation
                }
            ),
            redirect: "follow"
        })
        for (let i=0; i<faqCount; i++) {
            await fetch(`${DEVELOPMENT_HOST}/api/faqs`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: faqIds[i],
                    question: questionStates[i][0],
                    answer: answerStates[i][0]
                }),
                redirect: 'follow'
            });
        }
        setIsLoading(false);
        window.location.reload();
        alert("School Information Updated!");
    }



    // calendar shit
    const [selectedDate, setSelectedDate] = useState(null);
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState(null);
    const [eventInput, setEventInput] = useState('');
    const [newEvent, setNewEvent] = useState(''); // State to capture the new event input

    useEffect(() => {
        if(selectedDate !== null) {
            console.log('\n\n\n-----------\nselectedDate: ->: ', selectedDate);
            console.log('Date String ->: ', selectedDate.toDateString());
            console.log('ISO Date: ->: ', (new Date(Date.parse(selectedDate))).toISOString());
            console.log('UTC Date ->: ', (new Date(Date.parse(`${selectedDate}`))).toUTCString());
        }
    }, [selectedDate]);


    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/events`)
            .then(result =>{return result.json()})
            .then(value =>{setEvents(value)});
    }, []);

    useEffect(() => {
        if (event !== null) {
            setEventInput(event.event);
        }
    }, [event]);

    // Function to handle date selection
    const handleDateChange = (date) => {
        for (let i=0; i<events.length; i++) {
            if (events[i].date === date.toDateString()){
                setEvent(events[i]);
                break;
            }
            else {
                setEvent(null);
            }
        }
        
        // You can add additional logic here, such as fetching events for the selected date.
    };

    useEffect(() => {
        if(selectedDate !== null) {
            handleDateChange(selectedDate);
        }
    }, [selectedDate]);


    return (
        <>
            <div>
                <header>
                    <div className="welcome">
                        Welcome, <span className="admin-box">{ currentUser !== null ? `${currentUser.firstname} ${currentUser.lastname}` : '' }</span>
                    </div>
                </header>
            </div>

            <div className="dashboard">
                 <div className="faq-container">
    <h2 className="faq-header">FAQ Section</h2>
    {/* FAQ Table */}
    <div>
        <table className="faq-table">
            <tr className='faq-input'>
                <th className="faq-table-header">Question</th>
                <th className="faq-table-header">Answer</th>
                <th className="faq-table-header">Delete</th>
            </tr>
            {htmlFaqData !== null ? htmlFaqData : ''}
        </table>
        <button onClick={() => {
            setFaqCount(prev => prev + 1);
        }} className="add-faq-button">
            Add New FAQ
        </button>
    </div>
</div>
                <div className="left-column">
                    
                    <h1 className="siteSettingsH1">Site Settings</h1>
                    <form onSubmit={handleSubmit}>
                        <button disabled={isLoading} style={isLoading ? { opacity: 0.2 } : { opacity: 1 }}
                                className="left-column-button">
                            { isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <div className="input-column">
                            <h2>School Name</h2>
                            <input className='input-for-0'
                                type="text"
                                onChange={(e) => setSchoolName(e.target.value)}
                                value={schoolName}
                            />
                            <h2>Mission</h2>
                            <input className='input-for-1'
                                type="text"
                                onChange={(e) => setMission(e.target.value)}
                                value={mission}
                            />
                            <h2>Vision</h2>
                            <input className='input-for-2'
                                type="text"
                                onChange={(e) => setVision(e.target.value)}
                                value={vision}
                            />
                            <h2>Objectives</h2>
                            <input className='input-for-3'
                                type="text"
                                onChange={(e) => setObjectives(e.target.value)}
                                value={objectives}
                            />
                            <h2>Payment Link</h2>
                            <input className='input-for-4'
                                type="text"
                                onChange={(e) => setPaymentLink(e.target.value)}
                                value={paymentLink}
                            />
                            <h2>Contact Information</h2>
                            <input className='input-for-5'
                                type="text"
                                onChange={(e) => setContactInformation(e.target.value)}
                                value={contactInformation}
                            />
                        </div>
                    </form>
                    
                    {/* <FAQ /> */}
                </div>
                <div className="calendar-container">
                    <div className='calendar-heading'>
                    <h2 className='Titlelendar'>
                        School Calendar
                        </h2>
                    </div>
                    <div>
                    <ReactCalendar className="calendar" onChange={(e) => setSelectedDate(prev => e)} value={selectedDate} />
                        <div>
                            { selectedDate !== null ? <p>Selected Date: {selectedDate.toDateString()}</p> : '' }
                        </div>
                    </div>

                    {/* Displays Text Area and Button for Adding Events if event is null for the selected date, else displays the Current Event inside a Text Area of the selected date, Update Button, Delete Button */}
                    {
                    event !== null ?                                                                                                                    
                    <div className="event-list">
                        <h3>Events:</h3>
                        <ul>
                        <input
                                type="text"
                                className="eventInputUpdateDeleteField"
                                style={{
                                    width: '100%',
                                    backgroundColor: 'white', // Set the background color to white
                                    // Add other styles as needed
                                }}
                                value={eventInput}
                                onChange={(e) => setEventInput(e.target.value)}
                                />

                                <button className="update-button" onClick={
                                        () =>{
                                            if (event !== null) {
                                                fetch(`${DEVELOPMENT_HOST}/api/events`, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({
                                                            id: event._id,
                                                            event: eventInput
                                                        }),
                                                    redirect: "follow"
                                                }).then(result => {
                                                    // console.log(result);
                                                    window.location.reload();
                                                });
                                            }
                                        }                                    
                                }>Update Event</button>
                                <button className="delete-button" onClick={() =>{
                                    if (event !== null) {
                                        fetch(`${DEVELOPMENT_HOST}/api/events`, {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({ id: event._id }),
                                            redirect: "follow"
                                        }).then(result => {
                                            // console.log(result);
                                            window.location.reload();
                                        })
                                    }
                                }}>Delete Event
                                </button>
                        </ul>
                    </div>
                     : 
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        fetch(`${DEVELOPMENT_HOST}/api/events`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                    event_datetime: (new Date(selectedDate)).toISOString(),
                                    event: newEvent
                            }),
                            redirect: "follow"
                        }).then(result => {
                            return result.json();
                            // window.location.reload();
                        }).then(value => console.log(value));
                    }}>
                        <input
                            className="eventInputAddField"
                            type='text'
                            placeholder="Add an event"
                            style={{ width: '100%', height: '80px' }} // Adjust width and height
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button type="submit" className="add-button">Add</button>
                        </div>
                    </form>
                }
            

                </div>
            </div>





            
        </>
    )
}

export default SiteSettings;