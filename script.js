// Initialize tracking
function initializeTracking() {
    let userId = localStorage.getItem('cybersafe_user_id');
    
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('cybersafe_user_id', userId);
    }

    trackEvent({
        eventType: 'page_view',
        userId: userId,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    });
}

// Track events
function trackEvent(data) {
    fetch('/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(err => {
        console.debug('Tracking unavailable');
        storeLocalTracking(data);
    });
}

function storeLocalTracking(data) {
    let events = JSON.parse(localStorage.getItem('cybersafe_events') || '[]');
    events.push(data);
    if (events.length > 100) {
        events = events.slice(-100);
    }
    localStorage.setItem('cybersafe_events', JSON.stringify(events));
}

// Download CyberSafe
function downloadCyberSafe() {
    const userId = localStorage.getItem('cybersafe_user_id') || 'anonymous';
    
    trackEvent({
        eventType: 'download_initiated',
        userId: userId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });

    const downloadUrl = '/CyberSafe-Installer.zip';
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'CyberSafe-Installer.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        trackEvent({
            eventType: 'download_completed',
            userId: userId,
            filename: 'CyberSafe-Installer.zip',
            timestamp: new Date().toISOString()
        });
    }, 1000);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();

    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const userId = localStorage.getItem('cybersafe_user_id') || 'anonymous';
            
            trackEvent({
                eventType: 'contact_form_submitted',
                userId: userId,
                timestamp: new Date().toISOString()
            });
        });
    }

    // Mobile menu handler
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.style.display = 'none';
            });
        });
    }

    // Smooth scroll for navigation links
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

    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .info-item, .download-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Track user activity
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

// Track session end
window.addEventListener('beforeunload', function() {
    const userId = localStorage.getItem('cybersafe_user_id');
    trackEvent({
        eventType: 'session_end',
        userId: userId,
        timestamp: new Date().toISOString()
    });
});
