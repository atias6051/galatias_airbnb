import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import './Spots.css'

function Spots(){
// export default function Spots(){
    const dispatch = useDispatch()
    const spots = useSelector(state=>state.spots.Spots)

    useEffect(()=>{
        dispatch(getSpots())
        // console.log(spots)
    },[dispatch])

    console.log("spots,",spots)
    return (
        <>
            <h2>Spots</h2>
            <div className='grid-container'>
                {spots && spots.map(spot=>(
                    <div className='spot-card'>
                    <img src={spot.previewImage} className='spot-image'/>
                    <h3>{spot.name}</h3>
                    <h3>{spot.address}</h3>
                    </div>
                ))}
            </div>

        </>
    )
}
