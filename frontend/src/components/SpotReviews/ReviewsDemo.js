import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSingleSpot } from "../../store/spots"


function ReviewsDemo({spot}){
    const {numReviews,avgStarRating} = spot
    const spott = useSelector(state=>state.singleSpot)

    return(
        <div className="spot-ratings">
            <i className="fa-sharp fa-solid fa-star marg-right-5px"></i>
            {numReviews>0?(
                <p>{spot?.avgStarRating} · {spot?.numReviews} {numReviews>1?'Reviews':'Review'}</p>
            ):(<p>New</p>)}
        </div>
    )
}

export default ReviewsDemo
