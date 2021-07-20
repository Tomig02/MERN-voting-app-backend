const express = require('express');
const userRoomRoutes = require('./routes/usersAndRoom');
const proposalRoutes = require('./routes/voteProposals');
const adminRoutes = require('./routes/admin');
const app = express.Router();

app.use(userRoomRoutes);
app.use(proposalRoutes);
app.use(adminRoutes);

module.exports = app;