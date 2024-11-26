const express = require('express'); 
const {createUser}= require('../controllers/userController') 

const userRouter =express.Router();

const { userSchema, validateSchema } = require('../middleware/validations');

userRouter.post("/signup",validateSchema(userSchema),createUser);

module.exports= userRouter;