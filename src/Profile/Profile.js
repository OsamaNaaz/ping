import './Profile.css';
import { useState } from 'react';
export default function Profile({user, closeProfile}){
    const[visible, setVisible] = useState(false);
    setTimeout(() => {
        setVisible(true);
    }, 10);
    return(
        <div className="profile-overlay">
            <div className={`profile-pop-up ${visible ? 'visible' : ''}`}>
                <div className='profile-header'>Profile</div>
                <div className='profile-body'>
                    <div className='item'>
                        <img src={user.avatarUrl} alt="User Avatar"></img>
                    </div>
                    <br/>
                    <div>Name: {user.name}</div>
                    <br/>
                    <div>Username: {user.username}</div>
                    <br/>
                    <div>
                        Email: {user.email}
                    </div>
                    <br/>
                    <div>
                    Bio: {user.bio}
                    </div>
                    <br/>
                    <div>
                        Location: {user.location}
                    </div>
                </div>
                <div className='close-button' onClick={closeProfile}>Close</div>
            </div>
        </div>
    )
}