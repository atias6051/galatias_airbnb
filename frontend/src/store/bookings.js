import { csrfFetch } from './csrf';

const LOAD_USER_BOOKINGS = 'bookings/LOAD_USER_BOOKINGS'
const LOAD_SPOT_BOOKINGS = 'bookings/LOAD_SPOT_BOOKINGS'

const loadUserBookings = bookings =>{
    return{
        type: LOAD_USER_BOOKINGS,
        bookings
    }
}

const loadSpotBookings = bookings =>{
    return{
        type: LOAD_SPOT_BOOKINGS,
        bookings
    }
}

export const getUserBooking = userId => async dispatch =>{
    const res = await csrfFetch()
    const bookings = await res.json()
    dispatch(loadUserBookings(bookings))
}
export const getSpotBooking = userId => async dispatch =>{
    const res = await csrfFetch()
    const bookings = await res.json()
    dispatch(loadSpotBookings(bookings))

}
const initialState = {
    user:{},
    spot:{}
}
const bookingsReducer = (state=initialState,action) => {
    let newState = {...state}
    switch(action.type){
        default:
            return state
    }
}

export default bookingsReducer
