# CyberSafe Website Backend

This is the Flask backend API for the CyberSafe website, handling downloads tracking, user authentication, and admin analytics.

## Features

- Google Firebase authentication
- Download history tracking
- Admin dashboard with analytics
- User management
- CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Go to Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Save the JSON file as `firebase-key.json` in this directory
5. Enable Firestore Database in Firebase Console

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your Firebase credentials.

### 4. Create Firestore Collections

Run this Python script to initialize Firestore:

```python
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Create initial collections
db.collection('downloads').document('_placeholder').set({'_placeholder': True})
db.collection('users').document('_placeholder').set({'_placeholder': True})
```

## Running the Server

```bash
python app.py
```

The API will run on `http://localhost:5001`

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check

### Authenticated Endpoints

- `POST /api/download` - Record a download
  - Requires: Bearer token in Authorization header
  - Body: `{ platform: 'windows|macos|android' }`

### Admin Endpoints (requires admin role)

- `GET /api/admin/downloads` - Get download history with filters
  - Query params: `platform`, `dateRange` (24h|7d|30d|all)

- `GET /api/admin/users` - Get all users

- `GET /api/admin/stats` - Get overall statistics

- `POST /api/admin/set-admin/<user_id>` - Grant admin privileges

## Frontend Integration

The frontend connects to this API at `http://localhost:5001/api`.

Configure your Firebase credentials in `frontend/src/firebase.js`.

## Security

- All endpoints (except health) require Firebase authentication
- Admin endpoints require admin privileges
- CORS is configured for development
- In production, update CORS to specific domains only

## Deployment

### To Firebase Cloud Functions

1. Install Firebase CLI
2. Run `firebase login`
3. Run `firebase init functions`
4. Copy `app.py` content to `functions/main.py`
5. Run `firebase deploy --only functions`

### To Heroku

1. Create `Procfile`:
```
web: gunicorn app:app
```

2. Push to Heroku:
```bash
git push heroku main
```

### To Google Cloud App Engine

1. Create `app.yaml`:
```yaml
runtime: python39
env: standard

handlers:
- url: /.*
  script: auto

env_variables:
  FLASK_ENV: "production"
```

2. Deploy:
```bash
gcloud app deploy
```

## Troubleshooting

- **Firebase key not found**: Make sure `firebase-key.json` is in the backend directory
- **CORS errors**: Check frontend origin is allowed in CORS configuration
- **Firestore errors**: Verify Firestore database is created in Firebase Console
