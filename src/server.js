const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const argon2 = require('argon2');
const port = 9000;
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

mongoose.connect('mongodb://localhost:27017/ping',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB connected"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());
// app.listen(port, () => console.log("Server running on port " + port));
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: false},

  avatarUrl: { type: String },
  bio: { type: String },
  status: { type: String, enum: ["online", "offline", "busy"], default: "offline" },

  roles: { type: [String], default: ["user"] },
  twoFactorEnabled: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date }
});
  
  const User = mongoose.model('User', UserSchema);

  const ConversationSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }],
    lastMessage: { type: String },
    createdAt: { type: Date, default: Date.now }
  });

  const MessageSchema = new mongoose.Schema({
    convId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  });

  const Message = mongoose.model('Message', MessageSchema);
  const Conversation = mongoose.model('Conversation', ConversationSchema);

app.post('/login', async(req,res) => {
    const {username, password} = req.body;
     User.findOne({username: username}).then(data => {
        // argon2.verify(data.passwordHash,password).then(result => {
        if(data.password.trim() == password.trim()){
                const {password: _, ...user} = data.toObject();
                res.json(user);
                return res.status(200);
            }
             else {
                return(res.status(400).send("Wrong password"))
            }
        }
    ).catch(err => {
    if(err){
        return(res.status(400).send("User not found"));
    }
    else if(data === null){
        return(res.status(400).send("User not found"));
    }
    })
})

app.post('/register', async (req, res) => {
    const {username, email, password, name} = req.body;
    // const hash = await argon2.hash(password);
    const newUser = new User({username, email, password, name, avatarUrl: `https://ui-avatars.com/api/?name=${name.split(' ').join('+')}&background=random&size=128`});
    await newUser.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);  
    })
    return res; 
});
app.post('/getConversations', async(req,res) => {
    const {username} = req.body;
    console.log(req.body);
    await Conversation.find({
        participants: { $all: [username] }
    }).then(data => {

       setTimeout(() => {res.json(data.map(conversation => {
        return {
            id: conversation._id,
            participant: conversation.participants.find(p => p !== username),
            lastMessage: conversation.lastMessage,
            createdAt: conversation.createdAt
        }
       }));
    },1000) 
    }).catch(err => {
        res.json(err);  
    })
});
app.post('/getMessages', async(req,res) => {
    const {conversationId} = req.body;
    console.log(req.body);
    await Message.find({convId: conversationId}).sort({timestamp: 1}).then(data => {
        setTimeout(() =>{

            res.json(data)
        },1000);
    }).catch(err => {
        res.json(err);  
    })
})
app.post('/getUsers', async(req,res) => {
    const {usernames} = req.body;
    try{
        const data = await User.find({username: {$in: usernames}});
        const users = data.map(user => {
        return{
            username: user.username,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            status: user.status
        }
    });
    setTimeout(() => {
        res.json(users);
    },1000);
    }
    catch(err){
        res.json(err);
    }
})
app.post('/sendMessage', async(req,res) => {
    const {convId, sender, text} = req.body;
    const newMessage = new Message({
        convId: convId,
        sender: sender,
        text: text
    });
    await newMessage.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);  
    })
})
app.post('/searchUsers', async(req,res) => {
    const {searchQuery} = req.body;
    await User.find({
        $or: 
        [{username: {$regex: searchQuery, $options: 'i'}},
        {name: {$regex: searchQuery, $options: 'i'}},
        {email: {$regex: searchQuery, $options: 'i'}}
        ]
    }).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);  
    })
}
)
app.post('/updateUser', async(req,res) => {
    const {_id, username, name, email, bio="", password, currentPassword} = req.body;
    try{
        if(currentPassword === undefined || currentPassword.trim() === ""){
            throw new Error("Current password is required");
        }
        const usernameDoc = await User.findOne({username: username, _id: {$ne: _id}});
        if(usernameDoc){
            throw new Error("Username already taken");
        }
        const emailDoc = await User.findOne({email: email, _id: {$ne: _id}});
        if(emailDoc){
            throw new Error("Email already taken");
        }
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        } 
        if(user.password.trim() !== currentPassword.trim()){
            throw new Error("Current password is incorrect");
        }
        if(password !== undefined && password.trim() !== ""){
            user.password = password;
        }
        const updatedUser = await User.findOneAndUpdate({_id: _id}, {username: username, name: name, email: email, bio: bio}, {new: true});
        res.json(updatedUser);
    }
    catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
})
app.post('/createConversation', async(req,res) => {
    const {participants} = req.body;
    const sortedParticipants = [...participants].sort();
    try{
        const existingConversation = await Conversation.findOne({
            participants: sortedParticipants
        })
        if(existingConversation){
            return res.json(existingConversation);
        }
    }
    catch(err){
        if(err){
            return res.json(err);
        }
    }
    const newConversation = new Conversation({
        participants: sortedParticipants
    });
    await newConversation.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    })
})

io.on('connection', (socket) => {
    socket.on('joinConversation', (conversationId) => {
        console.log(`User joined conversation ${conversationId}`);
        socket.join(conversationId);
    });
    socket.on('sendMessage', async (message) => {
        await Message.create(message);
        io.to(message.convId).emit('receiveMessage', message);
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
    socket.on('stopTyping', (data) => {
        socket.broadcast.emit('stopTyping', data);
    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})
server.listen(9000, () => {
  console.log("Server running on port 9000");
});