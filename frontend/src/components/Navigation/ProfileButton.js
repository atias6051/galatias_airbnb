import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link, useHistory } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const profileButtonClassName = (user ? 'loggedIn' : 'noUser')

  return (
    <>
      <div id="profile-button-container">
      {user ? (
        <Link className="create-spot-nav-link" to="/spots/new">Create a New Spot</Link>
      ):(<></>)}
      <button id="profile-button" className={user?'logged-in hover-link' : 'no-user hover-link'} onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            {/* <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li> */}
            <li className="bold-text ">Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li onClick={closeMenu}><Link className="link-styling standard-button" to='/spots/current'>Manage Spots</Link></li>
            <li>
              <button className="hover-link link-styling standard-button" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              nameClass="sing-log-buttons"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              nameClass="sing-log-buttons"
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
