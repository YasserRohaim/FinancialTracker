const User = require('../models/User');
const { object, string, number, date } =require('yup');

var userSchema = object({
    name: string().required(),
    password:string().min(8,"minimum length is 8").required(),
    email: string().email(),
    budget: number.positive(),
    preferredCurrency : number().min(0).max(100)
  });
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, budget, preferredCurrency } = req.body;
    
    const user = new User({ name, email, passwordHash, budget, preferredCurrency });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
