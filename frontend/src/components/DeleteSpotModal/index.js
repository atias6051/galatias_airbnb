import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteSpot } from "../../store/spots"
import './DeleteSpotModal.css'

function DeleteSpotModal({spotId}){
    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = () =>{
        dispatch(deleteSpot(spotId))
        closeModal()
    }

    return(
        <div className="delete-modal-container">
            <h1>Confirm Delete</h1>
            <p>
            Are you sure you want to remove this spot?
            </p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal
