const express = require("express");
const app = express();
require("dotenv").config()
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 3000;

// MiddleWear
app.use(cors());
app.use(express.json());

// transactions


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8xsgmgv.mongodb.net/?appName=Cluster0`;

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
    await client.connect();
    const db = client.db("finmate");
    const transactionsColl = db.collection("transactions");

    // add transaction
    app.post("/transactions", async (req, res) => {
        const newTransaction = req.body;
        const result = await transactionsColl.insertOne(newTransaction);
        res.send(result);
    })

    // get transaction data
    app.get("/transactions", async (req, res) => {
        const cursor = transactionsColl.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})