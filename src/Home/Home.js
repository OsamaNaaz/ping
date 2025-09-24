import './Home.css';
import Login from '../Login/Login.js';
import Infographic from '../Infographic/Infographic.js';

export default function Home(){
    return (
        <div className="home">
            <div className='header'>
                <h1 className="home-title">PING!</h1>
            </div>
            <div className='row'>
                <div className='infographic'>
                    <Infographic></Infographic>
                </div>
                <div className='login-container'>
                    <Login></Login>
                </div>
            </div>
        </div> 
    )
}