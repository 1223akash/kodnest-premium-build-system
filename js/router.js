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
                        <form id="settings-form" onsubmit="savePreferences(event)">
                            
                            <div class="input-group">
                                <label class="input-label">Role Keywords (comma separated)</label>
                                <input type="text" id="pref-roles" class="input-field" placeholder="e.g. Frontend, React, Java">
                            </div>

                             <div class="input-group">
                                <label class="input-label">Preferred Locations (multi-select simulated by comma sep)</label>
                                <input type="text" id="pref-locations" class="input-field" placeholder="e.g. Bangalore, Pune">
                            </div>
                            
                            <div class="input-group">
                                <label class="input-label">Work Mode</label>
                                <div style="display: flex; gap: 16px; margin-top: 8px;">
                                    <label><input type="checkbox" name="pref-mode" value="Remote"> Remote</label>
                                    <label><input type="checkbox" name="pref-mode" value="Hybrid"> Hybrid</label>
                                    <label><input type="checkbox" name="pref-mode" value="Onsite"> Onsite</label>
                                </div>
                            </div>

                            <div class="input-group">
                                <label class="input-label">Experience Level</label>
                                 <select id="pref-exp" class="input-field">
                                    <option value="">Select Level</option>
                                    <option value="Fresher">Fresher (0-1 years)</option>
                                    <option value="1-3">Junior (1-3 years)</option>
                                    <option value="3-5">Mid-Senior (3-5 years)</option>
                                </select>
                            </div>

                            <div class="input-group">
                                <label class="input-label">Skills (comma separated)</label>
                                <input type="text" id="pref-skills" class="input-field" placeholder="e.g. JavaScript, Python, AWS">
                            </div>
                            
                            <div class="input-group">
                                <label class="input-label">Min Match Score: <span id="score-val">40</span></label>
                                <input type="range" id="pref-min-score" min="0" max="100" value="40" style="width: 100%" oninput="document.getElementById('score-val').innerText = this.value">
                            </div>

                             <button type="submit" class="btn btn-primary" style="margin-top: 16px;">Save Preferences</button>
                        </form>
                    </div>

                 </div>
            </div>
        `;
        loadPreferences();
        return;
    }

    // ... (Proof, Error routes remain same) ...

    if (route.template === 'dashboard') {
        app.innerHTML = `
             <section class="context-header">
                <h1>Dashboard</h1>
                <p>Track your job notifications and application status.</p>
            </section>
            
            <div class="workspace-wrapper">
                 <div class="primary-workspace">
                    
                    <div class="dashboard-controls">
                        <!-- Filter Bar -->
                        <div class="filter-bar" style="flex: 1; margin-bottom: 0;">
                            <input type="text" id="filter-search" class="filter-input" placeholder="Search role or company..." oninput="applyFilters()">
                            <select id="filter-location" class="filter-select" onchange="applyFilters()"><option value="">Location</option><option value="Bangalore">Bangalore</option><option value="Pune">Pune</option><option value="Remote">Remote</option></select>
                            <select id="filter-mode" class="filter-select" onchange="applyFilters()"><option value="">Mode</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Onsite">Onsite</option></select>
                            <select id="filter-exp" class="filter-select" onchange="applyFilters()"><option value="">Exp</option><option value="Fresher">Fresher</option><option value="0-1">0-1 Years</option><option value="1-3">1-3 Years</option></select>
                            <select id="filter-source" class="filter-select" onchange="applyFilters()"><option value="">Source</option><option value="LinkedIn">LinkedIn</option><option value="Naukri">Naukri</option><option value="Indeed">Indeed</option></select>
                            <select id="filter-sort" class="filter-select" style="margin-left: auto;" onchange="applyFilters()"><option value="latest">Latest</option><option value="match">Match Score</option><option value="salary">Salary</option></select>
                        </div>
                    </div>

                    <!-- Match Toggle -->
                    <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: flex-end;">
                        <label class="toggle-wrapper">
                            <input type="checkbox" id="toggle-match" class="toggle-input" onchange="applyFilters()">
                            <span class="toggle-slider"></span>
                            Show only matches above threshold
                        </label>
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
}

// Preferences Logic
window.loadPreferences = function () {
    const prefs = JSON.parse(localStorage.getItem('jobTrackerPreferences') || '{}');
    if (!prefs.roleKeywords) return; // No prefs yet

    document.getElementById('pref-roles').value = prefs.roleKeywords;
    document.getElementById('pref-locations').value = prefs.preferredLocations.join(', ');
    document.getElementById('pref-exp').value = prefs.experienceLevel;
    document.getElementById('pref-skills').value = prefs.skills;
    document.getElementById('pref-min-score').value = prefs.minMatchScore;
    document.getElementById('score-val').innerText = prefs.minMatchScore;

    const mode checkboxes = document.querySelectorAll('input[name="pref-mode"]');
    checkboxes.forEach(cb => {
        if (prefs.preferredMode.includes(cb.value)) cb.checked = true;
    });
};

window.savePreferences = function (event) {
    event.preventDefault();
    const roleKeywords = document.getElementById('pref-roles').value;
    const preferredLocations = document.getElementById('pref-locations').value.split(',').map(s => s.trim()).filter(s => s);
    const experienceLevel = document.getElementById('pref-exp').value;
    const skills = document.getElementById('pref-skills').value;
    const minMatchScore = document.getElementById('pref-min-score').value;

    const preferredMode = [];
    document.querySelectorAll('input[name="pref-mode"]:checked').forEach(cb => preferredMode.push(cb.value));

    const prefs = {
        roleKeywords,
        preferredLocations,
        preferredMode,
        experienceLevel,
        skills,
        minMatchScore
    };

    localStorage.setItem('jobTrackerPreferences', JSON.stringify(prefs));
    alert('Preferences Saved!');
    window.location.hash = '#/dashboard';
};

// Filter Logic Updated
window.applyFilters = function () {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const location = document.getElementById('filter-location').value;
    const mode = document.getElementById('filter-mode').value;
    const exp = document.getElementById('filter-exp').value;
    const source = document.getElementById('filter-source').value;
    const sort = document.getElementById('filter-sort').value;
    const matchToggle = document.getElementById('toggle-match').checked;

    const prefs = JSON.parse(localStorage.getItem('jobTrackerPreferences') || 'null');
    const minScore = prefs ? (parseInt(prefs.minMatchScore) || 40) : 40;

    // Pre-calculate scores if not already done (optimization)
    // In a real app we might store this, but here it's cheap to recalc for 60 items
    const scoredJobs = JOBS_DATA.map(job => {
        const score = MatchingEngine.calculateScore(job, prefs);
        return { ...job, score }; // Add score to job object
    });

    let filtered = scoredJobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(search) || job.company.toLowerCase().includes(search);
        const matchLocation = location ? job.location.includes(location) : true;
        const matchMode = mode ? job.mode === mode : true;
        const matchExp = exp ? job.experience.includes(exp) : true;
        const matchSource = source ? job.source === source : true;

        // Match Toggle Logic
        const matchThreshold = matchToggle ? (job.score >= minScore) : true;

        return matchSearch && matchLocation && matchMode && matchExp && matchSource && matchThreshold;
    });

    if (sort === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (sort === 'salary') {
        filtered.sort((a, b) => {
            const getSal = s => parseInt(s.salaryRange.replace(/\D/g, '')) || 0;
            return getSal(b) - getSal(a);
        });
    } else if (sort === 'match') {
        filtered.sort((a, b) => b.score - a.score);
    }

    const container = document.getElementById('job-list');
    container.innerHTML = '';
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (!prefs && matchToggle) {
        container.innerHTML = `<div class="empty-state"><h3>Set your preferences first.</h3><p>To use intelligent matching, go to Settings.</p></div>`;
        return;
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding: 40px;"><h3>No matching jobs found.</h3><p>Try adjusting your filters or lower your match threshold.</p></div>`;
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

    // Defensive coding
    const title = job.title || 'Untitled Role';
    const company = job.company || 'Unknown Company';
    const location = job.location || 'Remote';
    const mode = job.mode || 'Remote';
    const exp = job.experience ? `${job.experience} Yrs` : 'Exp N/A';
    const salary = job.salaryRange || 'Not disclosed';
    const source = job.source || 'Aggregated';
    const posted = job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo} days ago`;

    // Match Score Badge logic
    const score = job.score || 0;
    const scoreColor = MatchingEngine.getScoreColor(score);

    card.innerHTML = `
        <div class="job-header">
            <div>
                <div class="job-title" style="display: flex; align-items: center; gap: 8px;">
                    ${title}
                    <span class="match-badge score-${scoreColor}">${score}% Match</span>
                </div>
                <div class="job-company">${company}</div>
            </div>
            <div class="tag source">${source}</div>
        </div>
        
        <div class="job-tags">
            <span class="tag">${location}</span>
            <span class="tag">${mode}</span>
            <span class="tag">${exp}</span>
            <span class="tag salary">${salary}</span>
        </div>

        <div class="job-footer">
            <span class="posted-date">${posted}</span>
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
    const job = JOBS_DATA.find(j => j.id === id);
    if (!job) return;

    document.getElementById('modal-title').innerText = job.title;
    document.getElementById('modal-company').innerText = job.company;
    document.getElementById('modal-desc').innerText = job.description;

    const skillsContainer = document.getElementById('modal-skills');
    skillsContainer.innerHTML = job.skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('');

    const applyBtn = document.getElementById('modal-apply');
    applyBtn.onclick = () => window.open(job.applyUrl, '_blank');

    document.getElementById('job-modal').style.display = 'flex';
};

window.closeJobModal = function (event) {
    if (event && event.target !== document.getElementById('job-modal')) return; // Only close if clicking overlay or x
    document.getElementById('job-modal').style.display = 'none';
};

// Initialize
window.addEventListener('hashchange', renderRoute);
window.addEventListener('load', renderRoute);
