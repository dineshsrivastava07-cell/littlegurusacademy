# Little Gurus Academy

**Online preschool & after-school tutoring platform for ages 2–10, based in Gurgaon, India.**

Live at: **https://littlegurus.guru**

---

## Live URLs

| Service | URL |
|---------|-----|
| Website (Frontend) | https://littlegurus.guru |
| API (Backend) | https://littlegurusacademy.vercel.app |
| Admin Portal | https://littlegurus.guru/admin |
| Student LMS | https://littlegurus.guru/lms |
| API Health | https://littlegurusacademy.vercel.app/api/health |

---

## Tech Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | React 19 + Tailwind CSS + shadcn/ui | GitHub Pages (free) |
| Backend | FastAPI + Motor (async) | Vercel Hobby — Mumbai (bom1) |
| Database | MongoDB Atlas M0 | ap-south-1 Mumbai (DPDP compliant) |
| Email | Resend | — |
| DNS | Namecheap | — |
| CI/CD | GitHub Actions | — |
| Keep-alive | cron-job.org (14 min ping) | — |

> **DPDP Compliance:** All data (MongoDB Atlas ap-south-1) and compute (Vercel bom1) reside in India, satisfying the Digital Personal Data Protection Act 2023.

---

## Repository Structure

```
littlegurusacademy/
├── frontend/                   # React 19 app (Create React App + CRACO)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Admin.jsx       # Admin CMS portal (46KB)
│   │   │   ├── StudentLMS.jsx  # Student learning portal
│   │   │   ├── Learn.jsx       # Public free video library
│   │   │   ├── Gallery.jsx     # Photo gallery
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.js          # Axios API client
│   │   │   └── data.js         # Static / hardcoded data
│   │   └── App.js              # React Router routes
│   ├── package.json
│   └── craco.config.js
├── backend/                    # FastAPI application
│   ├── server.py               # All API endpoints
│   ├── auth.py                 # JWT + bcrypt authentication
│   ├── email_service.py        # Resend email helpers
│   ├── requirements.txt
│   └── vercel.json             # Vercel serverless config
└── .github/
    └── workflows/
        └── deploy-frontend.yml
```

---

## Environment Variables

### Backend — set in Vercel Dashboard → Settings → Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.psltu7r.mongodb.net/littlegurusacademy` |
| `ADMIN_PASSWORD` | Admin portal password (hashed on first boot) | `your-secure-password` |
| `JWT_SECRET` | Secret for signing JWT tokens | `random-64-char-string` |
| `RESEND_API_KEY` | Resend transactional email API key | `re_xxxxxxxxxxxx` |
| `SENDER_EMAIL` | Verified sender email for Resend | `littlegurus025@gmail.com` |
| `ADMIN_EMAIL` | Admin notification inbox | `your@email.com` |
| `FRONTEND_URL` | CORS allowed origin | `https://littlegurus.guru` |
| `ENVIRONMENT` | Runtime environment flag | `production` |

### Frontend — set as GitHub Actions Secret

| Secret | Description | Value |
|--------|-------------|-------|
| `REACT_APP_BACKEND_URL` | Full URL of the backend API | `https://littlegurusacademy.vercel.app` |

---

## Local Development

### Prerequisites

- Node.js 20+ and Yarn
- Python 3.11+
- MongoDB (local) or Atlas connection string

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env
cat > .env << 'EOF'
MONGO_URL=mongodb://localhost:27017/littlegurusacademy
ADMIN_PASSWORD=admin123
JWT_SECRET=local-dev-secret-change-in-prod
RESEND_API_KEY=re_test_key
SENDER_EMAIL=test@example.com
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
EOF

uvicorn server:app --reload --port 8000
```

### Frontend

```bash
cd frontend
yarn install
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env.local
yarn start
```

Open http://localhost:3000

---

## Deployment

### Frontend — automatic via GitHub Actions

Every push to `main` touching `frontend/**` triggers `.github/workflows/deploy-frontend.yml`:

1. Setup Node 20 and `yarn install --ignore-engines`
2. Build React app with `REACT_APP_BACKEND_URL` from GitHub Secrets
3. Add `CNAME` file (`littlegurus.guru`) to build output
4. Push `frontend/build` to `gh-pages` branch via `peaceiris/actions-gh-pages@v3`

GitHub Pages serves the `gh-pages` branch at `https://littlegurus.guru`.

### Backend — automatic via Vercel

Every push to `main` touching `backend/**` triggers a Vercel auto-deploy:

- Root Directory: `backend`
- Framework: Other (FastAPI via `@vercel/python`)
- Region: `bom1` (Mumbai, India)
- Config: `backend/vercel.json`

### DNS (Namecheap)

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | dineshsrivastava07-cell.github.io |

---

## Admin Portal

- URL: https://littlegurus.guru/admin
- Username: `admin`
- Password: set via `ADMIN_PASSWORD` environment variable on Vercel

**Manages:** Enquiries · Applications · Students · Testimonials · Videos · Teachers · Gallery · Site Settings · Chat Messages

---

## Student LMS

- URL: https://littlegurus.guru/lms
- Credentials issued by admin via the Admin Portal
- **Features:** Video library · Live chat with teachers · Support tickets · Profile

---

## Keep-Alive

Vercel Hobby functions sleep after ~10 minutes of inactivity. A job on **cron-job.org** pings `/api/health` every **14 minutes** to prevent cold starts during school hours (6 AM–10 PM IST).

---

## License

Private — All rights reserved. © 2024 Little Gurus Academy, Gurgaon, India.
