import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const AmbientDustParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

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

    // Particle pool with neural connections
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.35 - 0.1,
      opacity: Math.random() * 0.5 + 0.2,
      fadeSpeed: Math.random() * 0.005 + 0.002,
      increasing: Math.random() > 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const baseR = isDark ? 201 : 140;
      const baseG = isDark ? 169 : 115;
      const baseB = isDark ? 113 : 93;

      // Draw subtle connecting neural lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const lineOpacity = (1 - dist / 100) * (isDark ? 0.08 : 0.04);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${lineOpacity})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw floating glowing particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.increasing) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= 0.7) p.increasing = false;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0.1) p.increasing = true;
        }

        // Wrap around boundaries
        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${p.opacity * (isDark ? 0.6 : 0.35)})`;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.shadowColor = `rgba(${baseR}, ${baseG}, ${baseB}, 0.5)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-500"
      aria-hidden="true"
    />
  );
};
