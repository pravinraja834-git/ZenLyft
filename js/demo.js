/* ============================================================
   ZenLyft — demo.js
   Interactive AutoMatch product demonstration
   State machine: idle → processing → results → (employer view)
   ============================================================ */

(function () {
  'use strict';

  /* ---- Data ---- */

  const candidateScenarios = {
    mechanic: {
      input: 'I have 5 years of experience repairing motorcycles and servicing engines. I can work full time. I am looking for work around Erode.',
      profile: {
        skills: ['Motorcycle Repair', 'Engine Servicing', 'Mechanical Maintenance', 'Electrical Troubleshooting'],
        experience: '5 Years',
        location: 'Erode, Tamil Nadu',
        availability: 'Full-time',
      },
      matches: [
        {
          title: 'Two-Wheeler Service Technician',
          company: 'AutoCare India Pvt. Ltd.',
          location: 'Erode, Tamil Nadu',
          type: 'Full-time',
          pct: 94,
          bars: [
            { label: 'Skill match', val: 96 },
            { label: 'Experience', val: 100 },
            { label: 'Location', val: 100 },
            { label: 'Work type', val: 100 },
          ],
        },
        {
          title: 'Automotive Workshop Mechanic',
          company: 'Sri Murugan Motors',
          location: 'Erode, Tamil Nadu',
          type: 'Full-time',
          pct: 88,
          bars: [
            { label: 'Skill match', val: 90 },
            { label: 'Experience', val: 85 },
            { label: 'Location', val: 100 },
            { label: 'Work type', val: 100 },
          ],
        },
        {
          title: 'Field Service Engineer',
          company: 'Royal Enfield Dealer',
          location: 'Coimbatore, Tamil Nadu',
          type: 'Full-time',
          pct: 81,
          bars: [
            { label: 'Skill match', val: 88 },
            { label: 'Experience', val: 85 },
            { label: 'Location', val: 72 },
            { label: 'Work type', val: 100 },
          ],
        },
        {
          title: 'Mechanical Maintenance Technician',
          company: 'Tiruppur Manufacturing Co.',
          location: 'Tiruppur, Tamil Nadu',
          type: 'Full-time',
          pct: 76,
          bars: [
            { label: 'Skill match', val: 82 },
            { label: 'Experience', val: 75 },
            { label: 'Location', val: 65 },
            { label: 'Work type', val: 100 },
          ],
        },
      ],
    },
  };

  const employerScenario = {
    job: {
      title: 'Two-Wheeler Service Technician',
      requirements: [
        'Motorcycle repair and engine servicing',
        'Minimum 2 years of hands-on experience',
        'Based in or near Erode',
        'Available full-time',
      ],
    },
    candidates: [
      { initials: 'SK', name: 'Selvam K.', detail: '5 yrs · Erode · Motorcycle Repair', pct: 94 },
      { initials: 'MR', name: 'Murugan R.', detail: '4 yrs · Erode · Engine Servicing', pct: 88 },
      { initials: 'AK', name: 'Arjun K.', detail: '3 yrs · Namakkal · Two-Wheeler Repair', pct: 79 },
      { initials: 'VP', name: 'Vijay P.', detail: '6 yrs · Coimbatore · Mechanical Maintenance', pct: 74 },
    ],
  };

  /* ---- State ---- */
  let currentTab = 'candidate';
  let demoState = 'idle'; // idle | processing | results

  /* ---- DOM refs ---- */
  const demoSection = document.getElementById('demo-section');
  if (!demoSection) return;

  const tabs = demoSection.querySelectorAll('.demo__tab');
  const candidateView = demoSection.querySelector('#demo-candidate-view');
  const employerView = demoSection.querySelector('#demo-employer-view');

  // Candidate view elements
  const candidateInput = demoSection.querySelector('#demo-candidate-input');
  const runBtn = demoSection.querySelector('#demo-run-btn');
  const resetBtn = demoSection.querySelector('#demo-reset-btn');
  const processingEl = demoSection.querySelector('#demo-processing');
  const extractEl = demoSection.querySelector('#demo-extract');
  const skillsWrap = demoSection.querySelector('#demo-skills');
  const extractMeta = demoSection.querySelector('#demo-extract-meta');
  const resultsBody = demoSection.querySelector('#demo-results-body');
  const resultsPanel = demoSection.querySelector('#demo-results-panel');
  const resultsPlaceholder = demoSection.querySelector('#demo-results-placeholder');

  /* ---- Tab switching ---- */
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      currentTab = tab.dataset.tab;

      if (candidateView && employerView) {
        if (currentTab === 'candidate') {
          candidateView.style.display = 'grid';
          employerView.style.display = 'none';
        } else {
          candidateView.style.display = 'none';
          employerView.style.display = 'grid';
          renderEmployerView();
        }
      }
    });
  });

  /* ---- Candidate flow ---- */
  function runDemo() {
    if (demoState === 'processing') return;

    const scenario = candidateScenarios.mechanic;
    demoState = 'processing';

    // Show processing state
    if (runBtn) runBtn.disabled = true;
    if (processingEl) processingEl.classList.add('is-active');
    if (extractEl) { extractEl.style.opacity = '0.3'; }
    if (resultsPlaceholder) resultsPlaceholder.style.display = 'flex';
    if (resultsBody) {
      resultsBody.innerHTML = '';
    }

    // Phase 1: Show skills being extracted (after 800ms)
    setTimeout(function () {
      if (processingEl) processingEl.classList.remove('is-active');
      if (extractEl) extractEl.style.opacity = '1';

      // Render skills one by one
      if (skillsWrap) {
        skillsWrap.innerHTML = '';
        scenario.profile.skills.forEach(function (skill, i) {
          setTimeout(function () {
            const chip = document.createElement('span');
            chip.className = 'skill-pill';
            chip.textContent = skill;
            chip.style.opacity = '0';
            chip.style.transform = 'translateY(6px)';
            chip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            skillsWrap.appendChild(chip);
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                chip.style.opacity = '1';
                chip.style.transform = 'translateY(0)';
              });
            });
          }, i * 160);
        });
      }

      // Render meta
      if (extractMeta) {
        extractMeta.innerHTML = `
          <div class="demo__extract-row">
            <span class="demo__extract-key">Experience</span>
            <span class="demo__extract-val">
              <span class="badge badge--accent">${scenario.profile.experience}</span>
            </span>
          </div>
          <div class="demo__extract-row">
            <span class="demo__extract-key">Location</span>
            <span class="demo__extract-val">
              <span class="badge">${scenario.profile.location}</span>
            </span>
          </div>
          <div class="demo__extract-row">
            <span class="demo__extract-key">Availability</span>
            <span class="demo__extract-val">
              <span class="badge">${scenario.profile.availability}</span>
            </span>
          </div>
        `;
      }

    }, 900);

    // Phase 2: Show match results (after 2s)
    setTimeout(function () {
      demoState = 'results';
      if (resultsPlaceholder) resultsPlaceholder.style.display = 'none';
      if (runBtn) runBtn.disabled = false;
      if (resetBtn) resetBtn.style.display = 'inline-flex';

      renderMatches(scenario.matches);
    }, 2200);
  }

  function renderMatches(matches) {
    if (!resultsBody) return;
    resultsBody.innerHTML = '';

    matches.forEach(function (match, i) {
      setTimeout(function () {
        const card = createMatchCard(match);
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        resultsBody.appendChild(card);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });

        // Animate bars
        setTimeout(function () {
          card.querySelectorAll('.match-bar__fill').forEach(function (fill) {
            fill.style.width = fill.dataset.width || '0%';
          });
        }, 300);

      }, i * 200);
    });
  }

  function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <div class="job-card__top">
        <div>
          <div class="job-card__title">${match.title}</div>
          <div class="job-card__company">${match.company}</div>
        </div>
        <div class="job-card__match-pct">${match.pct}%</div>
      </div>
      <div class="job-card__meta">
        <span class="badge">${match.location}</span>
        <span class="badge">${match.type}</span>
      </div>
      <div class="job-card__bars">
        ${match.bars.map(function (bar) {
          const isLow = bar.val < 80;
          return `
            <div class="job-card__bar-row">
              <span class="job-card__bar-label">${bar.label}</span>
              <div class="match-bar">
                <div class="match-bar__track">
                  <div class="match-bar__fill ${isLow ? 'match-bar__fill--med' : ''}" data-width="${bar.val}%" style="width:0%"></div>
                </div>
                <span class="match-bar__pct">${bar.val}%</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    return card;
  }

  function resetDemo() {
    demoState = 'idle';
    if (candidateInput) candidateInput.value = candidateScenarios.mechanic.input;
    if (skillsWrap) skillsWrap.innerHTML = '';
    if (extractMeta) extractMeta.innerHTML = '';
    if (resultsBody) resultsBody.innerHTML = '';
    if (processingEl) processingEl.classList.remove('is-active');
    if (extractEl) extractEl.style.opacity = '0.4';
    if (resultsPlaceholder) resultsPlaceholder.style.display = 'flex';
    if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Run AutoMatch'; }
    if (resetBtn) resetBtn.style.display = 'none';
  }

  /* ---- Employer view ---- */
  function renderEmployerView() {
    const empContainer = demoSection.querySelector('#demo-employer-inner');
    if (!empContainer || empContainer.dataset.rendered) return;
    empContainer.dataset.rendered = 'true';

    const job = employerScenario.job;
    const candidates = employerScenario.candidates;

    const jobPanel = empContainer.querySelector('#emp-job-panel');
    const candidatesPanel = empContainer.querySelector('#emp-candidates-panel');

    if (jobPanel) {
      jobPanel.innerHTML = `
        <div class="employer-ui__job-card">
          <div class="employer-ui__job-title">${job.title}</div>
          <div class="employer-ui__requirements">
            ${job.requirements.map(function (req) {
              return `<div class="employer-ui__req"><div class="employer-ui__req-dot"></div><span>${req}</span></div>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (candidatesPanel) {
      candidatesPanel.innerHTML = `
        <div class="employer-ui__divider">Matched Candidates</div>
        <div class="employer-ui__candidates">
          ${candidates.map(function (c) {
            return `
              <div class="candidate-card">
                <div class="candidate-card__avatar">
                  <span class="candidate-card__avatar-initials">${c.initials}</span>
                </div>
                <div class="candidate-card__info">
                  <div class="candidate-card__name">${c.name}</div>
                  <div class="candidate-card__detail">${c.detail}</div>
                </div>
                <div class="candidate-card__score">${c.pct}%</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  /* ---- Event listeners ---- */
  if (runBtn) {
    runBtn.addEventListener('click', runDemo);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetDemo);
  }

  /* ---- Initialize ---- */
  // Pre-fill textarea
  if (candidateInput) {
    candidateInput.value = candidateScenarios.mechanic.input;
  }

  // Employer view hidden by default
  if (employerView) {
    employerView.style.display = 'none';
  }

  // Extract panel dimmed initially
  if (extractEl) {
    extractEl.style.opacity = '0.4';
  }

  // Reset button hidden initially
  if (resetBtn) {
    resetBtn.style.display = 'none';
  }

})();
