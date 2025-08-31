const mongoose = require('mongoose');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-finance');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'income', color: '#27ae60', icon: 'work', isDefault: true },
  { name: 'Freelance', type: 'income', color: '#3498db', icon: 'computer', isDefault: true },
  { name: 'Investment', type: 'income', color: '#9b59b6', icon: 'trending_up', isDefault: true },
  { name: 'Gift', type: 'income', color: '#e74c3c', icon: 'card_giftcard', isDefault: true },
  { name: 'Other Income', type: 'income', color: '#95a5a6', icon: 'attach_money', isDefault: true },

  // Expense categories
  { name: 'Food & Dining', type: 'expense', color: '#e67e22', icon: 'restaurant', isDefault: true },
  { name: 'Transportation', type: 'expense', color: '#34495e', icon: 'directions_car', isDefault: true },
  { name: 'Shopping', type: 'expense', color: '#e91e63', icon: 'shopping_cart', isDefault: true },
  { name: 'Entertainment', type: 'expense', color: '#9c27b0', icon: 'movie', isDefault: true },
  { name: 'Bills & Utilities', type: 'expense', color: '#607d8b', icon: 'receipt', isDefault: true },
  { name: 'Healthcare', type: 'expense', color: '#4caf50', icon: 'local_hospital', isDefault: true },
  { name: 'Education', type: 'expense', color: '#ff9800', icon: 'school', isDefault: true },
  { name: 'Travel', type: 'expense', color: '#00bcd4', icon: 'flight', isDefault: true },
  { name: 'Groceries', type: 'expense', color: '#8bc34a', icon: 'local_grocery_store', isDefault: true },
  { name: 'Rent', type: 'expense', color: '#795548', icon: 'home', isDefault: true },
  { name: 'Insurance', type: 'expense', color: '#455a64', icon: 'security', isDefault: true },
  { name: 'Other Expenses', type: 'expense', color: '#757575', icon: 'category', isDefault: true }
];

const sampleTransactions = [
  // Income transactions
  {
    type: 'income',
    amount: 75000,
    description: 'Monthly salary',
    category: 'Salary',
    date: new Date('2024-01-01')
  },
  {
    type: 'income',
    amount: 18000,
    description: 'Freelance project payment',
    category: 'Freelance',
    date: new Date('2024-01-05')
  },
  {
    type: 'income',
    amount: 4500,
    description: 'Stock dividend',
    category: 'Investment',
    date: new Date('2024-01-10')
  },

  // Expense transactions
  {
    type: 'expense',
    amount: 18000,
    description: 'Monthly rent payment',
    category: 'Rent',
    date: new Date('2024-01-01')
  },
  {
    type: 'expense',
    amount: 2250,
    description: 'Weekly groceries',
    category: 'Groceries',
    date: new Date('2024-01-02')
  },
  {
    type: 'expense',
    amount: 675,
    description: 'Dinner at restaurant',
    category: 'Food & Dining',
    date: new Date('2024-01-03')
  },
  {
    type: 'expense',
    amount: 900,
    description: 'Petrol for car',
    category: 'Transportation',
    date: new Date('2024-01-04')
  },
  {
    type: 'expense',
    amount: 375,
    description: 'Movie tickets',
    category: 'Entertainment',
    date: new Date('2024-01-06')
  },
  {
    type: 'expense',
    amount: 1800,
    description: 'Electric bill',
    category: 'Bills & Utilities',
    date: new Date('2024-01-07')
  },
  {
    type: 'expense',
    amount: 1200,
    description: 'New shirt',
    category: 'Shopping',
    date: new Date('2024-01-08')
  },
  {
    type: 'expense',
    amount: 3000,
    description: 'Doctor visit',
    category: 'Healthcare',
    date: new Date('2024-01-09')
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    await Category.insertMany(defaultCategories);
    console.log('Default categories created');

    // Insert sample transactions
    await Transaction.insertMany(sampleTransactions);
    console.log('Sample transactions created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  connectDB().then(seedDatabase);
}

module.exports = { defaultCategories, sampleTransactions };
