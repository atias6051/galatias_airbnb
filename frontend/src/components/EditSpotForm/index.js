import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { clearSingleSpot, editSpot, getSingleSpot } from '../../store/spots';
import { spotFormValidation } from '../../utils/FormValidations';
import { emptySubmitObject } from '../../utils/generalUtils';
import '../NewSpotForm/NewSpotForm.css'


function EditSpotForm(){
    const {spotId} = useParams()
    const user = useSelector(state=>state.session.user)
    const spot = useSelector(state=>state.spots.singleSpot)

    const dispatch = useDispatch()
    const history = useHistory()

    const [validationErrors, setValidationErros] = useState({})
    const [submitted,setSubmitted] = useState(false)
    const [spotObject,setSpotObject] = useState(emptySubmitObject)
    const [images,setImages] = useState({})

    if(!user) history.push('/')


    useEffect(()=>{
        dispatch(getSingleSpot(spotId))

        return () => dispatch(clearSingleSpot())
    },[dispatch])

    useEffect(()=>{
        if(spot.ownerId && user.id && Number(spot.ownerId) !== Number(user.id)){
            return history.push('/')
        }
    },[spot,user])

    useEffect(()=>{
        if(!spot || !Object.keys(spot).length) return
        const spotFiller = {
            ...spotObject,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: Number(spot.price),
        }
        let index = 1;
        let newImages = {}
        spot.SpotImages.map(img=>{
            if(img.preview === true){
                newImages.previewImage = {og: img.url, curr: img.url, id: img.id}
            }else{
                newImages[`image${index}`] = {og: img.url, curr: img.url, id: img.id}
                index++
            }
        })
        setImages(()=>newImages)
        setSpotObject(()=>({...spotFiller,...newImages}))
    },[spot])

    //Validation errors useEffect
    useEffect(()=>{
        const testObj = {
            ...spotObject,
            previewImage: spotObject.previewImage.curr,
            image1: spotObject.image1?.curr || null,
            image2: spotObject.image2?.curr || null,
            image3: spotObject.image3?.curr || null,
            image4: spotObject.image4?.curr || null
        }
        setValidationErros(spotFormValidation(testObj))
    },[spotObject])

    const handleChange = e =>{
        const changeSpot = {...spotObject,[e.target.name]:e.target.value}
        setSpotObject(changeSpot)
    }
    const handleImgChange = e => {
        const newImages = {...images}
        if(newImages[e.target.name]){
            newImages[e.target.name] = {
                ...newImages[e.target.name],
                curr: e.target.value
            }
            // newImages.changed = newImages[e.target.name].curr !== newImages[e.target.name].og
        }else{
            newImages[e.target.name] = {
                og: null,
                curr: e.target.value,
                id: null
            }
            // newImages.changed = newImages[e.target.name].curr.lenght > 0
        }
        setImages(()=>newImages)
        setSpotObject(()=> ({...spotObject,...newImages}))
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        setSubmitted(true)
        if(validationErrors.invalid) return null

        const submitObj = {
            newSpot: {
                address: spotObject.address,
                city: spotObject.city,
                state: spotObject.state,
                country: spotObject.country,
                lat: spotObject.lat,
                lng: spotObject.lng,
                name: spotObject.name,
                description: spotObject.description,
                price: Number(spotObject.price),
            },
            images
        }
        await dispatch(editSpot(submitObj,spotId))
        await dispatch(getSingleSpot(spotId))
        history.push(`/spots/${spotId}`)
    }
    return(
        <section id="create-spot-section">
            <form id='new-spot-form'>
                <h1>{`Update your Spot`}</h1>
                <div>
                    <h3>Where's your place located?</h3>
                    <p>
                        Guests will only get your exact address once they booked a
                        reservation.
                    </p>
                </div>
                <label className='block-label'>
                    <div>
                    Street Address {(submitted && validationErrors.address)?<p className='form-error'>{validationErrors.address}</p>:(<></>)}
                    </div>
                  <input
                    name="address"
                    className='full-width'
                    type='text'
                    placeholder="Address"
                    value={spotObject.address}
                    onChange={handleChange}
                    />
                </label>

                <div className='block-label'>
                <label>
                  <span>City</span> {(submitted && validationErrors.city)?<p className='form-error'>{validationErrors.city}</p>:(<></>)}
                  <input
                    name="city"
                    type='text'
                    placeholder="City"
                    value={spotObject.city}
                    onChange={handleChange}
                    />
                </label>
                <label>
                  State {(submitted && validationErrors.state)?<p className='form-error'>{validationErrors.state}</p>:(<></>)}
                  <input
                    name="state"
                    type='text'
                    placeholder="State"
                    value={spotObject.state}
                    onChange={handleChange}
                    />
                </label>
                </div>
                <div className='top-border'>
                    <h2>Describe your place to guests</h2>
                    <p>
                    Mention the best features of your space, any special amentities like
                    fast wif or parking, and what you love about the neighborhood.
                    </p>
                <textarea
                name="description"
                className='full-width'
                rows='5'
                placeholder="Description"
                value={spotObject.description}
                onChange={handleChange}
                />
                </div>
                {(submitted && validationErrors.description)?<p className='form-error'>{validationErrors.description}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Create a title for your spot</h2>
                    <p>
                    Catch guests' attention with a spot title that highlights what makes
                    your place special.
                    </p>
                </div>
                <input
                name="name"
                className='full-width'
                type="text"
                placeholder='Name your spot'
                value={spotObject.name}
                onChange={handleChange}
                />
                {(submitted && validationErrors.name)?<p className='form-error'>{validationErrors.name}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Set a base price for your spot</h2>
                    <p>
                    Competitive pricing can help your listing stand out and rank higher
                    in search results.
                    </p>
                </div>
                <span>$<input name="price" className='width98' type="text" placeholder='Price per night (USD)'
                value={spotObject.price}
                onChange={handleChange}
                /></span>
                {(submitted && validationErrors.price)?<p className='form-error'>{validationErrors.price}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Update you photos</h2>
                </div>

                <input className='block-label full-width'
                name='previewImage'
                type="text"
                placeholder='Preview Image URL'
                value={spotObject.previewImage?.curr}
                onChange={handleImgChange}
                />
                {(submitted && validationErrors.previewImage)?<p className='form-error'>{validationErrors.previewImage}</p>:(<></>)}
                <input className='block-label full-width'
                name='image1'
                type='text'
                placeholder='Image URL'
                value={spotObject.image1?.curr}
                onChange={handleImgChange}
                />
                {(submitted && validationErrors.image1)?<p className='form-error'>{validationErrors.image1}</p>:(<></>)}
                <input className='block-label full-width'
                name="image2"
                type='text'
                placeholder='Image URL'
                value={spotObject.image2?.curr}
                onChange={handleImgChange}
                />
                {(submitted && validationErrors.image2)?<p className='form-error'>{validationErrors.image2}</p>:(<></>)}
                <input className='block-label full-width'
                name='image3'
                type='text'
                placeholder='Image URL'
                value={spotObject.image3?.curr}
                onChange={handleImgChange}
                />
                {(submitted && validationErrors.image3)?<p className='form-error'>{validationErrors.image3}</p>:(<></>)}
                <input className='block-label full-width'
                name="image4"
                type='text'
                placeholder='Image URL'
                value={spotObject.image4?.curr}
                onChange={handleImgChange}
                />
                {(submitted && validationErrors.image4)?<p className='form-error'>{validationErrors.image4}</p>:(<></>)}
                <button type='submit' className='standard-button update-butt' onClick={handleSubmit}>Update your Spot</button>
            </form>

        </section>
    )
}

export default EditSpotForm
