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
    },[dispatch])

    const handleDelete = (spotId) =>{
        dispatch(deleteSpot(spotId))
    }
    // if(Object.values(spots).length === 0 ) return null
    return (
        <>
        <h1>Manage you spots</h1>
        <section id='all-spot-flex'>
        <section id='all-spots-section'>
        {spots && Object.values(spots).map(spot=>(
            <>
            <SpotTile key={spot.id} spot={spot} />
            <div key={spot.id*10}>
            <button onClick={()=>handleDelete(spot.id)}>Delete</button>
            <OpenModalButton
                buttonText="deleteModal"
                modalComponent={<DeleteSpotModal spotId={spot.id}/>}
            />
            <button onClick={()=> history.push(`/spots/${spot.id}/edit`)}>Update</button>
            </div>
            </>
            ))}

        </section>
        </section>
        </>
    )
}

export default CurrentUserSpots
