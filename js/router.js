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
    '/proof': { title: 'Proof', template: 'proof' }
};

function renderRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = routes[hash] || routes['/'];

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
