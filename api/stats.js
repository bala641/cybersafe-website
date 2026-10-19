// Vercel Serverless Function - Get analytics statistics
// GET /api/stats?range=7d&userId=xxx

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { range = '7d', userId } = req.query;

        // TODO: Query MongoDB for real data
        // For now, return mock data
        const stats = {
            period: range,
            totalDownloads: 2458,
            activeUsers: 1247,
            pageViews: 8932,
            averageSessionDuration: 204, // seconds (3m 24s)
            topCountries: [
                { country: 'United States', downloads: 892, percentage: 36.3 },
                { country: 'United Kingdom', downloads: 456, percentage: 18.6 },
                { country: 'Canada', downloads: 389, percentage: 15.8 },
                { country: 'Australia', downloads: 312, percentage: 12.7 },
                { country: 'Germany', downloads: 409, percentage: 16.6 }
            ],
            topFeatures: [
                { feature: 'Packet Capture', selections: 1823, percentage: 91 },
                { feature: 'Threat Detection', selections: 1647, percentage: 82 },
                { feature: 'Port Monitoring', selections: 1538, percentage: 77 },
                { feature: 'Protocol Analysis', selections: 1234, percentage: 62 },
                { feature: 'Traffic Statistics', selections: 1089, percentage: 54 }
            ],
            platforms: [
                { platform: 'Windows 11', percentage: 58, downloads: 1425 },
                { platform: 'Windows 10', percentage: 32, downloads: 787 },
                { platform: 'Windows Server 2022', percentage: 7, downloads: 172 },
                { platform: 'Windows 7', percentage: 3, downloads: 74 }
            ],
            downloads: [
                { date: '2024-10-13', downloads: 198 },
                { date: '2024-10-14', downloads: 245 },
                { date: '2024-10-15', downloads: 312 },
                { date: '2024-10-16', downloads: 287 },
                { date: '2024-10-17', downloads: 401 },
                { date: '2024-10-18', downloads: 456 },
                { date: '2024-10-19', downloads: 559 }
            ],
            userActivity: [
                { time: '00:00', activeUsers: 145 },
                { time: '04:00', activeUsers: 89 },
                { time: '08:00', activeUsers: 234 },
                { time: '12:00', activeUsers: 567 },
                { time: '16:00', activeUsers: 723 },
                { time: '20:00', activeUsers: 892 },
                { time: '24:00', activeUsers: 456 }
            ]
        };

        res.status(200).json(stats);

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve statistics',
            message: error.message 
        });
    }
}
