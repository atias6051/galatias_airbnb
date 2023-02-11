import {useState,useEffect} from 'react'
import { useDispatch } from "react-redux";
import './NewSpotForm.css'

function NewSpotForm(){
    const dispatch = useDispatch()
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

    const validationDependencies = [country,address,city,state,lat,lng,description,name,price,previewImage,image1,image2,image3,image4]
    const [validationErrors, setValidationErros] = useState({})
    const [submitted,setSubmitted] = useState(false)

    const checkPicFormat = url =>{
        const picFormats = ['png','jpg','jpeg']
        const urlSplit = url.split('.')
        return (urlSplit.length > 1 && picFormats.includes(urlSplit[urlSplit.length-1]))
    }

    useEffect(()=>{
        const errors = {
            country: "",
            address: "",
            city: "",
            state: "",
            lat: "",
            lng: "",
            description: "",
            name: "",
            price: "",
            previewImage: "",
            image1: "",
            image2: "",
            image3: "",
            image4: "",
        }

        if(!country.length) errors.country = 'Country is required'
        if(!address.length) errors.address = 'Address is required'
        if(!city.length) errors.city = 'City is required'
        if(!state.length) errors.state = 'State is required'
        if(!lat.length) errors.lat = 'Latitude is required'
        if(!lng.length) errors.lng = 'Longitude is required'
        if(description.length<30) errors.description = 'Description needs a minimum of 30 characters'
        if(!name.length) errors.name = 'Name is required'
        if(!price.length) errors.price = 'Price is required'
        if(!previewImage.length) errors.previewImage = 'Preview image is required'
        if(previewImage.length && !checkPicFormat(previewImage)) errors.previewImage = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image1.length && !checkPicFormat(image1)) errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image2.length && !checkPicFormat(image2)) errors.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image3.length && !checkPicFormat(image3)) errors.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image4.length && !checkPicFormat(image4)) errors.image4 = 'Image URL must end in .png, .jpg, or .jpeg'
        setValidationErros(errors)
    },[country,address,city,state,lat,lng,description,name,price,previewImage,image1,image2,image3,image4])


    const handleSubmit = e =>{
        e.preventDefault()
        setSubmitted(true)
        console.log(validationErrors)
        if(Object.keys(validationErrors).length) return null;
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
            PrevImage:{
                previewImage
            },
            images: {
                image1,
                image2,
                image3,
                image4
            }
        }

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
    }
    return(
        <section id="create-spot-section">
            <form id='new-spot-form'>
                <h1>Create a new Spot</h1>
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
                        className='full-width'
                        type='text'
                        placeholder="Country"
                        value={country}
                        onChange={(e)=> setCountry(e.target.value)}
                        />
                </label>
                <label className='block-label'>
                    <div>
                    Street Address {(submitted && validationErrors.address.length)?<p className='form-error'>{validationErrors.address}</p>:(<></>)}
                    </div>
                  <input
                    className='full-width'
                    type='text'
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                </label>

                <div className='block-label'>
                <label>
                  City {(submitted && validationErrors.city.length)?<p className='form-error'>{validationErrors.city}</p>:(<></>)}
                  <input
                    // className='half-width'
                    type='text'
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />,
                </label>
                <label>
                  State {(submitted && validationErrors.state.length)?<p className='form-error'>{validationErrors.state}</p>:(<></>)}
                  <input
                    // className='half-width'
                    type='text'
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                </label>
                </div>

                <label>
                  Latitude
                  <input
                    type='text'
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </label>,
                <label>
                  Longitude
                  <input
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
                </div>
                <textarea
                className='full-width'
                rows='5'
                // type="text-area"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                {(submitted && validationErrors.description.length)?<p className='form-error'>{validationErrors.description}</p>:(<></>)}
                <div>
                    <h2>Create a title for your spot</h2>
                    <p>
                    Catch guests' attention with a spot title that highlights what makes
                    your place special.
                    </p>
                </div>
                <input
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
                <span>$<input type="text" placeholder='Price per night (USD)'
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
                type="text"
                placeholder='Preview Image URL'
                value={previewImage}
                onChange={e=>setPreviewImage(e.target.value)}
                />
                {(submitted && validationErrors.previewImage.length)?<p className='form-error'>{validationErrors.previewImage}</p>:(<></>)}
                <input className='block-label full-width'
                type='text'
                placeholder='Image URL'
                value={image1}
                onChange={e=>setImage1(e.target.value)}
                />
                {(submitted && validationErrors.image1.length)?<p className='form-error'>{validationErrors.image1}</p>:(<></>)}
                <input className='block-label full-width'
                type='text'
                placeholder='Image URL'
                value={image2}
                onChange={e => setImage2(e.target.value)}
                />
                {(submitted && validationErrors.image2.length)?<p className='form-error'>{validationErrors.image2}</p>:(<></>)}
                <input className='block-label full-width'
                type='text'
                placeholder='Image URL'
                value={image3}
                onChange={e => setImage3(e.target.value)}
                />
                {(submitted && validationErrors.image3.length)?<p className='form-error'>{validationErrors.image3}</p>:(<></>)}
                <input className='block-label full-width'
                type='text'
                placeholder='Image URL'
                value={image4}
                onChange={e => setImage4(e.target.value)}
                />
                {(submitted && validationErrors.image4.length)?<p className='form-error'>{validationErrors.image4}</p>:(<></>)}
                <button type='submit' onClick={handleSubmit}>Create Spot</button>
            </form>

        </section>
    )
}

export default NewSpotForm
