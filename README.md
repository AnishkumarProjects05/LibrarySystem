# 📚 Full-Stack E-Commerce Book Store

A complete full-stack e-commerce application designed for managing and selling **digital and physical books**, integrating a real-time payment gateway (Razorpay), secure authentication, and **Role-Based Access Control (RBAC)**. The application provides a responsive customer dashboard, seamless transactions, and an admin interface for managing inventory and users.

---
## Project Demo Video
[Watch Demo Video](https://drive.google.com/file/d/1K-b-JRRgSNvWPB7lfWBbesiKQ4gGQu1O/view?usp=drive_link)
## 🚀 Features Overview

### **Frontend (Customer Experience)**

- **Real-Time Book Inventory** – Displays books with title, description, price, and stock.
- **Dynamic Quantity Selection** – Auto recalculation of total price.
- **Razorpay Payment Integration** – Secure and fast checkout.
- **Real-Time Stock Update** – Instantly updates stock after successful payment.
- **Order History Page** – “My Orders” to view past purchases.
- **Personalized Dashboard** – Shows user identity after login.
- **Responsive UI** – Optimized grid for desktop & mobile.

---

### **Backend (Server Functionality)**  
*(Assumed Node.js/Express Architecture)*

- **JWT Authentication** – Secure login & registration.
- **RBAC Implementation** – Customer/Admin role separation.
- **Order Management API** – Create and fetch orders.
- **Razorpay Verification APIs** – Payment order creation & signature validation.
- **Stock Update Logic** – Book quantity reduced after confirmed payment.
- **User Endpoint** – `/api/user/me` to fetch logged-in user details.

---

## 🛠 Tech Stack

| Component | Technology | Description |
|----------|------------|-------------|
| **Frontend** | React, React Router | Responsive UI & routing |
| **Styling** | CSS3 / Custom CSS | Custom UI design |
| **State Management** | React Hooks | Component state |
| **Backend** | Node.js, Express *(assumed)* | REST APIs |
| **Database** | MongoDB / MySQL *(assumed)* | Users, Books, Orders |
| **Payment Gateway** | Razorpay | Real-time payments |
| **Testing** | Postman | API Testing |

---

## Pictures

<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/2e115b7a-75b6-4080-b5e7-275b3791a7f8" />
<img width="742" height="500" alt="image" src="https://github.com/user-attachments/assets/259e533b-be86-49b1-94e5-b14bcaef2c32" />
<img width="742" height="426" alt="image" src="https://github.com/user-attachments/assets/e6510e42-1e57-40ed-a8dd-a5330e3cc75a" />
<img width="742" height="426" alt="image" src="https://github.com/user-attachments/assets/f72c1583-a984-403b-a0e9-e7802f712637" />
<img width="742" height="426" alt="image" src="https://github.com/user-attachments/assets/8d8acc15-6259-4a99-a3d5-d8815ff620a7" />

## 📦 Installation & Setup

This project includes both a **Frontend (React)** and **Backend (Node/Express)**.

---

#### 2) Frontend Setup

### **Prerequisites**
- Node.js
- npm/yarn
- Razorpay Test Key
- Backend running at: `http://localhost:4000`

### **Steps**

#### Clone repository
```bash
git clone [https://github.com/AnishkumarProjects05/LibrarySystem.git]
cd [LibrarySystem]/frontend
```
### Install Dependencies
```bash
npm install
```

### Add Razorpay  SDK
```bash
public/index.html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```
### Runing Frontend
```bash
npm start
```
#### 2) Backend Setup
## 📂 1. Navigate to Backend Directory
```bash
cd [project-name]/backend
```
### 2. Configure Environmental Variables
```bash
PORT=4000
DB_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 3. Runing Backend
```bash
node server.js
```


### Login Credentials
```bash
Admin :
Username: admin@gmail.com
Password:admin1

Customer :
Username : customer1@gmail.com
password:cust1

```


