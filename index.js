const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xcjib6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const touristsSpotCollection = client.db('touristsSpotDB').collection('touristsSpot')
    // const userCollection = client.db('newUserDB').collection('users');

  // Tourists Spot
    app.get(`/tourists`, async(req, res) => {
        const cursor = touristsSpotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get(`/tourists/:id`, async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
    });

    app.post(`/tourists`, async(req, res) => {
        const coffee = req.body
        console.log(coffee);
        const result = await touristsSpotCollection.insertOne(coffee)
        res.send(result);

    })

    app.put(`/tourists/:id`, async (req, res) => {
      const id = req.params.id
      const coffee = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateCoffee = {
        $set: {
        name : coffee.name,
        chef : coffee.chef,
        supplier : coffee.supplier,
        taste : coffee.taste,
        category : coffee.category,
        details : coffee.details,
        photo : coffee.photo,
        }
      } 
      const result = await touristsSpotCollection.updateOne(filter, updateCoffee, options)
      res.send(result);
    });

    app.delete(`/tourists/:id`, async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await touristsSpotCollection.deleteOne(query);
      res.send(result);
    })


    // Users

   
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Master Tourist Server is running')
})

app.listen(port, () =>{
    console.log(`Coffer server running on port ${port}`);
})