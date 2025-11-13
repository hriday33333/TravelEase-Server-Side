const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNANE}:${process.env.DB_PASSWORD}@cluster0.gisrno5.mongodb.net/?appName=Cluster0`;

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

    const db = client.db('TravelEase-server');
    const modelCollection = db.collection('models');
    const usersCollection = db.collection('users');
    const bookingsCollection = db.collection('bookings');

    // Booking related
    // 🔹 Get all bookings (or filter by user email)
    app.get('/bookings', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.userEmail = email;
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });


    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });

    // user
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        res.send({ message: 'user already exits' });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    app.get('/models', async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        query.userEmail = email;
      }

      const result = await modelCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/sortmodels', async (req, res) => {
      const result = await modelCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      res.send(result);
    });

    app.get('/vehicles', async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    app.get('/models/:id', async (req, res) => {
      const id = req.params.id;
     
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid ID format' });
      }
      const query = { _id: new ObjectId(id) };
      const result = await modelCollection.findOne(query);
      res.send(result);
    });

    app.post('/models', async (req, res) => {
      const newProducts = req.body;
      const result = await modelCollection.insertOne(newProducts);
      res.send(result);
    });

    app.delete('/models/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await modelCollection.deleteOne(query);
      res.send(result);
    });

    app.put('/models/:id', async (req, res) => {
      const id = req.params.id;
      const updateProducts = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: updateProducts,
      };
      const result = await modelCollection.updateOne(query, update);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
