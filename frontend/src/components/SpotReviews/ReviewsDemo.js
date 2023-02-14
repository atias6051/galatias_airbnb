

function ReviewsDemo({spot}){
    const {numReviews,avgStarRating} = spot
    return(
        <div className="spot-ratings">
            <i className="fa-sharp fa-solid fa-star"></i>
            {numReviews>0?(
                <p>{avgStarRating} · {numReviews} {numReviews>1?'Reviews':'Review'}</p>
            ):(<p>New</p>)}
        </div>
    )
}

export default ReviewsDemo
