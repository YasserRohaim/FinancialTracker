const User = require('../models/User');
const { object, string, number, date } =require('yup');

var userSchema = object({
    name: string().required(),
    age: number().required().positive().integer(),
    email: string().email(),
    website: string().url().nullable(),
    createdOn: date().default(() => new Date()),
  });
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, budget, preferredCurrency } = req.body;
    
    const user = new User({ username, email, passwordHash, budget, preferredCurrency });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
