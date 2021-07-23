const {Router} = require("express");
const mongoose = require("mongoose");
const {room, proposal} = require('../data_template');

const app = Router();

app.post('/newProposal', async (req, res) => {
    const {description, image, name, userID, roomID} = req.body;
    
    if(description, image, name, roomID, userID){

        if(await room.findOne({"proposals.creator": userID})){
            res.status(400).send("user already has a proposal");
        }else{
            const newProposal = new proposal({
                name: name,
                description: description,
                image: image,
                votes: 0,
                creator: userID,
                voters: []
            });

            try{
                await room.updateOne(
                    {"_id": roomID}, 
                    {$push: {"proposals": newProposal}}, 
                    {useFindAndModify:false}
                );
                const result = await room.findOne({"_id": roomID});

                res.status(200).json(result);
            }catch(err){
                res.status(400).send("error during DB access");
            }
        }
    }
    else{
        res.status.send("necesary data is null or undefined")
    }
});

app.post('/deleteProposal', async (req, res) => {
    const {roomID, userID} = req.body;
    try{
        await room.updateOne(
            {"_id": roomID}, 
            {$pull: {"proposals": {"creator": userID}}}
        );
        const result = await room.findOne({"_id": roomID});
        console.log(result);
        res.status(200).json(result);
    }catch(err){
        res.send(500).send("error un DB during delete");
    }
});

app.post('/vote', async (req, res) => {
    const {propID, userName} = req.body;

    try{
        const hasVoted = await room.findOne(
            {"proposals.voters": userName}
        );

        if(!hasVoted){
            voteProposal(res, propID, userName);
        }else{
            const actPropVoters = hasVoted.proposals.find(
                props => { return String(props._id) == propID }
            ).voters;
            const isSame = actPropVoters.indexOf(userName) !== -1;

            if(isSame){
                undoVote(res, propID, userName);
            }else{
                res.status(400).send("User has already voted in other proposal")
            }            
        }
    }catch(err){
        
        console.log(err);
        res.status(500).send("There was an error when looking for the room in the DB")
    }
})

const voteProposal = async (res, propID, username) => {
    try{
        await room.updateOne(
            {"proposals._id": propID}, 
            {$inc: {"proposals.$.votes": 1}}
        );
        await room.updateOne(
            {"proposals._id": propID}, 
            {$inc: {"votes": 1}}
        );
        await room.updateOne(
            {"proposals._id": propID}, 
            {$push: {"proposals.$.voters": username}}, 
        );

        const doc = await room.findOne({"proposals._id": propID});
        res.status(200).json(doc);
    } catch(err){
        res.status(500).send("error in db when voting");
        console.log(err);
    }
};

const undoVote = async (res, propID, username) => {

    try{
        await room.updateOne(
            {"proposals._id": propID}, 
            {$inc: {"proposals.$.votes": -1}}    
        );
        await room.updateOne(
            {"proposals._id": propID}, 
            {$inc: {"votes": -1}}
        );
        await room.updateOne(
            {"proposals._id": propID}, 
            {$pull: {"proposals.$.voters": username}}, 
        );

        const doc = await room.findOne({"proposals._id": propID});
        res.status(200).json(doc);
    }
    catch(err){
        res.status(500).send("error in db when unvoting");
        console.log(err);
    }
};

module.exports = app;