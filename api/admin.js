// Vercel Serverless Function - Admin authentication and data retrieval
// POST /api/admin/login - Authenticate admin
// GET /api/admin/users - Get active users
// GET /api/admin/downloads - Get download history
// GET /api/admin/events - Get user events

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { action } = req.query;

        if (req.method === 'POST' && action === 'login') {
            return handleLogin(req, res);
        }

        // Check authorization for protected endpoints
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!verifyToken(token)) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (req.method === 'GET' && action === 'users') {
            return handleGetUsers(req, res);
        }

        if (req.method === 'GET' && action === 'downloads') {
            return handleGetDownloads(req, res);
        }

        if (req.method === 'GET' && action === 'events') {
            return handleGetEvents(req, res);
        }

        res.status(400).json({ error: 'Unknown action' });

    } catch (error) {
        console.error('Admin API error:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: error.message 
        });
    }
}

function handleLogin(req, res) {
    const { email, password } = req.body;

    // TODO: Replace with real authentication
    // For development, use hardcoded credentials
    const validEmail = 'admin@cybersafe.com';
    const validPassword = 'password';

    if (email === validEmail && password === validPassword) {
        const token = generateToken(email);
        return res.status(200).json({
            success: true,
            token: token,
            expiresIn: 86400 // 24 hours
        });
    }

    res.status(401).json({ error: 'Invalid credentials' });
}

function handleGetUsers(req, res) {
    const { page = 1, limit = 10, search } = req.query;

    // Mock data
    const users = [
        { userId: 'user_abc123_1697', lastSeen: new Date(Date.now() - 2 * 60000), platform: 'Windows 11 (x64)', sessions: 5, status: 'active' },
        { userId: 'user_def456_1698', lastSeen: new Date(Date.now() - 15 * 60000), platform: 'Windows 10 (x64)', sessions: 12, status: 'active' },
        { userId: 'user_ghi789_1699', lastSeen: new Date(Date.now() - 2 * 3600000), platform: 'Windows 11 (x64)', sessions: 3, status: 'inactive' },
        { userId: 'user_jkl012_1700', lastSeen: new Date(Date.now() - 5 * 60000), platform: 'Windows Server 2022', sessions: 8, status: 'active' },
        { userId: 'user_mno345_1701', lastSeen: new Date(Date.now() - 24 * 3600000), platform: 'Windows 10 (x86)', sessions: 2, status: 'inactive' }
    ];

    const filtered = search 
        ? users.filter(u => u.userId.includes(search) || u.platform.includes(search))
        : users;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    res.status(200).json({
        success: true,
        users: filtered.slice(start, end),
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(filtered.length / limitNum)
    });
}

function handleGetDownloads(req, res) {
    const { page = 1, limit = 10, userId } = req.query;

    // Mock data
    const downloads = [
        { downloadId: '#DL-2024-001284', userId: 'user_abc123_1697', timestamp: '2024-10-19 14:32:15', platform: 'Windows 11 (x64)', version: '2.5.1', status: 'complete' },
        { downloadId: '#DL-2024-001283', userId: 'user_def456_1698', timestamp: '2024-10-19 14:15:42', platform: 'Windows 10 (x64)', version: '2.5.1', status: 'complete' },
        { downloadId: '#DL-2024-001282', userId: 'user_jkl012_1700', timestamp: '2024-10-19 13:48:09', platform: 'Windows Server 2022', version: '2.5.0', status: 'complete' },
        { downloadId: '#DL-2024-001281', userId: 'user_pqr678_1702', timestamp: '2024-10-19 13:20:33', platform: 'Windows 11 (x64)', version: '2.5.1', status: 'complete' },
        { downloadId: '#DL-2024-001280', userId: 'user_stu901_1703', timestamp: '2024-10-19 12:55:22', platform: 'Windows 10 (x86)', version: '2.4.8', status: 'complete' }
    ];

    const filtered = userId 
        ? downloads.filter(d => d.userId === userId)
        : downloads;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    res.status(200).json({
        success: true,
        downloads: filtered.slice(start, end),
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(filtered.length / limitNum)
    });
}

function handleGetEvents(req, res) {
    const { page = 1, limit = 10, eventType, userId } = req.query;

    // Mock data
    const events = [
        { timestamp: '2024-10-19 14:32:15', userId: 'user_abc123_1697', eventType: 'download', details: 'Downloaded v2.5.1', ipPlatform: '192.168.1.100' },
        { timestamp: '2024-10-19 14:15:42', userId: 'user_def456_1698', eventType: 'page_view', details: 'Viewed features page', ipPlatform: 'Windows 10' },
        { timestamp: '2024-10-19 13:48:09', userId: 'user_jkl012_1700', eventType: 'feature_selection', details: 'Selected: Packet Capture', ipPlatform: 'Windows Server 2022' },
        { timestamp: '2024-10-19 13:20:33', userId: 'user_pqr678_1702', eventType: 'user_active', details: 'Session still active', ipPlatform: '192.168.1.101' },
        { timestamp: '2024-10-19 12:55:22', userId: 'user_stu901_1703', eventType: 'session_end', details: 'Session ended', ipPlatform: 'Windows 10' }
    ];

    let filtered = events;
    if (eventType) {
        filtered = filtered.filter(e => e.eventType === eventType);
    }
    if (userId) {
        filtered = filtered.filter(e => e.userId === userId);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    res.status(200).json({
        success: true,
        events: filtered.slice(start, end),
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(filtered.length / limitNum)
    });
}

function generateToken(email) {
    // Simple token generation (would use JWT in production)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return token;
}

function verifyToken(token) {
    // Simple token verification (would use JWT in production)
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [email, timestamp] = decoded.split(':');
        const tokenAge = Date.now() - parseInt(timestamp);
        return tokenAge < 86400000; // 24 hours
    } catch {
        return false;
    }
}
