const Joi = require('joi');

// Transaction validation schema
const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().trim().min(1).max(255).required(),
  category: Joi.string().trim().min(1).max(100).required(),
  date: Joi.date().optional(),
  receiptUrl: Joi.string().uri().optional().allow(null, ''),
  extractedFromReceipt: Joi.boolean().optional()
});

// Category validation schema
const categorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  type: Joi.string().valid('income', 'expense', 'both').optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: Joi.string().trim().max(50).optional()
});

// Validation middleware
const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateTransaction,
  validateCategory
};
