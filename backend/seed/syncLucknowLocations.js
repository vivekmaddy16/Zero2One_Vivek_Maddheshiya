const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const DEMO_LOCATION = 'Lucknow, Uttar Pradesh';
const DEMO_LAT = 26.8467;
const DEMO_LNG = 80.9462;

const DEMO_EMAILS = [
  'rahul@test.com',
  'priya@test.com',
  'amit@test.com',
  'deepak@test.com',
  'sneha@test.com',
  'vikram@test.com',
  'kavita@test.com',
  'rohan@test.com',
  'arjun@test.com',
];

async function syncLucknowLocations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await User.updateMany(
      { email: { $in: DEMO_EMAILS } },
      {
        $set: {
          location: DEMO_LOCATION,
          lat: DEMO_LAT,
          lng: DEMO_LNG,
        },
      }
    );

    const sampleUsers = await User.find({ email: { $in: DEMO_EMAILS } })
      .select('name email role location lat lng')
      .sort({ email: 1 });

    console.log(`Matched users: ${result.matchedCount}`);
    console.log(`Updated users: ${result.modifiedCount}`);
    console.log('Sample locations:', sampleUsers);

    process.exit(0);
  } catch (error) {
    console.error('Lucknow sync error:', error.message);
    process.exit(1);
  }
}

syncLucknowLocations();
