import '../styles/Safety.css';
import Title from './Title';
import Menu from './Menu';

function Safety() {
  return (
    <div className='safety-cont'>
        <Title/>
        <div className='safety'>
          <div className='safety-title'>
            Fun Facts and Safety Tips
          </div>
          <div className='safety-points'>
          <ul>
            <li>
              Raccoons are nocturnal animals that prefer moist woodland areas but can be 
              found in farmlands, suburban and urban areas too. Their diet varies from fruits 
              and nuts to insects and bird eggs. They also have adapted to eat trash and food 
              more accessible in urban areas. Raccoons are solitary animals with the only social 
              relationships being a mother and her young. 
            </li>
            <li>
              Don’t touch or feed raccoons! Second to bats, they are most frequently linked to
              reported rabies cases in the United States. Raccoons who humans, especially in
              urban areas often feed, may lose their sense of fear of people and start to
              approach other humans. If they are not fed then, they can become aggressive for
              food! Although they can be friendly, raccoons are never truly docile and can
              quickly become skittish and hostile, so stay at least 6 feet away!
            </li>
            <li>
              Stay away from raccoons that are active during the day, move erratically or don’t
              seem to be afraid of humans. These can be indicators that the raccoon has rabies,
              so call your local wildlife control immediately.
            </li>
            <li>
              Raccoons have opposable thumbs and are able to open containers with broken/loose
              lids, so make sure you secure your garbage cans with locks or clamps. If possible,
              choose to store garbage bins indoors.
            </li>
          </ul>

          </div>
        </div>
        <Menu/>
      </div>
  )
}

export default Safety;