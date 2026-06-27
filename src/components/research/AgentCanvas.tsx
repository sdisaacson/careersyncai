import { useRef, useEffect, useCallback, memo } from "react";

export type ParticlePhase = "spawn" | "converge" | "cluster" | "disperse" | "pulse";

export type AgentCanvasProps = {
  isRunning: boolean;
  completedSectors: number;
  totalSectors: number;
  jobsFound: number;
};

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  clusterIndex: number;
  phase: ParticlePhase;
  phaseTime: number;
  angle: number;
  orbitSpeed: number;
  orbitRadius: number;
};

const PHASE_DURATION = 2000; // 2 seconds per phase
const TOTAL_CYCLE = PHASE_DURATION * 5;

function getPhase(elapsed: number): { phase: ParticlePhase; phaseTime: number } {
  const cyclePos = elapsed % TOTAL_CYCLE;
  if (cyclePos < PHASE_DURATION) {
    return { phase: "spawn", phaseTime: cyclePos / PHASE_DURATION };
  } else if (cyclePos < PHASE_DURATION * 2) {
    return { phase: "converge", phaseTime: (cyclePos - PHASE_DURATION) / PHASE_DURATION };
  } else if (cyclePos < PHASE_DURATION * 3) {
    return { phase: "cluster", phaseTime: (cyclePos - PHASE_DURATION * 2) / PHASE_DURATION };
  } else if (cyclePos < PHASE_DURATION * 4) {
    return { phase: "disperse", phaseTime: (cyclePos - PHASE_DURATION * 3) / PHASE_DURATION };
  } else {
    return { phase: "pulse", phaseTime: (cyclePos - PHASE_DURATION * 4) / PHASE_DURATION };
  }
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const AgentCanvas = memo(function AgentCanvas({
  isRunning,
  completedSectors,
  totalSectors,
  jobsFound,
}: AgentCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const statsRef = useRef({ completedSectors, jobsFound });

  statsRef.current = { completedSectors, jobsFound };

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const sectorAngles = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8);
    const clusterRadius = Math.min(width, height) * 0.25;
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 100; i++) {
      const clusterIndex = i % 8;
      const angle = sectorAngles[clusterIndex];
      const targetX = cx + Math.cos(angle) * clusterRadius;
      const targetY = cy + Math.sin(angle) * clusterRadius;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        targetX,
        targetY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.5,
        clusterIndex,
        phase: "spawn",
        phaseTime: 0,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.005 + Math.random() * 0.01,
        orbitRadius: 15 + Math.random() * 20,
      });
    }

    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    if (particlesRef.current.length === 0) {
      particlesRef.current = initParticles(width, height);
      startTimeRef.current = performance.now();
    }

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = (now: number) => {
      const elapsed = isRunning ? now - startTimeRef.current : 0;
      const { phase, phaseTime } = getPhase(elapsed);
      const particles = particlesRef.current;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle radial background glow at center
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.4);
      bgGrad.addColorStop(0, "rgba(0, 201, 255, 0.03)");
      bgGrad.addColorStop(1, "rgba(0, 201, 255, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw center hub
      const hubPulse = isRunning ? 1 + Math.sin(now * 0.003) * 0.15 : 1;
      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16 * hubPulse);
      hubGrad.addColorStop(0, "rgba(0, 201, 255, 0.8)");
      hubGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.5)");
      hubGrad.addColorStop(1, "rgba(124, 58, 237, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 16 * hubPulse, 0, Math.PI * 2);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      // Draw hub core
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      const coreGrad = ctx.createLinearGradient(cx - 6, cy - 6, cx + 6, cy + 6);
      coreGrad.addColorStop(0, "#00C9FF");
      coreGrad.addColorStop(0.5, "#3B82F6");
      coreGrad.addColorStop(1, "#7C3AED");
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const eased = easeInOut(phaseTime);

        // Phase-based animation
        switch (phase) {
          case "spawn": {
            p.opacity = 0.2 + phaseTime * 0.4;
            p.x += p.vx;
            p.y += p.vy;
            // Wrap around
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            break;
          }
          case "converge": {
            const tx = p.targetX;
            const ty = p.targetY;
            p.x += (tx - p.x) * (0.02 + eased * 0.03);
            p.y += (ty - p.y) * (0.02 + eased * 0.03);
            p.opacity = 0.5 + eased * 0.3;

            // Light trail
            ctx.beginPath();
            ctx.moveTo(p.x - p.vx * 5, p.y - p.vy * 5);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(0, 201, 255, ${0.1 * (1 - eased)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
          }
          case "cluster": {
            p.angle += p.orbitSpeed;
            const orbitX = p.targetX + Math.cos(p.angle) * p.orbitRadius;
            const orbitY = p.targetY + Math.sin(p.angle) * p.orbitRadius;
            p.x += (orbitX - p.x) * 0.1;
            p.y += (orbitY - p.y) * 0.1;
            p.opacity = 0.7 + Math.sin(now * 0.005 + i) * 0.2;
            break;
          }
          case "disperse": {
            const dispAngle = (p.clusterIndex * Math.PI * 2) / 8 + p.angle;
            const dispDist = eased * Math.min(width, height) * 0.45;
            const tx = cx + Math.cos(dispAngle) * dispDist;
            const ty = cy + Math.sin(dispAngle) * dispDist;
            p.x += (tx - p.x) * 0.03;
            p.y += (ty - p.y) * 0.03;
            p.opacity = 0.6 - eased * 0.2;
            break;
          }
          case "pulse": {
            const pulsePhase = Math.sin(phaseTime * Math.PI);
            p.opacity = 0.4 + pulsePhase * 0.5;
            p.x += p.vx * 0.3;
            p.y += p.vy * 0.3;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            break;
          }
        }

        // Mouse interaction - gentle attraction
        const mdx = mouseRef.current.x - p.x;
        const mdy = mouseRef.current.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 120 && mDist > 0) {
          const force = (1 - mDist / 120) * 0.3;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 201, 255, ${p.opacity})`;
        ctx.fill();

        // Glow effect for pulse phase
        if (phase === "pulse" && p.opacity > 0.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 201, 255, ${(p.opacity - 0.6) * 0.15})`;
          ctx.fill();
        }
      }

      // Draw connections between nearby particles during cluster phase
      if (phase === "cluster" || phase === "converge") {
        const connectionThreshold = 60;
        const maxConnections = 3;
        for (let i = 0; i < particles.length; i++) {
          let connections = 0;
          for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionThreshold) {
              const alpha = (1 - dist / connectionThreshold) * 0.2;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0, 201, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      // Draw hub-to-cluster connections during pulse phase
      if (phase === "pulse") {
        const sectorAngles = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8);
        const clusterRadius = Math.min(width, height) * 0.25;
        const pulseAlpha = Math.sin(phaseTime * Math.PI) * 0.15;
        for (let i = 0; i < 8; i++) {
          const angle = sectorAngles[i];
          const tx = cx + Math.cos(angle) * clusterRadius;
          const ty = cy + Math.sin(angle) * clusterRadius;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = `rgba(0, 201, 255, ${pulseAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw sector labels
      const sectorNames = [
        "Technology",
        "Healthcare",
        "Finance",
        "Energy",
        "Education",
        "Manufacturing",
        "Consulting",
        "Government",
      ];
      const sectorColors = [
        "#00C9FF", "#22C55E", "#F59E0B", "#EF4444",
        "#8B5CF6", "#64748B", "#EC4899", "#3B82F6",
      ];
      const sectorAngles = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8);
      const labelRadius = Math.min(width, height) * 0.38;

      for (let i = 0; i < 8; i++) {
        const angle = sectorAngles[i];
        const lx = cx + Math.cos(angle) * labelRadius;
        const ly = cy + Math.sin(angle) * labelRadius;

        // Label background
        ctx.font = '500 11px "Inter", system-ui, sans-serif';
        const text = sectorNames[i];
        const metrics = ctx.measureText(text);
        const pad = 8;
        const labelW = metrics.width + pad * 2;
        const labelH = 22;

        // Highlight active sector
        const isActive = i < statsRef.current.completedSectors;
        const bgAlpha = isActive ? 0.25 : 0.1;

        ctx.beginPath();
        ctx.roundRect(lx - labelW / 2, ly - labelH / 2, labelW, labelH, 11);
        ctx.fillStyle = `${sectorColors[i]}${Math.round(bgAlpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();

        if (isActive) {
          ctx.beginPath();
          ctx.roundRect(lx - labelW / 2, ly - labelH / 2, labelW, labelH, 11);
          ctx.strokeStyle = `${sectorColors[i]}60`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.fillStyle = isActive ? sectorColors[i] : "#94A3B8";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, lx, ly);
      }

      // Overlay stats (top-left)
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = "#00C9FF";
      ctx.fillText(`Agents Active: ${totalSectors}`, 16, 16);

      ctx.fillStyle = "#F5F7FA";
      ctx.fillText(
        `Jobs Found: ${statsRef.current.jobsFound}`,
        16,
        34
      );

      ctx.fillStyle = "#94A3B8";
      ctx.fillText(
        `Sectors: ${statsRef.current.completedSectors}/${totalSectors}`,
        16,
        52
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isRunning, initParticles, totalSectors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
});

export default AgentCanvas;
