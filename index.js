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


async function run() {

    try {
        await client.connect();
        const partsCollection = client.db('wheel-car').collection('parts');
        const orderCollection = client.db('wheel-car').collection('order');

        app.get('/parts', async (req, res) => {
            const query = {};
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
        app.put('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const updateQty = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    availableQty: updateQty.newAvailableQty
                }
            }
            const result = await partsCollection.updateOne(filter, updateDoc, options);
            res.send(result);


        });
        app.post('/order', async (req, res) => {
            const addNew = req.body;
            const result = await orderCollection.insertOne(addNew);
            res.send(result);
        });
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.delete('/order/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const result = await orderCollection.deleteOne(filter);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Wheel Car Server is Running')
});
app.listen(port, () => {
    console.log('Wheel Car listening to port', port)
});