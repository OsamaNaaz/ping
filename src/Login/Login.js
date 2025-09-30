import { useState } from 'react'
import './Login.css'
export default function Login(props){
    const [signUp, setSignUp] = useState(false);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")  
    const [invalidCredCheck, setInvalidCredCheck] = useState(false);
    const loginFunc = (e) => {
        e.preventDefault();
        try{
            if(username.length < 3){
                alert("Lol nope");
            }
            fetch('http://localhost:9000/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then(async res => {
                if(res.status == 200){
                    setInvalidCredCheck(false);
                    const data = await res.json();
                    console.log(data);
                    localStorage.setItem("user", JSON.stringify(data));
                    props.setUser(data);
                }
                else{
                    setInvalidCredCheck(true);
                }
            })
        }
        catch(err){
            console.log(err)
        }
    }
    const signUpFunc = (e) => {
        e.preventDefault();
        try{
            if(username.length < 3 || password !== confirmPassword || email.length < 3){
                alert("try again")
                return;
            }
            fetch('http://localhost:9000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    confirmPassword: confirmPassword,
                    email: email
                })
            }).then(res => {
                console.log(res)
            })
        }
        catch(err){
            console.log(err)
        }
    }
    return(
        <div style={{display:'flex',flex:'1'}}>
            <form className="login" onSubmit={signUp ? signUpFunc : loginFunc}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={signUp ? "Create Username" : "Username"} className={`input-field ${invalidCredCheck ? 'input-field-error' : ''}`}></input>
            <div className='password-container'>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={signUp ? "Create Password" : "Password"} className={`input-field ${invalidCredCheck ? 'input-field-error' : ''}`}></input>
                <span style={{display : signUp ? 'none' : 'block'}} className='forgot-password'>Forgot Password?</span>
            </div>
            <div className={signUp ? 'signUp-container show' : 'signUp-container'}>
                <input type="Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="input-field"></input>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-field"></input>
            </div>
            <div className='login-button-container'>
                <div className="newAccount">
                    <span onClick={() => setSignUp(!signUp)}>{signUp ? 'Already have an account?' : "Don't have an account?"}</span>
                </div>
                <button onClick={signUp ? signUpFunc : loginFunc} className='login-button'>{signUp ? 'Sign Up' : 'Login'}</button>
            </div>
            </form>
        </div>
    )
}