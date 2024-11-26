const express = require('express'); 
const {createUser, login}= require('../controllers/userController') 

const userRouter =express.Router();

const { userSchema, validateSchema } = require('../middleware/validations');

userRouter.post("/signup",validateSchema(userSchema),createUser);

userRouter.post("/signin",login); //post to hide data from url

module.exports= userRouter;