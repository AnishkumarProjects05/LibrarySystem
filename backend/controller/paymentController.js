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
    let totalAmount = 0;

    for (const item of books) {
      const book = await Book.findById(item.book);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      totalAmount += book.price * item.quantity;
    }

    const options = {
      amount: totalAmount * 100, // paise
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, books, totalAmount } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature, payment verification failed' });
    }

    // Save order to DB
    const order = new Order({
      user: userId,
      books,
      paymentId: razorpay_payment_id,
      totalAmount,
      status: 'paid',
    });
    await order.save();

    // Reduce stock of books
    for (const item of books) {
      await Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } });
    }

    // Send purchase confirmation email
    const userEmail = req.user.email;
    for (const item of books) {
      const book = await Book.findById(item.book);
      await emailService.sendPurchaseSuccessEmail(userEmail, book.title);
    }

    res.json({ message: 'Payment verified and order processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
