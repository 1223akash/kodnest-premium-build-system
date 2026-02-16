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
                    
                    <!-- Filter Bar -->
                    <div class="filter-bar">
                        <input type="text" class="filter-input" placeholder="Search role or company...">
                        <select class="filter-select"><option>Location</option><option>Bangalore</option><option>Pune</option><option>Remote</option></select>
                        <select class="filter-select"><option>Mode</option><option>Remote</option><option>Hybrid</option><option>Onsite</option></select>
                        <select class="filter-select"><option>Exp</option><option>Fresher</option><option>0-1 Years</option><option>1-3 Years</option></select>
                        <select class="filter-select"><option>Source</option><option>LinkedIn</option><option>Naukri</option><option>Indeed</option></select>
                        <select class="filter-select" style="margin-left: auto;"><option>Latest</option><option>Salary</option></select>
                    </div>

                    <!-- Job Cards Container -->
                    <div id="job-list"></div>
                    
                 </div>
            </div>
        `;

        // Render Jobs
        const container = document.getElementById('job-list');
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

        JOBS_DATA.forEach(job => {
            const isSaved = savedJobs.includes(job.id);
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-header">
                    <div>
                        <div class="job-title">${job.title}</div>
                        <div class="job-company">${job.company}</div>
                    </div>
                    <div class="tag source">${job.source}</div>
                </div>
                
                <div class="job-tags">
                    <span class="tag">${job.location}</span>
                    <span class="tag">${job.mode}</span>
                    <span class="tag">${job.experience} Yrs</span>
                    <span class="tag salary">${job.salaryRange}</span>
                </div>

                <div class="job-footer">
                    <span class="posted-date">${job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo + ' days ago'}</span>
                    <div class="card-actions">
                        <button class="btn btn-secondary btn-sm" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button>
                        <button class="btn ${isSaved ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="toggleSave(${job.id})">
                            ${isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        return;
    }

    if (route.template === 'saved') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Saved Jobs</h1>
                <p>Your bookmarked opportunities.</p>
            </section>
            <div class="workspace-wrapper">
                 <div class="primary-workspace" id="saved-job-list">
                    <!-- Saved jobs injected here -->
                 </div>
            </div>
        `;

        const container = document.getElementById('saved-job-list');
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        const savedData = JOBS_DATA.filter(job => savedJobs.includes(job.id));

        if (savedData.length === 0) {
            container.innerHTML = `
                <div class="card empty-state">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🔖</div>
                        <h3>No saved jobs.</h3>
                    <p>Bookmark jobs from your dashboard to view them here.</p>
                </div>
            `;
        } else {
            savedData.forEach(job => {
                const card = document.createElement('div');
                card.className = 'job-card';
                card.innerHTML = `
                    <div class="job-header">
                        <div>
                            <div class="job-title">${job.title}</div>
                            <div class="job-company">${job.company}</div>
                        </div>
                        <div class="tag source">${job.source}</div>
                    </div>
                    
                    <div class="job-tags">
                        <span class="tag">${job.location}</span>
                        <span class="tag">${job.mode}</span>
                        <span class="tag">${job.experience} Yrs</span>
                        <span class="tag salary">${job.salaryRange}</span>
                    </div>

                    <div class="job-footer">
                        <span class="posted-date">${job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo + ' days ago'}</span>
                        <div class="card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button>
                            <button class="btn btn-primary btn-sm" onclick="toggleSave(${job.id})">Unsave</button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }
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

// Global Save Handler
window.toggleSave = function (id) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (savedJobs.includes(id)) {
        savedJobs = savedJobs.filter(jobId => jobId !== id);
    } else {
        savedJobs.push(id);
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    renderRoute(); // Re-render to update UI
};

// Initialize
window.addEventListener('hashchange', renderRoute);
window.addEventListener('load', renderRoute);
