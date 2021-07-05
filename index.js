const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

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

app.get('/', (req, res) => {
    res.send('BIENVENIDO');
})

port = 3000;
app.listen(port, () => {
    console.log('listening to port: ' + port)
})

