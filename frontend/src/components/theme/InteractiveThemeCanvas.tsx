import React, { useEffect, useRef } from 'react';
import { useTheme, ThemeType } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  color: string;
  glow: string;
  char?: string; // For Matrix mode
  angle: number;
  speed: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const InteractiveThemeCanvas: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean; targetX: number; targetY: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    isHovering: false
  });

  const shockwavesRef = useRef<Shockwave[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse for interactive glow
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isHovering = true;

      // Update CSS variables for mouse-tracking spotlight across all cards!
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    // On Click: trigger futuristic shockwave energy blast
    const handleClick = (e: MouseEvent) => {
      const colorsMap: Record<ThemeType, string> = {
        cyber_quantum: '#00f0ff',
        matrix_gold: '#10b981',
        tokyo_synth: '#ec4899',
        supernova_fire: '#ff4b4b',
        black_stealth: '#ffffff',
        dubai_luxury: '#fbbf24'
      };

      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 160,
        alpha: 0.8,
        color: colorsMap[theme] || '#00f0ff'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Initialize Particles according to Active Visual Universe
    const particleCount = theme === 'matrix_gold' ? 65 : 75;
    const particles: Particle[] = [];

    const matrixChars = '0101XYZΩλπSalesAI$€£9876543210';

    const getThemeParticleConfig = (t: ThemeType) => {
      switch (t) {
        case 'cyber_quantum':
          return {
            colors: ['#00f0ff', '#38bdf8', '#818cf8', '#0284c7'],
            glows: ['rgba(0, 240, 255, 0.8)', 'rgba(56, 189, 248, 0.6)']
          };
        case 'matrix_gold':
          return {
            colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#059669'],
            glows: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.6)']
          };
        case 'tokyo_synth':
          return {
            colors: ['#ec4899', '#f43f5e', '#a855f7', '#d946ef', '#c084fc'],
            glows: ['rgba(236, 72, 153, 0.8)', 'rgba(168, 85, 247, 0.7)']
          };
        case 'supernova_fire':
          return {
            colors: ['#ff4b4b', '#f97316', '#fbbf24', '#ef4444', '#f59e0b'],
            glows: ['rgba(255, 75, 75, 0.8)', 'rgba(249, 115, 22, 0.7)']
          };
        case 'black_stealth':
          return {
            colors: ['#ffffff', '#e2e8f0', '#cbd5e1', '#94a3b8'],
            glows: ['rgba(255, 255, 255, 0.9)', 'rgba(226, 232, 240, 0.5)']
          };
        case 'dubai_luxury':
          return {
            colors: ['#fbbf24', '#f59e0b', '#d97706', '#fde047', '#fffbeb'],
            glows: ['rgba(251, 191, 36, 0.9)', 'rgba(245, 158, 11, 0.7)']
          };
      }
    };

    const config = getThemeParticleConfig(theme);

    for (let i = 0; i < particleCount; i++) {
      const colorIndex = Math.floor(Math.random() * config.colors.length);
      const size = Math.random() * 3 + 1.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: theme === 'matrix_gold' ? Math.random() * 1.5 + 0.8 : (Math.random() - 0.5) * 0.7,
        size: size,
        baseSize: size,
        alpha: Math.random() * 0.7 + 0.3,
        color: config.colors[colorIndex],
        glow: config.glows[Math.floor(Math.random() * config.glows.length)],
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01
      });
    }

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Draw Interactive Radial Cursor Nebula Spotlight
      const cursorGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
      const spotlightColors: Record<ThemeType, string> = {
        cyber_quantum: 'rgba(0, 240, 255, 0.08)',
        matrix_gold: 'rgba(16, 185, 129, 0.08)',
        tokyo_synth: 'rgba(236, 72, 153, 0.09)',
        supernova_fire: 'rgba(255, 75, 75, 0.09)',
        black_stealth: 'rgba(255, 255, 255, 0.05)',
        dubai_luxury: 'rgba(251, 191, 36, 0.09)'
      };

      cursorGradient.addColorStop(0, spotlightColors[theme] || 'rgba(0, 240, 255, 0.08)');
      cursorGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = cursorGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw & Update Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 4.5;
        sw.alpha *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 3;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.02) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // 3. Draw & Update Interactive Particles
      particles.forEach((p) => {
        // Position update
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.speed;

        // Interactive Mouse Gravitational Interaction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && mouseRef.current.isHovering) {
          const force = (180 - dist) / 180;
          // Quantum & Tokyo repel smoothly, Matrix & Gold shimmer around cursor
          if (theme === 'supernova_fire' || theme === 'dubai_luxury') {
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          } else {
            p.x -= (dx / dist) * force * 1.8;
            p.y -= (dy / dist) * force * 1.8;
          }
          p.size = p.baseSize * (1 + force * 0.8);
        } else {
          p.size = p.baseSize;
        }

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render particle
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.angle));

        if (theme === 'matrix_gold' && p.char) {
          // Matrix Digital Glyph
          ctx.font = '11px monospace';
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.glow;
          ctx.shadowBlur = 8;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          // Luminous Photon / Crystal Star
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.glow;
          ctx.shadowBlur = p.size * 5;
          ctx.fill();
        }
        ctx.restore();
      });

      // 4. Connecting Constellation Laser Beams (for Quantum, Tokyo, and Stealth)
      if (theme === 'cyber_quantum' || theme === 'tokyo_synth' || theme === 'black_stealth') {
        ctx.save();
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              const alpha = (1 - dist / 85) * 0.15;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p1.color;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85
      }}
    />
  );
};
