const loaded = {
    standings: false,
    constructors: false,
    lastrace: false,
    schedule: false
};

// Map F1 team names to their primary colors for accents
const teamColors = {
    'Red Bull': '#3671C6',
    'Ferrari': '#E80020',
    'Mercedes': '#27F4D2',
    'McLaren': '#FF8000',
    'Aston Martin': '#229971',
    'Alpine': '#0090FF',
    'Williams': '#005AFF',
    'RB F1 Team': '#6692FF',
    'Sauber': '#52E252',
    'Haas': '#B6BABD'
};

function getTeamColor(teamName) {
    for (const key in teamColors) {
        if (teamName.includes(key)) return teamColors[key];
    }
    return '#8B8B99'; // Fallback to muted text if not found
}

function toggleLoader(show) {
    const loader = document.getElementById('main-loader');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

function loadStandings() {
    if (loaded.standings) return;
    toggleLoader(true);
    
    fetch("/api/standings")
        .then(res => res.json())
        .then(drivers => {
            const tbody = document.getElementById("standings-body");
            let html = "";
            drivers.forEach((driver, index) => {
                const teamName = driver.Constructors[0].name;
                html += `
                    <tr style="--stagger: ${index}; --team-color: ${getTeamColor(teamName)};">
                        <td><span class="pos-badge">${driver.position}</span></td>
                        <td>${driver.Driver.givenName} <strong>${driver.Driver.familyName}</strong></td>
                        <td>
                            <div class="team-name">
                                <div class="team-color-bar"></div>
                                ${teamName}
                            </div>
                        </td>
                        <td>${driver.points} PTS</td>
                    </tr>`;
            });
            tbody.innerHTML = html;
            loaded.standings = true;
        })
        .finally(() => toggleLoader(false));
}

function loadConstructors() {
    if (loaded.constructors) return;
    toggleLoader(true);
    
    fetch("/api/constructors")
        .then(res => res.json())
        .then(teams => {
            const tbody = document.getElementById("constructors-body");
            let html = "";
            teams.forEach((team, index) => {
                const teamName = team.Constructor.name;
                html += `
                    <tr style="--stagger: ${index}; --team-color: ${getTeamColor(teamName)};">
                        <td><span class="pos-badge">${team.position}</span></td>
                        <td>
                            <div class="team-name">
                                <div class="team-color-bar"></div>
                                <strong>${teamName}</strong>
                            </div>
                        </td>
                        <td>${team.Constructor.nationality}</td>
                        <td>${team.points} PTS</td>
                    </tr>`;
            });
            tbody.innerHTML = html;
            loaded.constructors = true;
        })
        .finally(() => toggleLoader(false));
}

function loadLastRace() {
    if (loaded.lastrace) return;
    toggleLoader(true);
    
    fetch("/api/lastrace")
        .then(res => res.json())
        .then(race => {
            const titleEl = document.getElementById("lastrace-title");
            if (titleEl) {
                titleEl.innerHTML = `LAST RACE <span style="color:var(--text-muted); font-size:1.1rem; font-weight:400; font-family:'Inter'; text-transform:none;">— ${race.raceName} (${race.date})</span>`;
            }
            const tbody = document.getElementById("lastrace-body");
            let html = "";
            race.Results.forEach((result, index) => {
                const teamName = result.Constructor.name;
                const time = result.Time ? result.Time.time : result.status;
                html += `
                    <tr style="--stagger: ${index}; --team-color: ${getTeamColor(teamName)};">
                        <td><span class="pos-badge">${result.position}</span></td>
                        <td>${result.Driver.givenName} <strong>${result.Driver.familyName}</strong></td>
                        <td>
                            <div class="team-name">
                                <div class="team-color-bar"></div>
                                ${teamName}
                            </div>
                        </td>
                        <td>${time}</td>
                    </tr>`;
            });
            tbody.innerHTML = html;
            loaded.lastrace = true;
        })
        .finally(() => toggleLoader(false));
}

function loadSchedule() {
    if (loaded.schedule) return;
    toggleLoader(true);
    
    fetch("/api/schedule")
        .then(res => res.json())
        .then(races => {
            const container = document.getElementById("schedule-list");
            let html = "";
            races.forEach((race, index) => {
                html += `
                    <div class="race-card" style="--stagger: ${index};">
                        <div class="race-info">
                            <div class="race-name">Round ${race.round} — ${race.raceName}</div>
                            <div class="race-circuit">${race.Circuit.circuitName}, ${race.Circuit.Location.country}</div>
                        </div>
                        <div class="race-date">${race.date}</div>
                    </div>`;
            });
            container.innerHTML = html;
            loaded.schedule = true;
        })
        .finally(() => toggleLoader(false));
}

const loaders = {
    'standings-section': loadStandings,
    'constructors-section': loadConstructors,
    'lastrace-section': loadLastRace,
    'schedule-section': loadSchedule
};

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');

        // Hide all sections and un-highlight links
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

        // Show targets
        document.getElementById(targetId).classList.add('active');
        link.classList.add('active');

        // Load data if needed
        if (loaders[targetId]) {
            loaders[targetId]();
        }
    });
});

// Load standings on first visit
loadStandings();
document.querySelector('nav a').classList.add('active');