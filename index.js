const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdusz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const reviewsCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    const appointmentsCollection = client.db(`${process.env.DB_NAME}`).collection("appointments");
    const adminsCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
    console.log('connection err', err)
    // perform actions on the collection object

    app.get('/', (req, res) => {
        res.send('Server Running');
    });

    app.get('/services', (req, res) => {
        servicesCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/appointments', (req, res) => {
        appointmentsCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
                console.log(err)
            })
    })

    app.get('/appointment/:email', (req, res) => {
        appointmentsCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
                console.log(err)
            })
    })

    app.get('/admin/:email', (req, res) => {
        adminsCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
                console.log(err)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addAppointment', (req, res) => {
        const newAppointment = req.body;
        appointmentsCollection.insertOne(newAppointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addService', (req, res) => {
        const newService = req.body;
        servicesCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        reviewsCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.patch('/updateStatus/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        appointmentsCollection.updateOne({_id: id},{ $set:{ status: req.body.status }})
        .then(documents => res.send("Done"))
    })

    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        servicesCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value))
    })
});

app.listen(process.env.PORT || '3001');