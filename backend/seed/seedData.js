const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Rating = require('../models/Rating');

const DEMO_LOCATION = 'Lucknow, Uttar Pradesh';
const DEMO_LAT = 26.8467;
const DEMO_LNG = 80.9462;

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Rating.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Rahul Sharma',
        email: 'rahul@test.com',
        password: 'password123',
        role: 'customer',
        phone: '9876543210',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG
      },
      {
        name: 'Priya Patel',
        email: 'priya@test.com',
        password: 'password123',
        role: 'customer',
        phone: '9876543211',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG
      },
      {
        name: 'Amit Kumar',
        email: 'amit@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543212',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        bio: 'Expert electrician with 10+ years experience. Specializing in home wiring, appliance repair, and smart home installations.'
      },
      {
        name: 'Deepak Singh',
        email: 'deepak@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543213',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        bio: 'Professional plumber handling all types of plumbing work including pipe fitting, leak repair, and bathroom renovation.'
      },
      {
        name: 'Sneha Verma',
        email: 'sneha@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543214',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        bio: 'Passionate tutor specializing in Mathematics and Science for grades 8-12. IIT graduate with proven track record.'
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543215',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        bio: 'Reliable same-day delivery service. Package delivery, grocery runs, and document courier across the city.'
      },
      {
        name: 'Kavita Nair',
        email: 'kavita@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543216',
        location: DEMO_LOCATION,
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        bio: 'Trusted home cleaning professional focused on deep cleaning, sanitization, and sofa care for busy households.'
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
        bio: 'Interior and exterior painting specialist offering smooth finishes, moisture-resistant coatings, and fast room makeovers.'
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
        bio: 'Experienced carpenter for furniture repair, custom storage, and door or cabinet fixes with clean finishing work.'
      }
    ]);

    console.log(`Created ${users.length} users`);

    const providers = users.filter(u => u.role === 'provider');

    // Create services
    const services = await Service.create([
      // Electrician services
      {
        title: 'Complete Home Wiring',
        description: 'Full house electrical wiring installation and repair. Includes switchboard setup, circuit breaker installation, and safety inspection. Certified and insured work with 1-year warranty.',
        category: 'electrician',
        price: 2500,
        priceUnit: 'fixed',
        providerId: providers[0]._id,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        avgRating: 4.5,
        totalRatings: 12,
        tags: ['wiring', 'installation', 'repair']
      },
      {
        title: 'Appliance Repair Services',
        description: 'Expert repair for all home appliances - AC, refrigerator, washing machine, microwave, and more. Quick diagnosis and same-day repair with genuine spare parts.',
        category: 'electrician',
        price: 500,
        priceUnit: 'per_hour',
        providerId: providers[0]._id,
        image: '/service-images/appliance-repair.svg',
        avgRating: 4.8,
        totalRatings: 28,
        tags: ['appliance', 'AC', 'repair']
      },
      {
        title: 'Smart Home Setup',
        description: 'Transform your home into a smart home! Installation of smart switches, automated lighting, smart locks, and home automation systems. Compatible with Alexa and Google Home.',
        category: 'electrician',
        price: 5000,
        priceUnit: 'fixed',
        providerId: providers[0]._id,
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400',
        avgRating: 4.9,
        totalRatings: 8,
        tags: ['smart home', 'automation', 'IoT']
      },
      // Plumber services
      {
        title: 'Pipe Fitting & Repair',
        description: 'Professional pipe fitting, leak detection and repair services. Using latest equipment for accurate diagnosis. Emergency service available 24/7 across the city.',
        category: 'plumber',
        price: 800,
        priceUnit: 'per_hour',
        providerId: providers[1]._id,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
        avgRating: 4.3,
        totalRatings: 19,
        tags: ['pipe', 'leak', 'repair']
      },
      {
        title: 'Bathroom Renovation',
        description: 'Complete bathroom renovation including plumbing, tile work, fixture installation and waterproofing. Modern designs with premium fittings. Free consultation and 3D design preview.',
        category: 'plumber',
        price: 15000,
        priceUnit: 'fixed',
        providerId: providers[1]._id,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
        avgRating: 4.7,
        totalRatings: 6,
        tags: ['bathroom', 'renovation', 'waterproofing']
      },
      {
        title: 'Water Tank & Motor Service',
        description: 'Installation and maintenance of water tanks, motors, and pumps. Includes cleaning, repair of existing systems, and new installations with warranty.',
        category: 'plumber',
        price: 1200,
        priceUnit: 'fixed',
        providerId: providers[1]._id,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
        avgRating: 4.4,
        totalRatings: 11,
        tags: ['tank', 'motor', 'pump']
      },
      // Tutor services
      {
        title: 'Mathematics Tutoring (8-12)',
        description: 'Expert math tutoring for grades 8-12. Covering CBSE, ICSE, and State Board syllabi. Focus on concepts, problem-solving, and exam preparation. IIT graduate with 5+ years teaching experience.',
        category: 'tutor',
        price: 600,
        priceUnit: 'per_hour',
        providerId: providers[2]._id,
        image: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400',
        avgRating: 4.9,
        totalRatings: 34,
        tags: ['math', 'CBSE', 'exam prep']
      },
      {
        title: 'Science & Physics Coaching',
        description: 'Comprehensive science coaching covering Physics, Chemistry, and Biology. Hands-on experiments, visual learning, and competitive exam preparation (JEE/NEET).',
        category: 'tutor',
        price: 700,
        priceUnit: 'per_hour',
        providerId: providers[2]._id,
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        avgRating: 4.8,
        totalRatings: 22,
        tags: ['science', 'physics', 'JEE']
      },
      {
        title: 'Coding & Programming Classes',
        description: 'Learn coding from scratch! Python, JavaScript, web development, and data structures. Project-based learning with real-world applications. Perfect for beginners and intermediate learners.',
        category: 'tutor',
        price: 800,
        priceUnit: 'per_hour',
        providerId: providers[2]._id,
        image: '/service-images/coding-programming-classes.svg',
        avgRating: 4.7,
        totalRatings: 15,
        tags: ['coding', 'Python', 'web dev']
      },
      // Delivery services
      {
        title: 'Same-Day Package Delivery',
        description: 'Fast and reliable same-day delivery anywhere in the city. Real-time tracking, secure handling, and proof of delivery. Perfect for urgent documents, gifts, and small packages.',
        category: 'delivery',
        price: 150,
        priceUnit: 'fixed',
        providerId: providers[3]._id,
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400',
        avgRating: 4.6,
        totalRatings: 45,
        tags: ['delivery', 'same-day', 'courier']
      },
      {
        title: 'Grocery & Essentials Run',
        description: 'Let us handle your grocery shopping! We pick up groceries, medicines, and daily essentials from your preferred stores and deliver to your doorstep within 2 hours.',
        category: 'delivery',
        price: 200,
        priceUnit: 'fixed',
        providerId: providers[3]._id,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
        avgRating: 4.4,
        totalRatings: 31,
        tags: ['grocery', 'essentials', 'shopping']
      },
      {
        title: 'Furniture & Heavy Item Moving',
        description: 'Professional moving service for furniture and heavy items. Careful handling, proper packaging, and safe transport. Available for intra-city moves with a team of trained handlers.',
        category: 'delivery',
        price: 2000,
        priceUnit: 'fixed',
        providerId: providers[3]._id,
        image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400',
        avgRating: 4.5,
        totalRatings: 9,
        tags: ['moving', 'furniture', 'heavy']
      },
      // Cleaning services
      {
        title: 'Home Deep Cleaning',
        description: 'Complete deep cleaning for bedrooms, living rooms, kitchens, and washrooms. Includes dust removal, floor scrubbing, fan cleaning, and disinfection of high-touch surfaces.',
        category: 'cleaning',
        price: 2200,
        priceUnit: 'fixed',
        providerId: providers[4]._id,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        avgRating: 4.8,
        totalRatings: 26,
        tags: ['deep cleaning', 'sanitization', 'home']
      },
      {
        title: 'Kitchen & Bathroom Sanitization',
        description: 'Targeted cleaning for kitchens and bathrooms with stain removal, sink scrubbing, tile cleaning, and germ-focused sanitization for everyday hygiene.',
        category: 'cleaning',
        price: 900,
        priceUnit: 'fixed',
        providerId: providers[4]._id,
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400',
        avgRating: 4.6,
        totalRatings: 18,
        tags: ['kitchen', 'bathroom', 'sanitization']
      },
      {
        title: 'Sofa & Carpet Cleaning',
        description: 'Professional upholstery and carpet cleaning using fabric-safe products, odor control, and stain treatment for homes, offices, and rental properties.',
        category: 'cleaning',
        price: 700,
        priceUnit: 'per_hour',
        providerId: providers[4]._id,
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
        avgRating: 4.7,
        totalRatings: 14,
        tags: ['sofa', 'carpet', 'upholstery']
      },
      // Painting services
      {
        title: 'Interior Wall Painting',
        description: 'Room-by-room interior painting with surface preparation, crack filling, primer application, and smooth finish coats for homes and apartments.',
        category: 'painting',
        price: 6500,
        priceUnit: 'fixed',
        providerId: providers[5]._id,
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
        avgRating: 4.9,
        totalRatings: 21,
        tags: ['interior', 'wall paint', 'primer']
      },
      {
        title: 'Exterior Weatherproof Painting',
        description: 'Protect your outside walls with durable weather-resistant paint, waterproof coatings, and clean edge finishing for gates, balconies, and house exteriors.',
        category: 'painting',
        price: 12000,
        priceUnit: 'fixed',
        providerId: providers[5]._id,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        avgRating: 4.5,
        totalRatings: 11,
        tags: ['exterior', 'weatherproof', 'coating']
      },
      {
        title: 'Accent Wall & Texture Finish',
        description: 'Upgrade one room with accent wall painting, textured finishes, stencil work, and modern color combinations tailored to your interior style.',
        category: 'painting',
        price: 3500,
        priceUnit: 'fixed',
        providerId: providers[5]._id,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
        avgRating: 4.7,
        totalRatings: 9,
        tags: ['accent wall', 'texture', 'decor']
      },
      // Carpentry services
      {
        title: 'Furniture Repair & Assembly',
        description: 'Repair loose joints, broken drawers, damaged tables, and wardrobes. Also includes bed, desk, and flat-pack furniture assembly at your location.',
        category: 'carpentry',
        price: 850,
        priceUnit: 'per_hour',
        providerId: providers[6]._id,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        avgRating: 4.8,
        totalRatings: 24,
        tags: ['furniture', 'repair', 'assembly']
      },
      {
        title: 'Custom Shelves & Storage',
        description: 'Get custom wooden shelves, utility racks, and storage solutions designed for kitchens, bedrooms, workspaces, and compact apartments.',
        category: 'carpentry',
        price: 5000,
        priceUnit: 'fixed',
        providerId: providers[6]._id,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        avgRating: 4.6,
        totalRatings: 12,
        tags: ['shelves', 'storage', 'custom woodwork']
      },
      {
        title: 'Door, Window & Cabinet Fixes',
        description: 'Fix jammed doors, cabinet hinges, window frames, handles, and alignment issues with neat on-site carpentry work and replacement fitting support.',
        category: 'carpentry',
        price: 950,
        priceUnit: 'per_hour',
        providerId: providers[6]._id,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
        avgRating: 4.5,
        totalRatings: 16,
        tags: ['door', 'window', 'cabinet']
      }
    ]);

    console.log(`Created ${services.length} services`);
    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Customer: rahul@test.com / password123');
    console.log('Customer: priya@test.com / password123');
    console.log('Provider: amit@test.com / password123');
    console.log('Provider: deepak@test.com / password123');
    console.log('Provider: sneha@test.com / password123');
    console.log('Provider: vikram@test.com / password123');
    console.log('Provider: kavita@test.com / password123');
    console.log('Provider: rohan@test.com / password123');
    console.log('Provider: arjun@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
