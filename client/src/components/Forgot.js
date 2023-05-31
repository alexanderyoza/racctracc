import '../styles/Forgot.css';

import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleForgot = async (event) => {
        event.preventDefault();
        if (!email) {
            return;
        }

        try {
            const forgotResponse = await axios.post('https://racctracc.herokuapp.com/api/users/forgot', {email});
            alert('Email has been sent. Check your inbox for your password information.');
            navigate('/login');

        } catch (err) {
            alert('Email is not associated with an account. Please try again.');
            console.log(err);
        }
    }

  return (
    <div className="forgot-cont">
            <div className='forgot'>
              <h1>Forgot Password</h1>
              <p>If a user with the email exists, they will be sent an email containing their password.</p>

                <div className="forgot-input">
                    <input placeholder='Email' type="text" id="email" value={email}
                        onChange={(event) => setEmail(event.target.value)}></input>
                </div>
              
                <h3 onClick={() => navigate('/login')}>Back to Login</h3>

                <button type="submit" onClick={handleForgot}>Send</button>
            </div>
        </div>
  )
}

export default Forgot;