# 🚚 LogiSense AI – Smart Supply Chain Optimizer

## 🌟 Overview

LogiSense AI is an intelligent logistics optimization platform that helps businesses reduce delivery time, fuel consumption, and carbon emissions using AI-driven insights and real-time visualization.

It combines interactive maps, analytics dashboards, and optimization logic to simulate efficient supply chain routing.

---

## 🚀 Live Demo

| Service | Link |
|---|---|
| 🌐 **Frontend (MVP)** | **https://logisense-ai-frontend-52snaizrda-el.a.run.app** |
| ⚙️ **Backend API** | **https://logisense-ai-backend-52snaizrda-el.a.run.app** |
| 📄 **API Docs (Swagger)** | **https://logisense-ai-backend-52snaizrda-el.a.run.app/docs** |

---

## 🎯 Problem Statement

Modern supply chains suffer from:

* Inefficient routing
* High fuel consumption
* Increased carbon emissions
* Lack of real-time optimization

---

## 💡 Solution

LogiSense AI provides:

* Route optimization with AI-based insights
* Real-time visualization of logistics routes
* Dynamic analytics for performance tracking
* Smart fallback system for reliability

---

## 🧠 Key Features

### 📍 Route Optimizer

* Input source, destination, and priority
* Visualized optimized route on interactive 3D map
* AI-generated performance metrics:
  * ⏱ Time saved
  * ⛽ Fuel saved
  * 🌿 CO₂ reduction

---

### 🗺️ Interactive Map (Fixed & Fully Working)

* Built using **DeckGL + TileLayer + CartoDB Dark Matter** tiles
* Smooth scroll-to-zoom, drag-to-pan, drag-to-rotate (3D)
* Start and end markers with color-coded visualization
* No billing required — fully open tile source

---

### 📊 Analytics Dashboard

* Live-updating charts (delivery trends, fuel usage, etc.)
* Simulated real-time data updates
* Clean and modern dark UI

---

### ⚡ Smart AI Integration

* Uses **Gemini 2.0 Flash** for route suggestions and logistics insights
* Fallback mechanism ensures reliability even if API fails

---

### 🎤 Voice Assistant

* Voice-triggered interaction for enhanced UX
* Designed for future expansion

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework |
| Tailwind CSS | Styling |
| Zustand | State management |
| DeckGL v9 | 3D map & route visualization |
| Recharts | Analytics charts |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API |
| Python 3.13 | Runtime |
| Google Gemini 2.0 Flash | AI route optimization |
| Uvicorn | ASGI server |

### Infrastructure
| Technology | Purpose |
|---|---|
| Google Cloud Run | Serverless container hosting |
| Docker | Containerization |
| CartoDB + OpenStreetMap | Map tiles (free, no API key) |

---

## ⚙️ How It Works

```
1. User enters source & destination
2. System sends request to FastAPI backend
3. Gemini AI generates optimized route insights
4. Route is visualized on interactive 3D map (DeckGL)
5. Dashboard updates with analytics metrics
```

---

## 📦 Local Installation

```bash
# Clone the repo
git clone https://github.com/tanishq4220/LogiSenseAI-.git
cd LogiSenseAI-

# ── Backend ──────────────────────────────────────────
cd backend
pip install -r requirements.txt

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# ── Frontend (new terminal) ───────────────────────────
cd ../frontend
npm install
npm run dev
```

Then open → **http://localhost:5173** (or the port shown by Vite)

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/v1/chat` | AI route optimization |

### Example Request

```json
POST /api/v1/chat
{
  "message": "Optimize route from Pune to Mumbai",
  "history": []
}
```

### Example Response

```json
{
  "response": "Optimized route via NH48. Estimated savings: -22% time, -18% fuel, -20% CO₂."
}
```

---

## 🔮 Future Enhancements

* Real-time traffic integration via Google Maps API
* Multi-route comparison view
* Fleet tracking with live GPS
* Advanced AI optimization using LangGraph
* Carbon credit reporting dashboard

---

## 👨‍💻 Team

* **Tanishq** — Full Stack Developer & AI Integration

---

## 🏆 Hackathon Project

Built for the **Solution Challenge** — demonstrating AI-powered logistics optimization using Google Cloud and Gemini AI.

---

## 💬 Final Note

LogiSense AI showcases how intelligent systems can transform supply chains into faster, greener, and more efficient networks — powered by Google's AI and Cloud infrastructure.

---

*Deployed on Google Cloud Run · Powered by Gemini 2.0 Flash · Maps by CartoDB & OpenStreetMap*
