const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
  res.send('Travelaro server is running');
})

// setup up mongodb 
const uri = `mongodb+srv://${process.env.TRAVELARO_USER}:${process.env.USER_PASSWORD}@cluster0.jt8oxuk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db('travelaroDbUser').collection('services');
    const reviewCollection = client.db('travelaroDbUser').collection('reviews');
    
    // services post request
    app.post('/services', async(req, res) =>{
      const serviceData = req.body;
      const result = await serviceCollection.insertOne(serviceData);
      res.send(result);
    })

    // services get request
    app.get('/services', async(req, res) =>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    // get limited data
    app.get('/limited-services', async(req, res) =>{
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    })

    // get a signle service for service details
    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await serviceCollection.findOne(query);
      res.send(result);
    })

    // post request for review
    app.post('/reviews', async(req, res) =>{
      const reviewData = req.body;
      const result = await reviewCollection.insertOne(reviewData);
      res.send(result);
    })

    // query with email
    app.get('/reviews', async(req, res) =>{
      let query = {};
      if(req.query.email){
        query = {
          email: req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })

    // get request for multiple review data
    app.get('/reviews', async(req, res) =>{
      console.log(req.query);
      const query = {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })
    
    // get request for single review data
    app.get('/reviews/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {serviceId: id};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    

  }
  finally{

  }
}
run().catch(err => console.log(err));

app.listen(port, () => {
  console.log('Travelaro server is running on port:', port);
})