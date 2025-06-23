# 📚 aDApt – Collaborative Platform for Students

aDApt is a full-stack web application designed to streamline and centralize various student and campus services, including:

- ✅ **QnA Forums**
- 📧 **Categorized Mailing System**
- 🧳 **Lost & Found Board**
- 📂 **Shared Library File Exchange**
- 🔐 **User Authentication with Role Control**

Built with **React (Vite)** and **Node.js/Express**, it uses MongoDB for persistent storage, and integrates features like image/file uploads, real-time socket updates, and modular APIs.

---

## 🧠 Features

### 🔐 Authentication
- Signup/Login with JWT + Cookies
- Role-based access: `user`, `admin`
- Secure routes with middleware

### ❓ QnA Module
- Add/view categories
- Ask and answer questions (with images)
- Real-time answer updates via WebSocket

### 📧 Email Module
- Create email categories
- Add emails under categories
- View categorized emails

### 🧳 Lost & Found
- Post lost/found items with images
- View all posts by category (Lost / Found)

### 📂 Shared Library
- Upload/download course materials
- Manage file metadata (course, branch, year)
- View/download files per subject

---

## 📁 Folder Structure

### 📦 Project Root (aDApt/)
aDApt/
- client/
- server/
- .gitignore
- README.md

### 📦 Frontend (client/)
client/
- vite.config.js
- public/              # Static assets (favicon, robots.txt, etc.)
- src/
- assets/          # Images, icons, fonts
- components/      # Reusable UI bits (AnswerInput, EmailForm…)
- pages/           # Route pages (Home, QnA, Login…)
- store/           # Zustand stores (auth, qna, email…)
- lib/             # Axios instance, helper utils
- styles/          # Global CSS or Tailwind config
- main.jsx         # React app entry
- .env.development
- .env.production
- package.json

### 📦 Backend (server/)
server/
- server.js           # App entry + Express setup
- controllers/        # Business logic (authController.js, qnaController.js…)
- middleware/         # authMiddleware.js, uploadMiddleware.js
- models/             # Mongoose models (User.js, Question.js…)
- routes/             # Route definitions (auth.js, qna.js, email.js…)
- package.json

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, HttpOnly cookies
- **Image/File Uploads**: Cloudinary
- **Real-time**: Socket.IO
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🛠️ Installation

### 1️⃣ Clone Repo

```bash
git clone https://github.com/yourusername/aDApt.git
cd aDApt
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
```
Create .env:
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUD_NAME=cloudinary_cloud
CLOUD_API_KEY=key
CLOUD_API_SECRET=secret
```
### 3️⃣ Setup Frontend
```bash
cd ../client
npm install
```
Create .env in client/:
```bash
VITE_API_BASE_URL=https://adapt-taupe.vercel.app/api
```
### 🧪 Scripts
- Backend
```bash
cd server
npm start  # Runs server on default port (e.g., 5001)
```
- Frontend
```bash
cd client
npm run dev  # Runs Vite dev server on port 5173
```
---

## 🌐 Deployment
### Frontend → Vercel
- Select client/ as root directory

- Set build command: npm run build

- Set output directory: dist

### Backend → Render
- Select server/ as root

- Set build command: npm install

- Set start command: node server.js

---

## 🙋‍♂️ Author
Krutarth Kadia
- 📧 krutarthkadia@gmail.com
- 🐙 GitHub: @Krutarth-2004
- 🔗 LinkedIn: https://www.linkedin.com/in/krutarth-kadia-76652931a/

---

## ⭐️ If you like this project...
Please consider giving it a ⭐ on GitHub! It helps others discover it 🙌

