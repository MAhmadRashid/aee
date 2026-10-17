# 🚀 Vercel Deployment Guide — ZERO TO ONE Haute Parfumerie

Your website code has been verified, built without errors, and pushed to GitHub:
**Repository:** [https://github.com/MAhmadRashid/aee](https://github.com/MAhmadRashid/aee)

---

## ⚡ Step-by-Step 1-Click Deployment (Recommended)

### Step 1: Open Vercel
1. Go to [https://vercel.com](https://vercel.com).
2. Click **"Sign Up"** or **"Log In"** using your **GitHub account** (`MAhmadRashid`).

### Step 2: Import Your Project
1. On your Vercel Dashboard, click **"Add New..."** ➔ **"Project"**.
2. Find the repository named **`aee`** in your GitHub list.
3. Click the **"Import"** button next to it.

### Step 3: Configure Environment Variables
Before clicking deploy, expand the **"Environment Variables"** accordion section and add your Firebase credentials (from `.env.local`):

| Variable Name | Description |
| :--- | :--- |
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin Service Account Email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin Private Key (entire string including `-----BEGIN PRIVATE KEY-----`) |

*(Optional)*: If you use NextAuth in production:
| Variable Name | Description |
| :--- | :--- |
| `NEXTAUTH_URL` | Your production Vercel URL (e.g. `https://your-site.vercel.app`) |
| `NEXTAUTH_SECRET` | Any random 32-character string |

### Step 4: Click Deploy!
1. Click the blue **"Deploy"** button.
2. Vercel will build your Next.js application in about 60–90 seconds.
3. Once completed, you will get confetti and a live production link (e.g., `https://aee-xxx.vercel.app`)!

---

## 🔄 Automatic Continuous Deployment (CI/CD)
Whenever you make changes and push to GitHub (`git push origin master`), Vercel will automatically re-build and publish the updated website live!

---

## 🌐 Custom Domain (Optional)
Once deployed on Vercel:
1. Go to **Project Settings** ➔ **Domains**.
2. Enter your custom domain (e.g. `zerotoone.pk` or `zerotooneperfumes.com`).
3. Add the displayed DNS records (A Record / CNAME) at your domain registrar (GoDaddy, Namecheap, etc.).
4. Vercel will automatically provision a free SSL Certificate (HTTPS).
