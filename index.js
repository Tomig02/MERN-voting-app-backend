const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

const routeHandler = require("./source/routeHandler");

async function connectDB(){
    url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@social.pveot.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`

    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
        console.log(error);
    }
}
connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONT_END
}));
app.use(express.json());
app.use(routeHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening to port: ' + port)
})

