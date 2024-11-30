const db = require('../models/db.js');
const bcrypt= require('bcrypt')
const jwt =require('jsonwebtoken')
const getConversionRates = require('../utilities/getConversionRates.js');


exports.createUser = async (req, res) => {
    let { name, email, password, budget, preferredCurrency } = req.body;
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    if (preferredCurrency!="USD"){
      const conversionRates = await getConversionRates(preferredCurrency, ["USD"]); // Get conversion rate from user's currency to USD
      const rate = conversionRates["USD"];
      if(!rate){
        console.error("failed to retrieve conversion rate");

        
      }
      budget=budget*rate;
    }
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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query the database for the user by email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } 
    );

    // Return the token to the client
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

