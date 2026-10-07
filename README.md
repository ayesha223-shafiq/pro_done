# AgriHawk Pro — Autonomous Aerial Agriculture & Farm Intelligence OS

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

AgriHawk Pro is an enterprise precision agriculture and autonomous drone operations platform. It combines multispectral aerial scanning (NDVI, NDRE), AI crop disease diagnostics, sub-centimeter RTK topographic mapping, and precision variable-rate micro-spraying with an executive corporate web portal.

---

## 🚀 Key Features

- **Executive Portal & Design System**: High-impact navy & amber theme, interactive service pillars, 5-phase flight protocol showcase, and a dynamic mission proposal estimator.
- **Farm Management Suite**: Multi-farm dashboard with quick search & location filtering, crop lifecycle tracking, and acreage telemetry.
- **Multispectral NDVI Mapping**: Visualizes crop vegetative vigor, nitrogen stress, and chlorophyll density with zonal prescription overlays.
- **AI Crop Pathology & Diagnostics**: Deep-learning computer vision for identifying wheat rust, fungal blight, powdery mildew, and insect clusters.
- **Autonomous Drone Missions**: Mission planning, waypoint routing, battery telemetry, and flight logs.
- **Precision Variable-Rate Spraying**: Micro-dose calculation with centrifugal atomizers, slashing chemical waste by up to 35%.
- **Persistent Cloud Backend**: Firebase Firestore integration for real-time synchronization of farms, flight missions, inquiries, and consultation bookings.

---

## 🛠️ Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `yarn` / `pnpm`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/agrihawk-pro.git

# Navigate to the project folder
cd agrihawk-pro

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Add your Firebase and Gemini API keys inside `.env` if using direct client credentials.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📤 How to Push to GitHub

If you have downloaded this project or cloned it locally, follow these steps to connect and push it to your GitHub account:

### Step 1: Create a New GitHub Repository
1. Log in to your [GitHub Account](https://github.com/).
2. Click the **+** icon in the top right corner and select **New repository**.
3. Name your repository (e.g. `agrihawk-pro`).
4. **Leave "Initialize this repository with a README" unchecked** (since you already have this repository ready).
5. Click **Create repository**.

### Step 2: Initialize & Commit Locally
In your terminal, inside the project folder:
```bash
# Check git status
git status

# Stage all files
git add .

# Create a commit
git commit -m "AgriHawk Pro: AI-powered smart agriculture and drone OS"
```

### Step 3: Link & Push to GitHub
```bash
# Set primary branch to main
git branch -M main

# Link remote origin (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/agrihawk-pro.git

# Push your code to GitHub
git push -u origin main
```

---

## 🏗️ Project Architecture

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular UI components
│   │   ├── LandingPage.tsx          # Executive corporate portal & estimator
│   │   ├── DashboardView.tsx        # Farm intelligence dashboard & search
│   │   ├── ConsultationModal.tsx    # Flight consultation booking modal
│   │   ├── CropMonitoringView.tsx   # NDVI multispectral indices
│   │   ├── DiseaseDetectionView.tsx # AI plant pathology diagnostics
│   │   ├── DroneMissionsView.tsx    # Aerial flight fleet & missions
│   │   ├── PrecisionSprayingView.tsx# Variable-rate micro-dose sprayer
│   │   ├── FarmMappingView.tsx      # RTK 3D elevation & contour mapping
│   │   └── ...
│   ├── context/            # React Context (Auth, Toasts)
│   ├── services/           # Firebase Firestore service layer
│   ├── types/              # TypeScript interfaces and schemas
│   ├── App.tsx             # Main view router and orchestrator
│   └── main.tsx            # React application entry point
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build config
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
