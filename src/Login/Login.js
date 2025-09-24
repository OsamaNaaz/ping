import { useState } from 'react'
import './Login.css'
export default function Login(){
    const [signUp, setSignUp] = useState(false);
    return(
        <div className="login">
            <input type="text" placeholder={signUp ? "Create Username" : "Username"} className='input-field'></input>
            <div className='password-container'>
                <input type="password" placeholder={signUp ? "Create Password" : "Password"} className='input-field'></input>
                <span style={{display : signUp ? 'none' : 'block'}} className='forgot-password'>Forgot Password?</span>
            </div>
            <div className={signUp ? 'signUp-container show' : 'signUp-container'}>
                <input type="Password" placeholder="Confirm Password" className="input-field"></input>
                <input type="text" placeholder="Email" className="input-field"></input>
            </div>
            <div className='login-button-container'>
                <div className="newAccount">
                    <span onClick={() => setSignUp(!signUp)}>{signUp ? 'Already have an account?' : "Don't have an account?"}</span>
                </div>
                <button className='login-button'>{signUp ? 'Sign Up' : 'Login'}</button>
            </div>
        </div>
    )
}