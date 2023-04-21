const checkPicFormat = url =>{
    const picFormats = ['png','jpg','jpeg']
    const urlSplit = url.split('.')
    return (urlSplit.length > 1 && picFormats.includes(urlSplit[urlSplit.length-1]))
}

export const spotFormValidation = (spot) => {
    if(!spot) return
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
    if(spot.country.length>=100){
        errors.country = 'Country must be less than 100 characters'
        errors.invalid = true
    }
    if(!spot.address.length){
        errors.address = 'Address is required'
        errors.invalid = true
    }
    if(spot.address.length>=200){
        errors.address = 'address must be less than 200 characters'
        errors.invalid = true
    }
    if(!spot.city.length){
        errors.city = 'City is required'
        errors.invalid = true
    }
    if(spot.city.length>=100){
        errors.city= 'City must be less than 100 characters'
        errors.invalid = true
    }
    if(!spot.state.length){
        errors.state = 'State is required'
        errors.invalid = true
    }
    if(spot.state.length>=100){
        errors.state= 'State must be less than 100 characters'
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
    if(spot.name.length>=50){
        errors.name = 'Spot Name needs to be under 50 Characters'
        errors.invalid = true
    }
    // if(!spot.price.length){
    if(isNaN(spot.price) || spot.price === '' || spot.price < 1){
        errors.price = 'Price is required'
        errors.invalid = true
    }
    // if(!spot.previewImage.length){
    //     errors.previewImage = 'Preview image is required'
    //     errors.invalid = true
    // }
    if(!spot.images.prev){
        errors.previewImage = 'Preview image is required'
        errors.invalid = true
    }
    // if(spot.previewImage.length && !checkPicFormat(spot.previewImage)){
    //     errors.previewImage = 'Image URL must end in .png, .jpg, or .jpeg'
    //     errors.invalid = true
    // }
    // if(spot.image1.length && !checkPicFormat(spot.image1)){
    //     errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
    //     errors.invalid = true
    // }
    // if(spot.image2.length && !checkPicFormat(spot.image2)){
    //     errors.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
    //     errors.invalid = true
    // }
    // if(spot.image3.length && !checkPicFormat(spot.image3)){
    //     errors.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
    //     errors.invalid = true
    // }
    // if(spot.image4.length && !checkPicFormat(spot.image4)){
    //     errors.image4 = 'Image URL must end in .png, .jpg, or .jpeg'
    //     errors.invalid = true
    // }
    return errors}catch{
        console.log('errors from validation components')
    }
}
