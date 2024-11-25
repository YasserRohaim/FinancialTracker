const express= require('express');
const userRoutes = require('routers/userRoutes');


app=express();

app.use('/users/' ,userRoutes);
app.listen (30001);