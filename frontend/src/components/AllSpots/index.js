import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import { getSpots } from '../../store/spots';
import './AllSpots.css'

function AllSpots(){
    const spots = useSelector(state=>state.spots.allSpots)
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(()=>{
        dispatch(getSpots())
    },[dispatch])

    const handleSpotClick = (e) =>{
        console.log(e.target.value)
        // history.push(`/spots/${e.target.value}`)
    }

    return (
        <>
        <h1>Connected</h1>
        <section id='all-spots-section'>

        {spots && Object.values(spots).map(spot=>(
            <Link className='spot-card' key={spot.id} to={`spots/${spot.id}`}>
            {/* <div className='spot-card'> */}
                <img  className="spot-card-prev-image" src={spot.previewImage} alt={spot.name}/>
                <div  className='spot-preview-info'>
                    <div>
                        <h3>{spot.city}, {spot.state}</h3>
                        <h3>${spot.price} night</h3>
                    </div>
                    <span ><i className="fa-regular fa-star"></i>{spot.avgRating}</span>
                </div>
            {/* </div> */}
            </Link>
        ))}
        </section>
        </>
    )
}


export default AllSpots
