const express= require('express');
const dotenv= require('dotenv');
const userRouter = require('./routers/userRoutes');
dotenv.config();
app=express();
app.use(express.json());

const PORT= process.env.PORT;
app.use('/users' ,userRouter);
app.listen (PORT,()=>{
    console.log(`listening on port ${PORT}`);

}); 