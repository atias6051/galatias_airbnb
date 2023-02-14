import {Link} from 'react-router-dom'
import './SpotTile.css'
function SpotTile({spot}){
    const path = window.location.href.split('/').pop()

    return(
        <Link className='spot-card' key={spot.id} to={`/spots/${spot.id}`}>
            <img  className="spot-card-prev-image" src={spot.previewImage} alt={spot.name}/>
            <div  className='spot-preview-info'>
                <div>
                    <h3>{spot.city}, {spot.state}</h3>
                    <h3>${spot.price} night</h3>
                </div>
                <span ><i className="fa-sharp fa-solid fa-star"></i> {spot.avgRating>0?spot.avgRating:'New'}</span>
            {path==='current'?(
                <div><button>Delete</button><button>Update</button></div>
            ):(<></>)}
            </div>
        </Link>
    )
}

export default SpotTile
