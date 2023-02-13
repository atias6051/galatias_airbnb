import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserSpots } from "../../store/spots"
import SpotTile from "../AllSpots/SpotTile"

function CurrentUserSpots(){
    const spots = useSelector(state=>state.spots.currentUserSpots)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getUserSpots())
    },[dispatch])
    // if(Object.values(spots).length === 0 ) return null
    return (
        <>
        <h1>Manage you spots</h1>
        <section id='all-spot-flex'>
        <section id='all-spots-section'>
        {spots && Object.values(spots).map(spot=>(
            <SpotTile key={spot.id} spot={spot} />
            ))}
            {/* <div>
                <button>Update</button>
                <button>Delete</button>
            </div> */}
        </section>
        </section>
        </>
    )
}

export default CurrentUserSpots
