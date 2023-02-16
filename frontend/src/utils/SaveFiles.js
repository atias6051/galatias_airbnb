import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { createSpot, getSingleSpot } from '../../store/spots';
import { spotFormValidation } from '../../utils/FormValidations';
import './NewSpotForm.css'

function NewSpotForm(){

    const user = useSelector(state=>state.session.user)
    if(!user) history.push('/')
    const {spotId} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()


    // if(spotId) console.log("spotId",spotId)
    // if(!spotId) console.log("no spot id!")


    //input fields states
    const [country,setCountry] = useState("")
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");

    const [validationErrors, setValidationErros] = useState({})
    const [submitted,setSubmitted] = useState(false)

    // console.log("%$#%$%",spot)

//Validation errors useEffect
    useEffect(()=>{
        const spot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            previewImage,
            image1,
            image2,
            image3,
            image4
        }
        setValidationErros(spotFormValidation(spot))
    },[country,address,city,state,lat,lng,description,name,price,previewImage,image1,image2,image3,image4])


    const handleSubmit = async e =>{
        e.preventDefault()
        setSubmitted(true)
        if(validationErrors.invalid) return null;

        const submitObj = {
            newSpot: {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            },
            previewImage
            ,
            images: {
                image1,
                image2,
                image3,
                image4
            }
        }

        const newId = await dispatch(createSpot(submitObj))

        setCountry("");
        setAddress("");
        setCity("");
        setState("");
        setLat("");
        setLng("");
        setDescription("");
        setName("");
        setPrice("");
        setPreviewImage("");
        setImage1("");
        setImage2("");
        setImage3("");
        setImage4("");

        history.push(`/spots/${newId}`)
    }

    return(
        <section id="create-spot-section">
            <form id='new-spot-form'>
                <h1>Create a New Spot</h1>
                <div>
                    <h3>Where's your place located?</h3>
                    <p>
                        Guests will only get your exact address once they booked a
                        reservation.
                    </p>
                </div>
                <label>
                    <div>
                    Country {(submitted && validationErrors.country.length)?<p className='form-error'>{validationErrors.country}</p>:(<></>)}
                    </div>
                    <input
                        name="country"
                        type='text'
                        placeholder="Country"
                        value={country}
                        onChange={(e)=> setCountry(e.target.value)}
                        />
                </label>
                <label>
                    <div>
                    Street Address {(submitted && validationErrors.address.length)?<p className='form-error'>{validationErrors.address}</p>:(<></>)}
                    </div>
                  <input
                    name="address"
                    type='text'
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <label>
                  <span>City</span> {(submitted && validationErrors.city.length)?<p className='form-error'>{validationErrors.city}</p>:(<></>)}
                  <input
                    className='half-width'
                    name="city"
                    type='text'
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />,
                </label>
                <label>
                  State {(submitted && validationErrors.state.length)?<p className='form-error'>{validationErrors.state}</p>:(<></>)}
                  <input
                    className='half-width'
                    name="state"
                    type='text'
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                </label>
                {/* <div className='inline-block'>
                <label>
                  <span>City</span> {(submitted && validationErrors.city.length)?<p className='form-error'>{validationErrors.city}</p>:(<></>)}
                  <input
                    className='half-width'
                    name="city"
                    type='text'
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />,
                </label>
                <label>
                  State {(submitted && validationErrors.state.length)?<p className='form-error'>{validationErrors.state}</p>:(<></>)}
                  <input
                    className='half-width'
                    name="state"
                    type='text'
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                </label>
                </div> */}
                <label>
                  Latitude
                  <input
                    name='lat'
                    type='text'
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </label>,
                <label>
                  Longitude
                  <input
                    name='lng'
                    type='text'
                    placeholder="Longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    />
                </label>
                <div>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                </div>
                {(submitted && validationErrors.description.length)?<p className='form-error'>{validationErrors.description}</p>:(<></>)}
                <div>
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
                value={name}
                onChange={e=> setName(e.target.value)}
                />
                {(submitted && validationErrors.name.length)?<p className='form-error'>{validationErrors.name}</p>:(<></>)}
                <div>
                    <h2>Set a base price for your spot</h2>
                    <p>
                    Competitive pricing can help your listing stand out and rank higher
                    in search results.
                    </p>
                </div>
                <span>$<input name="price" type="text" placeholder='Price per night (USD)'
                value={price}
                onChange={e=>setPrice(e.target.value)}
                /></span>
                {(submitted && validationErrors.price.length)?<p className='form-error'>{validationErrors.price}</p>:(<></>)}
                <div>
                    <h2>Liven up your spot with photos</h2>
                    <p>
                    Submit a link to at least one photo to publish your spot
                    </p>
                </div>
                <input className='block-label full-width'
                name='previewImage'
                type="text"
                placeholder='Preview Image URL'
                value={previewImage}
                onChange={e=>setPreviewImage(e.target.value)}
                />
                {(submitted && validationErrors.previewImage.length)?<p className='form-error'>{validationErrors.previewImage}</p>:(<></>)}
                <input className='block-label full-width'
                name='image1'
                type='text'
                placeholder='Image URL'
                value={image1}
                onChange={e=>setImage1(e.target.value)}
                />
                {(submitted && validationErrors.image1.length)?<p className='form-error'>{validationErrors.image1}</p>:(<></>)}
                <input className='block-label full-width'
                name="image2"
                type='text'
                placeholder='Image URL'
                value={image2}
                onChange={e => setImage2(e.target.value)}
                />
                {(submitted && validationErrors.image2.length)?<p className='form-error'>{validationErrors.image2}</p>:(<></>)}
                <input className='block-label full-width'
                name='image3'
                type='text'
                placeholder='Image URL'
                value={image3}
                onChange={e => setImage3(e.target.value)}
                />
                {(submitted && validationErrors.image3.length)?<p className='form-error'>{validationErrors.image3}</p>:(<></>)}
                <input className='block-label full-width'
                name="image4"
                type='text'
                placeholder='Image URL'
                value={image4}
                onChange={e => setImage4(e.target.value)}
                />
                {(submitted && validationErrors.image4.length)?<p className='form-error'>{validationErrors.image4}</p>:(<></>)}
                <button type='submit' className='standard-button' onClick={handleSubmit}>Create</button>
            </form>

        </section>
    )
}

// export default NewSpotForm

/////////////////////////////

function FormTest(){
    return(
        <section id='spot-form-section'>
        <div id='spot-form-container'>
            <h2>Update your Spot</h2>
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation</p>
            {/* <form className='spot-form' onSubmit={handleSubmit}> */}
            <form className='spot-form' >
                <div id='spot-form-area-1'>
                    {/* country */}
                    <label>
                        Country
                    <input
                        name='country'
                        type="text"
                        // value={spotStateObject.country}
                        // onChange={handleChange}
                        required
                        placeholder="Country"
                    />
                    </label>
                    {/* Street address */}
                    <label>
                        Street Address
                    <input
                        name='address'
                        type="text"
                        // value={spotStateObject.address}
                        // onChange={handleChange}
                        required
                        placeholder="Address"
                    />
                    </label>
                </div>
                <div id='spot-form-area-2'>
                    {/* City */}
                    <label id='city'>
                        City
                    <input
                        type="text"
                        // value={spotStateObject.city}
                        // onChange={handleChange}
                        required
                        placeholder="City"
                    />
                    </label>
                    <div class='comma'>,</div>
                    {/* State */}
                    <label id='state'>
                        State
                    <input
                        type="text"
                        // value={spotStateObject.state}
                        // onChange={handleChange}
                        required
                        placeholder="State"
                    />
                    </label>
                </div>
                <div id='spot-form-area-3'>
                    {/* Latitude */}
                    <label id='Latitude'>
                        Latitude
                    <input
                        type="number"
                        // value={spotStateObject.latitude}
                        // onChange={handleChange}
                        required
                        placeholder="Latitude"
                    />
                    </label>
                    <div class='comma'>,</div>
                    {/* Longitude */}
                    <label id='Longitude'>
                        Longitude
                    <input
                        type="number"
                        // value={spotStateObject.longitude}
                        // onChange={handleChange}
                        required
                        placeholder="Longitude"
                    />
                    </label>
                </div>
                {/* Description */}
                <div id='description'>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amentities like
                        fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea
                        type="text"
                        // value={spotStateObject.description}
                        // onChange={handleChange}
                        required
                        placeholder='Please write at least 30 characters'
                    >
                    </textarea>
                </div>
                {/* name */}
                <div id='title'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <label>
                        Name
                    <input
                        type="text"
                        // value={spotStateObject.name}
                        // onChange={handleChange}
                        required
                        placeholder="Name of your spot"
                    />
                    </label>
                </div>
                {/* price */}
                <div id='price'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label>
                        $
                    <input
                        type="text"
                        // value={spotStateObject.price}
                        // onChange={handleChange}
                        required
                        placeholder='Price per night (USD)'
                    />
                    </label>
                </div>
                <div id='submit-container'>
                    <button type="submit" id='button'>Create Spot</button>
                </div>
            </form>
        </div>
    </section>
    )
}

export default FormTest