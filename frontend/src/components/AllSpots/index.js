import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';
import './AllSpots.css'
import SpotTile from './SpotTile';

function AllSpots(){
    const spots = useSelector(state=>state.spots.allSpots)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getSpots())
    },[dispatch])

    return (
        <section id='all-spot-flex'>
        <section id='all-spots-section'>

        {spots && Object.values(spots).map(spot=>(
            <SpotTile key={spot.id} spot={spot} />
        ))}
        </section>
        </section>
    )
}


export default AllSpots
