import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOTS_REVIEWS'
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'
const POST_REVIEW = 'reviews/POST_REVIEW'
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'

const loadSpotReviews = reviews =>{
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    }
}

const loadUserReviews = reviews =>{
    return {
        type: LOAD_USER_REVIEWS,
        reviews
    }
}

const removeReview = (reviewId) =>{
    return{
        type: REMOVE_REVIEW,
        reviewId
    }
}
// const addNewReview = review =>{
//     return{
//         type: POST_REVIEW,
//         review
//     }
// }

export const getSpotReviews = spotId => async disptach =>{
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json()
    disptach(loadSpotReviews(reviews))
}

export const getUserReviews = () => async disptach =>{
    const res = await csrfFetch('/api/reviews/current')
    const userReviews = await res.json()
    disptach(loadUserReviews(userReviews))
}

export const postReview = (submitObj,spotId) => async disptach =>{
    const res1 = await csrfFetch(`/api/spots/${spotId}/reviews`,{
        method: 'POST',
        body: JSON.stringify(submitObj)
    })
    if(res1.ok){
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
        const reviews = await res.json()
        disptach(loadSpotReviews(reviews))
    }
}

export const deleteReview = reviewId => async disptach => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`,{method:'DELETE'})
    disptach(removeReview(reviewId))
}

export const updateReview = (review, reviewId,spotId) => async disptach => {
    const res1 = await csrfFetch(`/api/reviews/${reviewId}`,{
        method: 'PUT',
        body: JSON.stringify(review)
    })
    if(res1.ok){
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
        const reviews = await res.json()
        disptach(loadSpotReviews(reviews))
    }
}

const initialState = {
    spot:{},
    user:{}
}

const reviewsReducer = (state=initialState,action) => {
    let newState = {...state}
    switch(action.type){
        case LOAD_SPOT_REVIEWS:
            const newSpotRevs = {}
            action.reviews.Reviews.map(rev=>{
                newSpotRevs[rev.id] = rev
            })
            return {...newState, spot: {...newSpotRevs}}
        case LOAD_USER_REVIEWS:
            const newUserRevs = {}
            action.reviews.Reviews.map(rev=>{
                newUserRevs[rev.id] = rev
            })
            return {...newState, user: {...newUserRevs}}
        case POST_REVIEW:
            newState.spot[action.review.id] = action.review
            newState.user[action.review.id] = action.review
            newState = {
                ...newState,
                spot: {...newState.spot},
                user: {...newState.user}
            }
            return newState;
        case REMOVE_REVIEW:
            delete newState.spot[action.reviewId]
            delete newState.user[action.reviewId]
            newState = {
                ...newState,
                spot: {...newState.spot},
                user: {...newState.user}
            }
            return newState;
        default:
        return state
    }
}

export default reviewsReducer
