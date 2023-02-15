import ReviewsDemo from '../SpotReviews/ReviewsDemo'
import './ReserveSpot.css'
function ReserveSpot({spot}){
    return (
        <div className="reserve-spot-main-container">
            <div className="price-and-stars">
                <h3>${spot.price} night</h3>
                <ReviewsDemo spot={spot}/>
            </div>
            <button onClick={()=> alert("Feature coming soon!")} className='reserve-button'>Reserve</button>
        </div>
    )
}

export default ReserveSpot
