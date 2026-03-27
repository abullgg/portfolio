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
  const text1 = 'hi, so you are here??';
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
      const delay = 60 + Math.random() * 80; // Variable speed for realism
      setTimeout(typeLine1, delay);
    } else {
      // Line 1 done — pause, hide cursor 1, show line 2 with cursor 2, then type Welcome
      setTimeout(() => {
        cursor1.classList.add('hidden');
        welcomeWrap.classList.add('visible');
        cursor2.classList.remove('hidden');
        setTimeout(typeLine2, 400); // slight delay before typing Welcome!
      }, 600);
    }
  }

  function typeLine2() {
    if (charIndex2 < text2.length) {
      typedEl2.textContent += text2.charAt(charIndex2);
      charIndex2++;
      const delay = 60 + Math.random() * 80;
      setTimeout(typeLine2, delay);
    }
  }

  // Start typing after a brief delay
  setTimeout(typeLine1, 800);
})();


/* ============================================
   NAV MENU TOGGLE
   ============================================ */

(function () {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  const navTexts = ['about', 'projects', 'contact'];
  const typedNavEls = [
    document.getElementById('nav-typed-1'),
    document.getElementById('nav-typed-2'),
    document.getElementById('nav-typed-3')
  ];
  
  let navTyped = false;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    
    // Type out nav texts if opening for the first time
    if (!navTyped && navMenu.classList.contains('open')) {
      navTyped = true;
      let charIndices = [0, 0, 0];
      
      function typeNav() {
        let allDone = true;
        for (let i = 0; i < 3; i++) {
          if (charIndices[i] < navTexts[i].length) {
            typedNavEls[i].textContent += navTexts[i].charAt(charIndices[i]);
            charIndices[i]++;
            allDone = false;
          }
        }
        if (!allDone) {
          setTimeout(typeNav, 40 + Math.random() * 60);
        }
      }
      
      // Delay nav typing slightly so the menu has time to slide open
      setTimeout(typeNav, 200);
    }
  });
})();
