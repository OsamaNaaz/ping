import './Login.css'
export default function Login(){
    return(
        <div className="login">
            <input type="text" placeholder="Username" className='input-field'></input><br/>
            <input type="password" placeholder="Password" className='input-field'></input><br></br>
            <button className='login-button'>Login</button>
        </div>
    )
}