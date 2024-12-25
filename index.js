const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5s9bg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const crowdCubeCollection = client.db('crowdDB').collection('crowd');
    const donationCollection = client.db('crowdDB').collection('donations');




    // Get all campaigns
 app.get('/campaigns', async (req, res) => {
  const cursor = crowdCubeCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});
    // Add a new campaign
    app.post('/campaigns', async (req, res) => {
      const campaign = req.body;
      if (!campaign.userEmail) {
        return res.status(400).send({ error: "User email is required" });
      }
      const result = await crowdCubeCollection.insertOne(campaign);
      res.send(result);
    });
       // Get campaigns created by a specific user
       app.get('/myCampaigns', async (req, res) => {
        const email = req.query.email;
        const query = { userEmail: email.trim().toLowerCase() }; // Normalize email
        const campaigns = await crowdCubeCollection.find(query).toArray();
        res.send(campaigns);
      });

    // Get campaign details by ID
    app.get('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const campaign = await crowdCubeCollection.findOne(query);
      res.send(campaign);
    });

    // Update a campaign
    app.put('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedData };
      const result = await crowdCubeCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete a campaign
    app.delete('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await crowdCubeCollection.deleteOne(query);
      res.send(result);
    });

    // Add a donation
    app.post('/donations', async (req, res) => {
      const donation = req.body;
      const result = await donationCollection.insertOne(donation);
      res.send(result);
    });



    // Get donations made by a specific user
    app.get('/myDonation', async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const donations = await donationCollection.find(query).toArray();
      res.send(donations);
    });
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    console.log('Connected successfully to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Crowdcube server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Crowdcube server is running on port ${port}`);
});
