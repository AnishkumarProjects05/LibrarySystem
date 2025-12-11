// MyOrders.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure you import the CSS here (it's in the same file as dashboard CSS now)
import './CustomerDashboard.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to view orders');
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:4000/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // Flatten the orders to show each book item individually in the list
          const formattedOrders = (data.orders || []).flatMap(order => 
            order.books.map((item, idx) => ({
              ...item,
              orderId: order._id,
              createdAt: order.createdAt,
              key: `${order._id}-${idx}`
            }))
          ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

          setOrders(formattedOrders);
        } else {
          alert(data.message || 'Failed to fetch orders');
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        alert('Error fetching orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="my-orders-page">
      <div className="orders-header-bar">
        <h1>My Order History</h1>
        <button onClick={() => navigate(-1)}>← Back to Dashboard</button>
      </div>

      {loading ? (
        <p>Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p>No orders found. Time to find a new book!</p>
      ) : (
        <div className="orders-list">
          {orders.map((item) => (
              <div key={item.key} className="order-row">
                <div className="order-book-image">
                  {item.book?.imageUrl ? (
                    <img
                      src={item.book.imageUrl}
                      alt={item.book.title}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      📖
                    </div>
                  )}
                </div>

                <div className="order-main">
                  <div className="order-title">{item.book?.title || 'Unknown Book'}</div>
                  <div className="order-meta">
                    <span>**Qty:** {item.quantity}</span>
                    <span>**Rate:** ₹{item.book?.price ?? 'N/A'}</span>
                    <span>**Total:** ₹{(item.book?.price * item.quantity).toFixed(2) ?? 'N/A'}</span>
                    <span>**Date:** {formatDate(item.createdAt)}</span>
                    <span style={{ fontSize: '0.8rem' }}>**Order ID:** {item.orderId}</span>
                  </div>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;