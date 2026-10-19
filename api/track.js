// Vercel Serverless Function - Track user events
// This runs on every request to /api/track

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { eventType, userId, page, timestamp, userAgent, platform, downloadUrl, feature, selected, sessionDuration } = req.body;

        // Validate required fields
        if (!eventType || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Store event in database
        const event = {
            eventType,
            userId,
            page,
            timestamp: timestamp || new Date().toISOString(),
            userAgent,
            platform,
            downloadUrl,
            feature,
            selected,
            sessionDuration,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            createdAt: new Date()
        };

        // TODO: Save to MongoDB
        // const result = await db.collection('events').insertOne(event);

        console.log('Event tracked:', event);

        // For now, store in memory (would need real database for production)
        if (!global.events) {
            global.events = [];
        }
        global.events.push(event);

        // Keep only last 1000 events in memory
        if (global.events.length > 1000) {
            global.events = global.events.slice(-1000);
        }

        // Return success response
        res.status(200).json({
            success: true,
            eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: 'Event tracked successfully'
        });

    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ 
            error: 'Failed to track event',
            message: error.message 
        });
    }
}
