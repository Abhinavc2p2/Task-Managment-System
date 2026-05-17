# 🚀 Taskify – Full Stack Task Management System

A complete **Task Management System** built with modern full-stack technologies.
Users can securely register, log in, and manage their personal tasks with full CRUD functionality.

---

## 🌐 Live Demo

🔗 Frontend (Vercel):
https://task-manager-frontend-chi-one.vercel.app

---

## 🧠 Features

### 🔐 Authentication

* User Registration & Login
* JWT-based Authentication (Access + Refresh Tokens)
* Secure password hashing using bcrypt
* Protected routes

---

### 📋 Task Management

* Create, Read, Update, Delete tasks
* Toggle task completion status
* Pagination support
* Search tasks by title
* Filter tasks by status (Completed / Pending)

---

### 🎨 UI Features

* Modern responsive UI (Tailwind CSS)
* Sidebar + Top Navigation layout
* Clean dashboard design
* Real-time UI updates
* Toast notifications

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM

### Database

* PostgreSQL (Neon Cloud)

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon

---

## ⚙️ Project Structure

```
Task-Management-System/
│
├── task-manager-backend/
│   ├── src/
│   ├── prisma/
│   └── ...
│
├── task-manager-frontend/
│   ├── app/
│   ├── services/
│   └── ...
```

---

## 🔑 API Endpoints

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`
* `POST /auth/logout`

### Tasks

* `GET /tasks`
* `POST /tasks`
* `PATCH /tasks/:id`
* `DELETE /tasks/:id`
* `PATCH /tasks/:id/toggle`

---



## 🚀 Getting Started (Local Setup)

### 1. Clone the repo

```
git clone https://github.com/your-username/Task-Management-System.git
cd Task-Management-System
```

---

### 2. Backend Setup

```
cd task-manager-backend
npm install
npx prisma migrate dev
npm run dev
```

---

### 3. Frontend Setup

```
cd task-manager-frontend
npm install
npm run dev
```

---

## 🧪 Testing

* Register a new user
* Login and access dashboard
* Add / Toggle / Delete tasks
* Use search and filter

---

## 🎯 Highlights

* Full-stack architecture
* Secure authentication system
* Clean UI/UX
* Production deployment
* Industry-standard practices

---

## 👨‍💻 Author

**Abhinav Mishra**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!

---
