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
      RETURNING  amount, original_currency, transaction_date, description;
    `;
    const values = [
      userId,
      convertedAmount,
      original_currency,
      transaction_date || new Date(), // Use provided date or default to current timestamp
      description,
    ];

    const { rows } = await db.query(query, values);

    res.status(201).json({"transaction":rows[0]});
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  const userId = req.user.id; 
  const userRow =await db.query ('SELECT base_currency,current_budget FROM users WHERE id = $1 ',
[userId]);
console.log(userRow);
const userCurrency= userRow.rows[0].base_currency;
const budget = userRow.rows[0].current_budget;

  try {
    const result = await db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user.' });
    }

    let transactions = result.rows;

    // Convert transaction amounts to user's preferred currency if it's not USD
    if (userCurrency !== 'USD') {
      const conversionRates = await getConversionRates('USD', [userCurrency]); // Get conversion rate from USD to user's currency
      const rate = conversionRates[userCurrency];

      if (!rate) {
        return res.status(400).json({ message: 'Unable to fetch conversion rate for the specified currency.' });
      }

      transactions = transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount * rate,
        currency: userCurrency,
      }));
      budget=budget*rate;
    }

    res.status(200).json({
      message: 'Transactions retrieved successfully',
      transactions: transactions,
      budget: budget,
      currency: userCurrency
    });
  } catch (error) {
    console.error('Error retrieving transactions:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching transactions.' });
  }
};

  exports.deleteTransaction = async (req, res) => {
    try {
      const userId = req.user.id; 
      const transactionId = req.params.id; 
    
      if (!userId){
        return res.status(400).json({ message: 'log in first' });

      }
      if(!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is missing' });
      }
  
      // Check if the transaction exists and belongs to the user
      const transaction = await db.query(
        'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
        [transactionId, userId]
      );
  
      if (transaction.rowCount === 0) {
        return res.status(404).json({ message: 'Transaction not found or does not belong to this user' });
      }
  
      // Delete the transaction
      await db.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [transactionId, userId]);
  
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ message: 'Error deleting transaction', error });
    }
  };
  
  