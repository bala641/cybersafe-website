// CyberSafe Website Scripts

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation to feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature cards and step cards
document.querySelectorAll('.feature-card, .step-card, .screenshot-card').forEach(card => {
    observer.observe(card);
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll(`.nav-links a[href*="${sectionId}"]`).forEach(link => {
                document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
                link.style.color = '#2196F3';
            });
        }
    });
});

// Download button analytics (if needed)
document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Download initiated');
        // Add analytics tracking here if needed
    });
});

console.log('🔍 CyberSafe Website Loaded');
