const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Service = require('../models/Service');

const DEMO_LOCATION = 'Lucknow, Uttar Pradesh';
const DEMO_LAT = 26.8467;
const DEMO_LNG = 80.9462;

const providerSeeds = [
  {
    name: 'Kavita Nair',
    email: 'kavita@test.com',
    password: 'password123',
    role: 'provider',
    phone: '9876543216',
    location: DEMO_LOCATION,
    lat: DEMO_LAT,
    lng: DEMO_LNG,
    bio: 'Trusted home cleaning professional focused on deep cleaning, sanitization, and sofa care for busy households.',
  },
  {
    name: 'Rohan Malhotra',
    email: 'rohan@test.com',
    password: 'password123',
    role: 'provider',
    phone: '9876543217',
    location: DEMO_LOCATION,
    lat: DEMO_LAT,
    lng: DEMO_LNG,
    bio: 'Interior and exterior painting specialist offering smooth finishes, moisture-resistant coatings, and fast room makeovers.',
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun@test.com',
    password: 'password123',
    role: 'provider',
    phone: '9876543218',
    location: DEMO_LOCATION,
    lat: DEMO_LAT,
    lng: DEMO_LNG,
    bio: 'Experienced carpenter for furniture repair, custom storage, and door or cabinet fixes with clean finishing work.',
  },
];

const serviceSeeds = [
  {
    title: 'Home Deep Cleaning',
    category: 'cleaning',
    providerEmail: 'kavita@test.com',
    description:
      'Complete deep cleaning for bedrooms, living rooms, kitchens, and washrooms. Includes dust removal, floor scrubbing, fan cleaning, and disinfection of high-touch surfaces.',
    price: 2200,
    priceUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    avgRating: 4.8,
    totalRatings: 26,
    tags: ['deep cleaning', 'sanitization', 'home'],
  },
  {
    title: 'Kitchen & Bathroom Sanitization',
    category: 'cleaning',
    providerEmail: 'kavita@test.com',
    description:
      'Targeted cleaning for kitchens and bathrooms with stain removal, sink scrubbing, tile cleaning, and germ-focused sanitization for everyday hygiene.',
    price: 900,
    priceUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400',
    avgRating: 4.6,
    totalRatings: 18,
    tags: ['kitchen', 'bathroom', 'sanitization'],
  },
  {
    title: 'Sofa & Carpet Cleaning',
    category: 'cleaning',
    providerEmail: 'kavita@test.com',
    description:
      'Professional upholstery and carpet cleaning using fabric-safe products, odor control, and stain treatment for homes, offices, and rental properties.',
    price: 700,
    priceUnit: 'per_hour',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
    avgRating: 4.7,
    totalRatings: 14,
    tags: ['sofa', 'carpet', 'upholstery'],
  },
  {
    title: 'Interior Wall Painting',
    category: 'painting',
    providerEmail: 'rohan@test.com',
    description:
      'Room-by-room interior painting with surface preparation, crack filling, primer application, and smooth finish coats for homes and apartments.',
    price: 6500,
    priceUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
    avgRating: 4.9,
    totalRatings: 21,
    tags: ['interior', 'wall paint', 'primer'],
  },
  {
    title: 'Exterior Weatherproof Painting',
    category: 'painting',
    providerEmail: 'rohan@test.com',
    description:
      'Protect your outside walls with durable weather-resistant paint, waterproof coatings, and clean edge finishing for gates, balconies, and house exteriors.',
    price: 12000,
    priceUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    avgRating: 4.5,
    totalRatings: 11,
    tags: ['exterior', 'weatherproof', 'coating'],
  },
  {
    title: 'Accent Wall & Texture Finish',
    category: 'painting',
    providerEmail: 'rohan@test.com',
    description:
      'Upgrade one room with accent wall painting, textured finishes, stencil work, and modern color combinations tailored to your interior style.',
    price: 3500,
    priceUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    avgRating: 4.7,
    totalRatings: 9,
    tags: ['accent wall', 'texture', 'decor'],
  },
  {
    title: 'Furniture Repair & Assembly',
    category: 'carpentry',
    providerEmail: 'arjun@test.com',
    description:
      'Repair loose joints, broken drawers, damaged tables, and wardrobes. Also includes bed, desk, and flat-pack furniture assembly at your location.',
    price: 850,
    priceUnit: 'per_hour',
    image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400',
    avgRating: 4.8,
    totalRatings: 24,
    tags: ['furniture', 'repair', 'assembly'],
  },
  {
    title: 'Custom Shelves & Storage',
    category: 'carpentry',
    providerEmail: 'arjun@test.com',
    description:
      'Get custom wooden shelves, utility racks, and storage solutions designed for kitchens, bedrooms, workspaces, and compact apartments.',
    price: 5000,
    priceUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    avgRating: 4.6,
    totalRatings: 12,
    tags: ['shelves', 'storage', 'custom woodwork'],
  },
  {
    title: 'Door, Window & Cabinet Fixes',
    category: 'carpentry',
    providerEmail: 'arjun@test.com',
    description:
      'Fix jammed doors, cabinet hinges, window frames, handles, and alignment issues with neat on-site carpentry work and replacement fitting support.',
    price: 950,
    priceUnit: 'per_hour',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
    avgRating: 4.5,
    totalRatings: 16,
    tags: ['door', 'window', 'cabinet'],
  },
];

async function ensureProvider(providerSeed) {
  let provider = await User.findOne({ email: providerSeed.email });

  if (!provider) {
    provider = await User.create(providerSeed);
    return { provider, created: true };
  }

  provider.name = providerSeed.name;
  provider.role = 'provider';
  provider.phone = providerSeed.phone;
  provider.location = providerSeed.location;
  provider.lat = providerSeed.lat;
  provider.lng = providerSeed.lng;
  provider.bio = providerSeed.bio;
  await provider.save();

  return { provider, created: false };
}

async function ensureService(serviceSeed, providerId) {
  const existingService = await Service.findOne({
    title: serviceSeed.title,
    category: serviceSeed.category,
  });

  if (!existingService) {
    await Service.create({
      title: serviceSeed.title,
      description: serviceSeed.description,
      category: serviceSeed.category,
      price: serviceSeed.price,
      priceUnit: serviceSeed.priceUnit,
      providerId,
      image: serviceSeed.image,
      avgRating: serviceSeed.avgRating,
      totalRatings: serviceSeed.totalRatings,
      tags: serviceSeed.tags,
      isActive: true,
    });

    return { created: true };
  }

  existingService.description = serviceSeed.description;
  existingService.price = serviceSeed.price;
  existingService.priceUnit = serviceSeed.priceUnit;
  existingService.providerId = providerId;
  existingService.image = serviceSeed.image;
  existingService.avgRating = serviceSeed.avgRating;
  existingService.totalRatings = serviceSeed.totalRatings;
  existingService.tags = serviceSeed.tags;
  existingService.isActive = true;
  await existingService.save();

  return { created: false };
}

async function syncMissingCategoryData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const providerMap = new Map();
    let providersCreated = 0;
    let providersUpdated = 0;

    for (const providerSeed of providerSeeds) {
      const result = await ensureProvider(providerSeed);
      providerMap.set(providerSeed.email, result.provider);

      if (result.created) {
        providersCreated += 1;
      } else {
        providersUpdated += 1;
      }
    }

    let servicesCreated = 0;
    let servicesUpdated = 0;

    for (const serviceSeed of serviceSeeds) {
      const provider = providerMap.get(serviceSeed.providerEmail);
      const result = await ensureService(serviceSeed, provider._id);

      if (result.created) {
        servicesCreated += 1;
      } else {
        servicesUpdated += 1;
      }
    }

    const categoryCounts = await Service.aggregate([
      {
        $match: {
          category: { $in: ['cleaning', 'painting', 'carpentry'] },
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log(`Providers created: ${providersCreated}`);
    console.log(`Providers updated: ${providersUpdated}`);
    console.log(`Services created: ${servicesCreated}`);
    console.log(`Services updated: ${servicesUpdated}`);
    console.log('Category counts:', categoryCounts);

    process.exit(0);
  } catch (error) {
    console.error('Sync error:', error.message);
    process.exit(1);
  }
}

syncMissingCategoryData();
