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

app.get('/', (req, res) =>{
  res.send('Travelaro server is running');
})

// setup up mongodb 
const uri = `mongodb+srv://${process.env.TRAVELARO_USER}:${process.env.USER_PASSWORD}@cluster0.jt8oxuk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db('travelaroDbUser').collection('services');
    
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
  }
  finally{

  }
}
run().catch(err => console.log(err));

app.listen(port, () => {
  console.log('Travelaro server is running on port:', port);
})