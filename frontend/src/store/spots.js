import { csrfFetch } from './csrf';
import thunk from "redux-thunk";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SINGLE = 'spots/LOAD_SINGLE'
// const CREATE_SPOT = 'spots/CREATE_SPOT'
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

// export const uploadImage

export const createSpot = (submitObj) => async dispatch => {
    const {newSpot, images} = submitObj
    //creating new spot
    const res = await csrfFetch('/api/spots',{
        method: 'POST',
        body: JSON.stringify(newSpot)
    })
    const spot = await res.json()

    const spotId = spot.id

    //create preview image
    let {url} = await csrfFetch('/api/spots/s3url').then(res=>res.json())
    await csrfFetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: images.prev,
    })

    const prevRes = await csrfFetch(`/api/spots/${spotId}/images`,{
        method: 'POST',
        body: JSON.stringify({
            url: url.split('?')[0],
            preview: true
        })
    })

    if(images.one){
        let {url} = await csrfFetch('/api/spots/s3url').then(res=>res.json())
        await csrfFetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: images.one,
        })

        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: url.split('?')[0],
                preview: false
            })
        })
    }
    if(images.two){
        let {url} = await csrfFetch('/api/spots/s3url').then(res=>res.json())
        await csrfFetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: images.two,
        })

        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: url.split('?')[0],
                preview: false
            })
        })
    }
    if(images.three){
        let {url} = await csrfFetch('/api/spots/s3url').then(res=>res.json())
        await csrfFetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: images.three,
        })

        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: url.split('?')[0],
                preview: false
            })
        })
    }
    if(images.four){
        let {url} = await csrfFetch('/api/spots/s3url').then(res=>res.json())
        await csrfFetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: images.four,
        })

        await csrfFetch(`/api/spots/${spotId}/images`,{
            method: 'POST',
            body: JSON.stringify({
                url: url.split('?')[0],
                preview: false
            })
        })
    }
    // if(images.image2.length){
    //     await csrfFetch(`/api/spots/${spotId}/images`,{
    //         method: 'POST',
    //         body: JSON.stringify({
    //             url: images.image2,
    //             preview: false
    //         })
    //     })
    // }
    // if(images.image3.length){
    //     await csrfFetch(`/api/spots/${spotId}/images`,{
    //         method: 'POST',
    //         body: JSON.stringify({
    //             url: images.image3,
    //             preview: false
    //         })
    //     })
    // }
    // if(images.image4.length){
    //     await csrfFetch(`/api/spots/${spotId}/images`,{
    //         method: 'POST',
    //         body: JSON.stringify({
    //             url: images.image4,
    //             preview: false
    //         })
    //     })
    // }
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
    const {newSpot,previewImage,images} = submitObj
    const res = await csrfFetch(`/api/spots/${spotId}`,{
        method: 'PUT',
        body: JSON.stringify(newSpot)
    })
    const updatedSpotRes = await csrfFetch(`/api/spots/${spotId}`)
    const updatedSpot = await updatedSpotRes.json()

    const {SpotImages} = updatedSpot;
    for(let img of SpotImages){
        await csrfFetch(`/api/spot-images/${img.id}`,{method:'DELETE'})
    }
    const prevRes = await csrfFetch(`/api/spots/${spotId}/images`,{
        method: 'POST',
        body: JSON.stringify({
            url: previewImage,
            preview: true
        })
    })

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
