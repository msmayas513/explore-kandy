

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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


/* Administrator Login API */

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const [rows] = await db.query(
      'SELECT id, username, password_hash FROM admins WHERE username = ?',
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    const admin = rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');

      return res.status(500).json({
        message: 'Login service unavailable'
      });
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      username: admin.username
    });

  } catch (error) {
    console.error('Admin login error:', error.message);

    res.status(500).json({
      message: 'Login failed'
    });
  }
});


/* Verify Administrator Token */

const verifyAdminToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Administrator authentication required'
    });
  }

  const token = authorizationHeader.slice(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired authentication token'
    });
  }
};

/* Add New Attraction - Admin Only */

app.post('/api/admin/attractions', verifyAdminToken, async (req, res) => {
  try {
    const {
      name,
      category,
      distance,
      description,
      latitude,
      longitude
    } = req.body;

    const validCategories = ['Nature', 'Religious', 'Historical'];

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !validCategories.includes(category) ||
      distance === '' ||
      distance === null ||
      distance === undefined ||
      !Number.isFinite(Number(distance)) ||
      Number(distance) < 0
    ) {
      return res.status(400).json({
        message: 'Please provide a valid name, category, and distance'
      });
    }

    const validCoordinate = (value, minimum, maximum) =>
      value === null ||
      value === undefined ||
      value === '' ||
      (
        Number.isFinite(Number(value)) &&
        Number(value) >= minimum &&
        Number(value) <= maximum
      );

    if (
      !validCoordinate(latitude, -90, 90) ||
      !validCoordinate(longitude, -180, 180)
    ) {
      return res.status(400).json({
        message: 'Invalid latitude or longitude'
      });
    }

    const [result] = await db.query(
      `INSERT INTO attractions
       (name, category, distance, description, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category,
        Number(distance),
        description || '',
        latitude === '' || latitude == null ? null : Number(latitude),
        longitude === '' || longitude == null ? null : Number(longitude)
      ]
    );

    res.status(201).json({
      message: 'Attraction added successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error adding attraction:', error.message);

    res.status(500).json({
      message: 'Failed to add attraction'
    });
  }
});

/* Edit Attraction - Admin Only */

app.put('/api/admin/attractions/:id', verifyAdminToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      category,
      distance,
      description,
      latitude,
      longitude
    } = req.body || {};

    const validCategories = ['Nature', 'Religious', 'Historical'];

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid attraction ID' });
    }

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !validCategories.includes(category) ||
      distance === '' ||
      distance == null ||
      !Number.isFinite(Number(distance)) ||
      Number(distance) < 0 ||
      Number(distance) > 999.9
    ) {
      return res.status(400).json({
        message: 'Please provide a valid name, category, and distance'
      });
    }

    const validCoordinate = (value, min, max) =>
      value == null ||
      value === '' ||
      (Number.isFinite(Number(value)) &&
       Number(value) >= min &&
       Number(value) <= max);

    if (
      !validCoordinate(latitude, -90, 90) ||
      !validCoordinate(longitude, -180, 180)
    ) {
      return res.status(400).json({
        message: 'Invalid latitude or longitude'
      });
    }

    if (typeof description !== 'string' && description != null) {
      return res.status(400).json({
        message: 'Invalid description'
      });
    }

    const [result] = await db.query(
      `UPDATE attractions
       SET name = ?, category = ?, distance = ?,
           description = ?, latitude = ?, longitude = ?
       WHERE id = ?`,
      [
        name.trim(),
        category,
        Number(distance),
        description || '',
        latitude == null || latitude === '' ? null : Number(latitude),
        longitude == null || longitude === '' ? null : Number(longitude),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Attraction not found'
      });
    }

    res.json({ message: 'Attraction updated successfully' });

  } catch (error) {
    console.error('Error updating attraction:', error.message);
    res.status(500).json({ message: 'Failed to update attraction' });
  }
});

/* Delete Attraction - Admin Only */

app.delete('/api/admin/attractions/:id', verifyAdminToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'Invalid attraction ID'
      });
    }

    const [result] = await db.query(
      'DELETE FROM attractions WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Attraction not found'
      });
    }

    res.json({
      message: 'Attraction deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting attraction:', error.message);

    res.status(500).json({
      message: 'Failed to delete attraction'
    });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Explore Kandy server running on port ${PORT}`);
});
