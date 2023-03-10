import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
// import { Link } from "react-router-dom"
import { getUserSpots } from "../../store/spots"
import SpotTile from "../AllSpots/SpotTile"
import { deleteSpot, getSingleSpot} from '../../store/spots';
import OpenModalButton from "../OpenModalButton"
import DeleteSpotModal from "../DeleteSpotModal"

function CurrentUserSpots(){
    const spots = useSelector(state=>state.spots.currentUserSpots)
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(()=>{
        dispatch(getUserSpots())

        //add clear userSpots())
    },[dispatch])

    // const handleDelete = (spotId) =>{
    //     dispatch(deleteSpot(spotId))
    // }
    // if(Object.values(spots).length === 0 ) return null
    return (
        <section className="main-container">
        <h1 className='title-h1'>Manage Spots</h1>
        <section id='all-spot-flex'>
        <section id='all-spots-section'>
        {spots && Object.values(spots).map(spot=>(
            <SpotTile key={spot.id} spot={spot} />
        ))}

        </section>
        </section>
        </section>
    )
}

export default CurrentUserSpots
