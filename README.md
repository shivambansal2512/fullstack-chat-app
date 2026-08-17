# Chatty

A full-stack real-time chat application built with the MERN stack and Socket.IO.

**Live demo:** https://fullstack-chat-app-jyub.onrender.com

> Hosted on Render's free tier, so the first request after a period of inactivity
> takes 30–50 seconds while the service wakes up.

## Features

- **Real-time messaging** — messages are pushed over Socket.IO, no polling
- **Typing indicators** — animated dots while the other person is typing
- **Read receipts** — single tick for sent, double tick for seen
- **Online presence** — live online/offline status for every contact
- **Image attachments** — photos are uploaded to Cloudinary and served from its CDN
- **JWT authentication** — httpOnly cookies, passwords hashed with bcrypt
- **Grouped messages** — consecutive messages from the same person share one
  avatar and timestamp, with date separators between days
- **Initials avatars** — users without a photo get a coloured circle derived from
  their name, so no two contacts look alike
- **Responsive** — on phones the contact list and the chat swap places instead of
  being squeezed side by side
- **Three accent themes** — one dark palette, switchable accent colour

## Tech Stack

**Frontend** — React, Vite, Zustand, Tailwind CSS, DaisyUI, Socket.IO Client, Axios

**Backend** — Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs, Cloudinary

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free tier is enough)
- A Cloudinary account (free tier is enough) — only needed for image uploads

### Setup

1. Clone the repo

   ```bash
   git clone https://github.com/shivambansal2512/fullstack-chat-app.git
   ```

2. Create `backend/.env`. See [`backend/.env.example`](backend/.env.example) for
   the full list.

   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   The app runs without the Cloudinary keys — image uploads simply return a clear
   "not configured" message instead of failing silently.

3. Install dependencies and run both servers

   ```bash
   npm install --prefix backend
   npm run dev --prefix backend
   ```

   ```bash
   npm install --prefix frontend
   npm run dev --prefix frontend
   ```

4. Open http://localhost:5173

   You need two accounts to try the chat. Open a second browser in incognito mode
   and sign up there.

> `nodemon` only watches `.js`, `.mjs`, `.cjs` and `.json` files, so restart the
> backend manually after editing `.env`.

## Project Structure

```
backend/src
├── controllers    auth and message handlers
├── lib            db, socket, cloudinary, jwt helpers
├── middleware     route protection
├── models         User and Message schemas
└── routes         /api/auth and /api/messages

frontend/src
├── components     Rail, Sidebar, ChatContainer, MessageInput, Avatar
├── pages          Login, SignUp, Home, Profile, Settings
├── store          Zustand stores for auth, chat and theme
└── lib            axios instance and date helpers
```

## Implementation Notes

**Delivering to one user.** The Socket.IO layer keeps a map of `userId → socketId`
as clients connect and disconnect. Sending a message looks up the receiver's socket
and emits only to them, rather than broadcasting to everyone.

**Read receipts.** Opening a conversation marks the other person's messages as read
and emits a `messagesRead` event back to the sender, so their ticks update live
without a refresh.

**Images.** Attachments are uploaded to Cloudinary and only the resulting URL is
stored in MongoDB. Keeping base64 in the database would inflate every document and
send the full image payload on each fetch.

**Message grouping.** Each message is compared against its neighbours: same sender
and same day means the avatar and timestamp are hidden, and the avatar renders on
the last message of the run.

## Deployment

Deployed to Render as a single web service. The backend serves the built frontend
from `frontend/dist` in production.

- **Build command** — `npm run build`
- **Start command** — `npm start`
- **Environment** — the same variables listed above, with `NODE_ENV=production`

## License

MIT © [Shivam Bansal](https://github.com/shivambansal2512)
