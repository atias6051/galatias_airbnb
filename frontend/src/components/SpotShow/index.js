import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteSpot, getSingleSpot} from '../../store/spots';
import { useHistory, useParams } from 'react-router-dom';
import './SpotShow.css'
import ReserveSpot from './ReserveSpot';
import SpotReviews from '../SpotReviews';

function SpotShow(){
    const {spotId} = useParams()
    const history = useHistory()
    const spot = useSelector(state=>state.spots.singleSpot)
    const currentUser = useSelector(state=>state.session.user)
    const dispatch = useDispatch()

    const handleDelete = () =>{
        dispatch(deleteSpot(spotId))
        history.push('/')
    }

    useEffect(()=>{
        dispatch(getSingleSpot(spotId))
    },[dispatch])

    if(Object.keys(spot).length === 0) return null

    return (
        <section id='spot-show-section'>
            {spot &&
            <>
            <h2>{spot?.name}</h2>
            <h3>{spot?.city}, {spot?.state}, {spot?.country}</h3>
            <div id="spot-image-gallery">
                {spot.SpotImages.map(img=>(
                    <div key={img.id} >
                        <img key={img.id} className='gallery-image-div' src={img.url}/>
                    </div>
                ))}
            </div>
            <h3>Hosted by {spot?.owner.firstName} {spot?.owner.lastName}</h3>
            <p>{spot?.description}</p>
            <ReserveSpot spot={spot} />
            <SpotReviews spotId={spotId} />
            </>
            }
            {(currentUser && currentUser.id === spot.owner.id)?(<button onClick={handleDelete}>delete</button>):(<></>)}
        </section>
    )


}

export default SpotShow
