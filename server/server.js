const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {getModels}  =require('./model')


const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 123456;
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';

//middleware
app.use(cors());
app.use(express.json());


async function startServer() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('meditationappDB');
    users = db.collection('users');

    // Register Route
    app.post('/api/register', async (req, res) => {
      try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await users.insertOne({
          name,
          email,
          password: hashedPassword,
          role,
          createdAt: new Date(),
        });

        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
      }
    });

    // Login Route
    app.post('/api/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await users.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, role: user.role, name: user.name });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
      }
    });

    //fetch sessions for users 
    app.get('/api/sessions', async (req, res) => {
        try {
          const models = getModels(db);
          const sessions = await models.sessions.find().toArray();
          res.json(sessions);
        } catch (err) {
            console.error('Error fetching sessions:', err);
            res.status(500).json({ message: 'Failed to fetch sessions' });
        }
    });

    //fetch all details for admins
    app.get('/api/admin-stats', async (req, res) => {
  try {
    const models = getModels(db);

    const totalUsers = await models.users.countDocuments();
    const totalSessions = await models.sessions.countDocuments();
    const totalReports = await models.feedback.countDocuments();
    const history = await models.history.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    res.json({
      totalUsers,
      totalSessions,
      totalReports,
      history,
    });
  } catch (err) {
    console.error('Failed to fetch admin stats:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});



    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();