import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { clearSingleSpot, deleteSpot, getSingleSpot} from '../../store/spots';
import { useHistory, useParams } from 'react-router-dom';
import './SpotShow.css'
import ReserveSpot from './ReserveSpot';
import SpotReviews from '../SpotReviews';
import SpotGallery from './SpotGallery';
import ReviewsDemo from '../SpotReviews/ReviewsDemo';

function SpotShow(){
    const {spotId} = useParams()
    const history = useHistory()
    const spot = useSelector(state=>state.spots.singleSpot)
    const currentUser = useSelector(state=>state.session.user)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSingleSpot(spotId))

        return  () => dispatch(clearSingleSpot())
    },[dispatch])

    if(Object.keys(spot).length === 0) return null

    return (
        <section id='spot-show-section'>
            {spot &&
            <>
            <h2>{spot?.name}</h2>
            <h3>{spot?.city}, {spot?.state}, {spot?.country}</h3>
            <SpotGallery images={spot.SpotImages}/>
            <div className='description-reserve-div'>
                <div>
                    <h3>Hosted by {spot?.owner.firstName} {spot?.owner.lastName}</h3>
                    <p>{spot?.description}</p>
                </div>
                <ReserveSpot spot={spot} />
            </div>
            <ReviewsDemo spot={spot}/>
            <SpotReviews spotId={spotId} />
            </>
            }
        </section>
    )


}

export default SpotShow
