const express = require('express'); 
const {createTransaction, getUserTransactions, deleteTransaction, editBudget  }= require('../controllers/transactionController') 

const transactionRouter =express.Router();

const {  validateSchema, transactionSchema } = require('../middleware/validations');
const { auth } = require('../middleware/auth');

transactionRouter.post("/create",auth,validateSchema(transactionSchema),createTransaction);
transactionRouter.get("/getall",auth,getUserTransactions);
transactionRouter.delete("/delete/:id",auth,deleteTransaction);
transactionRouter.put("/edit-budget",auth, editBudget);


module.exports= transactionRouter;