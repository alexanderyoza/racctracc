import '../styles/UserProfile.css';
import Menu from './Menu';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import PostPopup from './PostPopup'


function UserProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            console.log('Loading User...');
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    axios.get('https://racctracc.herokuapp.com/api/users/whoami', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                        }
                    })
                        .then((res) => {
                            setUser(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                            console.error(error);
                            // Handle error
                        });
                } catch (err) {
                    localStorage.removeItem('jwt_token');
                    alert('Invalid session, navigating to login page.');
                    console.log(err);
                    navigate('/');
                }
            }
            else {
                navigate('/');
            }
            
        }

        getUser();
        console.log('Loaded User:');
        console.log(user);
    }, [navigate]);

 
    useEffect(() => {
        const getUploads = async () => {
            console.log('Loading Uploads...');
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    await axios.get('https://racctracc.herokuapp.com/api/uploads/getUploads', {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                            }
                        })
                        .then((response) => {
                            setPosts(response.data);
                        })
                        .catch((error) => {
                            console.error(error);
                            // Handle error
                        });         
                } catch (err) {
                    localStorage.removeItem('jwt_token');
                    alert('Invalid session, navigating to login page.');
                    console.log(err);
                    navigate('/');
                }
            }
            else {
                navigate('/');
            }
            
        }
        getUploads();
        console.log('Uploads Loaded');
        console.log(posts);
    }, [navigate, user]);

    useEffect(() => {
        const getImg = async (path) => {
            console.log('Loading Images...');
            try {
                let response = await axios.get('https://racctracc.herokuapp.com/api/uploads/getImage', { headers: { imagepath: path } });
                return response.data;
            } catch (err) {
                console.error(err);
                return null;
            }
        }

        const fetchImages = async () => {
            const imgPromises = posts.map((post) => getImg(post.imagepath));
            const imgUrls = await Promise.all(imgPromises);
            setImages(imgUrls);
        };
        
        fetchImages();
        console.log('Images Loaded');
        console.log(images);
    }, [navigate, posts, user], 3600);



    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const openPostPopup = (post, img) => {
        setSelectedPost(post);
        setSelectedImage(img);
      };
    
      const closePostPopup = () => {
        setSelectedPost(null);
      };
    
    

    return (
        <div className='profile-cont'>
            <div className='profile'>
                <div className='info'>
                    <div className='name'>
                        {user ? user.name : 'loading name...'}
                    </div>
                    <div className='username'>
                        {user ? user.username : 'username'}
                    </div>
                    <div className='post-count'>
                        <div>{posts ? posts.length : 'loading post count...'} Sightings</div>
                        
                    </div>
                </div>
                
                <div className='post-sect'>    
                    {posts.map((post, idx) => (
                        <div className="post-block" key={idx}>
                            <img
                            src={images[idx]}
                            alt="Post"
                            onClick={() => openPostPopup(post, images[idx])}
                            />
                        </div>
                    ))}
                </div>
                {selectedPost && (
                    <PostPopup post={selectedPost} image={selectedImage} onClose={closePostPopup} />
                )}
            </div>
            
            <Menu/>
        </div>
    );
};

export default UserProfile;

