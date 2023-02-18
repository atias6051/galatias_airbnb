import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { createSpot, editSpot, getSingleSpot } from '../../store/spots';
import { spotFormValidation } from '../../utils/FormValidations';
import { emptySubmitObject } from '../../utils/generalUtils';
import '../NewSpotForm/NewSpotForm.css'

function EditSpotForm(){
    const user = useSelector(state=>state.session.user)
    // const allSpot = useSelector(state=>state.spots.allSpots)

    const {spotId} = useParams()
    // const storeSpot = useSelector(state=>state.spots.allSpots[spotId])


    const dispatch = useDispatch()
    const history = useHistory()

    // const spot = useSelector(state=>state.spots.singleSpot)
    if(!user) history.push('/')

    useEffect(()=>{
        async function inputsFiller(){
            const spot = await dispatch(getSingleSpot(spotId))
            if(Number(spot.ownerId) !== Number(user.id)){
                return history.push('/')
            }
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
            spot.SpotImages.map(img=>{
                if(img.preview === true){
                    spotFiller.previewImage = img.url
                }else{
                    spotFiller[`image${index}`] = img.url
                    index++
                }
            })
            setSpotObject(spotFiller)
        }

        inputsFiller()

    },[dispatch])




    const [validationErrors, setValidationErros] = useState({})
    const [submitted,setSubmitted] = useState(false)
    const [spotObject,setSpotObject] = useState(emptySubmitObject)

    //Validation errors useEffect
    useEffect(()=>{
        setValidationErros(spotFormValidation(spotObject))
    },[spotObject])

    const handleChange = e =>{
        const changeSpot = {...spotObject,[e.target.name]:e.target.value}
        setSpotObject(changeSpot)
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        setSubmitted(true)
        if(validationErrors.invalid){
            return null;
        }

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
            previewImage: spotObject.previewImage
            ,
            images: {
                image1: spotObject.image1,
                image2: spotObject.image2,
                image3: spotObject.image3,
                image4: spotObject.image4,
            }
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
                    Country {(submitted && validationErrors.country.length)?<p className='form-error'>{validationErrors.country}</p>:(<></>)}
                    </div>
                    <input
                        name="country"
                        className='full-width'
                        type='text'
                        placeholder="Country"
                        value={spotObject.country}
                        onChange={handleChange}
                        />
                </label>
                <label className='block-label'>
                    <div>
                    Street Address {(submitted && validationErrors.address.length)?<p className='form-error'>{validationErrors.address}</p>:(<></>)}
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
                  <span>City</span> {(submitted && validationErrors.city.length)?<p className='form-error'>{validationErrors.city}</p>:(<></>)}
                  <input
                    name="city"
                    type='text'
                    placeholder="City"
                    value={spotObject.city}
                    onChange={handleChange}
                    />
                </label>
                <label>
                  State {(submitted && validationErrors.state.length)?<p className='form-error'>{validationErrors.state}</p>:(<></>)}
                  <input
                    name="state"
                    type='text'
                    placeholder="State"
                    value={spotObject.state}
                    onChange={handleChange}
                    />
                </label>
                </div>

                <label>
                  Latitude {(submitted && validationErrors.lat.length)?<p className='form-error'>{validationErrors.lat}</p>:(<></>)}
                  <input
                    name='lat'
                    type='number'
                    placeholder="Latitude"
                    value={spotObject.lat}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Longitude {(submitted && validationErrors.lng.length)?<p className='form-error'>{validationErrors.lng}</p>:(<></>)}
                  <input
                    name='lng'
                    type='number'
                    placeholder="Longitude"
                    value={spotObject.lng}
                    onChange={handleChange}
                    />
                </label>
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
                {(submitted && validationErrors.description.length)?<p className='form-error'>{validationErrors.description}</p>:(<></>)}
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
                {(submitted && validationErrors.name.length)?<p className='form-error'>{validationErrors.name}</p>:(<></>)}
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
                {(submitted && validationErrors.price.length)?<p className='form-error'>{validationErrors.price}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Liven up your spot with photos</h2>
                    <p>
                    Submit a link to at least one photo to publish your spot
                    </p>
                </div>
                <input className='block-label full-width'
                name='previewImage'
                type="text"
                placeholder='Preview Image URL'
                value={spotObject.previewImage}
                onChange={handleChange}
                />
                {(submitted && validationErrors.previewImage.length)?<p className='form-error'>{validationErrors.previewImage}</p>:(<></>)}
                <input className='block-label full-width'
                name='image1'
                type='text'
                placeholder='Image URL'
                value={spotObject.image1}
                onChange={handleChange}
                />
                {(submitted && validationErrors.image1.length)?<p className='form-error'>{validationErrors.image1}</p>:(<></>)}
                <input className='block-label full-width'
                name="image2"
                type='text'
                placeholder='Image URL'
                value={spotObject.image2}
                onChange={handleChange}
                />
                {(submitted && validationErrors.image2.length)?<p className='form-error'>{validationErrors.image2}</p>:(<></>)}
                <input className='block-label full-width'
                name='image3'
                type='text'
                placeholder='Image URL'
                value={spotObject.image3}
                onChange={handleChange}
                />
                {(submitted && validationErrors.image3.length)?<p className='form-error'>{validationErrors.image3}</p>:(<></>)}
                <input className='block-label full-width'
                name="image4"
                type='text'
                placeholder='Image URL'
                value={spotObject.image4}
                onChange={handleChange}
                />
                {(submitted && validationErrors.image4.length)?<p className='form-error'>{validationErrors.image4}</p>:(<></>)}
                <button type='submit' className='standard-button update-butt' onClick={handleSubmit}>Update your Spot</button>
            </form>

        </section>
    )
}

export default EditSpotForm
