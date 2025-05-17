import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Deal from './models/Deal.js';
import Category from './models/Category.js';
import Review from './models/Review.js';
import connectDB from './config/db.js';

dotenv.config();

// Initial categories
const categories = [
  {
    name: 'Outdoor',
    description: 'Outdoor activities and equipment'
  },
  {
    name: 'Fashion',
    description: 'Clothing and accessories'
  },
  {
    name: 'Activities',
    description: 'Entertainment and recreational activities'
  },
  {
    name: 'Technology',
    description: 'Electronics and gadgets'
  },
  {
    name: 'Wellness',
    description: 'Health and wellness services'
  },
  {
    name: 'Culture',
    description: 'Cultural experiences and tours'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Deal.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});

    console.log('Previous data cleared');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');

    // Create a mapping of category names to their IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Initial deals
    const deals = [
      {
        title: "Adventure Gear",
        location: "Amman, Jordan",
        originalPrice: 100,
        currentPrice: 50,
        discount: "50%",
        image: "/Media/camping.png",
        validUntil: "2025-12-31",
        category: categoryMap['Outdoor'],
        isNew: true,
        description: "Get the best deals on camping and hiking gear. Perfect for your next outdoor adventure.",
        address: "King Hussein Business Park, Amman"
      },
      {
        title: "Business Attire",
        location: "Irbid, Jordan",
        originalPrice: 200,
        currentPrice: 140,
        discount: "30%",
        image: "/Media/businessman-1026415_640.jpg",
        validUntil: "2025-12-31",
        category: categoryMap['Fashion'],
        description: "Professional business wear for men and women. Suits, shirts, and accessories.",
        address: "University Street, Irbid"
      },
      {
        title: "Team Activities",
        location: "Aqaba, Jordan",
        originalPrice: 80,
        currentPrice: 60,
        discount: "25%",
        image: "/Media/teamwork-7423959_640.jpg",
        validUntil: "2025-12-31",
        category: categoryMap['Activities'],
        description: "Team building activities and water sports in Aqaba.",
        address: "South Beach, Aqaba"
      },
      {
        title: "Electronics",
        location: "Zarqa, Jordan",
        originalPrice: 500,
        currentPrice: 300,
        discount: "40%",
        image: "/Media/disc.png",
        validUntil: "2025-12-31",
        category: categoryMap['Technology'],
        isNew: true,
        description: "Latest electronics and gadgets at discounted prices.",
        address: "New Zarqa, Main Street"
      }
    ];

    // Insert deals
    const createdDeals = await Deal.insertMany(deals);
    console.log('Deals seeded');

    // Initial reviews
    const reviews = [
      {
        deal: createdDeals[0]._id,
        name: "Ahmad Ibrahim",
        rating: 5,
        comment: "Great quality gear at an amazing price!"
      },
      {
        deal: createdDeals[0]._id,
        name: "Layla Hassan",
        rating: 4,
        comment: "Good selection and helpful staff."
      },
      {
        deal: createdDeals[1]._id,
        name: "Omar Khalil",
        rating: 4,
        comment: "Great quality suits at reasonable prices"
      },
      {
        deal: createdDeals[2]._id,
        name: "Sarah Ahmed",
        rating: 5,
        comment: "Amazing experience for our team!"
      }
    ];

    // Insert reviews
    await Review.insertMany(reviews);
    console.log('Reviews seeded');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();