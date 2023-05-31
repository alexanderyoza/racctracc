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
import Rotate from '../media/rotate.png'

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
    facingMode: FACING_MODE_ENVIRONMENT,
    height: 1280,
    width: 960
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

        {
          taken ? (
            <div className='retake-cont'>
              <button id='retake' onClick={photoRetake}><img src={exitImg} alt="Go Back" /></button>
              <div className='screens'>
                <div className='photo-review'>
                  <img src={image} alt='userphoto' />
                </div>
                
                  <form className='upload-form' onSubmit={handleFormSubmit}>
                    <input placeholder='Location' type='text' onChange={handleLocationChange} />
                    <input placeholder='Caption' type='text' onChange={handleCaptionChange}/>
                    <button type="submit">Upload Image</button>
                </form>
              </div>
            </div>

          ):(
            <div className='screens'>
                <div className='webcam-cont'>
                <Webcam ref={webRef} 
                  className='webcam'
                  screenshotFormat="image/jpeg" 
                  forceScreenshotSourceSize
                    videoConstraints={videoConstraints}
                    height='100%'
                    mirrored={facingMode == 'user' ? true: false}
                  />
                </div>
                <div className='camera-buttons'>
                  <button id='sc' onClick={showImage}><AiOutlineCamera /></button>
                  <button onClick={handleClick} className='flip'><img src={Rotate} alt="rotate" /></button>
                </div>
                
            </div>
          )
        }
      </div>
      <Menu/>
    </div>
  );
}

export default Home;