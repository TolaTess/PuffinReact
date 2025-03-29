# PuffinGood Food Delivery Platform

A full-stack food delivery platform built with React, Node.js, and Firebase.

## Project Structure

```
puffingood/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── package.json       # Root package.json for managing both frontend and backend
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the required environment variables

4. Start the development servers:
   ```bash
   npm start
   ```
   This will start both the frontend (port 5173) and backend (port 3000) servers concurrently.

## Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=3000
```

## Available Scripts

- `npm start`: Start both frontend and backend servers
- `npm run start:frontend`: Start only the frontend server
- `npm run start:backend`: Start only the backend server
- `npm run install:all`: Install dependencies for all parts of the application 