const express = require('express');
const userRoomRoutes = require('./routes/usersAndRoom');

const app = express.Router();

app.use(userRoomRoutes);

module.exports = app;