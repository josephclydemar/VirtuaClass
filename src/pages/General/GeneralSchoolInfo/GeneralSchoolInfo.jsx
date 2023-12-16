import { useContext } from 'react';
import { Link } from 'react-router-dom';
import './GeneralSchoolInfo.css';
import NavBar from '../../../components/NavBar';
import SchoolInfoContext from '../../../contexts/SchoolInfoContext';


const GeneralSchoolInformation = () => {
    const { schoolInfo } = useContext(SchoolInfoContext);

    return (
        <>
            <NavBar  schoolInfo={schoolInfo}/>
            <div className="School-Information">
                <h1>Welcome to { schoolInfo.schoolName }</h1>
                <h2>Mission:</h2>
                <p>{ schoolInfo.mission }</p>
                
                {/* Add margin-bottom to the headings */}
                <h2 style={{ marginBottom: '10px' }}>Vision:</h2>
                <p>{ schoolInfo.vision }</p>

                <h2 style={{ marginBottom: '10px' }}>Objective:</h2>
                <p>{ schoolInfo.objectives }</p>

                {/* Add a space with a non-breaking space for spacing */}
                <p>&nbsp;</p>
                
                <p className="generalInfoContact">Contact: { schoolInfo.contactInformation }</p>
                <Link to={"/enrollment"} className="enroll-button">Enroll Now</Link>
            </div>
        </>
    );
}

export default GeneralSchoolInformation;
