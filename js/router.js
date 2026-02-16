/*
  Simple Client-Side Router for KodNest Premium Job Notification Tracker
  Handles hash-based routing (#/dashboard, #/settings, etc.)
*/

const routes = {
    '/': { title: 'Dashboard', template: 'dashboard' },
    '/dashboard': { title: 'Dashboard', template: 'dashboard' },
    '/saved': { title: 'Saved Jobs', template: 'saved' },
    '/digest': { title: 'Daily Digest', template: 'digest' },
    '/settings': { title: 'Settings', template: 'settings' },
    '/proof': { title: 'Proof', template: 'proof' },
    '404': { title: 'Page Not Found', template: 'error' }
};

let currentHash = null;

function renderRoute() {
    let hash = window.location.hash.slice(1) || '/';

    // Prevent flicker: Do nothing if the hash hasn't truly changed
    // (Note: window.onhashchange normally handles this, but being explicit helps safety)
    if (hash === currentHash) return;
    currentHash = hash;

    let route = routes[hash];

    // Handle 404
    if (!route) {
        route = routes['404'];
        // Optional: Reset title if needed, or keep generic
    }

    // Update Title
    document.title = `${route.title} - Job Notification Tracker`;

    // Update Active Link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash}`) {
            link.classList.add('active');
        }
    });

    // Fallback for root path active state
    if (hash === '/' || hash === '') {
        const dashboardLink = document.querySelector('a[href="#/dashboard"]');
        if (dashboardLink) dashboardLink.classList.add('active');
    }

    // Render Content
    const app = document.getElementById('app');

    if (route.template === 'error') {
        app.innerHTML = `
            <section class="context-header" style="text-align: center; padding-top: var(--spacing-8);">
                <h1 style="color: var(--color-error); font-size: 3rem; margin-bottom: var(--spacing-2);">404</h1>
                <p>The page you are looking for does not exist.</p>
                <div style="margin-top: var(--spacing-4);">
                    <a href="#/dashboard" class="btn btn-primary" style="display: inline-block;">Return to Dashboard</a>
                </div>
            </section>
        `;
        return;
    }

    app.innerHTML = `
        <section class="context-header">
            <h1>${route.title}</h1>
            <p>This section will be built in the next step.</p>
        </section>
        <div class="workspace-wrapper">
             <div class="primary-workspace">
                <div class="card">
                    <div class="card-header">${route.title} Placeholder</div>
                    <p style="color: var(--color-text-secondary);">Content for ${route.title} goes here.</p>
                </div>
             </div>
        </div>
    `;
}

// Initialize
window.addEventListener('hashchange', renderRoute);
window.addEventListener('load', renderRoute);
