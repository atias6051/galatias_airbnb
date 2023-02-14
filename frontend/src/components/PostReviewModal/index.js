import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal"
import { postReview } from '../../store/reviews';
import { getSingleSpot } from '../../store/spots';
import './PostReviewModal.css'

function PostReviewModal(){
    const spot = useSelector(state=>state.spots.singleSpot)
    const dispatch = useDispatch()
    const history = useHistory()
    const { closeModal } = useModal()

    const [description,setDescription] = useState('')
    const [starsPicked,setStarsPicked] = useState(0)
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [starsObj,setStarsObj] = useState({
        [1]:'fa-regular fa-star',
        [2]:'fa-regular fa-star',
        [3]:'fa-regular fa-star',
        [4]:'fa-regular fa-star',
        [5]:'fa-regular fa-star',
    })


    useEffect(()=>{
        if(starsPicked>0 && description.length>=10) setEnableSubmit(false)
        else setEnableSubmit(true)
    },[starsPicked,description])

    const handleSubmit = async e =>{
        e.preventDefault()
        const submitObj = {
            review: description,
            stars: starsPicked
        }

        await dispatch(postReview(submitObj,spot.id))
        await dispatch(getSingleSpot(spot.id))
        closeModal()
    }
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
        <div id="new-review-modal">
            <h2>How was your stay?</h2>
            <textarea
            rows={8}
            cols={25}
            value={description}
            onChange={(e=> setDescription(e.target.value))}
            placeholder='Leave your review here...'
            />
            {/* <Stars /> */}
        <div id='stars-container'>
        <i
        id={1}
        className={starsObj[1]+' padd-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        // onMouseOver={(e)=> console.log(e.target.id)}
        ></i>
        <i
        id={2}
        className={starsObj[2]+' padd-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <i
        id={3}
        className={starsObj[3]+' padd-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <i
        id={4}
        className={starsObj[4]+' padd-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <i
        id={5}
        className={starsObj[5]+' padd-right-5px'}
        onMouseOver={handleHover}
        onMouseOut={resetStars}
        onClick={e=>setStarsPicked(e.target.id)}
        ></i>
        <p>Stars</p>
        </div>
        <button
        disabled={enableSubmit}
        onClick={handleSubmit}
        id='submit-review-button'>
            Submit Your Review
        </button>
        </div>
    )
}

export default PostReviewModal
