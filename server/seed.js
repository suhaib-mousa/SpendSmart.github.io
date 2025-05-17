import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Deal from './models/Deal.js';
import Category from './models/Category.js';
import Review from './models/Review.js';
import User from './models/User.js';
import Tip from './models/Tip.js';
import connectDB from './config/db.js';

dotenv.config();

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

    // Clear existing data
    await Deal.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    await Tip.deleteMany({});

    console.log('Previous data cleared');

    // Create test user
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('Test user created');

    // Insert tips
    await Tip.insertMany(tips);
    console.log('Tips seeded');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');

    // Rest of your seeding logic...
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();