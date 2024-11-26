const { query } = require('express');
const db = require('../models/db.js');
const getConversionRates = require('../utilities/getConversionRates.js');

exports.createTransaction = async (req, res) => {
  const { description, transaction_date, original_currency, amount } = req.body;
  const userId = req.user.id; // Assuming `req.user` is populated by your auth middleware

  let convertedAmount = amount;

  try {
    // Convert amount to USD if it's not already in USD
    if (original_currency !== 'USD') {
      const conversionRates = await getConversionRates(original_currency, ['USD']);
      console.log("THE RATES AREEEE");
      console.log(conversionRates);
      const rate = conversionRates['USD'];

      if (!rate) {
        return res.status(400).json({ message: 'Unable to fetch conversion rate for the specified currency.' });
      }

      convertedAmount = amount * rate;
    }

    // Insert transaction into the database
    const query = `
      INSERT INTO transactions (user_id, amount, original_currency, transaction_date, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, amount, original_currency, transaction_date, description;
    `;
    const values = [
      userId,
      convertedAmount,
      original_currency,
      transaction_date || new Date(), // Use provided date or default to current timestamp
      description,
    ];

    const { rows } = await db.query(query, values);

    // Return the created transaction
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
    const userId = req.user.userId; 
    try {
      const result = await pool.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user.' });
      }
  
      res.status(200).json({
        message: 'Transactions retrieved successfully',
        transactions: result.rows,
      });
    } catch (error) {
      console.error('Error retrieving transactions:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
  };
  