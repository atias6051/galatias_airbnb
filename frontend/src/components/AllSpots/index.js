import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';
import './AllSpots.css'
import SpotTile from './SpotTile';
import { useHistory } from 'react-router-dom';

function AllSpots(){
    const spots = useSelector(state=>state.spots.allSpots)
    const dispatch = useDispatch()
    const history = useHistory()
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
            <button id='mapToggle' onClick={()=>history.push('/map')}>Map View</button>
        </section>
    )
}


export default AllSpots
