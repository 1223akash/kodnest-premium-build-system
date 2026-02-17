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
    '/jt/07-test': { title: 'Test Checklist', template: 'test-checklist' },
    '/jt/08-ship': { title: 'Ready to Ship', template: 'ship' },
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
                    
                    <div class="dashboard-controls">
                        <!-- Filter Bar -->
                        <div class="filter-bar" style="flex: 1; margin-bottom: 0;">
                            <input type="text" id="filter-search" class="filter-input" placeholder="Search role or company..." oninput="applyFilters()">
                            <select id="filter-location" class="filter-select" onchange="applyFilters()"><option value="">Location</option><option value="Bangalore">Bangalore</option><option value="Pune">Pune</option><option value="Remote">Remote</option></select>
                            <select id="filter-mode" class="filter-select" onchange="applyFilters()"><option value="">Mode</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Onsite">Onsite</option></select>
                            <select id="filter-exp" class="filter-select" onchange="applyFilters()"><option value="">Exp</option><option value="Fresher">Fresher</option><option value="0-1">0-1 Years</option><option value="1-3">1-3 Years</option></select>
                            <select id="filter-source" class="filter-select" onchange="applyFilters()"><option value="">Source</option><option value="LinkedIn">LinkedIn</option><option value="Naukri">Naukri</option><option value="Indeed">Indeed</option></select>
                            <select id="filter-sort" class="filter-select" style="margin-left: auto;" onchange="applyFilters()"><option value="latest">Latest</option><option value="match">Match Score</option><option value="salary">Salary</option></select>
                            <select id="filter-status" class="filter-select" style="margin-left: 8px; border-color: var(--color-accent);" onchange="applyFilters()">
                                <option value="">All Status</option>
                                <option value="Applied">Applied</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Selected">Selected</option>
                                <option value="Not Applied">Not Applied</option>
                            </select>
                            <button class="btn btn-secondary btn-sm" onclick="clearFilters()" style="margin-left: 8px;">✕ Clear</button>
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
                    
                    <div style="text-align: center; margin-top: 40px; margin-bottom: 20px; border-top: 1px dashed #eee; padding-top: 20px;">
                        <a href="#/jt/07-test" style="color: #ccc; text-decoration: none; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 8px;">
                            <span>⚙️</span> Verify System Status
                        </a>
                    </div>
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
                 <div class="primary-workspace" id="digest-workspace">
                    <!-- Injected via JS -->
                 </div>
            </div>
        `;
        renderDigest();
        return;
    }

    // ... (existing code) ...

    // Digest Engine Logic moved to end of file to fix scope mechanics


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

    if (route.template === 'test-checklist') {
        renderTestChecklist(app);
        return;
    }

    if (route.template === 'ship') {
        renderShip(app);
        return;
    }
}

// ==========================================
// TEST CHECKLIST LOGIC
// ==========================================

const CHECKLIST_ITEMS = [
    { id: 'pref-persist', label: 'Preferences persist after refresh', tip: 'Reload page, check Settings.' },
    { id: 'match-calc', label: 'Match score calculates correctly', tip: 'Check a job card score vs preferences.' },
    { id: 'match-toggle', label: '"Show only matches" toggle works', tip: 'Enable toggle, low scores should vanish.' },
    { id: 'save-persist', label: 'Save job persists after refresh', tip: 'Save a job, reload, check Saved tab.' },
    { id: 'apply-tab', label: 'Apply opens in new tab', tip: 'Click Apply, check browser tabs.' },
    { id: 'status-persist', label: 'Status update persists after refresh', tip: 'Change status, reload, verify.' },
    { id: 'status-filter', label: 'Status filter works correctly', tip: 'Filter by Applied, check results.' },
    { id: 'digest-gen', label: 'Digest generates top 10 by score', tip: 'Generate digest, count items.' },
    { id: 'digest-persist', label: 'Digest persists for the day', tip: 'Reload /digest, should be same.' },
    { id: 'no-errors', label: 'No console errors on main pages', tip: 'F12 > Console > Navigate routes.' }
];

function renderTestChecklist(container) {
    const testStatus = JSON.parse(localStorage.getItem('jobTrackerTestStatus') || '{}');
    const passedCount = CHECKLIST_ITEMS.filter(item => testStatus[item.id]).length;
    const total = CHECKLIST_ITEMS.length;
    const isComplete = passedCount === total;

    const listHtml = CHECKLIST_ITEMS.map(item => {
        const isChecked = testStatus[item.id] ? 'checked' : '';
        return `
            <div class="checklist-item" style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-bottom: 1px solid #eee;">
                <input type="checkbox" id="${item.id}" ${isChecked} onchange="updateTestStatus('${item.id}', this.checked)" style="margin-top: 4px; transform: scale(1.2); cursor: pointer;">
                <div>
                    <label for="${item.id}" style="font-weight: 500; display: block; cursor: pointer;">${item.label}</label>
                    <div style="font-size: 0.85rem; color: #666; margin-top: 2px;">Use case: ${item.tip}</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <section class="context-header">
            <h1>Pre-Flight Checklist</h1>
            <p>Verify system integrity before shipping.</p>
        </section>
        <div class="workspace-wrapper">
            <div class="primary-workspace">
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Verification Status</span>
                        <span class="tag ${isComplete ? 'source' : ''}" style="background: ${isComplete ? '#e6f4ea' : '#fce8e6'}; color: ${isComplete ? '#188038' : '#d93025'}; font-size: 0.9rem;">
                            ${passedCount} / ${total} Passed
                        </span>
                    </div>
                    
                    <div style="padding: 0;">
                        ${listHtml}
                    </div>

                    <div style="padding: 24px; text-align: center; border-top: 1px solid #eee; background: #fafafa;">
                        ${isComplete
            ? `<a href="#/jt/08-ship" class="btn btn-primary" style="width: 100%; display: block; text-align: center;">🚀 Proceed to Ship</a>`
            : `<button class="btn btn-secondary" disabled style="width: 100%; opacity: 0.5; cursor: not-allowed;">Resolve all issues to unlock shipping</button>`
        }
                        <div style="margin-top: 16px;">
                            <button class="btn btn-secondary btn-sm" onclick="resetTestStatus()">Reset Test Status</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.updateTestStatus = function (id, isChecked) {
    const testStatus = JSON.parse(localStorage.getItem('jobTrackerTestStatus') || '{}');
    testStatus[id] = isChecked;
    localStorage.setItem('jobTrackerTestStatus', JSON.stringify(testStatus));

    // Re-render to update progress bar and button state
    renderTestChecklist(document.getElementById('app'));
};

window.resetTestStatus = function () {
    if (confirm('Reset all verification progress?')) {
        localStorage.removeItem('jobTrackerTestStatus');
        renderTestChecklist(document.getElementById('app'));
    }
};

function renderShip(container) {
    const testStatus = JSON.parse(localStorage.getItem('jobTrackerTestStatus') || '{}');
    const passedCount = CHECKLIST_ITEMS.filter(item => testStatus[item.id]).length;
    const total = CHECKLIST_ITEMS.length;

    if (passedCount < total) {
        container.innerHTML = `
            <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
                <div style="font-size: 4rem; margin-bottom: 24px;">🔒</div>
                <h1>Deployment Locked</h1>
                <p style="color: #666; max-width: 400px; margin-bottom: 32px;">
                    You must verify all ${total} items in the checklist before you can ship this build.
                </p>
                <a href="#/jt/07-test" class="btn btn-primary">Return to Checklist</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <section class="context-header">
            <h1>Ready for Takeoff 🚀</h1>
            <p>All systems verified. You are clear to launch.</p>
        </section>
        <div class="workspace-wrapper">
            <div class="primary-workspace">
                <div class="card" style="text-align: center; padding: 48px 24px;">
                    <div style="font-size: 4rem; margin-bottom: 24px;">✅</div>
                    <h2>Quality Gate Passed</h2>
                    <p style="color: #666; max-width: 500px; margin: 0 auto 32px auto;">
                        Great job! You have verified that the Job Notification Tracker meets all requirements.
                        The system handles edge cases, persists data, and delivers a premium user experience.
                    </p>
                    <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; display: inline-block; text-align: left; font-family: monospace; font-size: 0.9rem;">
                        git add .<br>
                        git commit -m "chore: Ready for release v1.0"<br>
                        git push origin master
                    </div>
                </div>
            </div>
        </div>
    `;
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

    const checkboxes = document.querySelectorAll('input[name="pref-mode"]');
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
window.clearFilters = function () {
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-mode').value = '';
    document.getElementById('filter-exp').value = '';
    document.getElementById('filter-source').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('toggle-match').checked = false; // Optional: reset toggle too? User said "Clear All". Checks imply yes.
    applyFilters();
};

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

        // Status Filter
        const statusFilter = document.getElementById('filter-status').value;
        const currentStatus = getJobStatus(job.id).status;
        const matchStatus = statusFilter ? currentStatus === statusFilter : true;

        // Match Toggle Logic
        const matchThreshold = matchToggle ? (job.score >= minScore) : true;

        return matchSearch && matchLocation && matchMode && matchExp && matchSource && matchStatus && matchThreshold;
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
        container.innerHTML = `<div class="empty-state" style="padding: 40px;"><h3>No matching jobs found.</h3><p>Try adjusting your filters or lower your match threshold.</p><button class="btn btn-secondary" style="margin-top:16px" onclick="clearFilters()">Clear Filters</button></div>`;
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

    // Status Logic
    const statusData = getJobStatus(job.id);
    const currentStatus = statusData.status;
    const statusClass = currentStatus === 'Applied' ? 'applied' :
        currentStatus === 'Rejected' ? 'rejected' :
            currentStatus === 'Selected' ? 'selected' : '';

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
            <div class="card-actions" style="align-items: center;">
                <select class="status-select ${statusClass}" onchange="updateJobStatus(${job.id}, this.value)">
                    <option value="Not Applied" ${currentStatus === 'Not Applied' ? 'selected' : ''}>Not Applied</option>
                    <option value="Applied" ${currentStatus === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Rejected" ${currentStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    <option value="Selected" ${currentStatus === 'Selected' ? 'selected' : ''}>Selected</option>
                </select>
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

// Status Tracking Logic
window.getJobStatus = function (jobId) {
    const statusMap = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
    return statusMap[jobId] || { status: 'Not Applied', timestamp: null };
};

window.updateJobStatus = function (jobId, newStatus) {
    const statusMap = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');

    statusMap[jobId] = {
        status: newStatus,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('jobTrackerStatus', JSON.stringify(statusMap));

    // Visual Feedback
    showToast(`Status updated to ${newStatus}`);

    // Re-render to update badge colors (if needed, or just let CSS handle it via class toggle which we'd need to do manually to avoid full re-render flicker)
    // For now, let's just update the select class manually to avoid losing focus
    const select = document.querySelector(`.status-select[onchange="updateJobStatus(${jobId}, this.value)"]`);
    if (select) {
        select.className = 'status-select'; // Reset
        if (newStatus === 'Applied') select.classList.add('applied');
        if (newStatus === 'Rejected') select.classList.add('rejected');
        if (newStatus === 'Selected') select.classList.add('selected');
    }
};

window.showToast = function (msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);

    // Trigger reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

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

// ==========================================
// DAILY DIGEST ENGINE (Moved to Global Scope)
// ==========================================

window.renderDigest = function () {
    const container = document.getElementById('digest-workspace');
    if (!container) {
        console.error('Digest Container ID not found');
        return;
    }

    // Visual Debugger
    let debugLog = document.getElementById('debug-log');
    if (!debugLog) {
        debugLog = document.createElement('div');
        debugLog.id = 'debug-log';
        debugLog.style.cssText = "background: #333; color: #0f0; padding: 10px; margin-top: 20px; font-family: monospace; font-size: 12px; display: none;"; // Hidden by default, enable if needed
        container.appendChild(debugLog);
    }
    const log = (msg) => {
        console.log('[Digest]', msg);
    };

    log('renderDigest called');

    if (typeof MatchingEngine === 'undefined') {
        log('MatchingEngine missing, retrying...');
        setTimeout(window.renderDigest, 100);
        return;
    }

    const prefs = JSON.parse(localStorage.getItem('jobTrackerPreferences') || 'null');
    if (!prefs) {
        log('No prefs found');
        container.innerHTML = `
        <div class="card empty-state">
            <div style="font-size: 3rem; margin-bottom: 16px;">⚙️</div>
            <h3>Set your preferences first.</h3>
            <p>We need to know what you're looking for to generate your digest.</p>
            <a href="#/settings" class="btn btn-primary" style="margin-top: 16px;">Go to Settings</a>
        </div>`;
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `jobTrackerDigest_${today}`;
    const cachedDigest = localStorage.getItem(storageKey);

    if (cachedDigest) {
        log('Found cached digest');
        try {
            const digestJobs = JSON.parse(cachedDigest);
            log(`Rendering ${digestJobs.length} jobs`);
            renderDigestUI(container, digestJobs, today);
            log('Render complete');
        } catch (e) {
            log('Error parsing digest: ' + e.message);
            container.innerHTML = `<div class="card empty-state"><p>Error loading digest. <button onclick="localStorage.removeItem('${storageKey}'); location.reload()">Reset</button></p></div>`;
        }
    } else {
        log('No cache, showing Generate button');
        container.innerHTML = `
        <div class="card empty-state">
            <div style="font-size: 3rem; margin-bottom: 16px;">📧</div>
            <h3>It's 9:00 AM somewhere.</h3>
            <p>Ready to generate your personalized job briefing for today?</p>
            <div style="margin-top: 8px; font-size: 0.85rem; color: #888; background: #eee; padding: 4px 8px; display: inline-block; border-radius: 4px;">
                Demo Mode: Daily 9AM trigger simulated manually.
            </div>
            <br>
            <button class="btn btn-primary" style="margin-top: 24px;" onclick="generateDigest('${today}')">
                Generate Today's Digest
            </button>
        </div>
    `;
    }
};

window.generateDigest = function (todayStr) {
    const prefs = JSON.parse(localStorage.getItem('jobTrackerPreferences'));

    const scoredJobs = JOBS_DATA.map(job => {
        const score = MatchingEngine.calculateScore(job, prefs);
        return { ...job, score };
    });

    const minScore = parseInt(prefs.minMatchScore) || 1;
    let candidates = scoredJobs.filter(j => j.score >= minScore);

    candidates.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.postedDaysAgo - b.postedDaysAgo;
    });

    const top10 = candidates.slice(0, 10);

    if (top10.length === 0) {
        const container = document.getElementById('digest-workspace');
        container.innerHTML = `
        <div class="card empty-state">
            <div style="font-size: 3rem; margin-bottom: 16px;">🌵</div>
            <h3>No matching roles today.</h3>
            <p>Check again tomorrow or broaden your preferences.</p>
            <button class="btn btn-secondary" onclick="renderDigest()" style="margin-top: 16px;">Back</button>
        </div>
    `;
        return;
    }

    localStorage.setItem(`jobTrackerDigest_${todayStr}`, JSON.stringify(top10));
    const container = document.getElementById('digest-workspace');
    renderDigestUI(container, top10, todayStr);
};

window.renderDigestUI = function (container, jobs, dateStr) {
    const dateDisplay = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const jobRows = jobs.map(job => {
        const scoreColor = MatchingEngine.getScoreColor(job.score);
        return `
        <div class="digest-item">
            <div class="digest-job-main">
                <a href="${job.applyUrl}" target="_blank" class="digest-job-title">${job.title}</a>
                <div class="digest-job-meta">
                    ${job.company} • ${job.location} • ${job.experience} Yrs
                </div>
                <div class="digest-score" style="color: var(--color-${scoreColor === 'green' ? 'success' : 'warning'});">
                    ${job.score}% Match
                </div>
            </div>
            <div class="digest-actions">
                <a href="${job.applyUrl}" target="_blank" class="digest-btn">Apply</a>
            </div>
        </div>
    `;
    }).join('');

    container.innerHTML = `
    <div class="digest-controls">
        <button class="btn btn-secondary btn-sm" onclick="copyDigest()">📋 Copy to Clipboard</button>
        <button class="btn btn-secondary btn-sm" onclick="emailDigest()">✉️ Create Email Draft</button>
    </div>

    <div class="digest-container" id="digest-content">
        <div class="digest-header">
            <h2>Top ${jobs.length} Jobs For You — 9AM Digest</h2>
            <div class="digest-date">${dateDisplay}</div>
        </div>

        <div class="digest-body">
            ${jobRows}
        </div>

        ${renderStatusHistory()}

        <div class="digest-footer">
            <p>This digest was generated based on your preferences.</p>
            <p>Job Notification Tracker • <a href="#/settings">Update Preferences</a></p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 24px;">
        <button class="btn btn-secondary btn-sm" onclick="clearDigest('${dateStr}')">Reset Simulation (Dev Only)</button>
    </div>
`;
};

function renderStatusHistory() {
    const statusMap = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
    const updates = Object.entries(statusMap)
        .map(([id, data]) => {
            const job = JOBS_DATA.find(j => j.id == id);
            return job ? { ...data, job } : null;
        })
        .filter(item => item && item.status !== 'Not Applied')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    if (updates.length === 0) return '';

    const rows = updates.map(update => `
        <div class="status-history-item">
            <strong>${update.job.title}</strong> at ${update.job.company}
            <div style="margin-top: 2px;">
                <span class="match-badge" style="background: #eee; color: #333;">${update.status}</span>
                <span class="status-history-date">${new Date(update.timestamp).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');

    return `
        <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #eee;">
            <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Recent Status Updates</h3>
            ${rows}
        </div>
    `;
}

window.copyDigest = function () {
    const digestText = document.getElementById('digest-content').innerText;
    navigator.clipboard.writeText(digestText).then(() => alert('Digest copied to clipboard!'));
};

window.emailDigest = function () {
    const digestText = document.getElementById('digest-content').innerText;
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

window.clearDigest = function (dateStr) {
    localStorage.removeItem(`jobTrackerDigest_${dateStr}`);
    renderDigest();
};
