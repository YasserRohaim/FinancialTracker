const express = require('express'); 
const {createTransaction, getUserTransactions, deleteTransaction  }= require('../controllers/transactionController') 

const transactionRouter =express.Router();

const {  validateSchema, transactionSchema } = require('../middleware/validations');
const { auth } = require('../middleware/auth');

transactionRouter.post("/create",auth,validateSchema(transactionSchema),createTransaction);
transactionRouter.get("/getall",auth,getUserTransactions);
transactionRouter.delete("/delete/:id",auth,deleteTransaction);


module.exports= transactionRouter;