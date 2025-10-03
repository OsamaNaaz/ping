import './Message.css';
export default function Message({message}){
    const user = JSON.parse(localStorage.getItem("user"));
return(
    <div className="message">
        {message.sender === user.username ?
            (<div className="message-box right">{message.text}</div>) 
            : 
            (<div className="message-box left">{message.text}</div>)
        }
    </div>
)
}