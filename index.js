const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
  res.send('Travelaro server is running');
})

app.listen(port, () => {
  console.log('Travelaro server is running on port:', port);
})