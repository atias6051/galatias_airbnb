import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteReview, getSpotReviews, getUserReviews } from '../../store/reviews';
import OpenModalButton from "../OpenModalButton"
import './SpotReviews.css';
import PostReviewModal from '../PostReviewModal';
import EditReviewModal from '../EditReviewModal';
import { getSingleSpot } from '../../store/spots';
import formatDate from '../../utils/formatDate';

function SpotReviews({spotId}){
    const user = useSelector(state=>state.session.user)
    const spotReviews = useSelector(state=>state.reviews.spot)
    const spot = useSelector(state=>state.spots.singleSpot)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSpotReviews(spotId))
        dispatch(getUserReviews())
    },[dispatch])

    const handleDelete = async (e) =>{
        e.preventDefault()
        await dispatch(deleteReview(e.target.name))
        await dispatch(getSingleSpot(spot.id))
    }
    const reviews = Object.values(spotReviews)

    return (
        <>
        {user && !reviews.find(rev=>rev.userId === user.id) && user.id !== spot.ownerId ?
        (<OpenModalButton
        nameClass="post-review-button"
        buttonText={'Post Your Review'}
        modalComponent={<PostReviewModal/>}
        />):(<></>)}
        <section id="all-reviews-section">
        {spotReviews && reviews.map(rev=>(
            <div key={rev.id} className='review-div'>
                <h4>{rev?.User?.firstName}</h4>
                <p className='bold'>{formatDate(rev.createdAt)}</p>
                {/* <p>{rev.createdAt.split('T')[0]}</p> */}
                <p>{rev.review}</p>
                {user && user.id === rev.userId?(
                    <>
                <button name={rev.id} className='standard-button' onClick={handleDelete}>Delete</button>
                <OpenModalButton
                buttonText={"update"}
                nameClass={'standard-button'}
                modalComponent={<EditReviewModal reviewId={rev.id}/>}
                />
                </>
                ):(<></>)}
            </div>
        ))}
        {user && user.id !== spot.ownerId && !reviews.length?(<h3 className='marg-top-10'>Be the first to post a review!</h3>):(<></>)}
        </section>
        </>
    )
}
export default SpotReviews
