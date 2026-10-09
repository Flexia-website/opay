# OPay App — Flask Backend

A full-stack OPay clone PWA with Flask backend, Cloudinary image storage, and Render deployment.

---

## 🚀 Deploy to Render

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/opay-app.git
git push -u origin main
```

### 2. Create Render Web Service
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120`

### 3. Set Environment Variables on Render
Go to your service → Environment → Add:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | (auto-generate or set a random string) |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `ADMIN_USERNAME` | `clinton` |
| `ADMIN_PASSWORD` | `147852` |
| `ADMIN_PIN` | `0803` |
| `INITIAL_BALANCE` | `80754` |

---

## ☁️ Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier is enough)
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. Paste into Render environment variables above

---

## 🔐 Admin Account (Seeded)

The admin account is **pre-seeded** — no registration needed.

| Field | Value |
|-------|-------|
| Name | CLINTON (EJIOFOR-BENJAMIN CLINTON) |
| Password | `147852` |
| PIN | `0803` |

### What the Admin can do:
- ✅ Upload images to Cloudinary (button icons, app logo, network logos)
- ✅ Adjust / set account balance
- ✅ Reset images (reverts to defaults)
- ✅ Customize app colors

### What regular users can do:
- ✅ Upload their own **profile photo** to Cloudinary
- ❌ Cannot upload button/icon images
- ❌ Cannot adjust balance

---

## 📱 PWA Features

The app is a full PWA:
- Installable on Android and iOS
- Works offline (service worker caches assets)
- App icons included

---

## 🛠 Local Development

```bash
pip install -r requirements.txt

# Set env vars
export CLOUDINARY_CLOUD_NAME=your_cloud
export CLOUDINARY_API_KEY=your_key
export CLOUDINARY_API_SECRET=your_secret
export SECRET_KEY=dev-secret

python app.py
# → http://localhost:5000
```

---

## 📁 Project Structure

```
opay-backend/
├── app.py              # Flask backend (API + static serving)
├── requirements.txt    # Python deps
├── Procfile            # Render start command
├── render.yaml         # Render config
├── index.html          # PWA entry point
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── css/                # Styles
├── js/
│   ├── api.js          # Backend API bridge (NEW)
│   ├── store.js        # Client state stores
│   ├── pages/          # Page renderers (patched for backend)
│   └── components/     # Shared components
├── assets/             # Images & fonts
└── icons/              # PWA icons
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | — | Login (password/pin/fingerprint) |
| POST | `/api/logout` | session | Logout |
| GET | `/api/session` | — | Check session |
| GET | `/api/state` | — | Get balance + customization |
| GET | `/api/balance` | — | Get balance |
| POST | `/api/balance/adjust` | admin | Add/subtract balance |
| POST | `/api/balance/set` | admin | Set exact balance |
| GET | `/api/customization` | — | Get customization |
| POST | `/api/customization` | admin | Update colors/settings |
| POST | `/api/upload/image` | admin | Upload button image → Cloudinary |
| POST | `/api/upload/profile` | session | Upload profile photo → Cloudinary |
| POST | `/api/upload/network` | admin | Upload network logo → Cloudinary |
| POST | `/api/image/reset` | admin | Reset image to default |
