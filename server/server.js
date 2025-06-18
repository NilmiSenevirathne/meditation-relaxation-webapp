const express = require('express');
const {MongoClient} = require('mongodb');
const cors = require('cors');
const {getModels} = require('./model');


const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(express.json());


//database connection
const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri)

const ConnectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('meditationappDB');
    const {users, sessions, history, feedback} = getModels(db);


    //register user routes
    app.post('/api/register',async (req, res) => {
      try {
        const { name, email, password, role } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = {
          name,
          email,
          password, 
          role,
          createdAt: new Date()
        };

        const result = await users.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
      }
    });


  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

app.listen(PORT, () => {
  console.log('Server is running on port 5000');
  ConnectDB();
});