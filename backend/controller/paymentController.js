const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Book = require('../models/Book');
const emailService = require('./emailController');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { books } = req.body;
    console.log('1.Received Book',books);
    let totalAmount = 0;

    for (const item of books) {
      console.log('2.Processing Book',item.book);
      const book = await Book.findById(item.book);
      if (!book){
        console.error('Book not found for ID:', item.book);
        return res.status(404).json({ message: 'Book not found' });
      } 
      console.log('3. Book price:', book.price, 'Quantity:', item.quantity);
      totalAmount += book.price * item.quantity;
    }
    console.log('4. Total Amount (INR paise):', totalAmount * 100);

    const options = {
      amount: totalAmount * 100, // paise
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log('5. Order created successfully:', order.id);
    res.json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error('!!! CRITICAL ERROR in createOrder:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayorderid, razorpaypaymentid, razorpaysignature, userId, books, totalAmount } = req.body;
    const authenticatedUserId = req.user._id;
    const body = razorpayorderid + '|' + razorpaypaymentid;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaysignature) {
      return res.status(400).json({ message: 'Invalid signature, payment verification failed' });
    }
    console.log('Before the Order into DB');
    // Save order to DB
    const order = new Order({
      user: authenticatedUserId,
      books,
      paymentId: razorpaypaymentid,
      totalAmount,
      status: 'paid',
    });
    console.log('Saving order to database:', order);
    await order.save();

    // Reduce stock of books
    for (const item of books) {
      await Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } });
    }

    // Send purchase confirmation email
    const userEmail = req.user.email;
    for (const item of books) {
      const book = await Book.findById(item.book);
      console.log('Sending purchase email for book:', book.title);
      await emailService.sendPurchaseSuccessEmail(userEmail, book.title);
    }

    res.json({ message: 'Payment verified and order processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
