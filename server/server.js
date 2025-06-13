const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');


const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri)

const ConnectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  ConnectDB();
});