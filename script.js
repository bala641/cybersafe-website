// Track page views and generate unique user ID
function initializeTracking() {
    let userId = localStorage.getItem('cybersafe_user_id');
    
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('cybersafe_user_id', userId);
    }

    // Track page view
    trackEvent({
        eventType: 'page_view',
        userId: userId,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    });
}

// Track download click
function downloadApp() {
    const userId = localStorage.getItem('cybersafe_user_id') || 'anonymous';
    
    trackEvent({
        eventType: 'download',
        userId: userId,
        downloadUrl: '/downloads/cybersafe-latest.exe',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });

    // Trigger download
    const link = document.createElement('a');
    link.href = 'https://github.com/bala641/cybersafe/releases/download/latest/cybersafe-latest.exe';
    link.download = 'CyberSafe-Installer.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Send tracking data to backend
function trackEvent(data) {
    // Try to send to backend API
    fetch('/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(err => {
        // Silently fail if no backend (static hosting)
        console.debug('Tracking data stored locally');
        storeLocalTracking(data);
    });
}

// Store tracking data locally if backend unavailable
function storeLocalTracking(data) {
    let events = JSON.parse(localStorage.getItem('cybersafe_events') || '[]');
    events.push(data);
    // Keep only last 100 events
    if (events.length > 100) {
        events = events.slice(-100);
    }
    localStorage.setItem('cybersafe_events', JSON.stringify(events));
}

// Export tracking data (for development/testing)
function exportTrackingData() {
    const events = JSON.parse(localStorage.getItem('cybersafe_events') || '[]');
    const userId = localStorage.getItem('cybersafe_user_id');
    
    const data = {
        userId: userId,
        events: events,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersafe-tracking-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Scroll to download section
function scrollToDownload() {
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
        downloadSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();

    // Update year in footer
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Monitor checkbox changes
    document.querySelectorAll('.monitor-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            trackEvent({
                eventType: 'feature_selection',
                userId: localStorage.getItem('cybersafe_user_id'),
                feature: this.nextElementSibling.textContent,
                selected: this.checked,
                timestamp: new Date().toISOString()
            });
        });
    });
});

// Keyboard shortcut for admin access (Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        window.location.href = '/admin';
    }
});

// Periodic ping to track active users (every 5 minutes)
setInterval(function() {
    const userId = localStorage.getItem('cybersafe_user_id');
    if (document.hasFocus()) {
        trackEvent({
            eventType: 'user_active',
            userId: userId,
            timestamp: new Date().toISOString()
        });
    }
}, 5 * 60 * 1000);

// Track when user leaves
window.addEventListener('beforeunload', function() {
    const userId = localStorage.getItem('cybersafe_user_id');
    trackEvent({
        eventType: 'session_end',
        userId: userId,
        timestamp: new Date().toISOString(),
        sessionDuration: performance.timing.loadEventEnd - performance.timing.navigationStart
    });
});


// Download CyberSafe installer
function downloadCyberSafe() {
    const userId = localStorage.getItem('cybersafe_user_id') || 'anonymous';
    
    trackEvent({
        eventType: 'download_initiated',
        userId: userId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });

    // Download the installer zip from the server
    const downloadUrl = '/CyberSafe-Installer.zip';
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'CyberSafe-Installer.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track successful download
    setTimeout(() => {
        trackEvent({
            eventType: 'download_completed',
            userId: userId,
            filename: 'CyberSafe-Installer.zip',
            timestamp: new Date().toISOString()
        });
    }, 1000);
}
