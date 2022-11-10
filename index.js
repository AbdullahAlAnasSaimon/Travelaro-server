const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

function verifyJWT(req, res, next){

  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'Unauthorized access', status: 401})
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      return res.status(401).send({message: 'Unauthorized access', status: 401});
    }
    req.decoded = decoded;
    next();
  })
}


async function run(){
  try{
    const serviceCollection = client.db('travelaroDbUser').collection('services');
    const reviewCollection = client.db('travelaroDbUser').collection('reviews');

    app.post('/jwt', (req, res) =>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20d'});
      res.send({token});
    })
    
    // services post api
    app.post('/services', async(req, res) =>{
      const serviceData = req.body;
      const result = await serviceCollection.insertOne(serviceData);
      res.send(result);
    })

    // services get api
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

    // query with email
    app.get('/reviews', verifyJWT, async (req, res) =>{
      const decode = req.decoded;

      if(decode.email !== req.query.email){
        return res.status(403).send({message: "Unauthorized access", status: 403});
      }

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
    app.get('/reviews/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await reviewCollection.findOne(query);
      res.send(result);
    })

    // post api for review
    app.post('/reviews', async(req, res) =>{
      const reviewData = req.body;
      const result = await reviewCollection.insertOne(reviewData);
      res.send(result);
    })
    
    // get api for single review data
    app.get('/reviews/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {serviceId: id};
      const cursor = reviewCollection.find(query).sort({insertTime: -1});
      const result = await cursor.toArray();
      res.send(result);
    })

    // update review api
    app.put('/reviews/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: true};
      const updateReview = {
        $set: {
          description: req.body.description
        }
      }
      const result = await reviewCollection.updateOne(filter, updateReview, option);
      res.send(result);
    })

    // delete reveiw api
    app.delete('/reviews/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await reviewCollection.deleteOne(query);
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