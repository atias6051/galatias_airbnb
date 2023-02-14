import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteSpot, getSingleSpot} from '../../store/spots';
import { useHistory, useParams } from 'react-router-dom';
import './SpotShow.css'
import ReserveSpot from './ReserveSpot';
import SpotReviews from '../SpotReviews';
import SpotGallery from './SpotGallery';

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
            <SpotGallery images={spot.SpotImages}/>
            <h3>Hosted by {spot?.owner.firstName} {spot?.owner.lastName}</h3>
            <p>{spot?.description}</p>
            <ReserveSpot spot={spot} />
            <div className='spot-ratings'>
            <i className="fa-regular fa-star"></i>
            <h2>{spot.avgStarRating}</h2>
            <h2>·</h2>
            <h2>{spot.numReviews} Reviews</h2>
            </div>
            <SpotReviews spotId={spotId} />
            </>
            }
            {(currentUser && currentUser.id === spot.owner.id)?(<button onClick={handleDelete}>delete</button>):(<></>)}
        </section>
    )


}

export default SpotShow
