const express = require('express');
const router = express.Router();
const Place = require('./models/Place'); // Assuming you have a Place model

// Search places API endpoint
router.get('/search', async (req, res) => {
  try {
    const { 
      destination, 
      checkIn, 
      checkOut, 
      guests 
    } = req.query;

    // Build dynamic search query
    let searchQuery = {};

    // Filter by destination (case-insensitive partial match)
    if (destination) {
      searchQuery.location = { 
        $regex: destination, 
        $options: 'i' 
      };
    }

    // Filter by guest capacity
    if (guests) {
      searchQuery.maxGuests = { $gte: parseInt(guests) };
    }

    // Filter by availability
    if (checkIn && checkOut) {
      searchQuery.$and = [
        { 
          bookings: { 
            $not: { 
              $elemMatch: { 
                $or: [
                  { 
                    $and: [
                      { checkInDate: { $lt: new Date(checkOut) } },
                      { checkOutDate: { $gt: new Date(checkIn) } }
                    ]
                  }
                ]
              } 
            } 
          } 
        }
      ];
    }

    // Perform search with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const places = await Place.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .select('-bookings'); // Exclude booking details for privacy

    // Count total matching results
    const totalResults = await Place.countDocuments(searchQuery);

    res.json({
      places,
      currentPage: page,
      totalPages: Math.ceil(totalResults / limit),
      totalResults
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error performing search', 
      error: error.message 
    });
  }
});

module.exports = router;