const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const argon2 = require('argon2');
const port = 9000;

mongoose.connect('mongodb://localhost:27017/ping',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB connected"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.listen(port, () => console.log("Server running on port " + port));
const UserSchema = new mongoose.Schema({
    // name: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    email: {type: String, required: true},
    password: {type:String, required: true},
    createdAt: {type: Date, default: Date.now} 
  });
  
  const User = mongoose.model('User', UserSchema);

app.post('/login', async(req,res) => {
    const {username, password} = req.body;
     User.findOne({username: username}).then(data => {
        argon2.verify(data.password,password).then(result => {
            if(result){
            return(res.status(200).send(data))
            }
             else {
                return(res.status(400).send("Wrong password"))
            }
        })
    }).catch(err => {
    if(err){
        return(res.status(400).send("User not found"));
    }
    else if(data === null){
        return(res.status(400).send("User not found"));
    }
    })
})

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    const hash = await argon2.hash(password);
    const newUser = new User({username, email, password: hash});
    await newUser.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);  
    })
    return res; 
});