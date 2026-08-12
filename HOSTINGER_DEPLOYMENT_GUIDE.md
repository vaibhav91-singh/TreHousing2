# Hostinger Deployment Guide for TRE Housing Publications

This document provides step-by-step instructions for deploying both the Frontend (React Vite App + Custom Admin Panel) and the Backend (Django REST Framework) on Hostinger.

---

## 🏗 Architecture & Hostinger Deployment Options

### Scenario A: Deploying on Hostinger Shared Hosting (No Python Support)
If your Hostinger plan is Shared Web Hosting (hPanel) without Python WSGI support:

1. **Deploy Frontend & Admin Panel on Hostinger:**
   - Run `npm run build` inside `frontend-react`.
   - Upload the contents of the `dist/` directory directly into Hostinger's `public_html/`.
   - Make sure to upload the `.htaccess` file to `public_html/` so that React SPA routing and `/admin` routes work properly without 404 errors.

2. **Deploy Backend (Django) on Render / PythonAnywhere (Free/Low cost):**
   - Push `TREBACKEND-main` to GitHub.
   - Deploy on **Render.com** or **PythonAnywhere.com**.
   - Copy the deployed live backend URL (e.g. `https://trebackend.onrender.com`).
   - In Hostinger `.htaccess` or React environment config, set API base URL to your live backend endpoint.

---

### Scenario B: Deploying on Hostinger VPS or Python-Enabled Plan

If your Hostinger plan supports Python App Manager or VPS:

1. **Setup Python Application:**
   - Create a Python 3.10+ application in Hostinger App Manager.
   - Point application root to `TREBACKEND-main/TREBACKEND-main/trebackend`.
   - WSGI entry point: `trebackend.wsgi:application`.

2. **Setup Static Build:**
   - Upload compiled `dist/` folder contents of `frontend-react` to `public_html/`.
   - Ensure `.htaccess` routes `/api/` calls to `http://127.0.0.1:8000/api/` or Hostinger Python WSGI socket.

---

## 📄 Apache `.htaccess` Configuration for Hostinger (`public_html/.htaccess`)

```apache
Options -MultiViews
RewriteEngine On

# Allow direct access to backend APIs or static assets if running locally or via reverse proxy
RewriteCond %{REQUEST_URI} ^/api [NC,OR]
RewriteCond %{REQUEST_URI} ^/media [NC,OR]
RewriteCond %{REQUEST_URI} ^/static [NC]
RewriteRule ^ - [L]

# Single Page Application (SPA) Fallback for React Router & /admin Route
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

---

## 🔐 Admin Panel Access Details
- **Admin Panel URL:** `https://yourdomain.com/admin`
- **Default Security Passcode:** `admin123`
- **Change Passcode:** Navigate to `Settings` tab inside the Admin Dashboard to update your secret passcode anytime.

---
*Created by AI Assistant for TRE Housing Publications Deployment.*
