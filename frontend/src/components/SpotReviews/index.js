import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSpotReviews } from '../../store/reviews';
import './SpotReviews.css';

function SpotReviews({spotId}){
    const spotReviews = useSelector(state=>state.reviews.spot)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSpotReviews(spotId))
    },[dispatch])

    if(Object.keys(spotReviews).length === 0){
        return null
    }
    const reviews = Object.values(spotReviews)
    console.log(reviews)
    return (
        <>
        {spotReviews && reviews.map(rev=>(
            <div key={rev.id} className='review-div'>
                <h4>{rev.User.firstName}</h4>
                <p>{rev.createdAt.split('T')[0]}</p>
                <p>{rev.review}</p>
            </div>
        ))}
        </>
    )
}
export default SpotReviews
