const express = require('express');
const {room, user} = require('../data_template');

const app = express.Router();

app.post('/login', async ( req, res) => {
    const { id } = req.body;

    try{
        res.status(200).json(await room.findOne({"users._id": id}));
    } catch(err){
        console.log(err.reason);
        res.status(400).send("invalid access key");
    }
})

app.post('/createRoom', async (req, res) => {
    const {name, description, username, image} = req.body;

    const newUser = await createUser(username, image, admin=true, active=true);

    if( Object.values(req.body).every(elem => {return Boolean(elem)})){
        try{
            const newRoom = await room.create({
                "name": name,
                "description": description,
                "admin": user.name,
                "proposals": [], 
                "votes": 0,
                "users": [newUser], 
                "termino": false
            });
            res.status(200).json(newRoom);
        } catch(err){
            console.log(err.reason);
            res.status(500).send("there was an error during database access")
        }
    }
    else{
        res.status(400).send("client error");
    }

    
});

app.post("/addNewUser", async (req, res) => {
    const {name, image, roomID} = req.body;
    const newUser = await createUser(name, image, admin=false, active=false);

    if(newUser){
        try{
            await room.updateOne({"_id": roomID}, { $push: {"users": newUser}});
            res.status(200).json(newUser._id);
        }
        catch(err){
            res.status(500).send("error during database access");
        }
    }
    else{
        res.status(400).send("user info is incomplete");
    }
})

async function createUser(name, image, admin, active){
    try{
        return new user({
            name: name,
            image: image,
            admin: admin,
            active: active,
        });
    } catch(err){ 
        console.log(err) 
    }
}

module.exports = app;