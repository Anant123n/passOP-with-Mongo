const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connection URL (use env if available, else fallback)
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'PassOP';
const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(cors());

// Connect once
client.connect();

console.log("✅ MongoDB connected:", url);


//FOR GET THE PASSOP DATA
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  console.log('Found documents =>', findResult);
  res.json(findResult)
})

//FOR SAVE THE PASSWORD DATA// INSERT PASSWORD
app.post('/', async (req, res) => {
  const password = req.body;   // JSON body sent by client
  const db = client.db(dbName);
  const collection = db.collection('passwords'); // same name everywhere

  const insertResult = await collection.insertOne(password);

  res.send({ success: true, result: insertResult });
});

// DELETE PASSWORD
app.delete('/', async (req, res) => {
  const password = req.body;   // e.g. { "_id": "..." } or { "username": "anant" }
  const db = client.db(dbName);
  const collection = db.collection('passwords'); // same name everywhere

  const deleteResult = await collection.deleteOne(password);

  res.send({ success: true, result: deleteResult });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
