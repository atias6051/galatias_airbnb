import { csrfFetch } from './csrf';
const LOAD_SPOTS = 'spots/LOAD_SPOTS'


const loadSpots = spots => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

export const getSpots = () => async dispatch =>{
    const res = await csrfFetch('/api/spots')
    const spots = await res.json()
    dispatch(loadSpots(spots))
}




const spotsReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
      case LOAD_SPOTS:
        newState = {...action.spots}
        return newState;
      default:
        return state;
    }
};

export default spotsReducer
