import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

function CustomerDashboard() {
  const [books, setBooks] = useState([]);
  const [loadingBookId, setLoadingBookId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setQuantities(q => {
          const newQ = {...q};
          data.forEach(b => { if (!newQ[b._id]) newQ[b._id] = 1; });
          return newQ;
        });
      })
      .catch(err => console.error(err));
  }, []);

  const handleQuantityChange = (bookId, q) => {
    setQuantities({ ...quantities, [bookId]: q });
  };

  const handleBuy = async (book) => {
    const qty = Number(quantities[book._id]) || 1;
    setLoadingBookId(book._id);
    try {
      const res = await fetch('http://localhost:4000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ books: [{ book: book._id, quantity: qty }] }),
      });
      console.log("Create Order Response:", res);
      const order = await res.json();

      const options = {
        key: 'rzp_test_RmbKNoUlRe68JR',
        amount: order.amount,
        currency: order.currency,
        name: 'Library Management',
        description: `${book.title} (x${qty})`,
        image: book.imageUrl,
        order_id: order.orderId,
        handler: async function (response) {
          console.log("Razorpay Success Response Data:", response);
          await fetch('http://localhost:4000/api/payment/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              razorpayorderid: response.razorpay_order_id,
              razorpaypaymentid: response.razorpay_payment_id,
              razorpaysignature: response.razorpay_signature,
              books: [{ book: book._id, quantity: qty }],
              totalAmount: book.price * qty,
            }),
            
          });
          alert('Payment successful and order placed!');
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: { color: '#528FF0' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Error starting payment. Try again.');
    }
    setLoadingBookId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1>Available Books</h1>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          {/* SVG icon for better UI */}
          <svg height="28" width="28" viewBox="0 0 24 24" fill="none">
            <path d="M16 17L21 12L16 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3C13.7909 3 15.4347 3.72549 16.6569 4.92893" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="books-list">
        {books.map(book => {
          const qty = Number(quantities[book._id]) || 1;
          const isOutOfStock = book.stock <= 0;
          const exceedsStock = qty > book.stock;
          return (
            <div className="book-card" key={book._id}>
              <img src={book.imageUrl} alt={book.title} className="book-cover" />
              <div className="book-details">
                <h2>{book.title}</h2>
                <h3>by {book.author}</h3>
                <p>{book.description}</p>
                <p><strong>Price:</strong> ₹{book.price} x {qty} = <strong>₹{book.price * qty}</strong></p>
                <p><strong>Available:</strong> {book.stock > 0 ? book.stock : 'Out of stock'}</p>
                <input
                  type="number"
                  min="1"
                  max={book.stock}
                  value={qty}
                  disabled={isOutOfStock}
                  onChange={e => handleQuantityChange(book._id, Math.max(1, Math.min(book.stock, Number(e.target.value) || 1)))}
                  style={{width: "60px", marginRight:"7px"}}
                />
                <button className="buy-btn"
                  onClick={() => handleBuy(book)}
                  disabled={loadingBookId === book._id || isOutOfStock || exceedsStock}>
                  {isOutOfStock ? "Out of Stock"
                    : exceedsStock ? "Out of Stock"
                    : loadingBookId === book._id ? "Processing..." : "Buy"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomerDashboard;
