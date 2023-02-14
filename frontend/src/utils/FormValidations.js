const checkPicFormat = url =>{
    const picFormats = ['png','jpg','jpeg']
    const urlSplit = url.split('.')
    return (urlSplit.length > 1 && picFormats.includes(urlSplit[urlSplit.length-1]))
}

export const spotFormValidation = (spot) => {
    try{const errors = {
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
        invalid: false
    }
    if(!spot.country.length){
        errors.country = 'Country is required'
        errors.invalid = true
    }
    if(!spot.address.length){
        errors.address = 'Address is required'
        errors.invalid = true
    }
    if(!spot.city.length){
        errors.city = 'City is required'
        errors.invalid = true
    }
    if(!spot.state.length){
        errors.state = 'State is required'
        errors.invalid = true
    }
    // if(!spot.lat.length){
    if(isNaN(spot.lat || spot.lat === '')){
        errors.lat = 'Latitude is required'
        errors.invalid = true
    }
    // if(!spot.lng.length){
    if(isNaN(spot.lng || spot.lng === '')){
        errors.lng = 'Longitude is required'
        errors.invalid = true
    }
    if(spot.description.length<30){
        errors.description = 'Description needs a minimum of 30 characters'
        errors.invalid = true
    }
    if(!spot.name.length){
        errors.name = 'Name is required'
        errors.invalid = true
    }
    // if(!spot.price.length){
    if(isNaN(spot.price) || spot.price === ''){
        errors.price = 'Price is required'
        errors.invalid = true
    }
    if(!spot.previewImage.length){
        errors.previewImage = 'Preview image is required'
        errors.invalid = true
    }
    if(spot.previewImage.length && !checkPicFormat(spot.previewImage)){
        errors.previewImage = 'Image URL must end in .png, .jpg, or .jpeg'
        errors.invalid = true
    }
    if(spot.image1.length && !checkPicFormat(spot.image1)){
        errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
        errors.invalid = true
    }
    if(spot.image2.length && !checkPicFormat(spot.image2)){
        errors.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
        errors.invalid = true
    }
    if(spot.image3.length && !checkPicFormat(spot.image3)){
        errors.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
        errors.invalid = true
    }
    if(spot.image4.length && !checkPicFormat(spot.image4)){
        errors.image4 = 'Image URL must end in .png, .jpg, or .jpeg'
        errors.invalid = true
    }
    return errors}catch{
        console.log('errors from validation components')
    }
}
