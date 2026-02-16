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

    // ==========================================
    // DAILY DIGEST ENGINE
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
            // debugLog.style.display = 'block'; // Uncomment to show user
            // debugLog.innerHTML += `<div>${new Date().toLocaleTimeString()} - ${msg}</div>`;
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
            // ... (block if no prefs)
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
            // ... (show generate)
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

        // Score all jobs
        const scoredJobs = JOBS_DATA.map(job => {
            const score = MatchingEngine.calculateScore(job, prefs);
            return { ...job, score };
        });

        // Filter Logic: Must have score > 0 to be relevant? Or just top 10?
        // User said "No matches found" edge case, so strictly filter > 0
        // Actually, user said matches > threshold (usually), but let's stick to simple "scored > 0" for relevance
        // Better: Filter by minScore pref if set, else > 0
        const minScore = parseInt(prefs.minMatchScore) || 1;
        let candidates = scoredJobs.filter(j => j.score >= minScore);

        // Sort: Match Score Desc, then Posted Days Asc (Newest first)
        candidates.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.postedDaysAgo - b.postedDaysAgo;
        });

        // Top 10
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

        // Persist
        localStorage.setItem(`jobTrackerDigest_${todayStr}`, JSON.stringify(top10));

        // Render
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
