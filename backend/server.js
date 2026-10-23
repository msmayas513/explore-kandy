
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');




const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Explore Kandy Backend is Running!'
  });
});




app.get('/api/attractions', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM attractions ORDER BY id'
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching attractions:', error.message);

    res.status(500).json({
      message: 'Failed to fetch attractions'
    });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Explore Kandy server running on port ${PORT}`);
});
