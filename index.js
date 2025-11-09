const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://TravelEase-server:rSnVtJk2pNgWcGmy@cluster0.gisrno5.mongodb.net/?appName=Cluster0';

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
    await client.connect();

    const db = client.db('TravelEase-server');
    const modelCollection = db.collection('models');

    app.get('/models', async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        query.userEmail = email; // <-- এইখানে ডাটাবেজের ফিল্ড নাম দিতে হবে
      }

      const result = await modelCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/models/:id', async (req, res) => {
      const id = req.params.id;
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

    app.patch('/models/:id', async (req, res) => {
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
    await client.db('admin').command({ ping: 1 });
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
