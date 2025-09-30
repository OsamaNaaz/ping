import './Home.css';
import Login from '../Login/Login.js'; 
import Infographic from '../Infographic/Infographic.js';
import Main from '../Main/Main.js';
import Header from '../Header/Header.js';
import { useState } from 'react';

export default function Home(){
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null)
    return (
        <div className="home">
            <Header user={user}></Header>
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
        </div> 
    )
}