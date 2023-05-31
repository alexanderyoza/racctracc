import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import RegImg from '../media/registertitle.png'

import '../styles/Register.css';


export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registering, setRegistering] = useState(false);


    const handleRegister = async (event) => {
        event.preventDefault();
        if (!name || !username || !email || !password) {
            return;
        }
        setRegistering(true);

        const emailRegex = /\S+@\S+\.\S+/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{8,}$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            setRegistering(false);
            return;
        }
        if (!passwordRegex.test(password)) {
            alert('Please enter a password that is at least 8 characters long, containing at least one uppercase letter, lowercase letter, digit. and special symbol.');
            setRegistering(false);
            return;
        }

        console.log(`Registering user with name: ${name}, with email: ${email} and password: ${password}`);

        try {
            const registerResponse = await axios.post("https://racctracc.herokuapp.com/api/users/register", {name, username, email, password});
            alert('User created! Check your email for an email verification link to activate your account.');
            setRegistering(false);
            console.log(registerResponse);
        } catch (err) {
            alert('User with this email already exists. Please enter another email to create an account.');
            setRegistering(false);
            console.log(err);
        }

    }

    


    return (
        <div className="bg-container">
            <div className="register-container">
                <img src={RegImg} alt="Create An Account" />
                
                <div className="input-field">
                    <input placeholder="Name" type="text" id="name" value={name} onChange={(event) => setName(event.target.value)}></input>
                </div>

                <div className="input-field">
                    <input placeholder="Username" type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)}></input>
                </div>

                <div className="input-field">
                    <input placeholder="Email" type="text" id="email" value={email} onChange={(event) => setEmail(event.target.value)}></input>
                </div>

                <div className="input-field">
                    <input placeholder="Password" type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)}></input>
                </div>

                <div className="footer" onClick={() => navigate('/login')}>Already a Tracker? Sign In</div>

                <button type="submit" onClick={handleRegister}>Register</button>

            </div>
        </div>
    )
};