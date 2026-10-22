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

// Terminal animation effect
function typeTerminalEffect() {
    const terminal = document.querySelector('.terminal-body');
    if (!terminal) return;

    const lines = [
        { text: '$ ./cybersafe', class: 'terminal-line' },
        { text: 'initializing network monitor...', class: 'terminal-output' },
        { text: '$ system status: ACTIVE', class: 'terminal-line' },
        { text: '$ packets monitored: 1.2M+', class: 'terminal-line' },
        { text: '$ threats detected: Real-time', class: 'terminal-line' },
        { text: '$ active users: 50K+', class: 'terminal-line' },
    ];

    terminal.innerHTML = '';
    let delay = 0;

    lines.forEach((line, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = line.class;
            
            if (line.class === 'terminal-line') {
                const symbol = document.createElement('span');
                symbol.className = 'command-symbol';
                symbol.textContent = '$ ';
                p.appendChild(symbol);
                
                const text = document.createTextNode(line.text.replace('$ ', ''));
                p.appendChild(text);
            } else if (line.class === 'terminal-output') {
                p.textContent = line.text;
            }
            
            p.style.opacity = '0';
            p.style.animation = 'fadeIn 0.5s ease forwards';
            terminal.appendChild(p);
        }, delay);
        
        delay += 300;
    });
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();

    // Initialize terminal effect
    typeTerminalEffect();

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
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.style.display = 'none';
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

    document.querySelectorAll('.feature-card, .info-item, .download-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add fade-in animation for code blocks
    document.querySelectorAll('.code-block').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Add fade-in keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

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

// ── Mobile notify form ────────────────────────────────────────────────────
function submitNotify() {
    const input   = document.getElementById('notifyEmail');
    const form    = document.getElementById('androidNotifyForm');
    const success = document.getElementById('notifySuccess');
    const email   = input ? input.value.trim() : '';

    if (!email || !email.includes('@')) {
        if (input) {
            input.style.borderColor = '#f85149';
            input.focus();
            setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
        return;
    }

    // Send via Web3Forms (same access key)
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            access_key: 'c936415e-01ea-4c06-9171-0693bb16f363',
            subject: 'CyberSafe Android Launch Notification Request',
            from_name: 'CyberSafe Website',
            email: email,
            message: email + ' wants to be notified when the Android app launches.'
        })
    })
    .then(() => {
        if (form)    form.style.display    = 'none';
        if (success) success.style.display = 'block';
    })
    .catch(() => {
        // Still show success — we don't want to block the UX
        if (form)    form.style.display    = 'none';
        if (success) success.style.display = 'block';
    });
}
