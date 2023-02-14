function SpotGallery({images}){

    return(
        <div className="single-spot-gallery">
            {images.map(img=>(
                    <div key={img.id} className={img.preview? "main-tile":"small-tile"}>
                        <img key={img.id} className='gallery-image-div' src={img.url}/>
                    </div>
            ))}
        </div>
    )
}

export default SpotGallery
