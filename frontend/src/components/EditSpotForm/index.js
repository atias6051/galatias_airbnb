import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { clearSingleSpot, createSpot, editSpot, getSingleSpot } from '../../store/spots';
import { spotFormValidation } from '../../utils/FormValidations';
import { emptySubmitObject } from '../../utils/generalUtils';
import '../NewSpotForm/NewSpotForm.css'
import { useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete, {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
const libraries = ['places']

function EditSpotForm(){
    const user = useSelector(state=>state.session.user)
    // const allSpot = useSelector(state=>state.spots.allSpots)

    const {spotId} = useParams()
    // const storeSpot = useSelector(state=>state.spots.allSpots[spotId])


    const dispatch = useDispatch()
    const history = useHistory()
    const spot = useSelector(state=>state.spots.singleSpot)

    const [validationErrors, setValidationErros] = useState({})
    const [submitted,setSubmitted] = useState(false)
    const [spotObject,setSpotObject] = useState(emptySubmitObject)
    const [address, setAddress] = useState("");
    const [images,setImages] = useState({changed:false})

    if(!user) history.push('/')

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
        libraries:libraries
    });

    useEffect(()=>{
        dispatch(getSingleSpot(spotId))

        return () => dispatch(clearSingleSpot())
    },[dispatch])

    useEffect(()=>{
        if(!spot) return
        // if(spot.id !== spotId) return
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
            images: {}
        }
        let index = 1;
        let newImages = {changed:false}
        spot.SpotImages.map(img=>{
            if(img.preview === true){
                newImages.prev = {og: img.url, curr: img.url, id: img.id}
                spotFiller.images.prev = {og: img.url, curr: img.url, id: img.id}
            }else{
                newImages[`image${index}`] = {og: img.url, curr: img.url, id: img.id}
                spotFiller.images[`image${index}`] = img.url
                index++
            }
        })
        spotFiller.images = newImages
        setImages(()=>newImages)
        setSpotObject(()=>spotFiller)
        // console.log("NEW IMAGES -----",newImages)
    },[spot])

    // useEffect(()=>{
    //     async function inputsFiller(){
    //         const spot = await dispatch(getSingleSpot(spotId))
    //         if(Number(spot.ownerId) !== Number(user.id)){
    //             return history.push('/')
    //         }
    //         const spotFiller = {
    //             ...spotObject,
    //             address: spot.address,
    //             city: spot.city,
    //             state: spot.state,
    //             country: spot.country,
    //             lat: spot.lat,
    //             lng: spot.lng,
    //             name: spot.name,
    //             description: spot.description,
    //             price: Number(spot.price),
    //         }
    //         let index = 1;
    //         spot.SpotImages.map(img=>{
    //             if(img.preview === true){
    //                 spotFiller.previewImage = img.url
    //             }else{
    //                 spotFiller[`image${index}`] = img.url
    //                 index++
    //             }
    //         })
    //         setSpotObject(spotFiller)
    //     }

    //     inputsFiller()

    // },[dispatch])






    //Validation errors useEffect
    useEffect(()=>{
        setValidationErros(spotFormValidation(spotObject))
    },[spotObject])

    const handleChange = e =>{
        const changeSpot = {...spotObject,[e.target.name]:e.target.value}
        setSpotObject(changeSpot)
    }

    const handleSelect = async address => {
        // setAddress(()=>address) //CHECK IF BUGGIE
        const results = await geocodeByAddress(address)
        const latlng = await getLatLng(results[0])
        const addressArr = results[0].formatted_address.split(',').map(el=>el.trim())
        let newObj = {
            ...spotObject,
            address: addressArr[0],
            city: addressArr[1],
            state: addressArr[2].split(' ')[0],
            country: addressArr[3],
            lat: latlng.lat,
            lng: latlng.lng
        }
        setSpotObject(()=> newObj)
        // setAddress(()=>addressArr[0])
        // setCity(()=>addressArr[1])
        // setState(()=>addressArr[2].split(' ')[0])
        // setCountry(()=>addressArr[3])
        // setLat(()=>latlng.lat)
        // setLng(()=>latlng.lng)
    };

    const updateFiles = e =>{
        let temp = images[e.target.name]
        const newObj = {
            ...images,
            changed: true,
            [e.target.name]: {...temp,curr: e.target.files[0]}
        }
        setSpotObject(()=>({...spotObject,images:newObj}))
        setImages(()=>newObj)
    }

    useEffect(()=>{
        console.log(images)
        console.log(spotObject)
    },[images])

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
            images
            // previewImage: spotObject.previewImage
            // ,
            // images: {
            //     image1: spotObject.image1,
            //     image2: spotObject.image2,
            //     image3: spotObject.image3,
            //     image4: spotObject.image4,
            // }
        }
        await dispatch(editSpot(submitObj,spotId))
        await dispatch(getSingleSpot(spotId))
        history.push(`/spots/${spotId}`)
    }
    if(!isLoaded) return (<div>Loading...</div>)
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
                <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                    >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <label className='autocomplete-label'>
                        <div>
                            Street Address {(submitted && validationErrors.address.length)?<p className='form-error'>{validationErrors.address}</p>:(<></>)}
                        </div>
                        <input
                          {...getInputProps({
                              placeholder: 'Address',
                              className: 'location-search-input',
                            })}
                            />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {!loading && suggestions.map(suggestion => {
                              const className = 'suggestion-item'
                            //   const className = suggestion.active
                            //   ? 'suggestion-item--active'
                            //   : 'suggestion-item';
                              // inline style for demonstration purpose
                              //   const style = suggestion.active
                              //   ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                              //   : { backgroundColor: '#ffffff', cursor: 'pointer' };
                              return (
                                  <div className='auto-dropdown'
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

                {/* <label>
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
                </label> */}
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
                    <h2>Update you photos</h2>
                    {/* <p>
                    Submit a link to at least one photo to publish your spot
                    </p> */}
                </div>
                <label>Update Preview Image</label>
                <input className='block-label full-width file-input-button'
                name="prev" type="file" accept="image/*" onChange={updateFiles}
                />
                <label>Update Image 1</label>
                <input className='block-label full-width file-input-button'
                name="image1" type="file" accept="image/*" onChange={updateFiles}
                />
                <label>Update Image 2</label>
                <input className='block-label full-width file-input-button'
                name="image2" type="file" accept="image/*" onChange={updateFiles}
                />
                <label>Update Image 3</label>
                <input className='block-label full-width file-input-button'
                name="image3" type="file" accept="image/*" onChange={updateFiles}
                />
                <label>Update Image 4</label>
                <input className='block-label full-width file-input-button'
                name="image4" type="file" accept="image/*" onChange={updateFiles}
                />


                {/* <input className='block-label full-width'
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
                {(submitted && validationErrors.image4.length)?<p className='form-error'>{validationErrors.image4}</p>:(<></>)} */}
                <button type='submit' className='standard-button update-butt' onClick={handleSubmit}>Update your Spot</button>
            </form>

        </section>
    )
}

export default EditSpotForm
