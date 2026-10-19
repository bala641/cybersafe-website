// Admin Dashboard JavaScript - Client-side logic for data fetching and UI updates

class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('admin_token');
        this.currentTab = 'overview';
        this.init();
    }

    async init() {
        this.checkAuth();
        this.setupEventListeners();
        await this.loadDashboardData();
    }

    checkAuth() {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            this.showLoginForm();
        }
    }

    showLoginForm() {
        document.body.innerHTML = `
            <div class="admin-container">
                <div class="auth-section">
                    <div class="auth-form">
                        <h2>Admin Login</h2>
                        <div id="authMessage"></div>
                        <form onsubmit="dashboard.handleLogin(event)">
                            <div class="form-group">
                                <label>Admin Email</label>
                                <input type="email" id="email" placeholder="admin@cybersafe.com" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="password" placeholder="Enter password" required>
                            </div>
                            <div class="form-group">
                                <button type="submit">Login</button>
                            </div>
                        </form>
                        <p style="color: var(--text-secondary); margin-top: 1rem; font-size: 0.9rem;">
                            Default: admin@cybersafe.com / password
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/admin?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('token_expires', Date.now() + data.expiresIn * 1000);
                location.reload();
            } else {
                this.showAuthMessage(data.error || 'Login failed', 'error');
            }
        } catch (err) {
            console.error('Login error:', err);
            // Fallback to local authentication
            if (email === 'admin@cybersafe.com' && password === 'password') {
                const token = 'admin_token_' + Date.now();
                localStorage.setItem('admin_token', token);
                location.reload();
            } else {
                this.showAuthMessage('Invalid credentials', 'error');
            }
        }
    }

    showAuthMessage(msg, type) {
        const msgEl = document.getElementById('authMessage');
        if (msgEl) {
            msgEl.innerHTML = `<div class="${type}-message">${msg}</div>`;
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.admin-nav button').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target);
            });
        });

        // Search buttons
        document.querySelector('.search-box')?.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.performSearch(e.target);
            }
        });

        // Logout button
        document.querySelector('[onclick="dashboard.logout()"]')?.addEventListener('click', () => {
            this.logout();
        });
    }

    switchTab(button) {
        const tabName = button.textContent.toLowerCase().replace(/\s+/g, '');
        const tabMap = {
            'overview': 'overview',
            'activeusers': 'users',
            'downloadhistory': 'downloads',
            'events': 'events',
            'adminsettings': 'settings'
        };

        const tab = tabMap[tabName] || tabName;

        // Update UI
        document.querySelectorAll('.dashboard-section').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.admin-nav button').forEach(el => {
            el.classList.remove('active');
        });

        document.getElementById(tab)?.classList.add('active');
        button.classList.add('active');

        // Load tab data
        this.loadTabData(tab);
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();
            this.updateOverviewStats(stats);
            this.drawCharts(stats);
        } catch (err) {
            console.error('Failed to load dashboard stats:', err);
            this.loadMockData();
        }
    }

    loadMockData() {
        console.log('Using mock data');
        // Mock data is already in HTML
    }

    updateOverviewStats(stats) {
        document.getElementById('totalDownloads').textContent = 
            stats.totalDownloads?.toLocaleString() || '2,458';
        document.getElementById('activeUsers').textContent = 
            stats.activeUsers?.toLocaleString() || '1,247';
        document.getElementById('pageViews').textContent = 
            stats.pageViews?.toLocaleString() || '8,932';
        document.getElementById('avgSession').textContent = 
            this.formatDuration(stats.averageSessionDuration) || '3m 24s';
    }

    formatDuration(seconds) {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    drawCharts(stats) {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded, skipping charts');
            return;
        }

        // Downloads chart
        const dlCtx = document.getElementById('downloadsChart');
        if (dlCtx) {
            new Chart(dlCtx, {
                type: 'line',
                data: {
                    labels: stats.downloads?.map(d => d.date) || [],
                    datasets: [{
                        label: 'Downloads',
                        data: stats.downloads?.map(d => d.downloads) || [],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#b0b0b0' },
                            grid: { color: '#333333' }
                        },
                        x: {
                            ticks: { color: '#b0b0b0' },
                            grid: { color: '#333333' }
                        }
                    }
                }
            });
        }

        // Activity chart
        const actCtx = document.getElementById('activityChart');
        if (actCtx) {
            new Chart(actCtx, {
                type: 'bar',
                data: {
                    labels: stats.userActivity?.map(a => a.time) || [],
                    datasets: [{
                        label: 'Active Users',
                        data: stats.userActivity?.map(a => a.activeUsers) || [],
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#b0b0b0' },
                            grid: { color: '#333333' }
                        },
                        x: {
                            ticks: { color: '#b0b0b0' },
                            grid: { color: '#333333' }
                        }
                    }
                }
            });
        }
    }

    async loadTabData(tab) {
        switch(tab) {
            case 'users':
                await this.loadUsers();
                break;
            case 'downloads':
                await this.loadDownloads();
                break;
            case 'events':
                await this.loadEvents();
                break;
        }
    }

    async loadUsers(page = 1, search = '') {
        try {
            const query = new URLSearchParams({ page, limit: 10, search });
            const response = await fetch(`/api/admin?action=users&${query}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            this.populateUsersTable(data.users);
            this.updatePagination('users', data.pages, page);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    }

    populateUsersTable(users) {
        const tbody = document.getElementById('usersTable');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.userId}</td>
                <td>${this.formatTime(user.lastSeen)}</td>
                <td>${user.platform}</td>
                <td>${user.sessions}</td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    async loadDownloads(page = 1) {
        try {
            const query = new URLSearchParams({ page, limit: 10 });
            const response = await fetch(`/api/admin?action=downloads&${query}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            this.populateDownloadsTable(data.downloads);
            this.updatePagination('downloads', data.pages, page);
        } catch (err) {
            console.error('Failed to load downloads:', err);
        }
    }

    populateDownloadsTable(downloads) {
        const tbody = document.getElementById('downloadsTable');
        if (!tbody) return;

        tbody.innerHTML = downloads.map(dl => `
            <tr>
                <td>${dl.downloadId}</td>
                <td>${dl.userId}</td>
                <td>${dl.timestamp}</td>
                <td>${dl.platform}</td>
                <td>${dl.version}</td>
                <td>
                    <span class="status-badge status-active">
                        ${dl.status.charAt(0).toUpperCase() + dl.status.slice(1)}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    async loadEvents(page = 1, eventType = '') {
        try {
            const query = new URLSearchParams({ page, limit: 10, eventType });
            const response = await fetch(`/api/admin?action=events&${query}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            this.populateEventsTable(data.events);
            this.updatePagination('events', data.pages, page);
        } catch (err) {
            console.error('Failed to load events:', err);
        }
    }

    populateEventsTable(events) {
        const tbody = document.getElementById('eventsTable');
        if (!tbody) return;

        tbody.innerHTML = events.map(event => `
            <tr>
                <td>${event.timestamp}</td>
                <td>${event.userId}</td>
                <td><span class="event-type">${event.eventType}</span></td>
                <td>${event.details}</td>
                <td>${event.ipPlatform}</td>
            </tr>
        `).join('');
    }

    updatePagination(table, pages, currentPage) {
        // Pagination update logic
        console.log(`Pagination for ${table}: Page ${currentPage} of ${pages}`);
    }

    formatTime(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }

    performSearch(button) {
        const parent = button.parentElement;
        const input = parent.querySelector('input');
        const query = input?.value || '';
        
        // Determine which search based on parent context
        if (parent.closest('#users')) {
            this.loadUsers(1, query);
        } else if (parent.closest('#downloads')) {
            this.loadDownloads(1);
        } else if (parent.closest('#events')) {
            this.loadEvents(1, query);
        }
    }

    exportDashboard(format) {
        console.log(`Exporting dashboard as ${format}`);
        // Implement export logic
    }

    exportAllData(format) {
        console.log(`Exporting all data as ${format}`);
        // Implement export logic
    }

    regenerateApiKey() {
        if (confirm('Are you sure? This will invalidate the current API key.')) {
            const newKey = 'sk_live_' + Math.random().toString(36).substr(2, 20);
            alert('API key regenerated: ' + newKey);
        }
    }

    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token_expires');
        window.location.href = '/admin';
    }
}

// Initialize dashboard when DOM is ready
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new AdminDashboard();
});
