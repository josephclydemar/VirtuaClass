import { Link } from 'react-router-dom';
import { AiOutlineLock } from "react-icons/ai";

const NavBar = ({schoolInfo}) => {
    return (
        <nav className="Navbar">
            <div className="Navbar__container">
                <h1><Link to={"/"}>{schoolInfo.schoolName}</Link></h1>
                <div>
                    <p><Link to={"/courses"}>Course List</Link></p>
                    <p><Link to={"/faq"}>FAQ</Link></p>
                    <p><Link to={"/calendar"}>Calendar</Link></p>
                    <p><Link to={"/enrollment"}>Enrollment</Link></p>
                    <p><Link to={"/paymentlinks"}>Payment Links</Link></p>
                </div>
                <Link to={"/login"}>
                <p>
                    <AiOutlineLock size={20} /> Login
                </p>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;