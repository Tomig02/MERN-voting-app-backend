const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: 'String',
    image: 'String'
})

const gift = new mongoose.Schema({
    description: 'String',
    image: 'String',
    likes: 'Number'
})

const schema = new mongoose.Schema({
    room: 'String',
    description: 'String',
    id: 'String',
    admin: 'String',
    users: [user],
    gifts: [gift]
},{collection: "rooms"})

export default mongoose.model('room', schema);