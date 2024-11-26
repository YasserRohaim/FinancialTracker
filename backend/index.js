const express= require('express');
const dotenv= require('dotenv');
const userRouter = require('./routers/userRoutes');
const transactionRouter = require('./routers/transactionRoutes');
dotenv.config();
app=express();
app.use(express.json());

const PORT= process.env.PORT;
app.use('/users' ,userRouter);
app.use('/transactions' ,transactionRouter);

app.listen (PORT,()=>{
    console.log(`listening on port ${PORT}`);

}); 