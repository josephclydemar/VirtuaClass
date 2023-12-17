import './css/LoginScreen.css';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from "react";
import NavBar from '../../../components/NavBar';
import CurrentUserContext from "../../../contexts/CurrentUserContext";
import SchoolInfoContext from '../../../contexts/SchoolInfoContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';


const LoginScreen = () => {
    const { setCurrentUser } = useContext(CurrentUserContext);
    const { schoolInfo } = useContext(SchoolInfoContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${DEVELOPMENT_HOST}/api/accounts`);
        const json = await response.json();

        const matchedAccount = json.filter(item=>item.email === email)[0];

        

        if (matchedAccount) {
            // console.log(matchedAccount.user_id);
            if (matchedAccount.password === password) {
                const path = `${DEVELOPMENT_HOST}/api/${matchedAccount.account_type}/${matchedAccount.user_id}`;
                console.log(`Fetching ${path}`);
                fetch(path)
                    .then(result => result.json())
                    .then(value => {
                        setCurrentUser(value);
                        console.table(value);
                        console.log(matchedAccount);
                        sessionStorage.setItem('currentUser', JSON.stringify(value));
                        navigate(`/${matchedAccount.account_type}`);
                    });
            } else if (matchedAccount.password !== password){
                console.log("Incorrect password.");
                alert('Password is incorrect.');
            }
        }
        else if (!matchedAccount){
            console.log("Email does not exist.");
            alert('Email does not exist.');
        }
        document.getElementById('loginEmailInput').value = '';
        document.getElementById('loginPasswordInput').value = '';

        // console.log(json);
        // console.log([email, password]);
        // console.log(matchedAccount);
    }

    return (
        <>
            <NavBar  schoolInfo={schoolInfo}/>
            <form className="loginScreenForm" onSubmit={handleSubmit}>
                <h3>Enter your Login details  </h3>
                
                <label className="loginFieldLabel" htmlFor="loginEmailInput">Email:</label>
                <input 
                    className="loginInput"
                    id="loginEmailInput"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <label className="loginFieldLabel" htmlFor="loginPasswordInput" >Password:</label>
                <input 
                    className="loginInput"
                    id="loginPasswordInput"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />

                <button className="loginButton">Login</button>
            </form>
        </>
    )
}

export default LoginScreen;