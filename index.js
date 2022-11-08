const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const services = require('./data/services.json');
const reviews = require('./data/reviews.json');

app.get('/', (req, res) =>{
  res.send('Travelaro server is running');
})


const uri = `mongodb+srv://${process.env.TRAVELARO_USER}:${process.env.USER_PASSWORD}@cluster0.jt8oxuk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db('travelaroDbUser').collection('services');

    app.post('/services', async(req, res) =>{
      const serviceData = req.body;
      // console.log(serviceData);
      const result = await serviceCollection.insertOne(serviceData);
      res.send(result);
    })
  }
  finally{

  }
}
run().catch(err => console.log(err));

app.get('/services', (req, res) =>{
  res.send(services);
})

app.get('/reviews', (req, res) =>{
  res.send(reviews);
})

app.get('/services/:id', (req, res) =>{
  const id = parseInt(req.params.id);
  const signleService = services.find(service => service.id === id)
  res.send(signleService);
})

app.get('/reviews/:id', (req, res) =>{
  const id = req.params.id;
  const review = reviews.filter(r => r.serviceId == id);
  res.send(review);
})

app.listen(port, () => {
  console.log('Travelaro server is running on port:', port);
})