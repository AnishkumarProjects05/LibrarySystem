// customerDashboard.js (Focusing on the handleLogout function)
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

function CustomerDashboard() {
  // ... (existing state variables and effects) ...
  const [books, setBooks] = useState([]);
  const [loadingBookId, setLoadingBookId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // ... (useEffect for fetching books and user details) ...
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 1. Fetch User Data (Email)
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUserEmail(data.user.email);
        } else {
          console.error('Failed to fetch user data:', data.message);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    // 2. Fetch Books
    const fetchBooks = () => {
      fetch('http://localhost:4000/api/books')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch books');
          return res.json();
        })
        .then(data => {
          setBooks(data);
          setQuantities(q => {
            const newQ = { ...q };
            data.forEach(b => {
              if (!newQ[b._id]) newQ[b._id] = 1;
            });
            return newQ;
          });
        })
        .catch(err => {
          console.error('Error fetching books:', err);
          toast.error('Could not load books. Please try again.');
        });
    };

    fetchUser();
    fetchBooks();

  }, [navigate]);

  // ... (handleQuantityChange and handleBuy functions) ...
  const handleQuantityChange = (bookId, q) => {
    setQuantities({ ...quantities, [bookId]: q });
  };

  const handleBuy = async (book) => {
    const qty = Number(quantities[book._id]) || 1;
    if (qty <= 0 || qty > book.stock) {
      toast.error("Invalid quantity.");
      return;
    }

    setLoadingBookId(book._id);
    try {
      const token = localStorage.getItem('token');

      // 1. Create Order
      const createRes = await fetch('http://localhost:4000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ books: [{ book: book._id, quantity: qty }] }),
      });

      if (!createRes.ok) throw new Error('Order creation failed');
      const order = await createRes.json();

      // 2. Razorpay Integration
      const options = {
        key: 'rzp_test_S2bO2yvgt2kFwi', // Replace with your actual key
        amount: order.amount,
        currency: order.currency,
        name: 'Library Management',
        description: `Purchase: ${book.title} (x${qty})`,
        image: book.imageUrl,
        order_id: order.orderId,
        handler: async function (response) {
          // 3. Verify Payment after successful transaction
          const verifyRes = await fetch('http://localhost:4000/api/payment/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpayorderid: response.razorpay_order_id,
              razorpaypaymentid: response.razorpay_payment_id,
              razorpaysignature: response.razorpay_signature,
              books: [{ book: book._id, quantity: qty }],
              totalAmount: book.price * qty,
            }),
          });

          if (!verifyRes.ok) {
            toast.error('Payment successful, but stock update failed on server. Please contact support.');
            throw new Error('Payment verification failed');
          }

          toast.success('Payment successful and order placed! Check My Orders.');

          // --- LOGIC TO DECREMENT STOCK LOCALLY (FRONTEND) ---
          setBooks(prevBooks =>
            prevBooks.map(b =>
              b._id === book._id ? { ...b, stock: b.stock - qty } : b
            )
          );
          // ---------------------------------------------------
        },
        prefill: { name: userEmail.split('@')[0], email: userEmail || '' }, // Using email to prefill Razorpay
        theme: { color: '#3b82f6' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment flow error:", err);
      toast.error('Error starting or completing payment. Try again.');
    }
    setLoadingBookId(null);
  };

  // *** KEY UPDATE HERE ***
  const handleLogout = () => {
    // 1. Clear Authentication Data
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Good practice to clear role too

    // 2. Clear any lingering user-specific data from state/storage
    // This is crucial if you were caching orders in the browser.
    // If you are using React state for orders in MyOrders.js, navigating 
    // to /login will unmount MyOrders, which is sufficient, but clearing 
    // storage keys related to user data is the safest approach.

    // 3. Redirect to the login page
    navigate('/login');
  };

  return (
    // ... (rest of the component) ...
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Welcome, {userEmail ? userEmail.split('@')[0] : 'Customer'}!
        </h1>
        <div className="dashboard-actions">
          <button
            onClick={() => navigate('/my-order')}
            className="btn-orders"
          >
            View My Orders
          </button>
          <button
            onClick={handleLogout}
            className="btn-logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="books-section">
        <h2>Available Books</h2>
        <div className="books-container">
          {books.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading books or no books available...</p>
          ) : (
            books.map((book) => {
              const qty = quantities[book._id] || 1;
              const isOutOfStock = book.stock <= 0;

              return (
                <div
                  key={book._id}
                  className="book-card"
                >
                  <div className="book-cover-wrapper">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="book-cover"
                      />
                    ) : (
                      <div className="no-image">📚</div>
                    )}
                  </div>

                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p className="description">{book.description}</p>

                    <p className="price-info">
                      Price: ₹{book.price} x {qty} ={' '}
                      <strong>₹{book.price * qty}</strong>
                    </p>

                    <p className="stock-info">
                      Available Stock: {' '}
                      <span className={isOutOfStock ? 'stock-out' : 'stock-available'}>
                        {isOutOfStock ? 'Out of stock' : book.stock}
                      </span>
                    </p>

                    <div className="buy-actions">
                      <input
                        type="number"
                        value={qty}
                        min="1"
                        max={book.stock > 0 ? book.stock : 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            book._id,
                            Math.max(1, Math.min(book.stock > 0 ? book.stock : 1, Number(e.target.value) || 1))
                          )
                        }
                        disabled={isOutOfStock}
                      />
                      <button
                        disabled={loadingBookId === book._id || isOutOfStock}
                        onClick={() => handleBuy(book)}
                      >
                        {loadingBookId === book._id ? 'Processing…' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;