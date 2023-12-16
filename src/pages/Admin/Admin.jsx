import { Routes, Route } from 'react-router-dom';

// Admin Components
import EnrollmentApplications from "./EnrollmentApplications/EnrollmentApplications";
import InstructorAccounts from './InstructorAccounts/InstructorAccounts';
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import SiteSettings from "./SiteSettings/SiteSettings";
import StudentAccounts from "./StudentAccounts/StudentAccounts";
import AdministratorAccounts from "./AdministratorAccounts/AdministratorAccounts";


function Admin() {
    return (
        <>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/enrollment_applications" element={<EnrollmentApplications/>}/>
                <Route path="/student_accounts" element={<StudentAccounts />} />
                <Route path="/instructor_accounts" element={<InstructorAccounts/>}/>
                <Route path="/administrator_accounts" element={<AdministratorAccounts/>}/>
                <Route path="/site_settings" element={<SiteSettings/>}/>
            </Routes>
        </>
    );
}

export default Admin;