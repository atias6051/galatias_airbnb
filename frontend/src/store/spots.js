import { csrfFetch } from './csrf';
import thunk from "redux-thunk";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SINGLE = 'spots/LOAD_SINGLE'
// const CREATE_SPOT = 'spots/CREATE_SPOT'
const REMOVE_SPOT = 'spots/REMOVE_SPOT'
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS'

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

const loadUserSpots = spots =>{
    return{
        type: LOAD_USER_SPOTS,
        spots
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

export const createSpot = (submitObj) => async dispatch => {
    const {newSpot,previewImage,images} = submitObj
    //creating new spot
    const res = await csrfFetch('/api/spots',{
        method: 'POST',
        body: JSON.stringify(newSpot)
    })
    const spot = await res.json()

    const spotId = spot.id

    //create preview image
    const prevRes = await csrfFetch(`/api/spots/${spotId}/images`,{
        method: 'POST',
        body: JSON.stringify({
            url: previewImage,
            preview: true
        })
    })

    //adding non-preview images if exists
    if(images.image1.length){
        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: images.image1,
                preview: false
            })
        })
    }
    if(images.image2.length){
        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: images.image2,
                preview: false
            })
        })
    }
    if(images.image3.length){
        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: images.image3,
                preview: false
            })
        })
    }
    if(images.image4.length){
        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: images.image4,
                preview: false
            })
        })
    }
    const finalRes = await csrfFetch(`/api/spots/${spotId}`)
    const singleSpot = await finalRes.json()
    dispatch(loadSingle(singleSpot))
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
            return newState
        case REMOVE_SPOT:
            delete newState.allSpots[action.spotId]
            newState = {...newState, allSpots: {...newState.allSpots}}
            return newState
        case LOAD_USER_SPOTS:
            newState.currentUserSpots = {}
            action.spots.Spots.map(spot=>{
                newState.currentUserSpots[spot.id] = spot
            })
            newState = {...newState,currentUserSpots:{...newState.currentUserSpots}}
            return newState;
        default:
            return state;
    }
}

export default spotsReducer;
