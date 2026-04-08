# 🔧 Fixify — Local Service Marketplace

> Connect with verified local service providers. Book electricians, plumbers, tutors, delivery & more — instantly.

![Fixify](frontend/public/logo.png)

## 🚀 Features

### Core
- **Authentication** — JWT-based register/login with role selection (Customer/Provider)
- **Service Listings** — Browse by category, search, filter & sort
- **Booking System** — Date/time picker, address, instant confirmation
- **Customer Dashboard** — View bookings, pay, rate services
- **Provider Dashboard** — Accept/decline requests, manage services (CRUD)
- **Ratings & Reviews** — 5-star rating with auto-aggregated averages

### Bonus
- 💬 **Real-time Chat** — Socket.io with typing indicators & online status
- 💳 **Simulated Payment** — Credit card flow with processing animation
- 🤖 **AI Recommendations** — Smart suggestions based on booking history

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, Vite, Tailwind CSS v3, Framer Motion, Axios |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Mongoose |
| **Auth** | JWT, bcryptjs, role-based middleware |
| **Real-time** | Socket.io |
| **UI** | Inter font, responsive design, soft shadows |

## 📁 Project Structure

```
Fixify/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # Auth, Service, Booking, Rating, Message
│   ├── middleware/auth.js  # JWT + role guards
│   ├── models/             # User, Service, Booking, Rating, Message
│   ├── routes/             # All API routes + recommendations
│   ├── seed/seedData.js    # Demo data script
│   └── server.js           # Express + Socket.io
│
└── frontend/
    ├── public/             # Logo, favicon
    └── src/
        ├── api/            # Axios API layer
        ├── context/        # Auth + Socket contexts
        ├── components/     # Navbar, ServiceCard, Modals, etc.
        └── pages/          # Home, Services, Booking, Dashboards, Chat
```

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone
```bash
git clone https://github.com/vivekmaddy16/Zero2One_Vivek_Maddheshiya.git
cd Zero2One_Vivek_Maddheshiya
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/fixify
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Seed Database
```bash
cd backend
npm run seed
```

### 4. Start Backend
```bash
cd backend
npm run dev
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 6. Open App
Navigate to `http://localhost:5173`

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | rahul@test.com | password123 |
| Customer | priya@test.com | password123 |
| Provider (Electrician) | amit@test.com | password123 |
| Provider (Plumber) | deepak@test.com | password123 |
| Provider (Tutor) | sneha@test.com | password123 |
| Provider (Delivery) | vikram@test.com | password123 |

## 📸 Screenshots

### Landing Page
Clean, professional UI with service categories and featured listings.

### Service Booking
Date/time picker with live booking summary sidebar.

### Dashboards
Role-based dashboards with booking stats and management tools.

## 👨‍💻 Author

**Vivek Maddheshiya**

---

*Built with ❤️ for Zero2One*
