import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import { getSpots } from '../../store/spots';
import './AllSpots.css'
import SpotTile from './SpotTile';

function AllSpots(){
    const spots = useSelector(state=>state.spots.allSpots)
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(()=>{
        dispatch(getSpots())
    },[dispatch])

    return (
        <>
        <h1>Connected</h1>
        <section id='all-spots-section'>

        {spots && Object.values(spots).map(spot=>(
            <SpotTile key={spot.id} spot={spot} />
        ))}
        </section>
        </>
    )
}


export default AllSpots
