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

// TODO: handle errors and disconnections


const app = express();

app.use(cors());
app.use(express.json());
app.use(routeHandler);

const port = 3001;
app.listen(port, () => {
    console.log('listening to port: ' + port)
})

