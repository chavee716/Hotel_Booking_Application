const express = require('express');
const router = express.Router();
const Place = require('./models/Place');

router.get('/search', async (req, res) => {
  try {
    const { query, guests } = req.query;
    console.log('Search params:', { query, guests });

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

    console.log('Results found:', places.length);

    res.json({ places });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error performing search', 
      error: error.message 
    });
  }
});

module.exports = router;