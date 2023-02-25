// The http module contains methods to handle http queries.
const http = require('http')
// Let's import our logic.
const fileQuery = require('./queryManagers/front.js')
const apiQuery = require('./queryManagers/api.js')

/* The http module contains a createServer function, which takes one argument, which is the function that
** will be called whenever a new request arrives to the server.
 */
http.createServer(function (request, response) {
    // First, let's check the URL to see if it's a REST request or a file request.
    // We will remove all cases of "../" in the url for security purposes.
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });

    try {
        // If the URL starts by /api, then it's a REST request (you can change that if you want).
        if (filePath[1] === "api") {
            apiQuery.manage(request, response);
            // If it doesn't start by /api, then it's a request for a file.
        } else {
            fileQuery.manage(request, response);
        }
    } catch(error) {
        console.log(`error while processing ${request.url}: ${error}`)
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
// For the server to be listening to request, it needs a port, which is set thanks to the listen function.
}).listen(8000);

const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://admin:admin@ps8cluster.ceqcgq2.mongodb.net/?retryWrites=true&w=majority";
const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

async function createDatabaseAndUser() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        //NAME OF THE DATABASE
        const db = client.db("connect4");
        //NAME OF THE COLLECTION
        const usersCollection = db.collection("log");
        //VALUES TO INSERT
        // const values = { username: "admin" , password: "admin" , mail : "aze@gmail.com" };
        //
        // const result = await usersCollection.insertOne(values);
        // console.log('Document inserted', result.insertedId);
    } catch (err) {
        console.error('Failed to create database or user', err);
    } finally {
        await client.close();
    }
}
createDatabaseAndUser();