# Smart Facility Assistant (SFA) - Backend

The **Smart Facility Assistant (SFA)** is an intelligent IoT and AI-powered system designed to enhance energy efficiency, security, and operational intelligence for server rooms, ATM stations, and control centers. This backend is built with NestJS using a microservices architecture.

## 🚀 Features

- 🔥 Smart Cooling System: Real-time temperature tracking and AI-based fan control.
- 🧠 AI Security: Face recognition, behavioral alerts, and threat classification.
- 📹 Camera Optimization: Suggests optimal camera placement and detects blind spots.
- 🗺️ Interactive 2D Map: Upload facility images to auto-generate interactive layouts.
- 💡 AI Recommendations: Energy-saving and security tips based on real-time data.

## 🧱 Tech Stack

- **NestJS** for backend architecture
- **MQTT** for IoT sensor communication
- **Redis**  for inter-service messaging
- **PostgreSQL** for data persistence
- **Docker** for containerized deployment

---

## 🛠️ Getting Started

Follow these steps to run the backend locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```

### 2. Navigate to the project directory

```bash
cd your-repo-name
```

### 3. Install dependencies

```bash
pnpm i
```

Make sure you have `pnpm` installed. If not, install it with:

```bash
npm install -g pnpm
```

### 4. Start dependencies (Redis, MQTT broker, PostgreSQL)

You can either install and run these locally or spin them up with Docker:

```bash
docker compose up --build
```

### 5. Configure your environment

Copy the example env and edit the credentials:

```bash
cp .env.example .env
```

Update database, Redis, and MQTT connection info as needed.

### 6. Run the application

```bash
pnpm start:dev
```

### 7. Access API documentation

Visit:

```
http://localhost:3000/api-docs
```

---

## 📦 Services Overview

- `mqtt-service`: Handles sensor data input from IoT devices.
- `camera-service`: Interfaces with Python ML microservices for AI functionality.
- `api-gateway`: Serves the REST & WebSocket APIs to frontend clients.
- `database`: PostgreSQL instance for structured logging and data storage.

---

## 👤 User Roles

- **Admin**: Full access (editor, camera setup, analytics).
- **Employee**: View dashboards and receive alerts.
- **AI System**: Monitors system and triggers automation.

---

## 📈 Success Metrics

- Reduce unnecessary fan usage by 25%
- 90%+ accurate face recognition
- Intrusion alerts within 3 seconds
- Interactive map generation in under 10 seconds

---

## 📄 License

MIT License

---

> Built with ❤️ for the Hackathon Challenge — April 2025
