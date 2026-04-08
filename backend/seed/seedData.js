const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Rating = require('../models/Rating');

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
        location: 'Mumbai, Maharashtra',
        lat: 19.0760,
        lng: 72.8777
      },
      {
        name: 'Priya Patel',
        email: 'priya@test.com',
        password: 'password123',
        role: 'customer',
        phone: '9876543211',
        location: 'Delhi, NCR',
        lat: 28.7041,
        lng: 77.1025
      },
      {
        name: 'Amit Kumar',
        email: 'amit@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543212',
        location: 'Mumbai, Maharashtra',
        lat: 19.0760,
        lng: 72.8777,
        bio: 'Expert electrician with 10+ years experience. Specializing in home wiring, appliance repair, and smart home installations.'
      },
      {
        name: 'Deepak Singh',
        email: 'deepak@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543213',
        location: 'Delhi, NCR',
        lat: 28.7041,
        lng: 77.1025,
        bio: 'Professional plumber handling all types of plumbing work including pipe fitting, leak repair, and bathroom renovation.'
      },
      {
        name: 'Sneha Verma',
        email: 'sneha@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543214',
        location: 'Bangalore, Karnataka',
        lat: 12.9716,
        lng: 77.5946,
        bio: 'Passionate tutor specializing in Mathematics and Science for grades 8-12. IIT graduate with proven track record.'
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram@test.com',
        password: 'password123',
        role: 'provider',
        phone: '9876543215',
        location: 'Mumbai, Maharashtra',
        lat: 19.0760,
        lng: 72.8777,
        bio: 'Reliable same-day delivery service. Package delivery, grocery runs, and document courier across the city.'
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
        title: 'Appliance Repair & Service',
        description: 'Expert repair for all home appliances - AC, refrigerator, washing machine, microwave, and more. Quick diagnosis and same-day repair with genuine spare parts.',
        category: 'electrician',
        price: 500,
        priceUnit: 'per_hour',
        providerId: providers[0]._id,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
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
        title: 'Coding & Programming Lessons',
        description: 'Learn coding from scratch! Python, JavaScript, web development, and data structures. Project-based learning with real-world applications. Perfect for beginners and intermediate learners.',
        category: 'tutor',
        price: 800,
        priceUnit: 'per_hour',
        providerId: providers[2]._id,
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=400',
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

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
