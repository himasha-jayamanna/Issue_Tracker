# Issue_Tracker
 
A modern full-stack issue tracker built with React, Node.js, Express, and MongoDB, featuring JWT authentication. The application allows users to create, manage, update,delete, filter, and export issues in a clean and user-friendly interface.

---

## Features

- User authentication (Register & Login with JWT)
- Create, edit, delete issues
- Assign issues to users
- Issue status management (Open, In Progress, Resolved, Closed)
- Priority management (Low, Medium, High)
- Search and filter issues by title, status, and priority
- Export issues as **CSV** or **JSON**
- Responsive and clean UI

---

## Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**

### Tools
- Git & GitHub
- Postman (for API testing)

---

## Getting Started (Local Setup)

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later recommended)
- MongoDB (local or MongoDB Atlas)
- Git

---

## Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend


---

## Getting Started (Local Setup)

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later recommended)
- MongoDB (local or MongoDB Atlas)
- Git

---

## Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend

2. Install dependencies:
    ```bash
    npm install

3. Create a .env file inside backend/:
    ```bash
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

4. Create a .env file inside backend/:
    ```bash
    node server.js
    
## Frontend Setup

1. Navigate to frontend folder:
    ```bash
    cd frontend

2. Install dependencies:
    ```bash
    npm install

3. Start frontend:
    ```bash
    npm run dev
