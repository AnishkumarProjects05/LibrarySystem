const Order = require('../models/Order');

module.exports = {
        getOrdersByUser:async(req,res)=>{
        try{
            const userId = req.user._id;
            const orders = await Order.find({ user: userId })
                .sort({ createdAt: -1 })
                .populate('books.book');
            
            console.log("Fetched Orders for User:", orders);
            res.status(200).json({
                success: true,
                orders: orders
            });
        }
        catch(error){
            console.error("Error fetching user orders:", error);
            res.status(500).json({ 
                success: false, 
                message: "Failed to fetch orders." 
            });
        }
    }

};