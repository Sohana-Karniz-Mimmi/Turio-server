const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xcjib6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const touristsSpotCollection = client
      .db("touristsSpotDB")
      .collection("touristsSpot");
    const userCollection = client.db("newTouristUserDB").collection("users");
    const countriesCollection = client.db("countriesDB").collection("country");

    // Tourists Spot
    app.get(`/tourists`, async (req, res) => {
      const cursor = touristsSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get(`/tourists/:email`, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = touristsSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get(`/single-tourists/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
    });

    app.post(`/tourists`, async (req, res) => {
      const tourist = req.body;
      console.log(tourist);
      const result = await touristsSpotCollection.insertOne(tourist);
      res.send(result);
    });

    app.put(`/single-tourists/:id`, async (req, res) => {
      const id = req.params.id;
      const tourist = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTourist = {
        $set: {
          touristsSpotName: tourist.touristsSpotName,
          countryName: tourist.countryName,
          averageCost: tourist.averageCost,
          description: tourist.description,
          location: tourist.location,
          travelTime: tourist.travelTime,
          totalVisitors: tourist.totalVisitors,
          seasonality: tourist.seasonality,
          photo: tourist.photo,
        },
      };
      const result = await touristsSpotCollection.updateOne(
        filter,
        updateTourist,
        options
      );
      res.send(result);
    });

    app.delete(`/tourists/:id`, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Countries
    app.post(`/countries`, async (req, res) => {
      const countries = req.body;
      console.log(countries);
      const result = await countriesCollection.insertOne(countries);
      res.send(result);
    });

    app.get(`/countries`, async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get(`/countries/:countryName`, async (req, res) => {
      const countryName = req.params.countryName;
      const query = { countryName: countryName };
      const cursor = countriesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });


    // Users

    app.get(`/users`, async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get(`/users/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post(`/users`, async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Master Tourist Server is running");
});

app.listen(port, () => {
  console.log(`Master server running on port ${port}`);
});
