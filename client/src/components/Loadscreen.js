import { useNavigate } from 'react-router-dom';
import '../styles/Loadscreen.css'
import LoadImg from '../media/Loadscreen.png';


function Loadscreen() {
  const navigate = useNavigate();

  window.setTimeout(() => {
    navigate('/login');
  }, 2000);

  return (
    <div className='loadscreen-cont'>
      <img src={LoadImg} alt="load screen" />
    </div>
  )
}

export default Loadscreen;