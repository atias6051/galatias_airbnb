import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import { spotFormValidation } from '../../utils/FormValidations';
import { useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete, {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import './NewSpotForm.css'
const libraries = ['places']
function NewSpotForm(){

    const user = useSelector(state=>state.session.user)
    if(!user) history.push('/')
    const {spotId} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()


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
    const [images,setImages] = useState({})

    const [validationErrors, setValidationErros] = useState({})
    const [submitted,setSubmitted] = useState(false)

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
        libraries:libraries
    });
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
    },[country,address,city,state,lat,lng,description,name,price,previewImage,images])

    const handleSelect = async address => {
        setAddress(()=>address)
        const results = await geocodeByAddress(address)
        const latlng = await getLatLng(results[0])
        const addressArr = results[0].formatted_address.split(',').map(el=>el.trim())
        setAddress(()=>addressArr[0])
        setCity(()=>addressArr[1])
        setState(()=>addressArr[2].split(' ')[0])
        setCountry(()=>addressArr[3])
        setLat(()=>latlng.lat)
        setLng(()=>latlng.lng)
    };

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
            images:{
                preview: previewImage,
                others: [image1,image2,image3,image4]
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
        setImages({})
        setPreviewImage("");
        setImage1("");
        setImage2("");
        setImage3("");
        setImage4("");

        history.push(`/spots/${newId}`)
    }
    if(!isLoaded) return (<div>Loading...</div>)
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

                <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                    >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <label className='autocomplete-label'>
                        <div>
                            Street Address {(submitted && validationErrors.address)?<p className='form-error'>{validationErrors.address}</p>:(<></>)}
                        </div>
                        <input
                          {...getInputProps({
                              placeholder: 'Address',
                              className: 'location-search-input',
                            })}
                            />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {!loading && suggestions.map((suggestion,i) => {
                              const className = 'suggestion-item'
                              return (
                                  <div key={i} className='auto-dropdown'
                                  {...getSuggestionItemProps(suggestion, {
                                      className,
                                      //   style,
                                    })}
                                    >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                        })}
                        </div>

                    </label>
                    )}
                </PlacesAutocomplete>

                <label>
                  <span>City</span> {(submitted && validationErrors.city)?<p className='form-error'>{validationErrors.city}</p>:(<></>)}
                  <input
                    name="city"
                    type='text'
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <label>
                  State {(submitted && validationErrors.state)?<p className='form-error'>{validationErrors.state}</p>:(<></>)}
                  <input
                    name="state"
                    type='text'
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <label>
                    <div>
                    Country {(submitted && validationErrors.country)?<p className='form-error'>{validationErrors.country}</p>:(<></>)}
                    </div>
                    <input
                        name="country"
                        type='text'
                        placeholder="Country"
                        value={country}
                        onChange={(e)=> setCountry(e.target.value)}
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
                rows='10'
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                </div>
                {(submitted && validationErrors.description)?<p className='form-error'>{validationErrors.description}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Create a title for your spot</h2>
                    <p>
                    Catch guests' attention with a spot title that highlights what makes
                    your place special.
                    </p>
                <input
                name="name"
                className='full-width'
                type="text"
                placeholder='Name your spot'
                value={name}
                onChange={e=> setName(e.target.value)}
                />
                </div>
                {(submitted && validationErrors.name)?<p className='form-error'>{validationErrors.name}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Set a base price for your spot</h2>
                    <p>
                    Competitive pricing can help your listing stand out and rank higher
                    in search results.
                    </p>
                </div>
                <div >$<input name="price" className='width98'  type="text" placeholder='Price per night (USD)'
                value={price}
                onChange={e=>setPrice(e.target.value)}
                /></div>
                {(submitted && validationErrors.price)?<p className='form-error'>{validationErrors.price}</p>:(<></>)}
                <div className='top-border'>
                    <h2>Liven up your spot with photos</h2>
                    <p>
                    Choose Preview Image
                    </p>
                </div>

                <input className='block-label full-width'
                name='previewImage'
                type="text"
                placeholder='Preview Image URL'
                value={previewImage}
                onChange={e=>setPreviewImage(e.target.value)}
                />
                {(submitted && validationErrors.previewImage)?<p className='form-error'>{validationErrors.previewImage}</p>:(<></>)}
                <input className='block-label full-width'
                name='image1'
                type='text'
                placeholder='Image URL'
                value={image1}
                onChange={e=>setImage1(e.target.value)}
                />
                {(submitted && validationErrors.image1)?<p className='form-error'>{validationErrors.image1}</p>:(<></>)}
                <input className='block-label full-width'
                name="image2"
                type='text'
                placeholder='Image URL'
                value={image2}
                onChange={e => setImage2(e.target.value)}
                />
                {(submitted && validationErrors.image2)?<p className='form-error'>{validationErrors.image2}</p>:(<></>)}
                <input className='block-label full-width'
                name='image3'
                type='text'
                placeholder='Image URL'
                value={image3}
                onChange={e => setImage3(e.target.value)}
                />
                {(submitted && validationErrors.image3)?<p className='form-error'>{validationErrors.image3}</p>:(<></>)}
                <input className='block-label full-width'
                name="image4"
                type='text'
                placeholder='Image URL'
                value={image4}
                onChange={e => setImage4(e.target.value)}
                />
                {(submitted && validationErrors.image4)?<p className='form-error'>{validationErrors.image4}</p>:(<></>)}
                <button type='submit' className='standard-button form-butt' onClick={handleSubmit}>Create</button>
            </form>
        </section>
    )
}

export default NewSpotForm
