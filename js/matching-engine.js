const MatchingEngine = {
    // Exact Scoring Rules
    calculateScore: function (job, prefs) {
        if (!prefs) return 0;

        let score = 0;
        const roleKeywords = (prefs.roleKeywords || '').toLowerCase().split(',').map(k => k.trim()).filter(k => k);
        const preferredLocations = (prefs.preferredLocations || []).map(l => l.toLowerCase());
        const preferredModes = (prefs.preferredMode || []);
        const expLevel = prefs.experienceLevel;
        const userSkills = (prefs.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(s => s);

        // Rule 1: Role Keyword in Title (+25)
        // Check if ANY keyword matches
        const titleLower = job.title.toLowerCase();
        if (roleKeywords.some(k => titleLower.includes(k))) {
            score += 25;
        }

        // Rule 2: Role Keyword in Description (+15)
        const descLower = job.description.toLowerCase();
        if (roleKeywords.some(k => descLower.includes(k))) {
            score += 15;
        }

        // Rule 3: Location Match (+15)
        // job.location might be "Bangalore"
        if (preferredLocations.some(l => job.location.toLowerCase().includes(l))) {
            score += 15;
        }

        // Rule 4: Mode Match (+10)
        if (preferredModes.includes(job.mode)) {
            score += 10;
        }

        // Rule 5: Experience Match (+10)
        // Heuristic: simple string match for now as per prompt "job.experience matches experienceLevel"
        // In real app, we'd parse ranges. For now, exact string or partial match.
        if (expLevel && job.experience === expLevel) {
            score += 10;
        } else if (expLevel === 'Fresher' && job.experience === '0-1') {
            // Soft match for Fresher/0-1
            score += 5;
        }

        // Rule 6: Skill Overlap (+15)
        const jobSkillsLower = job.skills.map(s => s.toLowerCase());
        if (userSkills.some(s => jobSkillsLower.some(js => js.includes(s) || s.includes(js)))) {
            score += 15;
        }

        // Rule 7: Recency (+5)
        if (job.postedDaysAgo <= 2) {
            score += 5;
        }

        // Rule 8: Source LinkedIn (+5)
        if (job.source === 'LinkedIn') {
            score += 5;
        }

        return Math.min(score, 100); // Cap at 100
    },

    getScoreColor: function (score) {
        if (score >= 80) return 'green';
        if (score >= 60) return 'amber';
        if (score >= 40) return 'neutral';
        return 'grey';
    }
};

// Make it available globally
window.MatchingEngine = MatchingEngine;
