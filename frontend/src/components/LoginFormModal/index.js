import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [disableButton,setDisableButton] = useState(true)
  const { closeModal } = useModal();

  useEffect(()=>{
    if(credential.length >= 4 && password.length >= 6) setDisableButton(false)
    else setDisableButton(true)

  },[credential,password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const loginDemo = () => {
    return dispatch(sessionActions.login({ credential:"Demo-lition", password: "password" }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  }

  return (
    <div className="flex-col-center padd-10">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form-form">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
        type="submit"
        className="standard-button full-width"
        disabled={disableButton}
        >Log In
        </button>
        <h5 className="hover-link padd-10" onClick={loginDemo}>Log in as Demo User</h5>
      </form>
    </div>
  );
}

export default LoginFormModal;
