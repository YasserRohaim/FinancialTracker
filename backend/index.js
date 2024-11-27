const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");



const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      { url: "http://localhost:3001" },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const userRouter = require('./routers/userRoutes');
const transactionRouter = require('./routers/transactionRoutes');

dotenv.config();

const app = express();
const PORT =  process.env.BACK_END_PORT;

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
