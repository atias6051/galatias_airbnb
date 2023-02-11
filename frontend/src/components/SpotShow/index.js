import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSingleSpot} from '../../store/spots';
import { useParams } from 'react-router-dom';
import './SpotShow.css'

function SpotShow(){
    const {spotId} = useParams()
    const spot = useSelector(state=>state.spots.singleSpot)
    const dispatch = useDispatch()

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
                    <div >
                        <img className='gallery-image-div' src={img.url}/>
                    </div>
                ))}
            </div>
            <h3>Hosted by {spot?.owner.firstName} {spot?.owner.lastName}</h3>
            <p>{spot?.description}</p>
            </>
            }
        </section>
    )


}

export default SpotShow
