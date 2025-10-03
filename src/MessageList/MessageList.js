import Message from "../Message/Message"
import './MessageList.css'
export default function MessageList(){
    const messages = [
  {
    "_id": "messageId001",
    "conversationId": "conv123",
    "sender": "alex_jones",
    "text": "Hey Jane, are we still on for dinner at 7?",
    "timestamp": "2025-10-02T18:00:00Z"
  },
  {
    "_id": "messageId002",
    "conversationId": "conv123",
    "sender": "jane_jones",
    "text": "Yes! I'm running about 15 minutes late though. Can we do 7:15?",
    "timestamp": "2025-10-02T18:05:00Z"
  },
  {
    "_id": "messageId003",
    "conversationId": "conv123",
    "sender": "alex_jones",
    "text": "No problem at all. 7:15 it is. See you then.",
    "timestamp": "2025-10-02T18:06:00Z"
  },
  {
    "_id": "messageId004",
    "conversationId": "conv123",
    "sender": "jane_jones",
    "text": "Perfect, thanks!",
    "timestamp": "2025-10-02T18:07:00Z"
  }
]
    return(
            <div className="message-list">
            </div>
    )
}