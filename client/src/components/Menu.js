import { Link } from 'react-router-dom';
import '../styles/Menu.css';
import RaccIcon from '../media/RaccIcon.png';
import AlertIcon from '../media/AlertIcon.png';
import UserIcon from '../media/UserIcon.png';
import HomeIcon from '../media/HomeIcon.png';

function Menu() {
  return (
    <div className='menu'>
      <Link className='category' to='/feed'>
        <div className='cat-text'><img src={HomeIcon} alt="Home" /></div>
      </Link>
      <Link className='category' to='/post'>
        <div className='cat-text'><img src={RaccIcon} alt="Post" /></div>
      </Link>
      <Link className='category' to='/userprofile'>
        <div className='cat-text'><img src={UserIcon} alt="User" /></div>
      </Link>
      <Link className='category' to='/safety'>
        <div className='cat-text'><img src={AlertIcon} alt="Safety" /></div>
      </Link>
    </div>
  )
}

export default Menu;