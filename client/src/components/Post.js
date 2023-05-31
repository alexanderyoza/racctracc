import Menu from './Menu';
import Title from './Title';
import Webcam from 'react-webcam';
import '../styles/Post.css';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import exitImg from '../media/exit.png';
import { AiOutlineCamera } from "react-icons/ai";

function Home() {
  
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";

  const navigate = useNavigate();

  const [id, setId] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [taken, setTaken] = useState(false);
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  


  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const fetchData = async () => {
        try {
          const fetchUser = await axios.get('https://racctracc.herokuapp.com/api/users/whoami', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            }
          });
          setId(fetchUser.data._id);
        } catch (err) {
          localStorage.removeItem('jwt_token');
          alert('Invalid session, navigating to login page.');
          console.log(err);
          navigate('/');
        }
      }
      fetchData();
    }
    else {
      navigate('/');
    }
  }, [navigate]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const currentTime = getTimeStamp().toString();
    const formData = new FormData();
    formData.append('userId', id);
    formData.append('caption', caption);
    formData.append('imagepath',  id + '_' + currentTime + ".jpeg");
    formData.append('location', location);


    const blob = await fetch(image).then((res) => res.blob());
    console.log(image);
    const file = new File([blob], id + '_' + currentTime + ".jpeg", {type: 'image/webp'});
    formData.append('image', file);

    for (let i of formData) {
      console.log(i);
    }

    axios.post('https://racctracc.herokuapp.com/api/uploads/createUpload', formData)
      .then((response) => {
        console.log(response.data); // Image uploaded successfully
        // Handle any additional logic or UI updates
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  const webRef = useRef(null);

  const videoConstraints = {
    facingMode : FACING_MODE_ENVIRONMENT
  };

  const showImage = () => {
    setTaken(true);
    setImage(webRef.current.getScreenshot());
  };

  const handleClick = React.useCallback(() => {
    setFacingMode(
      prevState =>
        prevState === FACING_MODE_USER
          ? FACING_MODE_ENVIRONMENT
          : FACING_MODE_USER
    );
  }, []);

  function getTimeStamp() {
    return Date.now();
  }
  const photoRetake = () => {
    setTaken(false);
  }


  return (
    <div className='upload-cont'>
      <div className="camera">
        <Title/>

        {
          taken ? (
            <div className='screens'>
              <button id='retake' onClick={photoRetake}><img src={exitImg} alt="Go Back" /></button>
              <img src={image} alt='userphoto'/>
                <form className='upload-form' onSubmit={handleFormSubmit}>
                  <input placeholder='Location' type='text' onChange={handleLocationChange} />
                  <input placeholder='Caption' type='text' onChange={handleCaptionChange}/>
                  <button type="submit">Upload Image</button>
                </form>
            </div>

          ):(
            <div className='screens'>
              <Webcam ref={webRef} 
                className='webcam'
                screenshotFormat="image/jpeg" 
                height = '100%'
                width = '100%'
                forceScreenshotSourceSize
                videoConstraints={videoConstraints}
                />
              <button onClick={handleClick}>Flip Camera</button>
              <button id='sc' onClick={showImage}><AiOutlineCamera /></button>
            </div>
          )
        }
      </div>
      <Menu/>
    </div>
  );
}

export default Home;