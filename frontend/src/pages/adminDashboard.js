import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: '', author: '', description: '', price: '', stock: '', imageUrl: ''
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Fetch all books
  const fetchBooks = () => {
    fetch('http://localhost:4000/api/books')
      .then(res => res.json())
      .then(setBooks);
  };

  useEffect(fetchBooks, []);

  // Handle form input change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create or update book
  const handleSubmit = async e => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:4000/api/books/${editId}`
      : 'http://localhost:4000/api/books';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
    });

    if (res.ok) {
      setForm({ title: '', author: '', description: '', price: '', stock: '', imageUrl: '' });
      setEditId(null);
      fetchBooks();
    }
  };

  // Edit handler
  const handleEdit = book => {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      stock: book.stock,
      imageUrl: book.imageUrl
    });
    setEditId(book._id);
  };

  // Delete handler
  const handleDelete = async id => {
    await fetch(`http://localhost:4000/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    fetchBooks();
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setForm({ title: '', author: '', description: '', price: '', stock: '', imageUrl: '' });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Cover Image URL" required />
        <button type="submit">{editId ? 'Update' : 'Add'} Book</button>
        {editId && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
      <div className="books-list">
        {books.map(book => (
          <div className="book-card" key={book._id}>
            <img src={book.imageUrl} alt={book.title} className="book-cover" />
            <div className="book-details">
              <h2>{book.title}</h2>
              <h3>by {book.author}</h3>
              <p>{book.description}</p>
              <p>
                <strong>Price:</strong> ₹{book.price} |
                <strong> Stock:</strong> {book.stock}
              </p>
              <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(book._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
