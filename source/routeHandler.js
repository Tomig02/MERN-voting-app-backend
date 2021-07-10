const express = require('express');
const userRoomRoutes = require('./routes/usersAndRoom');
const proposalRoutes = require('./routes/voteProposals');

const app = express.Router();

app.use(userRoomRoutes);
app.use(proposalRoutes);

module.exports = app;