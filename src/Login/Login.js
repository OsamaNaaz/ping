import { useState } from 'react'
import './Login.css'
import { IoMdEye } from "react-icons/io";
import { usernameRegex, passwordRegex, emailRegex, nameRegex } from '../constants';
import InputField from '../InputField/InputField';
import io from 'socket.io-client';
import { socketEmit, socketOn } from '../socket';
import { currentUser } from '../utils';
const socket = io('http://localhost:9000',{
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnection: true

});

export default function Login(props){
    const regexMap = {
        username: usernameRegex,
        password: passwordRegex,
        email: emailRegex,
        name: nameRegex
    };
    const [signUp, setSignUp] = useState(false);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [invalidCredCheck, setInvalidCredCheck] = useState(false);
    const [validators, setValidators] = useState({
        username: true,
        password: true,
        confirmPassword: true,
        email: true,
        name: true
    });
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
                    localStorage.setItem("user", JSON.stringify(data));
                    console.log(data?.username)
                    if(data?.username) {
                        socketEmit('userConnected', data.username);
                    }
                    window.location.reload();
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

    const validator = (field,value) => {
        if(field === "confirmPassword"){
            const validation = password === value;
            setValidators(prev => ({
                ...prev,
                [field]: validation
            }));
            return;
        }
        if(field === "password" && confirmPassword.length > 0){
            setValidators(prev => ({
                ...prev,
                ["confirmPassword"]: value === confirmPassword,
                [field]: regexMap[field].test(value)
            }));
            return;
        }
        if(field === 'password' && confirmPassword.length === 0){
            setValidators(prev => ({
                ...prev,
                [field]: regexMap[field].test(value)
            }));
            return;
        }
        setValidators(prev => ({
            ...prev,
            [field]: regexMap[field].test(value)
        }));
    }

    const signUpFunc = (e) => {
        e.preventDefault();
        const localValidators = {
            username: usernameRegex.test(username),
            password: passwordRegex.test(password),
            confirmPassword: password === confirmPassword,
            email: emailRegex.test(email),
            name: nameRegex.test(name)
        };
        setValidators(localValidators);
        try{
            if(Object.values(localValidators).includes(false)){
                return;
            }
            fetch('http://localhost:9000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    confirmPassword: confirmPassword,
                    email: email
                })
            }).then(res => {
                loginFunc(e);
            })
        }
        catch(err){
            console.log(err)
        }
    }
    return(
        <div style={{display:'flex',flex:'1'}}>
            <form className="login" onSubmit={signUp ? signUpFunc : loginFunc}>
            <InputField inputName="Username" type="text" value={username} onChange={(e) => {setUsername(e.target.value); validator("username",e.target.value)}} placeholder={signUp ? "Create Username" : "Username"} error={!validators.username ? signUp ? 'Username must be 3-20 chars, letters/numbers/underscores only' : 'Invalid username' : ''}></InputField>
            <div className='password-container'>
                <InputField inputName="Password" type="password" value={password} onChange={(e) => {setPassword(e.target.value); validator("password",e.target.value)}} placeholder={signUp ? "Create Password" : "Password"} error={!validators.password && signUp ? 'Password must contain at least 6 chars, one letter and one number' : invalidCredCheck && !signUp ? 'Username not found/wrong password' : ''}></InputField>
                <span style={{display : signUp ? 'none' : 'block'}} className='forgot-password'>Forgot Password?</span>
            </div>
            <div className={signUp ? 'signUp-container show' : 'signUp-container'}>
                <InputField inputName="Confirm Password" type="Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); validator("confirmPassword",e.target.value)}} placeholder="Confirm Password" error={!validators.confirmPassword ? 'Passwords do not match' : ''}></InputField>
                <InputField inputName="Full Name" type="text" value = {name} onChange = {(e) => {setName(e.target.value); validator("name",e.target.value)}} placeholder="Full Name" error={!validators.name ? 'Name should be 3-50 characters, letters only' : ''}></InputField>
                <InputField inputName="Email" type="text" value={email} onChange={(e) => {setEmail(e.target.value); validator("email",e.target.value)}} placeholder="Email" error={!validators.email ? 'Invalid email format' : ''}></InputField>
            </div>
            <div className='login-button-container'>
                <div className="newAccount">
                    <span onClick={() => {
                        setSignUp(!signUp); 
                        setValidators({username:true, password:true, confirmPassword:true, email:true, name:true })
                        }
                    }>
                        {signUp ? 'Already have an account?' : "Don't have an account?"}
                        </span>
                </div>
                <button onClick={signUp ? signUpFunc : loginFunc} className='login-button'>{signUp ? 'Sign Up' : 'Login'}</button>
            </div>
            </form>
        </div>
    )
}