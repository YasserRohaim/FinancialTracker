const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const userRouter = require('./routers/userRoutes');
const transactionRouter = require('./routers/transactionRoutes');

dotenv.config();

const app = express();
const PORT =  3001;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(helmet()); 
app.use(morgan('dev')); 

// Routes
app.use('/users', userRouter);
app.use('/transactions', transactionRouter);

// Error-Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
