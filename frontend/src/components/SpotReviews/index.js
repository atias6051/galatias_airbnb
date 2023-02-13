import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSpotReviews } from '../../store/reviews';

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
    return (
        <>
        {spotReviews && reviews.map(rev=>(
            <li key={rev.id}>{rev.review}</li>
        ))}
        </>
    )
}
export default SpotReviews
