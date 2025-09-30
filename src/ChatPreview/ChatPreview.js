import './ChatPreview.css'
export default function ChatPreview(props){
    const sampleUser = props.user;
    return(
        <div className="chat-preview">
            <img src={sampleUser.avatarUrl} alt="User Avatar" className='user-avatar'></img>
            <span className='user-name'>
                {sampleUser.name}
            </span>
        </div>
    )
}