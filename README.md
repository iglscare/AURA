# 👑 AURA — Ultra-Luxury E-Commerce & Executive Console

An haute-horlogerie and luxury goods storefront combined with a high-performance **Executive Control Center**, featuring 3D Canvas interactions, custom physics-based scroll animations, Supabase backend integration, and Nginx production containerization.

---

## ✨ Features

- **🏆 Luxury Storefront**: Immersive dark-mode aesthetic with custom gold accents, typography (`Plus Jakarta Sans` & `Cormorant Garamond`), 3D viewport canvas, and smooth Lenis scrolling.
- **📊 Executive Admin Console**: Comprehensive management hub for live inventory management, user directory moderation (VIP, Customer, Admin access), tabular revenue tracking, and order fulfillment status updates.
- **🔒 Secure Supabase Backend**: Integrated client architecture with environment variable bindings for database operations, user management, and cloud image uploads.
- **🐳 Docker Containerization**: Production multi-stage Docker build served via Nginx Alpine with custom SPA routing and Gzip asset compression.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4
- **Animation & 3D**: Three.js, Lucide Icons, Motion (Framer Motion), Lenis, GSAP
- **State Management**: Zustand
- **Backend & Database**: Supabase (`@supabase/supabase-js`)
- **Web Server & Containerization**: Nginx Alpine, Docker, Docker Compose

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+)
- npm (v10+)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/iglscare/AURA.git
cd AURA
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Start Development Server
```bash
npm run dev
```
> Access application at `http://localhost:3000`

---

## 🐳 Docker Deployment & Containerization

### Run Production Container (Port 8080)
```bash
docker compose up aura-prod --build
```
> Access app at `http://localhost:8080`

### Run Containerized Dev Server (Port 3000 with Hot-Reload)
```bash
docker compose up aura-dev
```

### Standalone Docker Commands
```bash
# Build production image
docker build -t aura-app:latest .

# Run container
docker run -d -p 8080:80 --name aura-container aura-app:latest
```

---

## 🔒 Security & Best Practices

- Environment variables (`.env`, `.env.local`) are strictly excluded from source control via `.gitignore`.
- Production builds use multi-stage Docker isolation to serve pre-compiled static assets without exposing source code or secrets.
- All Supabase API connections use environment variable bindings.

