# Student Life OS - Deployment Guide

This guide explains how to deploy the **Student Life OS** project (Frontend + Backend) to production.

---

## 1. Deploying Backend (Render / Railway / Heroku)

### Option A: Render (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
2. Connect your Git repository.
3. Set the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in Render:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(your-secret-key-here)`
   - `MONGO_URI` = `(your-mongodb-atlas-connection-string)` *(Optional: if omitted, in-memory store is used)*
   - `FRONTEND_URL` = `(your-deployed-vercel-frontend-url)` e.g. `https://student-life-os.vercel.app`

---

## 2. Deploying Frontend (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/new) and import your repository.
2. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-api-url.onrender.com/api`
3. Click **Deploy**.

---

## 3. Summary of Fixed Deployment Issues

1. **Frontend Crash Prevention**: Fixed `api.js` throwing an unhandled exception when `VITE_API_URL` is omitted during production build.
2. **Server Crash Prevention**: Fixed `server.js` and `db.js` crashing when `MONGO_URI` or `JWT_SECRET` were not passed during initial platform health checks.
3. **CORS Flexibility**: Configured CORS middleware in `server.js` to allow production cross-origin API requests from Vercel.
4. **Root Build Scripts**: Added `"build"` and `"start"` scripts to root `package.json` so root-level cloud runners succeed seamlessly.
