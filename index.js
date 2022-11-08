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

app.get('/', (req, res) =>{
  res.send('Travelaro server is running');
})

app.get('/services', (req, res) =>{
  res.send(services);
})


app.listen(port, () => {
  console.log('Travelaro server is running on port:', port);
})