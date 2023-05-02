import { csrfFetch } from './csrf';
import thunk from "redux-thunk";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SINGLE = 'spots/LOAD_SINGLE'
const CLEAR_SINGLE = 'spots/CLEAR_SINGLE'
const REMOVE_SPOT = 'spots/REMOVE_SPOT'
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'

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

const removeSpot = spotId =>{
    return{
        type: REMOVE_SPOT,
        spotId
    }
}
export const clearSingleSpot = () => {
    return{
        type: CLEAR_SINGLE
    }
}

const loadUserSpots = spots =>{
    return{
        type: LOAD_USER_SPOTS,
        spots
    }
}

const updateSpot = spot =>{
    return{
        type: UPDATE_SPOT,
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
    return spot
}

export const createSpot = (submitObj) => async dispatch => {
    const {newSpot, images} = submitObj
    //creating new spot
    const res = await csrfFetch('/api/spots',{
        method: 'POST',
        body: JSON.stringify(newSpot)
    })
    const spot = await res.json()
    const spotId = spot.id
    await csrfFetch(`/api/spots/${spotId}/images`,{
        method: 'POST',
        body: JSON.stringify({
            url: images.preview,
            preview: true
        })
    })
    images.others.filter(el=>el.length).forEach( async el => {
        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: el,
                preview: false
            })
        })
    })

    const finalRes = await csrfFetch(`/api/spots/${spotId}`)
    const singleSpot = await finalRes.json()
    await dispatch(loadSingle(singleSpot))
    return spotId
}

export const getUserSpots = () => async dispatch =>{
    const res = await csrfFetch(`/api/spots/current`)
    const spots = await res.json()
    dispatch(loadUserSpots(spots))
}

export const deleteSpot = spotId => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`,{
        method: "DELETE",
    })
    dispatch(removeSpot(spotId))
}

export const editSpot = (submitObj,spotId) => async dispatch => {
    const {newSpot, images} = submitObj
    const res = await csrfFetch(`/api/spots/${spotId}`,{
        method: 'PUT',
        body: JSON.stringify(newSpot)
    })
    Object.values(images).forEach(async el=>{
        if(el.id && el.curr !== el.og){
            await csrfFetch(`/api/spot-images/${el.id}`,{
                method: 'PUT',
                body: JSON.stringify({url : el.curr})
            })
        }else if(!el.id && el.curr){
            await csrfFetch(`/api/spots/${spotId}/images`,{
                method: 'POST',
                body: JSON.stringify({url: el.curr})
            })
        }
    })
    const finalUpdatedSpotRes = await csrfFetch(`/api/spots/${spotId}`)
    const finalUpdatedSpot = await finalUpdatedSpotRes.json()
    dispatch(updateSpot(finalUpdatedSpot))
}


const initialState = {
    allSpots: {},
    singleSpot: {},
    currentUserSpots: {},
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
            newState = {...newState,singleSpot:{...action.spot}}
            newState.singleSpot.SpotImages = [...action.spot.SpotImages]
            return newState
        case CLEAR_SINGLE:
            const clearObj = {}
            return {...newState,singleSpot:clearObj}
        case REMOVE_SPOT:
            delete newState.allSpots[action.spotId]
            delete newState.currentUserSpots[action.spotId]
            newState = {...newState,
                allSpots: {...newState.allSpots},
                currentUserSpots: {...newState.currentUserSpots}
            }
            return newState
        case LOAD_USER_SPOTS:
            newState.currentUserSpots = {}
            action.spots.Spots.map(spot=>{
                newState.currentUserSpots[spot.id] = spot
            })
            newState = {...newState,currentUserSpots:{...newState.currentUserSpots}}
            return newState;
        case UPDATE_SPOT:
            delete newState.allSpots[action.spot.id]
            newState = {...newState, allSpots: {...newState.allSpots},singleSpot:{...newState.singleSpot}}
            newState.allSpots[action.spot.id] = {...action.spot}
            newState.singleSpot[action.spot.id] = {...action.spot,SpotImages:[...action.spot.SpotImages]}
            return newState
        default:
            return state;
    }
}

export default spotsReducer;
