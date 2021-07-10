const express = require('express');
const {room, user} = require('../data_template');

const app = express.Router();

app.post('/login', ( req, res) => {
    const { id } = req.body;

    room.findOne({"users._id": id}, (error, success) => {
        if( error ){
            console.log(error);
        }
        else{
            res.json(success);
        }
    });
})

app.post('/createRoom', async (req, res) => {
    const {name, description, user} = req.body;

    const newUser = await createUser(user, active=true);

    if(user & name & description){
        const newRoom = await room.create({
            "name": name,
            "description": description,
            "admin": user.name,
            "proposals": [], 
            "votes": 0,
            "users": [newUser], 
            "termino": false}
        );

        res.json(newRoom);
    }
    else{
        res.status(400).send("client error");
    }

    
});

app.post("/addNewUser", async (req, res) => {
    const newUser = await createUser(req.body, active=false);

    if(newUser){
        let addedRoom;
        try{
            addedRoom = await room.updateOne({ _id: req.body.roomID}, { $push: {users: newUser}});
        }
        catch(err){
            res.status(402).json(err);
        }

        res.status(200).json(addedRoom);
    }
    else{
        res.status(400).send("user info is incomplete");
    }
})

async function createUser(data, active){
    try{
        return new user({
            name: data.name,
            image: data.image,
            admin: data.admin,
            active: active,
        });
    }
    catch(err){ console.log(err) }
}

module.exports = app;