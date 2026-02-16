/*
  Simple Client-Side Router for KodNest Premium Job Notification Tracker
  Handles hash-based routing (#/dashboard, #/settings, etc.)
*/

const routes = {
    '/': { title: 'Welcome', template: 'landing' },
    '/dashboard': { title: 'Dashboard', template: 'dashboard' },
    '/saved': { title: 'Saved Jobs', template: 'saved' },
    '/digest': { title: 'Daily Digest', template: 'digest' },
    '/settings': { title: 'Preferences', template: 'settings' },
    '/proof': { title: 'Proof', template: 'proof' },
    '404': { title: 'Page Not Found', template: 'error' }
};

let currentHash = null;

function renderRoute() {
    let hash = window.location.hash.slice(1) || '/';

    // Prevent flicker
    if (hash === currentHash) return;
    currentHash = hash;

    let route = routes[hash];

    // Handle 404
    if (!route) {
        route = routes['404'];
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

    const app = document.getElementById('app');

    // Render specific templates
    if (route.template === 'landing') {
        app.innerHTML = `
            <section class="context-header landing-hero">
                <h1>Stop Missing The Right Jobs.</h1>
                <p>Precision-matched job discovery delivered daily at 9AM.</p>
                <a href="#/settings" class="btn btn-primary" style="font-size: 1.1rem; padding: 12px 32px;">Start Tracking</a>
            </section>
        `;
        return;
    }

    if (route.template === 'dashboard') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Dashboard</h1>
                <p>Track your job notifications and application status.</p>
            </section>
            <div class="workspace-wrapper">
                 <div class="primary-workspace">
                    <div class="card empty-state">
                        <div style="font-size: 3rem; margin-bottom: 16px;">📭</div>
                        <h3>No jobs yet.</h3>
                        <p>In the next step, you will load a realistic dataset.</p>
                    </div>
                 </div>
            </div>
        `;
        return;
    }

    if (route.template === 'settings') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Settings</h1>
                <p>Customize your job preferences.</p>
            </section>
            <div class="workspace-wrapper">
                 <div class="primary-workspace">
                    
                    <div class="card">
                        <div class="card-header">Job Preferences</div>
                        
                        <div class="input-group">
                            <label class="input-label">Role Keywords</label>
                            <input type="text" class="input-field" placeholder="e.g. Frontend Developer, React.js">
                        </div>

                         <div class="input-group">
                            <label class="input-label">Preferred Locations</label>
                            <input type="text" class="input-field" placeholder="e.g. Bangalore, Remote, Pune">
                        </div>
                        
                        <div class="input-group">
                            <label class="input-label">Work Mode</label>
                            <select class="input-field">
                                <option>Remote</option>
                                <option>Hybrid</option>
                                <option>Onsite</option>
                                <option selected>Any</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Experience Level</label>
                             <select class="input-field">
                                <option>Fresher (0-1 years)</option>
                                <option>Junior (1-3 years)</option>
                                <option>Mid-Senior (3-5 years)</option>
                            </select>
                        </div>

                         <button class="btn btn-primary">Save Preferences</button>

                    </div>

                 </div>
            </div>
        `;
        return;
    }

    if (route.template === 'saved') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Saved Jobs</h1>
                <p>Your bookmarked opportunities.</p>
            </section>
            <div class="workspace-wrapper">
                 <div class="primary-workspace">
                    <div class="card empty-state">
                        <div style="font-size: 3rem; margin-bottom: 16px;">🔖</div>
                         <h3>No saved jobs.</h3>
                        <p>Bookmark jobs from your dashboard to view them here.</p>
                    </div>
                 </div>
            </div>
        `;
        return;
    }

    if (route.template === 'digest') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Daily Digest</h1>
                <p>Your curated morning update.</p>
            </section>
            <div class="workspace-wrapper">
                 <div class="primary-workspace">
                    <div class="card empty-state">
                        <div style="font-size: 3rem; margin-bottom: 16px;">☕</div>
                        <h3>Your digest arrives at 9AM.</h3>
                        <p>Check back tomorrow for your personalized job list.</p>
                    </div>
                 </div>
            </div>
        `;
        return;
    }

    if (route.template === 'proof') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Proof</h1>
                <p>Artifact collection.</p>
            </section>
            <div class="workspace-wrapper">
                 <div class="primary-workspace">
                    <div class="card empty-state">
                        <h3>Artifact Collection</h3>
                        <p>Placeholder for future proofs.</p>
                    </div>
                 </div>
            </div>
        `;
        return;
    }

    if (route.template === 'error') {
        app.innerHTML = `
            <section class="context-header" style="text-align: center; padding-top: 64px;">
                <h1 style="color: var(--color-error); font-size: 3rem; margin-bottom: 16px;">404</h1>
                <p>The page you are looking for does not exist.</p>
                <div style="margin-top: 32px;">
                    <a href="#/dashboard" class="btn btn-primary">Return to Dashboard</a>
                </div>
            </section>
        `;
        return;
    }
}

// Initialize
window.addEventListener('hashchange', renderRoute);
window.addEventListener('load', renderRoute);
