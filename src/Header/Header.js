import './Header.css';
import userLogo from '../assets/pics/user.png';
import { useState, useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import { logOut } from '../utils';

export default function Header({user}){
    const dropdownRef = useRef(null);
    useClickOutside(dropdownRef, () => setOpenDropDown(false));
    const [openDropDown, setOpenDropDown] = useState(false);
    return(
        <div className={`header ${user ? "logged-in-header" : ""}`}>
            <h1 className="home-title">PING!</h1>
            <div className="user-logo" ref={dropdownRef}>
            {user && (<img src={userLogo}  alt="User Logo" onClick={(e) => { setOpenDropDown(!openDropDown); }}></img>)}
            {openDropDown && (<div className="dropdown"> 
                <ul>
                    <li>Account Settings</li>
                    <li>Profile</li>
                    <li onClick={() => logOut()}>Logout</li>
                </ul>
            </div>
        )}
        </div>
        </div>
    )
}