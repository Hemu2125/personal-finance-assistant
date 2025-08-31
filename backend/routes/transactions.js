const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validation');

// GET /api/transactions - Get all transactions with filtering
router.get('/', getTransactions);

// GET /api/transactions/stats - Get transaction statistics
router.get('/stats', getTransactionStats);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', getTransaction);

// POST /api/transactions - Create new transaction
router.post('/', validateTransaction, createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', validateTransaction, updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
