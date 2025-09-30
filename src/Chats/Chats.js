import ChatPreview from '../ChatPreview/ChatPreview'
import './Chats.css'
export default function Chats(){
    const users = [
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
},
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "avatarUrl": "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
  "bio": "Just another chatter!",
  "status": "online",
  "roles": ["user"],
  "twoFactorEnabled": false
}
    ]
    return(
        <div className="chats">
            {users.map(user => (
                <ChatPreview user={user} key={user.username}></ChatPreview>
            ))}
        </div>
    )
}