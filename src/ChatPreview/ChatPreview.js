import './ChatPreview.css'
export default function ChatPreview({user, onClick}){
    return(
        <div className="chat-preview" onClick={onClick}>
            <img src={user.avatarUrl} alt="User Avatar" className='user-avatar'></img>
            <span className='user-name'>
                {user.name} {user.hasNewMessage && <span className='new-message'>*</span>}<br/>
                <span className={`user-status ${user.isOnline ? 'online' : 'offline'}`}>{user.status}</span>
            </span>
            <br/>            
        </div>
    )
}