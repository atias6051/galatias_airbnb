import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from "react";
import { getSpots } from '../../store/spots';
import PlacesAutocomplete, {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import './Map.css'
import { useHistory } from "react-router-dom";

const libraries = ['places']
function Map(){
    const history = useHistory()
    const [address,setAddress] = useState('')
    const [coordiantes,setCoordinates] = useState({lat:null,lng:null})
    const spots = useSelector(state=>state.spots.allSpots)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getSpots())
    },[dispatch])

    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }, []);
    // useEffect(()=>{
    //     console.log("spots--->", spots)
    // },[spots])

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
        libraries:libraries
    });


    if(!isLoaded || !spots) return <div>Loading...</div>
    return (
        <section id='map-sction'>
            <GoogleMap
                zoom={9}
                center={{ lat:37.8, lng: -122.2}}
                mapContainerClassName="map-container"
                >
                {spots && Object.values(spots).map(spot=>(
                    <Marker key={spot.id} animation='BOUNCE' onClick={() => history.push(`/spots/${spot.id}`)} title={spot.name} position={{lat:spot.lat,lng:spot.lng}}/>
                    ))}
            </GoogleMap>
            <button id='listToggle' onClick={()=>history.push('/')}>List View</button>
        </section>
    )
}

export default Map
