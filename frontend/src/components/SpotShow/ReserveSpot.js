
function ReserveSpot({spot}){
    return (
        <div className="spot-reserve-div">
            <div className="spot-price-stars">
                <h3>${spot.price} night</h3>
                {/* <span><i className="fa-regular fa-star"></i>{spot.avgStarRating} · {spot.numReviews} reviews</span> */}
            </div>
            <button>Reserve</button>
        </div>
    )
}

export default ReserveSpot
