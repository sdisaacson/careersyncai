import { useRef, useEffect, useCallback, memo } from "react";

export type ParticlePhase =
  "spawn" | "converge" | "cluster" | "disperse" | "pulse";

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
  glowIntensity: number;
};

const PHASE_DURATION = 2500;
const TOTAL_CYCLE = PHASE_DURATION * 5;

function getPhase(elapsed: number): {
  phase: ParticlePhase;
  phaseTime: number;
} {
  const cyclePos = elapsed % TOTAL_CYCLE;
  if (cyclePos < PHASE_DURATION) {
    return { phase: "spawn", phaseTime: cyclePos / PHASE_DURATION };
  } else if (cyclePos < PHASE_DURATION * 2) {
    return {
      phase: "converge",
      phaseTime: (cyclePos - PHASE_DURATION) / PHASE_DURATION,
    };
  } else if (cyclePos < PHASE_DURATION * 3) {
    return {
      phase: "cluster",
      phaseTime: (cyclePos - PHASE_DURATION * 2) / PHASE_DURATION,
    };
  } else if (cyclePos < PHASE_DURATION * 4) {
    return {
      phase: "disperse",
      phaseTime: (cyclePos - PHASE_DURATION * 3) / PHASE_DURATION,
    };
  } else {
    return {
      phase: "pulse",
      phaseTime: (cyclePos - PHASE_DURATION * 4) / PHASE_DURATION,
    };
  }
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const SECTOR_COLORS = [
  "#00C9FF",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#64748B",
  "#EC4899",
  "#3B82F6",
];

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
  const dimensionsRef = useRef({ width: 0, height: 0 });

  statsRef.current = { completedSectors, jobsFound };

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const sectorAngles = Array.from(
      { length: 8 },
      (_, i) => (i * Math.PI * 2) / 8
    );
    const clusterRadius = Math.min(width, height) * 0.22;
    const cx = width / 2;
    const cy = height / 2;
    const PARTICLE_COUNT = 180;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 1.5 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.4,
        clusterIndex,
        phase: "spawn",
        phaseTime: 0,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.003 + Math.random() * 0.012,
        orbitRadius: 12 + Math.random() * 25,
        glowIntensity: 0.5 + Math.random() * 0.5,
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
    dimensionsRef.current = { width, height };

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
      const minDim = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      // Deep radial background glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.45);
      bgGrad.addColorStop(0, "rgba(0, 201, 255, 0.04)");
      bgGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.02)");
      bgGrad.addColorStop(1, "rgba(0, 201, 255, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw sector rings for completed sectors
      const sectorAngles = Array.from(
        { length: 8 },
        (_, i) => (i * Math.PI * 2) / 8
      );
      const clusterRadius = minDim * 0.22;

      for (let i = 0; i < 8; i++) {
        const isActive = i < statsRef.current.completedSectors;
        const angle = sectorAngles[i];
        const sx = cx + Math.cos(angle) * clusterRadius;
        const sy = cy + Math.sin(angle) * clusterRadius;

        // Sector glow
        if (isActive) {
          const sectorGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 40);
          sectorGlow.addColorStop(0, `${SECTOR_COLORS[i]}15`);
          sectorGlow.addColorStop(1, "transparent");
          ctx.fillStyle = sectorGlow;
          ctx.fillRect(sx - 40, sy - 40, 80, 80);
        }

        // Ring around cluster center
        ctx.beginPath();
        ctx.arc(sx, sy, isActive ? 22 : 16, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? `${SECTOR_COLORS[i]}40` : "#33415530";
        ctx.lineWidth = isActive ? 1.5 : 0.5;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(sx, sy, isActive ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? SECTOR_COLORS[i] : "#475569";
        ctx.fill();
      }

      // Center hub with pulsing effect
      const hubPulse = isRunning ? 1 + Math.sin(now * 0.002) * 0.2 : 1;
      const hubGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        20 * hubPulse
      );
      hubGrad.addColorStop(0, "rgba(0, 201, 255, 0.9)");
      hubGrad.addColorStop(0.4, "rgba(59, 130, 246, 0.6)");
      hubGrad.addColorStop(1, "rgba(124, 58, 237, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 20 * hubPulse, 0, Math.PI * 2);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      // Hub core
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      const coreGrad = ctx.createLinearGradient(cx - 7, cy - 7, cx + 7, cy + 7);
      coreGrad.addColorStop(0, "#00C9FF");
      coreGrad.addColorStop(0.5, "#3B82F6");
      coreGrad.addColorStop(1, "#7C3AED");
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const eased = easeInOut(phaseTime);
        const sectorColor = SECTOR_COLORS[p.clusterIndex];

        switch (phase) {
          case "spawn": {
            p.opacity = 0.15 + phaseTime * 0.5;
            p.x += p.vx * 0.5;
            p.y += p.vy * 0.5;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
            break;
          }
          case "converge": {
            const tx = p.targetX;
            const ty = p.targetY;
            const speed = 0.015 + eased * 0.04;
            p.x += (tx - p.x) * speed;
            p.y += (ty - p.y) * speed;
            p.opacity = 0.4 + eased * 0.4;

            // Trail effect
            const trailAlpha = (1 - eased) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x - (tx - p.x) * 0.3, p.y - (ty - p.y) * 0.3);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `${sectorColor}${Math.round(trailAlpha * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
          }
          case "cluster": {
            p.angle += p.orbitSpeed;
            const orbitX = p.targetX + Math.cos(p.angle) * p.orbitRadius;
            const orbitY = p.targetY + Math.sin(p.angle) * p.orbitRadius;
            p.x += (orbitX - p.x) * 0.08;
            p.y += (orbitY - p.y) * 0.08;
            p.opacity = 0.6 + Math.sin(now * 0.004 + i * 0.5) * 0.25;
            break;
          }
          case "disperse": {
            const dispAngle =
              (p.clusterIndex * Math.PI * 2) / 8 + p.angle + now * 0.0005;
            const dispDist = eased * minDim * 0.42;
            const tx = cx + Math.cos(dispAngle) * dispDist;
            const ty = cy + Math.sin(dispAngle) * dispDist;
            p.x += (tx - p.x) * 0.025;
            p.y += (ty - p.y) * 0.025;
            p.opacity = 0.5 - eased * 0.15;
            break;
          }
          case "pulse": {
            const pulsePhase = Math.sin(phaseTime * Math.PI);
            p.opacity = 0.35 + pulsePhase * 0.55;
            p.x += p.vx * 0.2;
            p.y += p.vy * 0.2;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
            break;
          }
        }

        // Mouse interaction
        const mdx = mouseRef.current.x - p.x;
        const mdy = mouseRef.current.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 150 && mDist > 0) {
          const force = (1 - mDist / 150) * 0.4;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        // Draw glow
        if (p.opacity > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = `${sectorColor}${Math.round(
            (p.opacity - 0.4) * 0.12 * 255
          )
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${sectorColor}${Math.round(p.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      }

      // Connections between nearby particles
      if (phase === "cluster" || phase === "converge") {
        const connectionThreshold = 70;
        const maxConnections = 2;
        for (let i = 0; i < particles.length; i += 2) {
          let connections = 0;
          for (
            let j = i + 1;
            j < particles.length && connections < maxConnections;
            j += 2
          ) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionThreshold) {
              const alpha = (1 - dist / connectionThreshold) * 0.25;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const connColor =
                particles[i].clusterIndex === particles[j].clusterIndex
                  ? SECTOR_COLORS[particles[i].clusterIndex]
                  : "#00C9FF";
              ctx.strokeStyle = `${connColor}${Math.round(alpha * 255)
                .toString(16)
                .padStart(2, "0")}`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      // Hub-to-cluster connections during pulse
      if (phase === "pulse") {
        const pulseAlpha = Math.sin(phaseTime * Math.PI) * 0.2;
        for (let i = 0; i < 8; i++) {
          const angle = sectorAngles[i];
          const tx = cx + Math.cos(angle) * clusterRadius;
          const ty = cy + Math.sin(angle) * clusterRadius;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = `${SECTOR_COLORS[i]}${Math.round(pulseAlpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Sector labels
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
      const labelRadius = minDim * 0.36;

      for (let i = 0; i < 8; i++) {
        const angle = sectorAngles[i];
        const lx = cx + Math.cos(angle) * labelRadius;
        const ly = cy + Math.sin(angle) * labelRadius;

        const isActive = i < statsRef.current.completedSectors;
        const bgAlpha = isActive ? 0.3 : 0.12;

        ctx.font = '600 11px "Inter", system-ui, sans-serif';
        const text = sectorNames[i];
        const metrics = ctx.measureText(text);
        const pad = 10;
        const labelW = metrics.width + pad * 2;
        const labelH = 24;

        // Label background with rounded rect
        ctx.beginPath();
        ctx.roundRect(lx - labelW / 2, ly - labelH / 2, labelW, labelH, 12);
        ctx.fillStyle = `${SECTOR_COLORS[i]}${Math.round(bgAlpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();

        if (isActive) {
          ctx.beginPath();
          ctx.roundRect(lx - labelW / 2, ly - labelH / 2, labelW, labelH, 12);
          ctx.strokeStyle = `${SECTOR_COLORS[i]}80`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.fillStyle = isActive ? SECTOR_COLORS[i] : "#94A3B8";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, lx, ly);
      }

      // Stats overlay (top-left)
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      ctx.font = '600 12px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = "#00C9FF";
      ctx.fillText(`Agents Active: ${totalSectors}`, 20, 20);

      ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = "#F5F7FA";
      ctx.fillText(`Jobs Found: ${statsRef.current.jobsFound}`, 20, 40);

      ctx.fillStyle = "#94A3B8";
      ctx.fillText(
        `Sectors: ${statsRef.current.completedSectors}/${totalSectors}`,
        20,
        58
      );

      // Animated status indicator
      if (isRunning) {
        const dotX = 20;
        const dotY = 80;
        const dotRadius = 4 + Math.sin(now * 0.005) * 2;
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 201, 255, ${0.6 + Math.sin(now * 0.008) * 0.4})`;
        ctx.fill();

        ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = "#64748B";
        ctx.fillText("SCANNING", dotX + 14, dotY - 4);
      }

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
