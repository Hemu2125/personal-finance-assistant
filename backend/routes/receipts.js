const express = require('express');
const router = express.Router();
const {
  upload,
  uploadReceipt,
  getReceipt,
  processReceipt
} = require('../controllers/receiptController');

// POST /api/receipts/upload - Upload and process receipt
router.post('/upload', upload, uploadReceipt);

// GET /api/receipts/:filename - Get receipt file
router.get('/:filename', getReceipt);

// POST /api/receipts/process/:filename - Re-process existing receipt
router.post('/process/:filename', processReceipt);

module.exports = router;
