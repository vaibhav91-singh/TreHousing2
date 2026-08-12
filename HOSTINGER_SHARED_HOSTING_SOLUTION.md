# Solution: Hostinger Shared Hosting (No VPS / No Python Support)

Since Hostinger Shared Hosting only supports Static files (HTML, CSS, JS) & PHP, here is the **Best 100% Free Architecture Setup** to deploy your website and Admin Panel live:

---

## 🏗 High-Level Setup Overview

1. **Frontend + Admin Panel (On Hostinger):**
   - Upload `frontend-react/dist` files to Hostinger `public_html/`.
   - Your website and Admin Panel will run smoothly at `https://yourdomain.com` and `https://yourdomain.com/admin`.

2. **Django Backend + Database (On Free Cloud Server):**
   - Deploy `TREBACKEND-main` for **FREE** on **Render.com** or **PythonAnywhere.com**.
   - Your Django Backend will give a Live API URL like: `https://tre-backend.onrender.com`.

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Deploy Django Backend on Render.com (100% FREE)

1. Sign up on **[Render.com](https://render.com/)** using GitHub.
2. Click **New +** ➔ Select **Web Service**.
3. Connect your GitHub repository `vaibhav91-singh/TreHousing2`.
4. Fill the configuration settings:
   - **Root Directory:** `TREBACKEND-main/TREBACKEND-main/trebackend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command:** `gunicorn trebackend.wsgi:application`
5. Click **Create Web Service**. 
6. Render will give you a Live Backend API URL (e.g. `https://tre-backend.onrender.com`).

---

### Step 2: Deploy Frontend on Hostinger Shared Hosting

1. In your local project, open `frontend-react` folder and run:
   ```bash
   npm run build
   ```
2. Open Hostinger **File Manager** ➔ Go to **`public_html/`**.
3. Upload all files inside `frontend-react/dist/` directly into `public_html/`.
4. Upload the **`.htaccess`** file to `public_html/` so React routing & `/admin` routes don't show 404 errors.

---

### 🌐 Summary of Your Live System:
- **Main Website:** `https://yourdomain.com` (Hosted on Hostinger)
- **Admin Panel:** `https://yourdomain.com/admin` (Hosted on Hostinger)
- **Django Backend Database:** `https://tre-backend.onrender.com` (Hosted Free on Render)

*This setup costs ₹0 extra and gives you maximum performance without needing a VPS plan!*
