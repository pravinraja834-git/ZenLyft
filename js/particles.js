/* ==============================================
   ZenLyft - Particles System
   Canvas-based floating particle engine
   ============================================== */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 60;
    this.mouse = { x: -9999, y: -9999 };
    this.animId = null;
    this.colors = ['#43377F', '#5B4AA2', '#7868C6', '#A99AE8'];
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || window.innerWidth;
    this.canvas.height = rect.height || window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(x, y) {
    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: (Math.random() * 0.02) + 0.01,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    this.canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(67, 55, 127, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  update() {
    for (const p of this.particles) {
      // Mouse repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }

      // Velocity damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawConnections();

    for (const p of this.particles) {
      const pulsedRadius = p.radius + Math.sin(p.pulse) * 0.5;
      const pulsedAlpha = p.alpha + Math.sin(p.pulse) * 0.05;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, pulsedRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + this.alphaToHex(pulsedAlpha);
      this.ctx.fill();
    }
  }

  alphaToHex(alpha) {
    return Math.round(alpha * 255).toString(16).padStart(2, '0');
  }

  animate() {
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    window.particleSystem = new ParticleSystem('particles-canvas');
  }
});
