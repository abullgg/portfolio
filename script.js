/* ============================================
   FLUID SIMULATION — Metaball / Lava-lamp blobs
   ============================================ */

(function () {
  const canvas = document.getElementById('fluid-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // ---------- Blob class (sine-wave orbital motion) ----------
  class Blob {
    constructor() {
      this.radius = 80 + Math.random() * 160;
      // Base position — anchor point the blob orbits around
      this.baseX = Math.random() * width;
      this.baseY = Math.random() * height;
      // Orbital radii — how far the blob drifts from its anchor
      this.orbitX = 60 + Math.random() * 200;
      this.orbitY = 60 + Math.random() * 200;
      // Speed and phase offset — each blob has a unique rhythm
      this.speedX = (0.0003 + Math.random() * 0.0006) * (Math.random() > 0.5 ? 1 : -1);
      this.speedY = (0.0003 + Math.random() * 0.0006) * (Math.random() > 0.5 ? 1 : -1);
      this.phaseX = Math.random() * Math.PI * 2;
      this.phaseY = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x = this.baseX + Math.sin(time * this.speedX + this.phaseX) * this.orbitX;
      this.y = this.baseY + Math.cos(time * this.speedY + this.phaseY) * this.orbitY;
    }
  }

  // Create blobs
  const blobCount = 8;
  const blobs = [];
  for (let i = 0; i < blobCount; i++) {
    blobs.push(new Blob());
  }

  // ---------- Mouse-interactive blob ----------
  const mouseBlob = {
    x: -9999,
    y: -9999,
    radius: 0,
    targetRadius: 0,
  };

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseBlob.x = e.clientX;
    mouseBlob.y = e.clientY;
    mouseBlob.targetRadius = 180;
  });

  // Shrink when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    mouseBlob.targetRadius = 0;
  });

  // Smooth radius transition
  function updateMouseBlob() {
    mouseBlob.radius += (mouseBlob.targetRadius - mouseBlob.radius) * 0.08;
  }

  // ---------- Metaball rendering via pixel manipulation ----------
  // For performance we render at lower resolution and scale up
  const scale = 4;
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');

  function resizeOff() {
    offCanvas.width = Math.ceil(width / scale);
    offCanvas.height = Math.ceil(height / scale);
  }

  window.addEventListener('resize', resizeOff);
  resizeOff();

  function renderMetaballs() {
    const w = offCanvas.width;
    const h = offCanvas.height;
    const imageData = offCtx.createImageData(w, h);
    const data = imageData.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        const px = x * scale;
        const py = y * scale;

        for (let i = 0; i < blobs.length; i++) {
          const b = blobs[i];
          const dx = px - b.x;
          const dy = py - b.y;
          const distSq = dx * dx + dy * dy;
          sum += (b.radius * b.radius) / distSq;
        }

        // Mouse blob contribution
        if (mouseBlob.radius > 1) {
          const mdx = px - mouseBlob.x;
          const mdy = py - mouseBlob.y;
          const mdistSq = mdx * mdx + mdy * mdy;
          sum += (mouseBlob.radius * mouseBlob.radius) / mdistSq;
        }

        const idx = (y * w + x) * 4;

        if (sum > 1.0) {
          // Inside metaball — grey-green tones
          const intensity = Math.min(sum - 1.0, 1.0);
          const grey = Math.floor(18 + intensity * 30);
          const green = Math.floor(18 + intensity * 45);
          data[idx] = grey;           // R
          data[idx + 1] = green;      // G
          data[idx + 2] = grey;       // B
          data[idx + 3] = 200;        // A
        } else {
          // Background — near black
          data[idx] = 10;
          data[idx + 1] = 10;
          data[idx + 2] = 10;
          data[idx + 3] = 255;
        }
      }
    }

    offCtx.putImageData(imageData, 0, 0);

    // Draw scaled up — disable smoothing for pixelated lo-fi look
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offCanvas, 0, 0, width, height);
  }

  // ---------- Animation loop (time-based for seamless infinite motion) ----------
  function animate(time) {
    updateMouseBlob();
    for (let i = 0; i < blobs.length; i++) {
      blobs[i].update(time);
    }
    renderMetaballs();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();



/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

(function () {
  const text = 'hi, so you are here??';
  const typedEl = document.getElementById('typed-text');
  const welcomeWrap = document.querySelector('.line-2-wrap');
  let charIndex = 0;

  function typeChar() {
    if (charIndex < text.length) {
      typedEl.textContent += text.charAt(charIndex);
      charIndex++;
      const delay = 60 + Math.random() * 80; // Variable speed for realism
      setTimeout(typeChar, delay);
    } else {
      // Typing done — show "Welcome!" line with cursor after a pause
      setTimeout(() => {
        welcomeWrap.classList.add('visible');
      }, 600);
    }
  }

  // Start typing after a brief delay
  setTimeout(typeChar, 800);
})();
