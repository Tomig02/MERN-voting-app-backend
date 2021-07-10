const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: 'String',
    image: 'String',
    admin: 'Boolean',
    active: 'Boolean',
})

const proposal = new mongoose.Schema({
    name: 'String',
    description: 'String',
    image: 'String',
    votes: 'Number',
    voters: ['String']
})

const schema = new mongoose.Schema({
    name: 'String',
    description: 'String',
    admin: 'String',
    users: [user],
    proposals: [proposal],
    votes: 'Number',
    fin: 'Boolean'
}, {collection: "rooms"});

module.exports = {
    "user": mongoose.model('user', user), 
    "room": mongoose.model('room', schema),
    "proposal": mongoose.model('proposal', proposal)
};