const express = require('express');
const router = express.Router();
const {getOrdersByUser} = require('../controller/OrderController');
const  protect = require('../middleware/authMiddleware');

router.route('/').get(protect,getOrdersByUser);
module.exports = router;
