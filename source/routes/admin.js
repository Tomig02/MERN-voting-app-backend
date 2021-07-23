const express = require('express');
const {room, user} = require('../data_template');

const app = express.Router();

app.post("/kickUser", async (req, res) => {
    const {roomID, userID} = req.body;

    try{
        await room.updateOne(
            {"_id": roomID},
            {$pull: {"users": {"_id": userID}}}
        );

        const result = await room.findOne({"_id": roomID});
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).send("error during DB access")
    }
});

app.post("/Finish", async (req, res) => {
    const {roomID} = req.body;

    try{
        await room.updateOne(
            {"_id": roomID},
            {"fin": true}
        );

        res.status(200).json(await room.findOne({'_id': roomID}));
    }catch(err){
        console.log(err);
        res.status(500).send("server error during DB access");
    }
});

app.post("/handleReq", async (req, res) => {
    const {roomID, userID, accept} = req.body;

    try{
        const action = accept? {$set: {"users.$.active": true}}: {$pull: {"users": {"_id": userID}}}
        await room.updateOne(
            {"_id": roomID, "users._id": userID},
            action
        );
        
        const result = await room.findOne({"_id": roomID});
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).send("error during DB access");
    }
});

module.exports = app;
