import './Home.css';
import Login from '../Login/Login.js'; 
import Infographic from '../Infographic/Infographic.js';
import Main from '../Main/Main.js';
import Header from '../Header/Header.js';
import { useState, useEffect } from 'react';
import Profile from '../Profile/Profile.js';
import { socketEmit, socketOn, socketId } from '../socket.js';
import { currentUser } from '../utils.js';

export default function Home(){
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null)
    const [showProfile, setShowProfile] = useState(false);
    useEffect(() => {
        console.log('Home component mounted, setting up socket connection');
        socketOn("connect", () => {
            console.log("Socket connected with ID:", socketId());
            const user = currentUser();
            if (user) {
                socketEmit("userConnected", user.username);
            }
        });
    })
    return (
        <div className="home">
            <Header onClickProfile={() => setShowProfile(true)} user={user}></Header>
            <div className='row' >
                { !user && <div className='infographic'>
                    <Infographic></Infographic>
                </div> }
                { !user &&<div className='login-container'>
                    <Login setUser={setUser}></Login>
                </div> }
                { user && <div className='main-container'>
                    <Main></Main>
                </div>}
            </div>
            {showProfile && <Profile user={user} closeProfile={() => setShowProfile(false)} setUser={setUser}></Profile>}
        </div> 
    )
}