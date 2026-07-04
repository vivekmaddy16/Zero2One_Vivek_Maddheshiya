# 🚀 Fixify - Neighbourhood Service Marketplace

## 🏆 Kalpathon Hackathon Submission

---

## 👥 Team Details

**Team Name:**
Zero2One

**Project Name:**
Fixify

**Selected Track:**
Web Development

**Selected Problem Statement:**
Neighbourhood Service Marketplace – Connecting local service providers with customers

---

## 👨‍💻 Team Members & Roles

| Name              | Role                               |
| ---------------   | ---------------------------------- |
| Vivek Maddheshiya | Team Leader / Full Stack Developer |
| Yogesh Singh      | Frontend Developer                 |
| Aniket Kumar      | Backend Developer                  |
| Ananya Singh      | UI/UX Designer                     |

---

## 📞 Team Leader Contact

* **Name:** Vivek Maddheshiya
* **Phone:** 7237900686

---

## 📌 Project Description

### 🔴 Problem

In many local areas, finding reliable service providers like electricians, plumbers, tutors, or delivery agents is difficult. Customers often rely on unverified contacts or word-of-mouth, while skilled workers struggle to find consistent job opportunities.

---

### 🟢 Solution

**Fixify** is a centralized, real-time, web-based marketplace that connects customers with nearby service providers. With integrated real-time communication, active booking mapping, and an intelligent AI assistant, Fixify bridges the gap between client requirements and provider availability.

---

### ✨ Key Features (Implemented)

Fixify is packed with powerful, production-ready features designed for an optimal user experience:

* 🔐 **Role-Based Authentication:** Clean sign-up/login workflows with distinct UI layouts and dashboards for **Customers** and **Service Providers**.
* 🔍 **Smart Browsing & Search:** Dynamic browsing of local services filtered by category (Electrician, Plumber, Tutor, Cleaning, Painting, Carpentry, etc.).
* 📅 **Dynamic Booking Flow:** Complete booking life cycle management (Pending, Confirmed, In Progress, Completed, Cancelled) with automatic status tracking.
* 💬 **Real-Time Messaging:** Fully functional Chat module integrated via **Socket.io**. Features online/offline indicators, typing notifications, and instant status updates.
* 📍 **Live Location-Based Tracking Map:** Integrated **OpenLayers (ol)** map that displays the live location of both the customer and the provider during active bookings.
* 🤖 **AI-Powered Service Assistant:** An in-app NLP-based chatbot that processes user statements (e.g., *"my kitchen tap is leaking"*) using scoring heuristics, mapping them to the most suitable category and offering quick booking suggestions.
* 🚨 **Emergency SOS System:** An instant broadcast button to alert all active service providers in the area for urgent issues.
* 💳 **Simulated Payment Gateway:** Simulated payment collection on completion of services with digital receipt generation.
* ⭐ **Feedback & Reviews:** Automatic recalculation of provider ratings and service scores based on customer reviews.

---

### 🛠️ Tech Stack

#### Frontend:
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS & Framer Motion (for smooth transitions/animations)
* **Maps & Tracking:** OpenLayers (`ol` API)
* **Real-time Connection:** Socket.io-client

#### Backend:
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (via Mongoose ODM)
* **Real-time Engine:** Socket.io
* **Security:** JSON Web Tokens (JWT) & BcryptJS

---

### 🌍 Impact

* Empowers local workers by providing more job opportunities
* Helps users find trusted services quickly
* Supports the growth of local economies
* Reduces dependency on unorganized service channels

---

## 🔗 Project Links

* 🌐 **Live Project:** [https://zero2-one-vivek-maddheshiya.vercel.app](https://zero2-one-vivek-maddheshiya.vercel.app)
* 💻 **GitHub Repository:** [https://github.com/vivekmaddy16/Fixify](https://github.com/vivekmaddy16/Fixify)
* 📊 **Presentation (PPT):** *[Insert presentation link here]*

---

## 💻 Local Setup & Installation

Follow these steps to run Fixify on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/vivekmaddy16/Fixify.git
cd Fixify
```

### 2. Configure Backend
Navigate to the `backend/` directory, install dependencies, and create your environment file:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory (refer to [backend/.env.example](backend/.env.example)):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Seed Database
To populate your local MongoDB database with mock data, run the following seeds:
```bash
# Seed basic user profiles and services
npm run seed

# Populate and synchronize Lucknow local coordinates
npm run seed:lucknow

# Synchronize missing service categories
npm run seed:missing-categories
```

#### Run Backend Server
```bash
npm run dev
```

### 3. Configure Frontend
Open a new terminal, navigate to the `frontend/` directory, install dependencies, and create the environment file:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory (refer to [frontend/.env.example](frontend/.env.example)):
```env
VITE_API_URL=http://localhost:5000/api
```

#### Run Frontend Dev Server
```bash
npm run dev
```
The client app will be accessible at [http://localhost:5173](http://localhost:5173).

---

## 🚀 Deployment

### Frontend on Vercel
1. Connect your GitHub repository to Vercel.
2. Select the **Root Directory** as `frontend` (or configure the build settings to target the `frontend` folder).
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Configure the environment variable:
   `VITE_API_URL=https://your-backend-api.onrender.com/api`
5. Deploy.

### Backend on Render
1. Create a new **Web Service** on Render.
2. Point it to this repository, and set the **Root Directory** as `backend`.
3. Set the Build Command to `npm install` and Start Command to `npm start`.
4. Add the necessary Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your deployed Vercel frontend URL)
   - `CORS_ORIGINS` (comma-separated origins)
5. Deploy.

---

## 📸 Demo 

<img width="1919" height="1008" alt="image" src="https://github.com/user-attachments/assets/d835634d-6646-4b04-ae3d-d49aef1c97b8" />

---

## ⚡ Future Enhancements

* 💳 Real-world payment gateway integrations (e.g., Stripe, Razorpay)
* 🔔 Web Push Notifications for offline updates
* 🤖 Deep learning recommendations based on user search/browsing history
* 📱 Native mobile application using React Native

---

## 🏁 Conclusion

Fixify leverages modern real-time communication protocols, geolocation tools, and NLP search helpers to bridge the gap between clients and local service professionals, creating an organized, reliable, and accessible neighbourhood marketplace.

---

⭐ *Thank you for reviewing our project!*
