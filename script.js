/* ============================================
   SIMPLE PARTICLE BACKGROUND
   Drifting dots — clean, minimal, Y2K-friendly
   ============================================ */

(function () {
  const canvas = document.getElementById('fluid-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let mouseX = -9999;
  let mouseY = -9999;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // ---------- Particle class ----------
  class Particle {
    constructor() {
      // Base anchor position
      this.baseX = Math.random() * width;
      this.baseY = Math.random() * height;
      // Current position
      this.x = this.baseX;
      this.y = this.baseY;
      this.size = 1 + Math.random() * 1.8;
      this.opacity = 0.08 + Math.random() * 0.18;
      // Orbital drift — each particle has its own rhythm
      this.orbitX = 30 + Math.random() * 80;
      this.orbitY = 30 + Math.random() * 80;
      this.speedX = (0.00012 + Math.random() * 0.00025) * (Math.random() > 0.5 ? 1 : -1);
      this.speedY = (0.00012 + Math.random() * 0.00025) * (Math.random() > 0.5 ? 1 : -1);
      this.phaseX = Math.random() * Math.PI * 2;
      this.phaseY = Math.random() * Math.PI * 2;
      // Offset for smooth mouse push recovery
      this.pushX = 0;
      this.pushY = 0;
    }

    update(time) {
      // Target position from orbit
      const targetX = this.baseX + Math.sin(time * this.speedX + this.phaseX) * this.orbitX;
      const targetY = this.baseY + Math.cos(time * this.speedY + this.phaseY) * this.orbitY;

      // Mouse repulsion
      const dx = targetX + this.pushX - mouseX;
      const dy = targetY + this.pushY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 130;

      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        this.pushX += (dx / dist) * force * 2.5;
        this.pushY += (dy / dist) * force * 2.5;
      }

      // Ease push back to zero (smooth recovery)
      this.pushX *= 0.95;
      this.pushY *= 0.95;

      this.x = targetX + this.pushX;
      this.y = targetY + this.pushY;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, ${90 + Math.floor(this.phaseX * 10) % 30}, ${20 + Math.floor(this.phaseY * 8) % 15}, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = 200;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // ---------- Draw faint connecting lines between nearby particles ----------
  function drawConnections() {
    const maxDist = 130;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 200, 50, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // ---------- Animation loop ----------
  function animate(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(10, 10, 10, 1)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(time);
      particles[i].draw();
    }

    drawConnections();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();


/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

(function () {
  const text1 = 'Hi, I build scalable backend systems and data-driven solutions';
  const typedEl1 = document.getElementById('typed-text-1');
  const cursor1 = document.getElementById('cursor-1');

  const text2 = 'Welcome!';
  const typedEl2 = document.getElementById('typed-text-2');
  const welcomeWrap = document.getElementById('welcome-wrap');
  const cursor2 = document.getElementById('cursor-2');

  let charIndex1 = 0;
  let charIndex2 = 0;

  function typeLine1() {
    if (charIndex1 < text1.length) {
      typedEl1.textContent += text1.charAt(charIndex1);
      charIndex1++;
      const delay = 15 + Math.random() * 25; // Variable speed for realism, very snappy
      setTimeout(typeLine1, delay);
    } else {
      // Line 1 done — pause, hide cursor 1, show line 2 with cursor 2, then type Welcome
      setTimeout(() => {
        cursor1.classList.add('hidden');
        welcomeWrap.classList.add('visible');
        cursor2.classList.remove('hidden');
        setTimeout(typeLine2, 100); // slight delay before typing Welcome!
      }, 250);
    }
  }

  function typeLine2() {
    if (charIndex2 < text2.length) {
      typedEl2.textContent += text2.charAt(charIndex2);
      charIndex2++;
      const delay = 15 + Math.random() * 25;
      setTimeout(typeLine2, delay);
      } else {
        const navToggleObj = document.getElementById('nav-toggle');
        const navMenuObj = document.getElementById('nav-menu');
        
        if (navToggleObj) {
          navToggleObj.classList.add('pulse-active');
          navToggleObj.classList.add('ping');
          
          // Auto-open menu after 1 second if not already opened
          setTimeout(() => {
            if (navMenuObj && !navMenuObj.classList.contains('open')) {
              navToggleObj.click(); // Trigger the existing click logic which handles all typing
            }
          }, 1000);

          // Form a recurring radar ping to attract attention if the user hasn't opened the menu yet
          setInterval(() => {
            if (navMenuObj && !navMenuObj.classList.contains('open')) {
              // Force animation restart by violently removing and reapplying the class
              navToggleObj.classList.remove('ping');
              void navToggleObj.offsetWidth; // Trigger DOM reflow to reset CSS state
              navToggleObj.classList.add('ping');
            }
          }, 5000);
        }
      }
  }

  // Start typing after a brief delay
  setTimeout(typeLine1, 150);
})();


/* ============================================
   NAV MENU TOGGLE
   ============================================ */

(function () {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  const navTexts = ['about', 'projects', 'get in touch', 'more'];
  const typedNavEls = [
    document.getElementById('nav-typed-1'),
    document.getElementById('nav-typed-2'),
    document.getElementById('nav-typed-3'),
    document.getElementById('nav-typed-4')
  ];
  
  let navTyped = false;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('rotated');
    
    // Type out nav texts if opening for the first time
    if (!navTyped && navMenu.classList.contains('open')) {
      navTyped = true;
      let charIndices = [0, 0, 0, 0];
      
      function typeNav() {
        let allDone = true;
        for (let i = 0; i < 4; i++) {
          if (charIndices[i] < navTexts[i].length) {
            typedNavEls[i].textContent += navTexts[i].charAt(charIndices[i]);
            charIndices[i]++;
            allDone = false;
          }
        }
        if (!allDone) {
          setTimeout(typeNav, 15 + Math.random() * 20);
        }
      }
      
      // Delay nav typing slightly so the menu has time to slide open
      setTimeout(typeNav, 100);
    }
  });

  // About panel toggle via click
  const aboutLink = document.getElementById('about-link');
  const aboutWrapper = document.getElementById('about-wrapper');

  if (aboutLink && aboutWrapper) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      aboutWrapper.classList.toggle('open');
      scrollToView(aboutWrapper);
    });
  }

  // Contact panel toggle via click
  const contactLink = document.getElementById('contact-link');
  const contactWrapper = document.getElementById('contact-wrapper');

  if (contactLink && contactWrapper) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      contactWrapper.classList.toggle('open');
      scrollToView(contactWrapper);

      // Close contact and resume panels if main contact tab is collapsed
      if (!contactWrapper.classList.contains('open')) {
        const contactFormPanel = document.getElementById('contact-form-panel');
        if (contactFormPanel) contactFormPanel.classList.remove('show');
        
        const resumePanel = document.getElementById('resume-preview-panel');
        if (resumePanel) resumePanel.classList.remove('show');
      }
    });
  }

  // Projects panel toggle via click
  const projectsLink = document.getElementById('projects-link');
  const projectsWrapper = document.getElementById('projects-wrapper');

  if (projectsLink && projectsWrapper) {
    projectsLink.addEventListener('click', (e) => {
      e.preventDefault();
      projectsWrapper.classList.toggle('open');
      scrollToView(projectsWrapper);
      
      // Close details if closing the main project tab to keep it tidy
      if (!projectsWrapper.classList.contains('open')) {
        const pgDetailsContent = document.getElementById('phishguard-details-content');
        if (pgDetailsContent) pgDetailsContent.classList.remove('show');
        
        const cmntyDetailsContent = document.getElementById('cmnty-details-content');
        if (cmntyDetailsContent) cmntyDetailsContent.classList.remove('show');
      }
    });
  }

  // PhishGuard details side panel toggle
  const pgDetailsLink = document.getElementById('phishguard-details-link');
  const pgDetailsContent = document.getElementById('phishguard-details-content');
  const sidePanelClose = document.getElementById('side-panel-close');
  const asciiConnector = document.getElementById('ascii-connector');

  // cmnty-backend details side panel toggle
  const cmntyDetailsLink = document.getElementById('cmnty-details-link');
  const cmntyDetailsContent = document.getElementById('cmnty-details-content');
  const cmntyPanelClose = document.getElementById('cmnty-panel-close');

  // Resume preview side panel
  const resumePreviewLink = document.getElementById('resume-preview-link');
  const resumePanel = document.getElementById('resume-preview-panel');
  const resumePanelClose = document.getElementById('resume-panel-close');

  // More section toggle
  const moreLink = document.getElementById('more-link');
  const moreWrapper = document.getElementById('more-wrapper');

  if (moreLink && moreWrapper) {
    moreLink.addEventListener('click', (e) => {
      e.preventDefault();
      moreWrapper.classList.toggle('open');
      scrollToView(moreWrapper);
    });
  }
  // Contact form side panel
  const contactFormLink = document.getElementById('contact-form-link');
  const contactFormPanel = document.getElementById('contact-form-panel');
  const formPanelClose = document.getElementById('form-panel-close');

  // Currently on inline panel
  const currentlyOnLink = document.getElementById('currently-on-link');
  const currentlyOnInlineContent = document.getElementById('currently-on-inline-content');

  // Helper to ensure dropdowns are fully visible when opened
  function scrollToView(element) {
    if (element.classList.contains('open')) {
      // Small timeout to allow CSS height transition to happen before scrolling
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const offset = rect.bottom - window.innerHeight;
        // Only scroll if the element overflows the bottom of the screen
        if (offset > 0) {
          window.scrollBy({
            top: offset + 60, // Add 60px padding at the bottom so it's not flush with edge
            left: 0,
            behavior: 'smooth'
          });
        }
      }, 350); // wait until CSS max-height transition finishes
    }
  }

  // Helper to close all side panels
  function closeAllPanels() {
    if (pgDetailsContent) pgDetailsContent.classList.remove('show');
    if (cmntyDetailsContent) cmntyDetailsContent.classList.remove('show');
    if (resumePanel) resumePanel.classList.remove('show');
    if (contactFormPanel) contactFormPanel.classList.remove('show');
    
    // namecard panel
    const namecardPanel = document.getElementById('namecard-panel');
    if (namecardPanel) namecardPanel.classList.remove('show');
  }

  // Rewire details link
  if (pgDetailsLink && pgDetailsContent) {
    // Remove old listener by replacing element (clean approach)
    pgDetailsLink.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = pgDetailsContent.classList.contains('show');
      closeAllPanels();
      if (!isOpen) pgDetailsContent.classList.add('show');
    });
  }

  if (cmntyDetailsLink && cmntyDetailsContent) {
    cmntyDetailsLink.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = cmntyDetailsContent.classList.contains('show');
      closeAllPanels();
      if (!isOpen) cmntyDetailsContent.classList.add('show');
    });
  }

  if (resumePreviewLink && resumePanel) {
    resumePreviewLink.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = resumePanel.classList.contains('show');
      closeAllPanels();
      if (!isOpen) resumePanel.classList.add('show');
    });
  }

  const floatingResumeBtn = document.getElementById('floating-resume-btn');
  if (floatingResumeBtn && resumePanel) {
    floatingResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = resumePanel.classList.contains('show');
      closeAllPanels();
      if (!isOpen) resumePanel.classList.add('show');
    });
  }

  if (contactFormLink && contactFormPanel) {
    contactFormLink.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = contactFormPanel.classList.contains('show');
      closeAllPanels();
      if (!isOpen) contactFormPanel.classList.add('show');
    });
  }

  if (sidePanelClose && pgDetailsContent) {
    sidePanelClose.addEventListener('click', () => {
      pgDetailsContent.classList.remove('show');
    });
  }

  if (cmntyPanelClose && cmntyDetailsContent) {
    cmntyPanelClose.addEventListener('click', () => {
      cmntyDetailsContent.classList.remove('show');
    });
  }

  if (resumePanelClose && resumePanel) {
    resumePanelClose.addEventListener('click', () => {
      resumePanel.classList.remove('show');
    });
  }

  if (formPanelClose && contactFormPanel) {
    formPanelClose.addEventListener('click', () => {
      contactFormPanel.classList.remove('show');
    });
  }

  // Namecard Panel logic
  const logoTagTrigger = document.getElementById('logo-tag-trigger');
  const namecardPanel = document.getElementById('namecard-panel');
  const namecardPanelClose = document.getElementById('namecard-panel-close');

  if (logoTagTrigger && namecardPanel) {
    logoTagTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = namecardPanel.classList.contains('show');
      closeAllPanels();
      if (!isOpen) namecardPanel.classList.add('show');
    });

    if (namecardPanelClose) {
      namecardPanelClose.addEventListener('click', () => {
        namecardPanel.classList.remove('show');
      });
    }
  }

  if (currentlyOnLink && currentlyOnInlineContent) {
    currentlyOnLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentlyOnInlineContent.classList.toggle('open');
      scrollToView(currentlyOnInlineContent);
    });
  }

  // Copy email to clipboard
  const copyEmailBtn = document.getElementById('copy-email');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('hassanabul9279@gmail.com');
        copyEmailBtn.textContent = '[copied!]';
        copyEmailBtn.classList.add('copied');
        
        setTimeout(() => {
          copyEmailBtn.textContent = '[c]';
          copyEmailBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy email: ', err);
      }
    });
  }

  // Acknowledge download resume click
  const downloadResumeBtn = document.getElementById('download-resume');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      downloadResumeBtn.textContent = '[downloading...]';
      downloadResumeBtn.classList.add('copied');
      
      setTimeout(() => {
        downloadResumeBtn.textContent = '[d]';
        downloadResumeBtn.classList.remove('copied');
      }, 2500);
    });
  }

  // Animated cycling placeholders
  function cyclePlaceholder(inputEl, phrases, charDelay, pauseDelay) {
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function step() {
      // Don't animate if user is typing
      if (document.activeElement === inputEl && inputEl.value.length > 0) {
        setTimeout(step, pauseDelay);
        return;
      }

      const current = phrases[phraseIdx];

      if (!deleting) {
        inputEl.setAttribute('placeholder', current.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx >= current.length) {
          deleting = true;
          setTimeout(step, pauseDelay);
          return;
        }
      } else {
        inputEl.setAttribute('placeholder', current.substring(0, charIdx));
        charIdx--;
        if (charIdx < 0) {
          deleting = false;
          charIdx = 0;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(step, deleting ? charDelay / 2 : charDelay);
    }

    step();
  }

  const subjectInput = document.querySelector('.terminal-form input[name="subject"]');
  const messageInput = document.querySelector('.terminal-form textarea[name="message"]');

  if (subjectInput) {
    subjectInput.setAttribute('placeholder', '');
    cyclePlaceholder(subjectInput, ['Internship', 'Collaboration', 'Just saying hi'], 70, 1500);
  }

  if (messageInput) {
    messageInput.setAttribute('placeholder', '');
    cyclePlaceholder(messageInput, [
      "Tell me what you'd like to build together...",
      "Got a project idea? Let's talk.",
      "Drop a message, I'll get back to you."
    ], 40, 2000);
  }

  // Handle AJAX form submission to prevent redirect
  const contactFormNode = document.querySelector('.terminal-form');
  if (contactFormNode) {
    contactFormNode.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = contactFormNode.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '➤  Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';

      fetch(contactFormNode.action, {
        method: 'POST',
        body: new FormData(contactFormNode),
        mode: 'no-cors'
      })
      .then(() => {
        contactFormNode.innerHTML = `
          <div class="form-field" style="margin-top: 2rem;">
            Message delivered successfully. I'll get back to you soon.
          </div>
        `;
      })
      .catch(error => {
        submitBtn.innerHTML = '➤  Error! Try again';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      });
    });
  }
})();
