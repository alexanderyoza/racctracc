import { useEffect } from 'react';
import '../styles/Card.css';
import axios from 'axios';
import { useState } from 'react';

const Card = ({ post }) => {

   const [username, setUsername] = useState('User');
   const [image, setImage] = useState('');


   useEffect(() => {
      const getUser = async () => {
         await axios.get(`https://racctracc.herokuapp.com/api/users/getUsername/${post.userId}`)
            .then((response) => {
               setUsername(response.data.username);
            })
            .catch((error) => {
               console.error(error);
            });
      }
      getUser();
   }, [post.userId]);

   useEffect(() => {
      const getImg = async (path) => {
          console.log('Loading Images...');
          try {
              let response = await axios.get('https://racctracc.herokuapp.com/api/uploads/getImage', { headers: { imagepath: path } });
               setImage(response.data);
          } catch (err) {
              console.error(err);
              return null;
          }
      }
      getImg(post.imagepath);
  }, [post, username], 3600);

   return (
      <div className="post-card">

         <div className='post-top'>
            <div className='user'>{username}</div>
            <div className='location'>{post.location}</div>
         </div>

         <img src={image} alt='img' />

         <div className='caption'>{ post.caption }</div>
      </div>
   );
};
export default Card;
