import { csrfFetch } from './csrf';
import thunk from "redux-thunk";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SINGLE = 'spots/LOAD_SINGLE'

const loadSpots = (spots) => {
    return{
        type: LOAD_SPOTS,
        spots
    }
}

const loadSingle = (spot) =>{
    return{
        type: LOAD_SINGLE,
        spot
    }
}

export const getSpots = () => async dispatch =>{
    const res = await csrfFetch('/api/spots')
    const spots = await res.json();
    dispatch(loadSpots(spots))
}

export const getSingleSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await res.json()
    dispatch(loadSingle(spot))
}

const initialState = {
    allSpots: {},
    singleSpot: {}
}
const spotsReducer = (state=initialState,action) => {
    let newState = {...state};
    switch(action.type){
        case LOAD_SPOTS:
            action.spots.Spots.map(spot=>{
                newState.allSpots[spot.id] = {...spot}
            })
            newState = {...newState, allSpots: {...newState.allSpots}}
            return newState
        case LOAD_SINGLE:
            // newState.singleSpot = {...action.spot}
            newState = {...newState,singleSpot:{...action.spot}}
            return newState
        default:
            return state;
    }
}

export default spotsReducer;
