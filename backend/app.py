from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from datetime import datetime, timedelta
from functools import wraps
import json

app = Flask(__name__)
CORS(app)

# Initialize Firebase
try:
    firebase_admin.get_app()
except ValueError:
    # Initialize with your Firebase credentials
    # Download from Firebase Console: Project Settings -> Service Accounts -> Generate Key
    if os.path.exists('firebase-key.json'):
        cred = credentials.Certificate('firebase-key.json')
        firebase_admin.initialize_app(cred)
    else:
        print("WARNING: firebase-key.json not found. Using emulator or environment variables.")

db = firestore.client()

# Authentication middleware
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'message': f'Token verification failed: {str(e)}'}), 401

        return f(*args, **kwargs)
    return decorated_function

# Admin check middleware
def admin_required(f):
    @wraps(f)
    @token_required
    def decorated_function(*args, **kwargs):
        user_doc = db.collection('users').document(request.user['uid']).get()
        if not user_doc.exists or not user_doc.get('isAdmin', False):
            return jsonify({'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Routes

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

@app.route('/api/download', methods=['POST'])
@token_required
def record_download():
    """Record a download in Firestore"""
    try:
        data = request.json
        platform = data.get('platform')
        user_email = request.user.get('email')
        user_id = request.user.get('uid')

        if not platform or platform not in ['windows', 'macos', 'android']:
            return jsonify({'error': 'Invalid platform'}), 400

        # Record download
        download_record = {
            'userId': user_id,
            'email': user_email,
            'platform': platform,
            'timestamp': datetime.now(),
            'userAgent': request.headers.get('User-Agent', ''),
            'ipAddress': request.remote_addr
        }

        db.collection('downloads').document().set(download_record)

        # Update or create user document
        user_ref = db.collection('users').document(user_id)
        user_data = user_ref.get()

        if user_data.exists:
            user_ref.update({
                'downloadCount': firestore.firestore.Increment(1),
                'lastDownload': datetime.now(),
                'platforms': firestore.firestore.ArrayUnion([platform])
            })
        else:
            user_ref.set({
                'email': user_email,
                'downloadCount': 1,
                'firstDownload': datetime.now(),
                'lastDownload': datetime.now(),
                'platforms': [platform],
                'isAdmin': False
            })

        # Generate download URL (mock - replace with actual file hosting)
        return jsonify({
            'success': True,
            'downloadUrl': f'/downloads/{platform}/CyberSafe-Setup',
            'filename': f'CyberSafe-Setup.{"exe" if platform == "windows" else "dmg" if platform == "macos" else "apk"}'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/downloads', methods=['GET'])
@admin_required
def get_download_history():
    """Get download history with filters (Admin only)"""
    try:
        platform = request.args.get('platform')
        date_range = request.args.get('dateRange', '7d')

        # Calculate date range
        now = datetime.now()
        if date_range == '24h':
            start_date = now - timedelta(hours=24)
        elif date_range == '7d':
            start_date = now - timedelta(days=7)
        elif date_range == '30d':
            start_date = now - timedelta(days=30)
        else:
            start_date = None

        # Query downloads
        query = db.collection('downloads')

        if platform:
            query = query.where('platform', '==', platform)

        if start_date:
            query = query.where('timestamp', '>=', start_date)

        query = query.order_by('timestamp', direction=firestore.firestore.Query.DESCENDING)
        downloads = query.stream()

        downloads_list = []
        stats = {
            'totalDownloads': 0,
            'windowsCount': 0,
            'macosCount': 0,
            'androidCount': 0,
            'uniqueUsers': set()
        }

        for doc in downloads:
            data = doc.to_dict()
            downloads_list.append({
                'id': doc.id,
                'email': data.get('email'),
                'platform': data.get('platform'),
                'timestamp': data.get('timestamp').isoformat() if data.get('timestamp') else None,
                'userId': data.get('userId')
            })

            stats['totalDownloads'] += 1
            if data.get('platform') == 'windows':
                stats['windowsCount'] += 1
            elif data.get('platform') == 'macos':
                stats['macosCount'] += 1
            elif data.get('platform') == 'android':
                stats['androidCount'] += 1

            stats['uniqueUsers'].add(data.get('userId'))

        stats['uniqueUsers'] = len(stats['uniqueUsers'])

        return jsonify({
            'success': True,
            'downloads': downloads_list,
            'stats': stats
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_users():
    """Get all users (Admin only)"""
    try:
        users = db.collection('users').stream()
        users_list = []

        for doc in users:
            data = doc.to_dict()
            users_list.append({
                'id': doc.id,
                'email': data.get('email'),
                'downloadCount': data.get('downloadCount', 0),
                'platforms': data.get('platforms', []),
                'firstDownload': data.get('firstDownload'),
                'lastDownload': data.get('lastDownload'),
                'isAdmin': data.get('isAdmin', False)
            })

        return jsonify({
            'success': True,
            'users': users_list,
            'total': len(users_list)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_stats():
    """Get overall statistics (Admin only)"""
    try:
        downloads = db.collection('downloads').stream()
        users = db.collection('users').stream()

        stats = {
            'totalDownloads': 0,
            'windowsCount': 0,
            'macosCount': 0,
            'androidCount': 0,
            'totalUsers': 0,
            'averageDownloadsPerUser': 0
        }

        total_downloads = 0
        for doc in downloads:
            data = doc.to_dict()
            stats['totalDownloads'] += 1
            platform = data.get('platform')
            if platform == 'windows':
                stats['windowsCount'] += 1
            elif platform == 'macos':
                stats['macosCount'] += 1
            elif platform == 'android':
                stats['androidCount'] += 1

        for doc in users:
            stats['totalUsers'] += 1

        if stats['totalUsers'] > 0:
            stats['averageDownloadsPerUser'] = round(stats['totalDownloads'] / stats['totalUsers'], 2)

        return jsonify({
            'success': True,
            'stats': stats
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/set-admin/<user_id>', methods=['POST'])
@admin_required
def set_admin(user_id):
    """Grant admin privileges to a user (Admin only)"""
    try:
        db.collection('users').document(user_id).update({'isAdmin': True})
        return jsonify({'success': True, 'message': 'User granted admin privileges'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5001)
