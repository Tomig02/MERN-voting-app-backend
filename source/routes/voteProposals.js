const {Router} = require("express");
const mongoose = require("mongoose");
const {room, proposal} = require('../data_template');

const app = Router();

app.post('/newProposal', async (req, res) => {
    const {description, image, name, roomID} = req.body;
    
    if(description, image, name, roomID){
        const newProposal = new proposal({
            name: name,
            description: description,
            image: image,
            votes: 0,
            voters: []
        });
        await room.findByIdAndUpdate(roomID, {$push: {"proposals": newProposal}}, {useFindAndModify:false},
            (error, doc) => {
                if(error){
                    res.status(400).json(error);
                }
                else{
                    res.status(200).json(doc);
                }
            }
        );
    }
    else{
        res.status.send("necesary data is null or undefined")
    }
});

app.post('/deleteProposal', (req, res) => {
    const {propID} = req.body;

    room.findOneAndUpdate({"proposals._id": propID}, {$pull: {"proposals": {"_id": propID}}}, (error , doc) => {
        if(error){
            res.status(400).send("error in db during delete");
        }
        else{
            res.status(200).json(doc);
        }
    })
});

app.post('/voteProposal', async (req, res) => {
    const {propID, userName} = req.body;

    try{
        await room.findOneAndUpdate(
            {"proposals._id": propID}, 
            {$inc: {"proposals.$.votes": 1}}
        );
        doc = await room.findOneAndUpdate(
            {"proposals._id": propID}, 
            {$push: {"proposals.$.voters": userName}}, 
        );
        
        res.status(200).json(doc);
    }
    catch(err){
        res.status(400).send("error in db when voting");
        console.log(err);
    }
});

app.post('/undoVote', async (req, res) => {
    const {propID, userName} = req.body;
    
    try{
        await room.findOneAndUpdate(
            {"proposals._id": propID}, 
            {$inc: {"proposals.$.votes": -1}}
        );
        doc = await room.findOneAndUpdate(
            {"proposals._id": propID}, 
            {$pull: {"proposals.$.voters": userName}}, 
        );
        
        res.status(200).json(doc);
    }
    catch(err){
        res.status(400).send("error in db when voting");
        console.log(err);
    }
});

module.exports = app;