const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
// const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://study-sphere-fakrul.netlify.app"],
  credentials: true,
  optionalSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.5s9bg.mongodb.net:27017,cluster0-shard-00-01.5s9bg.mongodb.net:27017,cluster0-shard-00-02.5s9bg.mongodb.net:27017/?ssl=true&replicaSet=atlas-12sq4a-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "unauthorized access" });
  jwt.verify(token, 'fakrul', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
  });
  next();
};

async function run() {
  try {
    const db = client.db("studySphereDB");
    const assignmentsCollection = db.collection("assignments");
    const submissionsCollection = db.collection("submissionsAssignments");

    // Generate JWT
    app.post("/jwt", (req, res) => {
      try {
        const email = req.body;
        const token = jwt.sign(email, 'fakrul');
        console.log(email, token);
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
      } catch (error) {
        res.send(error.message);
      }
    });

    // Logout and clear cookie
    app.post("/logout", async (req, res) => {
      res
        .clearCookie("token", {
          maxAge: 0,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Create an assignment
    app.post("/assignments", verifyToken, async (req, res) => {
      const assignment = req.body;
      const result = await assignmentsCollection.insertOne(assignment);
      res.send(result);
    });

    // Get all assignments
    app.get("/assignments", async (req, res) => {
      const result = await assignmentsCollection.find().toArray();
      res.send(result);
    });
    // get specific assignment by id
    app.get("/assignments/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });
    // Get assignments created by a specific user
    app.get("/assignments/:email", verifyToken, async (req, res) => {
      const email = req.params.email;

      const query = { creatorEmail: email };
      const result = await assignmentsCollection.find(query).toArray();
      res.send(result);
    });
    // search by title and level
    // Get assignments based on title and difficulty level
    app.get("/assignments/search", async (req, res) => {
      const { title, difficultyLevel } = req.query; // Get search parameters from query string

      // Build the query object dynamically based on provided filters
      const query = {};

      if (title) {
        query.title = { $regex: title, $options: "i" }; // Case-insensitive search for title
      }
      if (difficultyLevel) {
        query.difficultyLevel = difficultyLevel; // Exact match for difficulty level
      }

      try {
        const result = await assignmentsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).send({ message: "Failed to fetch assignments" });
      }
    });

    // Delete an assignment
    app.delete("/assignmentsDelete/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // Update an assignment
    app.put("/assignments/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: new ObjectId(id) };
      const update = { $set: updatedData };
      const options = { upsert: true };
      const result = await assignmentsCollection.updateOne(
        query,
        update,
        options
      );

      res.send(result);
    });

    // Submit an assignment
    app.post("/submissions", verifyToken, async (req, res) => {
      const submission = req.body;
      const result = await submissionsCollection.insertOne(submission);
      res.send(result);
    });
    app.get("/submissions", async (req, res) => {
      const submissions = await submissionsCollection.find({}).toArray();
      res.send(submissions);
      // try {
      //   const submissions = await submissionsCollection.find({}).toArray();
      //   res.send(submissions);
      // } catch (error) {
      //   console.error("Error fetching submissions:", error);
      //   res.status(500).send({ message: "Failed to fetch submissions" });
      // }
    });

    // Get all submissions for a specific user
    app.get("/submissions/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      // const decodedEmail = req.user?.email;
      // if (decodedEmail !== email) {
      //   return res.status(401).send({ message: 'unauthorized access' });
      // }
      const query = { userEmail: email.trim().toLowerCase() };
      // const query = { userEmail: email };
      const result = await submissionsCollection.find(query).toArray();
      res.send(result);
    });
    // app.get('/submissions/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await submissionsCollection.findOne(query);
    //   res.send(result);
    // });
    // app.put('/submissions/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updatedData = req.body;
    //   console.log("Update request data:", req.body);

    //   const query = { _id: new ObjectId(id) };
    //   const update = { $set: updatedData };
    //   const options = { upsert: true };
    //   const result = await submissionsCollection.updateOne(query, update, options);
    //   res.send(result);
    // });

    app.patch("/submissions/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id; // Get the submission ID from the request parameters
        const { obtainMarks, feedback, status } = req.body; // Extract updated fields from the request body

        console.log("Patch request data:", req.body); // Debugging log

        // Ensure at least one field is provided for update
        if (!obtainMarks && !feedback && !status) {
          return res
            .status(400)
            .json({
              error:
                "At least one field (obtainMarks, feedback, status) is required!",
            });
        }

        const query = { _id: new ObjectId(id) }; // Find submission by ID
        const update = { $set: {} }; // Initialize update object

        // Dynamically add fields to the update object
        if (obtainMarks) update.$set.obtainMarks = obtainMarks;
        if (feedback) update.$set.feedback = feedback;
        if (status) update.$set.status = status;

        const result = await submissionsCollection.updateOne(query, update);

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ error: "Submission not found or no changes made." });
        }

        res
          .status(200)
          .json({ message: "Submission updated successfully!", result });
      } catch (error) {
        console.error("Error updating submission:", error);
        res
          .status(500)
          .json({ error: "An error occurred while updating the submission." });
      }
    });
    // Ping MongoDB to confirm successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } finally {
    // Client will close automatically if you uncomment the following:
    // await client.close();
  }
}
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Study-Sphere server...");
});

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
