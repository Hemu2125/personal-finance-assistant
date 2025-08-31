const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const Transaction = require('../models/Transaction');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/receipts');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Extract text from image using Tesseract.js
const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m) // Optional: log progress
    });
    return text;
  } catch (error) {
    throw new Error('Failed to extract text from image');
  }
};

// Extract text from PDF
const extractTextFromPDF = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
};

// Parse receipt text to extract transaction data
const parseReceiptText = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let amount = null;
  let description = '';
  let date = new Date();
  
  // Look for amount patterns (e.g., ₹12.34, Rs 12.34, 12.34, Total: ₹12.34)
  const amountPatterns = [
    /(?:total|amount|sum)[\s:]*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d{2})?)/i,
    /₹\s*(\d+(?:\.\d{2})?)/g,
    /rs\.?\s*(\d+(?:\.\d{2})?)/gi,
    /inr\s*(\d+(?:\.\d{2})?)/gi,
    /(\d+\.\d{2})/g
  ];
  
  for (const pattern of amountPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Extract the numeric part
      const numericMatch = matches[0].match(/(\d+(?:\.\d{2})?)/);
      if (numericMatch) {
        amount = parseFloat(numericMatch[1]);
        break;
      }
    }
  }
  
  // Look for date patterns
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}-\d{1,2}-\d{4})/
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const parsedDate = new Date(match[1]);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
        break;
      }
    }
  }
  
  // Use first few meaningful lines as description
  const meaningfulLines = lines.filter(line => 
    line.length > 3 && 
    !line.match(/^\d+$/) && 
    !line.match(/^[\d\s\-\/\.]+$/)
  ).slice(0, 3);
  
  description = meaningfulLines.join(' ') || 'Receipt transaction';
  
  return {
    amount: amount || 0,
    description: description.substring(0, 255), // Limit description length
    date: date,
    category: 'General', // Default category
    type: 'expense' // Assume receipts are expenses
  };
};

// Upload and process receipt
const uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let extractedText;
    
    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else {
      extractedText = await extractTextFromImage(filePath);
    }

    // Parse the extracted text
    const parsedData = parseReceiptText(extractedText);
    
    // Create transaction from parsed data
    const transactionData = {
      ...parsedData,
      receiptUrl: `/uploads/receipts/${req.file.filename}`,
      extractedFromReceipt: true
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    res.status(201).json({
      success: true,
      data: {
        transaction,
        extractedText,
        fileName: req.file.filename
      },
      message: 'Receipt processed and transaction created successfully'
    });

  } catch (error) {
    // Clean up uploaded file if processing failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Get receipt image
const getReceipt = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/receipts', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Receipt file not found'
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

// Process existing receipt (re-analyze)
const processReceipt = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/receipts', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Receipt file not found'
      });
    }

    const fileExtension = path.extname(filename).toLowerCase();
    let extractedText;
    
    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else {
      extractedText = await extractTextFromImage(filePath);
    }

    const parsedData = parseReceiptText(extractedText);

    res.json({
      success: true,
      data: {
        extractedText,
        parsedData,
        filename
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload: upload.single('receipt'),
  uploadReceipt,
  getReceipt,
  processReceipt
};
