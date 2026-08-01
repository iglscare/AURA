<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fad37e69-1786-45e5-a547-3fbcf5e984b2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🐳 Docker Deployment & Containerization

### Quick Start with Docker Compose

**Run Production Container (Nginx served on port 8080):**
```bash
docker compose up aura-prod --build
```
> Access app at `http://localhost:8080`

**Run Development Container (Hot-reload enabled on port 3000):**
```bash
docker compose up aura-dev
```
> Access app at `http://localhost:3000`

---

### Standalone Docker Commands

**1. Build Production Image:**
```bash
docker build -t aura-app:latest .
```

**2. Run Production Container:**
```bash
docker run -d -p 8080:80 --name aura-container aura-app:latest
```

**3. Stop Container:**
```bash
docker stop aura-container && docker rm aura-container
```
