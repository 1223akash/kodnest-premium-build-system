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
                        <input type="text" id="filter-search" class="filter-input" placeholder="Search role or company..." oninput="applyFilters()">
                        <select id="filter-location" class="filter-select" onchange="applyFilters()"><option value="">Location</option><option value="Bangalore">Bangalore</option><option value="Pune">Pune</option><option value="Remote">Remote</option></select>
                        <select id="filter-mode" class="filter-select" onchange="applyFilters()"><option value="">Mode</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Onsite">Onsite</option></select>
                        <select id="filter-exp" class="filter-select" onchange="applyFilters()"><option value="">Exp</option><option value="Fresher">Fresher</option><option value="0-1">0-1 Years</option><option value="1-3">1-3 Years</option></select>
                        <select id="filter-source" class="filter-select" onchange="applyFilters()"><option value="">Source</option><option value="LinkedIn">LinkedIn</option><option value="Naukri">Naukri</option><option value="Indeed">Indeed</option></select>
                        <select id="filter-sort" class="filter-select" style="margin-left: auto;" onchange="applyFilters()"><option value="latest">Latest</option><option value="salary">Salary</option></select>
                    </div>

                    <!-- Job Cards Container -->
                    <div id="job-list"></div>
                    
                 </div>
            </div>
        `;

        // Initial Render
        window.applyFilters();
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
        renderSavedJobs();
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

// Filter Logic
window.applyFilters = function () {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const location = document.getElementById('filter-location').value;
    const mode = document.getElementById('filter-mode').value;
    const exp = document.getElementById('filter-exp').value;
    const source = document.getElementById('filter-source').value;
    const sort = document.getElementById('filter-sort').value;

    let filtered = JOBS_DATA.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(search) || job.company.toLowerCase().includes(search);
        const matchLocation = location ? job.location.includes(location) : true;
        const matchMode = mode ? job.mode === mode : true;
        const matchExp = exp ? job.experience.includes(exp) : true;
        const matchSource = source ? job.source === source : true;
        return matchSearch && matchLocation && matchMode && matchExp && matchSource;
    });

    if (sort === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (sort === 'salary') {
        // Basic sort by parsing the first number in salary string
        filtered.sort((a, b) => {
            const getSal = s => parseInt(s.salaryRange.replace(/\D/g, '')) || 0;
            return getSal(b) - getSal(a);
        });
    }

    const container = document.getElementById('job-list');
    container.innerHTML = '';
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding: 40px;"><h3>No matching jobs found.</h3><p>Try adjusting your filters.</p></div>`;
        return;
    }

    filtered.forEach(job => {
        const isSaved = savedJobs.includes(job.id);
        const card = createJobCard(job, isSaved);
        container.appendChild(card);
    });
};

function createJobCard(job, isSaved) {
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
                <button class="btn btn-secondary btn-sm" onclick="openJobModal(${job.id})">View</button>
                <button class="btn btn-secondary btn-sm" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button>
                <button id="btn-save-${job.id}" class="btn ${isSaved ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="toggleSave(${job.id})">
                    ${isSaved ? 'Saved' : 'Save'}
                </button>
            </div>
        </div>
    `;
    return card;
}

function renderSavedJobs() {
    const container = document.getElementById('saved-job-list');
    if (!container) return;

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
        container.innerHTML = '';
        savedData.forEach(job => {
            const card = createJobCard(job, true); // Always saved here
            // Override save button to be "Unsave" behavior clearly
            const btn = card.querySelector(`#btn-save-${job.id}`);
            btn.innerText = 'Unsave';
            container.appendChild(card);
        });
    }
}

// Global Save Handler (Optimistic UI)
window.toggleSave = function (id) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    let isNowSaved = false;

    if (savedJobs.includes(id)) {
        savedJobs = savedJobs.filter(jobId => jobId !== id);
        isNowSaved = false;
    } else {
        savedJobs.push(id);
        isNowSaved = true;
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));

    // Optimistic UI Update in Dashboard
    const btn = document.getElementById(`btn-save-${id}`);
    if (btn) {
        if (isNowSaved) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            btn.innerText = 'Saved';
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btn.innerText = 'Save';
        }
    }

    // Refresh if on Saved page to remove item
    if (window.location.hash === '#/saved') {
        renderSavedJobs();
    }
};

// Modal Logic
window.openJobModal = function (id) {
    stener('hashchange', renderRoute);
    window.addEventListener('load', renderRoute);
