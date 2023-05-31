import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import '../styles/Verify.css';

function Verify() {
  const navigate = useNavigate();
  const params = useParams();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      try {
        await axios.post('https://racctracc.herokuapp.com/api/users/verify', { id: params.id, token: params.token });
        setVerified(true);
      } catch (err) {
        alert('Invalid link, navigating to login page.');
        navigate('/');
      }
    }
    validateUser();
  }, [navigate, params.id, params.token]);

  if (!verified) {
    return(
      <div className='verify-load'>
        <div>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className='verify-cont'>
      <div className='verify'>
        <h1>You have successfully verified your email! </h1>
        <h1>Click below to return to the login screen:</h1>
        <h3 onClick={() => navigate('/verify')}>Return to login page</h3>
      </div>
    </div>
  )
}

export default Verify;