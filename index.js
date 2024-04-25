const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json());





app.get('/', (req, res) => {
    res.send('Coffee server coming soon')
})

app.listen(port, () =>{
    console.log(`Coffer server running on port ${port}`);
})