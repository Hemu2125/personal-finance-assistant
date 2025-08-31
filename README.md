# Personal Finance Assistant

A comprehensive full-stack web application designed to help users track, manage, and understand their financial activities. Built with React, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Core Functionality
- **Transaction Management**: Add, edit, delete, and categorize income and expense transactions
- **Time Range Filtering**: View transactions within specific date ranges
- **Category Management**: Create and manage custom transaction categories
- **Financial Analytics**: Visual charts and graphs showing spending patterns
- **Receipt Processing**: Upload receipt images/PDFs and automatically extract transaction data using OCR

### Analytics & Visualization
- **Expense by Category**: Pie charts showing spending distribution
- **Daily Trends**: Line charts displaying income vs expenses over time
- **Monthly Comparisons**: Bar charts comparing income and expenses
- **Financial Summary**: Dashboard with key metrics (total income, expenses, balance, savings rate)
- **Indian Currency Support**: All amounts displayed in Indian Rupees (₹) with proper formatting

### Receipt Processing
- **Image Upload**: Support for JPEG, PNG, GIF image formats
- **PDF Support**: Extract text from PDF receipts
- **OCR Technology**: Automatic text extraction using Tesseract.js
- **Smart Parsing**: AI-powered extraction of amount, date, and description
- **Manual Review**: Edit extracted data before saving

## 🛠 Tech Stack

### Frontend
- **React** - Modern UI library
- **React Router** - Client-side routing
- **Chart.js + React-Chartjs-2** - Data visualization
- **Axios** - HTTP client
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **Multer** - File upload handling
- **Tesseract.js** - OCR for image text extraction
- **PDF-Parse** - PDF text extraction
- **Joi** - Data validation
- **Helmet** - Security middleware

### Development Tools
- **Nodemon** - Development server auto-restart
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.x or higher)
- **npm** (comes with Node.js)
- **MongoDB** (version 4.x or higher)

### Installing Prerequisites

#### Node.js & npm
- Download and install from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version` and `npm --version`

#### MongoDB
- **Option 1 - Local Installation**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Option 2 - MongoDB Atlas**: Use cloud MongoDB at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Option 3 - Docker**: Run `docker run -d -p 27017:27017 --name mongodb mongo:latest`

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-finance-assistant
```

### 2. Install Dependencies
```bash
# Install root dependencies (for concurrent running)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

#### Start MongoDB
If using local MongoDB:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb/brew/mongodb-community
```

#### Seed Default Data (Optional)
```bash
cd backend
npm run seed
```

This will create default categories and sample transactions.

### 5. Start the Application

#### Option 1: Start Both Frontend and Backend Simultaneously
```bash
# From root directory
npm run dev
```

#### Option 2: Start Services Separately
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📱 Usage Guide

### Dashboard
- View financial overview with income, expenses, and balance
- Quick access to recent transactions
- Top spending categories
- Quick action buttons for common tasks

### Managing Transactions
1. **Add Transaction**: Click "Add Transaction" from dashboard or transactions page
2. **Edit Transaction**: Click edit icon next to any transaction
3. **Delete Transaction**: Click delete icon and confirm
4. **Filter Transactions**: Use date range, type, and category filters

### Categories
1. **Add Category**: Click "Add Category" button
2. **Choose Type**: Income only, Expense only, or Both
3. **Customize**: Select color and icon for visual identification
4. **Edit/Delete**: Manage existing categories (default categories cannot be deleted)

### Receipt Upload
1. **Upload**: Drag & drop or click to select receipt image/PDF
2. **Processing**: AI extracts text and analyzes transaction data
3. **Review**: Check extracted information for accuracy
4. **Edit**: Modify any incorrect details
5. **Save**: Transaction is added to your records

### Analytics
- **Filter by Date**: Select date range for analysis
- **View Charts**: Expenses by category, daily trends, income vs expenses
- **Category Breakdown**: Detailed table with percentages and averages

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Transactions
- `GET /transactions` - Get all transactions (with filtering)
- `GET /transactions/:id` - Get single transaction
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/stats` - Get transaction statistics

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get single category
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

#### Receipts
- `POST /receipts/upload` - Upload and process receipt
- `GET /receipts/:filename` - Get receipt file
- `POST /receipts/process/:filename` - Re-process existing receipt

### Query Parameters

#### Transactions
- `type` - Filter by transaction type (income/expense)
- `category` - Filter by category name
- `startDate` - Start date for date range
- `endDate` - End date for date range
- `page` - Page number for pagination
- `limit` - Number of results per page
- `sortBy` - Sort field (default: date)
- `sortOrder` - Sort order (asc/desc)

#### Categories
- `type` - Filter by category type (income/expense/both)

## 📁 Project Structure

```
personal-finance-assistant/
├── backend/                    # Node.js/Express backend
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── uploads/              # File upload directory
│   ├── server.js             # Main server file
│   ├── seedData.js           # Database seeding script
│   └── package.json          # Backend dependencies
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   └── package.json          # Frontend dependencies
├── package.json              # Root package for scripts
└── README.md                 # This file
```

## 🧪 Testing

### Manual Testing
1. Start the application
2. Test each feature:
   - Add/edit/delete transactions
   - Upload receipts
   - View analytics
   - Manage categories
   - Filter data

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test health endpoint
curl http://localhost:5000/health

# Get all transactions
curl http://localhost:5000/api/transactions

# Create a transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","amount":380,"description":"Coffee","category":"Food & Dining"}'
```

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
- **Issue**: `MongooseServerSelectionError`
- **Solution**: Ensure MongoDB is running and connection string is correct

#### Port Already in Use
- **Issue**: `Error: listen EADDRINUSE :::5000`
- **Solution**: Kill process using port or change PORT in .env file

#### Receipt Upload Not Working
- **Issue**: OCR processing fails
- **Solution**: Ensure image is clear and text is readable

#### CORS Errors
- **Issue**: Cross-origin requests blocked
- **Solution**: Check FRONTEND_URL in backend .env file

### Performance Tips
1. **Database Indexing**: Indexes are automatically created for date, type, and category fields
2. **Image Optimization**: Compress large images before upload
3. **Pagination**: Use limit parameter for large datasets

## 🔐 Security Considerations

### Implemented Security Features
- **Helmet**: Security headers
- **Input Validation**: Joi validation schemas
- **File Upload Limits**: 10MB file size limit
- **Error Handling**: Proper error responses without sensitive data

### Production Recommendations
- Use HTTPS in production
- Implement authentication/authorization
- Set up proper CORS configuration
- Use environment variables for sensitive data
- Regular security updates

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS**: EC2 + RDS/DocumentDB
- **DigitalOcean**: Droplets with managed MongoDB
- **Vercel/Netlify**: Frontend hosting with backend on other platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check MongoDB connection and logs
4. Ensure all dependencies are installed
5. Verify environment variables are set correctly

## 🔄 Future Enhancements

- User authentication and multi-user support
- Data export/import functionality
- Mobile app development
- Advanced reporting features
- Integration with banking APIs
- Budgeting and goal-setting features
- Email notifications and reminders
