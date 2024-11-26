const express = require('express'); 
const { createTransaction }= require('../controllers/transactionController') 

const transactionRouter =express.Router();

const {  validateSchema, transactionSchema } = require('../middleware/validations');
const { auth } = require('../middleware/auth');

transactionRouter.post("/create",auth,validateSchema(transactionSchema),createTransaction);


module.exports= transactionRouter;