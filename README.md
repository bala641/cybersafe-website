# CyberSafe Website

Marketing website and download center for CyberSafe Network Monitor.

## Project Structure

```
cybersafe.site/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── pages/        # Landing, Downloads, Features, Admin Dashboard
│   │   ├── components/   # Navbar, Footer, ProtectedRoute
│   │   ├── context/      # Firebase authentication
│   │   └── firebase.js   # Firebase configuration
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/               # Flask REST API
│   ├── app.py            # Main API server
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## Features

- 🌐 Professional landing page
- 📥 Download center for Windows/macOS/Android
- 📊 Admin dashboard with analytics
- 🔐 Google Sign-In authentication
- 📈 Download tracking and statistics
- 📱 Responsive design

## Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Deployment

Ready to deploy to:
- **Frontend**: Vercel, Firebase Hosting
- **Backend**: Render, Heroku, Railway
- **Database**: Firebase Firestore

## Configuration

See backend/.env.example for backend setup.
See frontend/src/firebase.js for frontend configuration.

## More Info

Visit the main project folder for complete application documentation.
