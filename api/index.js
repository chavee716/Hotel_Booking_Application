const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime-types');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

// Helper function to get user data from token
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (!token) {
      reject('No token found');
      return;
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) reject(err);
      resolve(userData);
    });
  });
}

// Search places route
app.get('/api/places/search', async (req, res) => {
  try {
    const { query, guests } = req.query;
    console.log('Search request received:', { query, guests });

    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ];
    }

    if (guests) {
      searchQuery.maxGuests = { $gte: parseInt(guests) };
    }

    console.log('MongoDB query:', searchQuery);

    const places = await Place.find(searchQuery)
      .sort({ price: 1 })
      .limit(50);

    console.log(`Found ${places.length} results`);
    res.json({ places });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error performing search', 
      error: error.message 
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json('test ok');
});

// Register route
app.post('/api/register', async (req, res) => {
  const {name, email, password} = req.body;
  
  try {
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(422).json({error: 'Email already exists'});
    }

    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    
    res.json({
      _id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email
    });
  } catch (e) {
    res.status(422).json(e);
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const {email, password} = req.body;
  
  try {
    const userDoc = await User.findOne({email});
    if (!userDoc) {
      return res.status(404).json('User not found');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(422).json('Invalid password');
    }

    jwt.sign({
      email: userDoc.email,
      id: userDoc._id
    }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }).json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email
      });
    });
  } catch (err) {
    res.status(500).json('Internal server error');
  }
});

// Profile route
app.get('/api/profile', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(null);
  }

  try {
    const userData = await getUserDataFromReq(req);
    const user = await User.findById(userData.id).select('-password');
    if (!user) {
      return res.json(null);
    }
    res.json(user);
  } catch (error) {
    res.json(null);
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }).json(true);
});

// Upload photo by link
app.post('/api/upload-by-link', async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'No link provided' });
  }

  try {
    const newName = 'photo' + Date.now() + '.jpg';
    const destinationPath = __dirname + '/uploads/' + newName;

    await imageDownloader.image({
      url: link,
      dest: destinationPath,
    });

    const url = `/uploads/${newName}`;
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to download image' });
  }
});

// Upload photos
const photosMiddleware = multer({dest: 'uploads/'});
app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  try {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const {path, originalname} = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadedFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Create place
app.post('/api/places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      title, address, addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;

    const placeDoc = await Place.create({
      owner: userData.id,
      title, 
      address,
      photos: addedPhotos.map(url => ({ url })),
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create place' });
  }
});

// Get user places
app.get('/api/user-places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Get single place
app.get('/api/places/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

// Update place
app.put('/api/places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      id, title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;

    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (userData.id !== placeDoc.owner.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await placeDoc.updateOne({
      title, 
      address, 
      photos: addedPhotos.map(url => ({ url })),
      description,
      perks, 
      extraInfo, 
      checkIn, 
      checkOut, 
      maxGuests, 
      price,
    });

    res.json('ok');
  } catch (error) {
    res.status(500).json({ error: 'Failed to update place' });
  }
});

// Get all places
app.get('/api/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      place, checkIn, checkOut,
      numberOfGuests, name, phone, price
    } = req.body;

    const booking = await Booking.create({
      place,
      user: userData.id,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});