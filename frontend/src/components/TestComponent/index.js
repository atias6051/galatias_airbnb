import { useEffect, useState } from 'react';
import { csrfFetch } from '../../store/csrf';
// const crypto = require("crypto");

function TestComponent(){

    const [image,setImage] = useState(null)
    const [displayImg,setDisplayImage] = useState('')

    const updateFiles = e => {
        const files = e.target.files;
        console.log(e.target.name)
        console.log(files)
        setImage(()=>files[0]);
    };

    const handleSubmit = async e =>{
        e.preventDefault()
        const {url} = await csrfFetch('/api/spots/s3url').then(res=>res.json())
        const res = await csrfFetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: image,
        })
        const imageUrl = url.split('?')[0]
        setDisplayImage(()=>imageUrl)

        setImage(()=>null)
    }
    return (
        <div>
            <h1>Hello Tester</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input name="prev" accept="image/*" onChange={updateFiles} type="file" />
                <input name="one" accept="image/*" onChange={updateFiles} type="file" />
                <button type="submit">Submit</button>
            </form>
            <img src={displayImg} />
        </div>
    )
}

export default TestComponent
