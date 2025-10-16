import io from 'socket.io-client';
const apiUrl = 'http://localhost:9000';
const socket = io('http://localhost:9000');
export async function createConversationApi(participants){
    try{
        const res = await fetch(apiUrl+'/createConversation',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({participants: participants})
        });
        const response = await res.json();
        console.log(response._id,participants)
        socket.emit('conversationCreated', response._id, participants);
        return response;
    }
    catch(err){
        console.log(err)
    }
}
export async function getConversations(user){
    try{
        const response = await fetch('http://localhost:9000/getConversations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        console.log(err);
    }
} 
export async function updateUserApi(user){
    try{
        const response = await fetch(apiUrl+'/updateUser',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update user');
        }
        
        const data = await response.json();
        return {success: true, data};
    }
    catch(err){
        return {success: false, error: err.message}; 
    }
}
export async function fetchUserInfo(username){
    try{
        const response = await fetch(apiUrl+'/getUser',{   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username})
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user info');
        }
        const data = await response.json();
        return data;
    }
    catch(err){
        return {success: false, error: err.message}; 
    }
}

