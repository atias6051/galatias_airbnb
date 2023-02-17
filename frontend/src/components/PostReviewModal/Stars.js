import { useEffect, useState } from 'react';
import './PostReviewModal.css'
function Stars(){
    const [starsPicked,setStarsPicked] = useState(0)
    const [starsObj,setStarsObj] = useState({
        [1]:'fa-regular fa-star',
        [2]:'fa-regular fa-star',
        [3]:'fa-regular fa-star',
        [4]:'fa-regular fa-star',
        [5]:'fa-regular fa-star',
    })

    const resetStars = () =>{
        const newStars = {}
        for(let i = 1;i<6;i++){
            if(i<=starsPicked){
                newStars[i] = 'fa-solid fa-star picked'
            }else{
                newStars[i] = 'fa-regular fa-star'
            }
        }
        setStarsObj(newStars)
    }
    const handleHover = e => {
        const newStars = {}
        for(let i = 1;i<6;i++){
            if(i<=e.target.id){
                newStars[i] = 'fa-solid fa-star picked'
            }else{
                newStars[i] = 'fa-regular fa-star'
            }
        }
        setStarsObj(newStars)
    }

    return(
        <div id='stars-container'>
        <i
        id={1}
        className={starsObj[1]+' marg-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        // onMouseOver={(e)=> console.log(e.target.id)}
        ></i>
        <i
        id={2}
        className={starsObj[2]+' marg-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <i
        id={3}
        className={starsObj[3]+' marg-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <i
        id={4}
        className={starsObj[4]+' marg-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <i
        id={5}
        className={starsObj[5]+' marg-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <p>Stars</p>
        </div>
    )
}

export default Stars
