# ChatApp

A full-stack real-time chat application built with the MERN stack and Socket.IO.

## Features

- **Real-time messaging** — instant message delivery with Socket.IO
- **Typing indicators** — animated dots when the other user is typing
- **Read receipts** — single tick (sent) and double blue tick (seen)
- **Online user status** — see who's currently online
- **JWT Authentication** — secure login/signup with httpOnly cookies
- **Profile pictures** — upload and update your avatar
- **32 UI themes** — powered by DaisyUI

## Tech Stack

**Frontend:** React, Vite, Zustand, TailwindCSS, DaisyUI, Socket.IO Client, Axios

**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free tier works)

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/shivambansal2512/fullstack-chat-app.git
   cd fullstack-chat-app
   ```

2. Create `backend/.env`
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

3. Install dependencies and run
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend (new terminal)
   cd frontend
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`

## License

MIT © [Shivam Bansal](https://github.com/shivambansal2512)
