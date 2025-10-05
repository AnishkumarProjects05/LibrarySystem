const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: Number,
  }],
  totalAmount: Number,
  paymentId: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
