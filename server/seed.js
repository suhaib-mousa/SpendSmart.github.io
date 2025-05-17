import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Deal from './models/Deal.js';
import Category from './models/Category.js';
import Review from './models/Review.js';
import User from './models/User.js';
import Tip from './models/Tip.js';
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

// Initial tips
const tips = [
  {
    title: "Ways to make money from the Internet",
    text: "A video from the Online Lessons channel discusses ways to make money online and increase your sources of income..",
    link: "https://youtu.be/wAIIct0rNZU?si=duAyUiHhcqcePIbT",
    image: "/Media/Untitled design(8).png",
    order: 1
  },
  {
    title: "The most important rule in investment",
    text: "What is investment, why do we invest, and how? This clip will answer these questions.",
    link: "https://youtu.be/bFfeCSbLaB8?si=EDYwvHJEwK6WHj4u",
    image: "/Media/Untitled design(10).png",
    order: 2
  },
  {
    title: "Best money management system",
    text: "A video from the Dupamicaffeine channel shows a practical way to divide your monthly salary and increase your income..",
    link: "https://youtu.be/loGAyJTbu88?si=C6H6odrof4pjwXlS",
    image: "/Media/Untitled design(11).png",
    order: 3
  },
  {
    title: "How to be creative in financial management and save your money?",
    text: "YouTube video showing ways to manage your finances well.",
    link: "https://youtu.be/s0t_4MSQEYQ?si=aX-tJnzhbu4Alc-w",
    image: "/Media/Untitled design(14).png",
    order: 4
  },
  {
    title: "financial freedom",
    text: "YouTube clip from the show \"Seen\" talking about financial freedom.",
    link: "https://youtu.be/kZTSzFfMFjY?si=yGGtVtRu5M5NTLLw",
    image: "/Media/Untitled design(12).png",
    order: 5
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Check if data already exists
    const tipsCount = await Tip.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const dealsCount = await Deal.countDocuments();
    const usersCount = await User.countDocuments();

    // Only seed if no data exists
    if (tipsCount === 0) {
      await Tip.insertMany(tips);
      console.log('Tips seeded');
    }

    if (categoriesCount === 0) {
      const createdCategories = await Category.insertMany(categories);
      console.log('Categories seeded');

      if (dealsCount === 0) {
        // Create initial deals
        const deals = [
          {
            title: "Adventure Gear",
            location: "Amman, Jordan",
            originalPrice: 100,
            currentPrice: 50,
            discount: "50%",
            image: "/Media/camping.png",
            validUntil: "2025-12-31",
            category: createdCategories[0]._id,
            rating: 4.5,
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
            category: createdCategories[1]._id,
            rating: 4.2,
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
            category: createdCategories[2]._id,
            rating: 4.8,
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
            category: createdCategories[3]._id,
            rating: 4.3,
            isNew: true,
            description: "Latest electronics and gadgets at discounted prices.",
            address: "New Zarqa, Main Street"
          }
        ];

        await Deal.insertMany(deals);
        console.log('Deals seeded');
      }
    }

    if (usersCount === 0) {
      // Create test user
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Test user created');
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();