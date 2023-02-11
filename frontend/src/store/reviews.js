import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOTS_REVIEWS'

const loadSpotReviews = reviews =>{
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    }
}

export const getSpotReviews = spotId => async disptach =>{
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json()
    disptach(loadSpotReviews(reviews))
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
        default:
        return state
    }
}

export default reviewsReducer
