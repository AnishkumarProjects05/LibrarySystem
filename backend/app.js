const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./route/authRoute');
const bookRoutes = require('./route/bookRoute');
const paymentRoutes = require('./route/paymentRoute');
const orderRoutes = require('./route/orderRoute');

app.use('/debug',(reg,res)=>{
    res.send("API is working fine");
})


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
module.exports = app;
