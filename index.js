const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

// const port =  7777;
const port = 7777;

// middleware
app.use(express.json());
app.use(cors());

// userId: mongodb7
// userPass: W9cFGIBkpAkFakaS




// Mongodb CONNECTion URI
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.xwklikq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// CRUD Operations - for Mongodb
async function run() {
    try {
        const database = client.db("TourBookingDatabase77");
        const packagesCollection = database.collection("packages");


        //   GET - All data from Database
        app.get('/packages', async (req, res) => {
            const query = {};
            const cursor = packagesCollection.find(query);

            const result = await cursor.toArray();
            // console.log(result)
            res.send(result);
        });


        // GET API - to get All Orders
        app.get('/manageAllOrders', async (req, res) => {
            const query = {};
            const cursor = packagesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })



        // GET API - SPECIFIC user (Find-Many with same email)
        app.get('/forSpecificEmail/:anyEmail', async (req, res) => {
            const email = req.params.anyEmail;
            const query = { email };
            const cursor = packagesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        //DELETE API - Specific ID
        //Damn! Deleting by ID (_id) is very exceptional! We need to "IMPORT" the "ObjectId" function (that belong to Mongodb)! This time we can't just declare an object and match them like others and match them from mongodb!!
        app.delete('/deleteOrder/:anyId', async (req, res) => {
            const id = req.params.anyId;
            const query = { _id: new ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);

            if (result.deletedCount === 1) {
                // console.log("Successfully deleted one document.");
            } else {
                // console.log("No documents matched the query. Deleted 0 documents.");
            };

            res.send(result);
        });


        // POST - create a document to insert
        app.get('/package', async (req, res) => {
            const doc = {
                title: "Record of a Shriveled!!",
                content: "No bytes, no problem. Just insert a document!!",
            }
            const result = await packagesCollection.insertOne(doc);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });


        //POST method to post or write data in mongodb with the user email id*********
        app.post('/pack', async (req, res) => {
            const doc = req.body;
            // console.log("RR", req.body)

            const result = await packagesCollection.insertOne(doc);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });


        // POST - To ADD A NEW SERVICE 
        const database2 = client.db("TourBookingDatabase78");
        const servicesCollection = database2.collection("services");
        app.post('/addNewService', async (req, res) => {
            const doc2 = req.body;
            // console.log("New SER::", doc2)

            const result = await servicesCollection.insertOne(doc2);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });

        //GET - All Services
        app.get('/newNewServices', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // UPDATE API - PUT (all)/ PATCH (partially)
        app.patch('/updateStatus/:anyId', async (req, res) => {
            const id = req.params.anyId;
            const upStatus = req.body.status;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: upStatus,       //dynamic
                    //  status: 'Confirm!', // hard coded
                    note: 'This is updated now!',
                },
            };

            const result = await packagesCollection.updateOne(filter, updateDoc);
            res.send(result);
        });


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


//GET API - home
app.get('/', async (req, res) => {
    res.send("Hi, this is Tour Server HOME!!")
});



app.listen(port, () => {
    // console.log(`Listening to port: ${port}`)
});