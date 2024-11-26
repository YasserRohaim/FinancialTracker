const db = require('../models/db.js');
const bcrypt= require('bcrypt')

exports.createUser = async (req, res) => {
    const { name, email, password, budget, preferredCurrency } = req.body;
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const query = `
      INSERT INTO users (name, email, password, current_budget, base_currency)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, current_budget, base_currency;`;
    const values = [name, email, hashedPassword, budget, preferredCurrency];

    const { rows } = await db.query(query, values);
    res.status(201).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
