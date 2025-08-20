const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connection URL (use env if available, else fallback)
const url = process.env.mongo_url;
const client = new MongoClient(url);

// Database Name
const dbName = 'PassOP';
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// ✅ Allow CORS (replace * with your frontend domain in production)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",  
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));

// Connect once
client.connect()
  .then(() => console.log("✅ MongoDB connected:", url))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ========================= API ROUTES =========================

// GET passwords
app.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new password
app.post('/', async (req, res) => {
  try {
    const password = req.body;   // JSON body sent by client
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const insertResult = await collection.insertOne(password);
    res.json({ success: true, result: insertResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE password by id
app.delete('/', async (req, res) => {
  try {
    const { id } = req.body; // frontend sends { "id": "123" }
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const deleteResult = await collection.deleteOne({ id: id });
    res.json({ success: true, result: deleteResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================= SERVER START =========================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
