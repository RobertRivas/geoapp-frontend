# 🌍 geoapp Frontend

This is the **frontend for GeoApp**, built with **React**, **TypeScript**, and **Vite**. It renders interactive Mapbox-based geographic visualizations and consumes data from a FastAPI backend. The app is deployed via **AWS Amplify** with GitHub integration.

---

## ⚙️ Environment Setup

This project uses `.env` files to manage settings for local and production environments.

### 🧪 Local Development

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your local settings:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_MAPBOX_API_KEY=your_mapbox_token
   ```

3. Start the dev server:

   ```bash
   yarn install
   yarn dev
   ```

---


