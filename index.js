const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid-transport');
const app = express();
const port = process.env.PORT || 5000;


// const stripe = require('stripe')(process.env.STRIPE_SECRET)
//middleware--------->
// app.use(cors());
//cors policy config--------->
const corsConfig = {
    origin: true,
    Credentials: true,
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig));


app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t7ino.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


console.log('db connected');


async function run(){

    try{
        await client.connect();
        const partsCollection = client.db('wheel-car').collection('parts');

        app.get('/parts', async (req, res)=>{
            const query ={};
            const cursor = partsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        });
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await partsCollection.findOne(query);
            res.send(result);
        });

    }
    finally{

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Wheel Car Server is Running')
});
app.listen(port, () => {
    console.log('Wheel Car listening to port', port)
});