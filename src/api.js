const apiUrl = 'http://localhost:9000';
export async function createConversation(participants){
    try{
        const response = await fetch(apiUrl+'/createConversation',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({participants: participants})
        }).then(res => res.json());
        return response;
    }
    catch(err){
        console.log(err)
    }
}
export async function getConversations(user){
    try{
        console.log(user);
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
