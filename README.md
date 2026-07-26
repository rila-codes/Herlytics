# 🌸 HerLytics - Predict. Prevent. Empower.

HerLytics is an AI-powered, open-source women's wellness platform designed to help women evaluate their health risks through predictive analytics, personalized wellness guidance, and lifestyle tracking. Its flagship feature is an AI-powered PCOS (PCOD) Risk Prediction system that estimates the likelihood of PCOS based on user-provided lifestyle, menstrual, and health information.

---

## ⚠ Medical Disclaimer
**HerLytics is not a diagnostic or treatment platform. It provides predictive insights based on user-supplied information and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Users with concerning symptoms or elevated risk should consult a qualified healthcare professional.**

---

## 🛠 Tech Stack

- **Frontend**: React (TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts)
- **Backend**: Spring Boot 3.x (Java 17, Hibernate, Spring Security, JWT, Lombok, Swagger/OpenAPI)
- **AI Service**: FastAPI (Python 3.10+, Scikit-Learn Random Forest Classifier)
- **Database**: PostgreSQL (Neon database ready)

---

## 📂 Project Structure

```text
e:/Herlytics/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/herlytics/
│   │   ├── config/          # Database seeder & security configurations
│   │   ├── controller/      # API Rest Controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Hibernate Entities
│   │   ├── repository/      # JPA Data repositories
│   │   ├── security/        # JWT Web Security
│   │   └── service/         # Core business logic services
│   ├── pom.xml
│   └── Dockerfile
├── ai/                      # FastAPI Python Service
│   ├── app/
│   │   ├── main.py          # Routing & endpoints
│   │   ├── model/           # Training script & model persistence
│   │   └── predict/         # Inference logic & recommendations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # React SPA
│   ├── src/
│   │   ├── assets/          # Logo & assets
│   │   ├── components/      # UI components (e.g., ProtectedRoute)
│   │   ├── contexts/        # Auth Session context
│   │   ├── layouts/         # Navbar & Bottom menu wrapper
│   │   └── pages/           # Pages (Dashboard, Assessment, Result, etc.)
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml       # Docker environment orchestrator
└── schema.sql               # PostgreSQL Schema script
```

---

## 🚀 Getting Started

### Method 1: Docker Compose (Recommended)
You can spin up the entire application (Frontend, Backend, AI service, Database) in a single command:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs (Swagger): `http://localhost:8080/swagger-ui.html`
- AI Service Docs: `http://localhost:8000/docs`

---

### Method 2: Manual Local Startup

#### 1. AI Service
1. Navigate to the `/ai` directory.
2. Install python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the model training script to generate the persistence file:
   ```bash
   python app/model/train.py
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### 2. Spring Boot Backend
1. Make sure you have PostgreSQL running and a database named `herlytics` created (or edit `application.yml` configurations).
2. Navigate to the `/backend` directory.
3. Start the application:
   ```bash
   mvn spring-boot:run
   ```

#### 3. React Frontend
1. Navigate to the `/frontend` directory.
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Verification & Testing
- **AI Health Check**: Verify by sending a request to `http://localhost:8000/health`. It should return `{"status":"healthy","model_loaded":true}`.
- **Backend API**: Check `http://localhost:8080/swagger-ui/index.html` to verify all endpoints are active.
- **Database Seeding**: The backend automatically seeds initial anti-inflammatory recipes and PCOS articles on startup if the database tables are empty.
