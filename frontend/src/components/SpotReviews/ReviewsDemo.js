

function ReviewsDemo({spot}){
    const {numReviews,avgStarRating} = spot
    return(
        <div className="spot-ratings">
            <i className="fa-sharp fa-solid fa-star marg-right-5px"></i>
            {numReviews>0?(
                <p>{avgStarRating} · {numReviews} {numReviews>1?'Reviews':'Review'}</p>
            ):(<p>New</p>)}
        </div>
    )
}

export default ReviewsDemo
