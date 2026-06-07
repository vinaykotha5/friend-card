import { useEffect, useRef, useCallback } from "react";

const PARTICLE_COUNT = 70;

const PASTEL_COLORS = {
  cherryBlossom: ["#FFB7C5", "#FFC1CC", "#FFD1DC", "#FFAEC0"],
  rosePetal: ["#E8919A", "#D4727D", "#C9606D", "#E07A86"],
  butterfly: ["#C5A3FF", "#A8D8EA", "#FFD3B6", "#B5EAD7"],
  sparkle: ["#FFF9C4", "#FFFDE7", "#FFF8E1", "#FFE0B2"],
  heart: ["#FF8AAE", "#FF6B8A", "#FF85A1", "#FFA0B4"],
  firefly: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFEE58"],
  bokeh: ["#E8D5F5", "#D5EAF5", "#F5E0D5", "#D5F5E0", "#F5D5E8"],
};

const TYPES = [
  "cherryBlossom",
  "cherryBlossom",
  "cherryBlossom",
  "rosePetal",
  "rosePetal",
  "butterfly",
  "sparkle",
  "sparkle",
  "heart",
  "heart",
  "firefly",
  "firefly",
  "bokeh",
  "bokeh",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createParticle(w, h, forceTop = false) {
  const type = randomFrom(TYPES);
  const colors = PASTEL_COLORS[type];
  const color = randomFrom(colors);

  let size;
  switch (type) {
    case "cherryBlossom":
      size = 6 + Math.random() * 8;
      break;
    case "rosePetal":
      size = 5 + Math.random() * 7;
      break;
    case "butterfly":
      size = 7 + Math.random() * 6;
      break;
    case "sparkle":
      size = 2 + Math.random() * 4;
      break;
    case "heart":
      size = 4 + Math.random() * 5;
      break;
    case "firefly":
      size = 2 + Math.random() * 3;
      break;
    case "bokeh":
      size = 12 + Math.random() * 25;
      break;
    default:
      size = 5;
  }

  return {
    x: Math.random() * w,
    y: forceTop ? -size - Math.random() * 60 : Math.random() * h,
    size,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    speedY: 0.15 + Math.random() * 0.45,
    speedX: (Math.random() - 0.5) * 0.2,
    swayAmplitude: 15 + Math.random() * 30,
    swaySpeed: 0.003 + Math.random() * 0.008,
    swayOffset: Math.random() * Math.PI * 2,
    opacity: 0.15 + Math.random() * 0.45,
    baseOpacity: 0.15 + Math.random() * 0.45,
    type,
    color,
    twinkleSpeed: 0.02 + Math.random() * 0.04,
    twinkleOffset: Math.random() * Math.PI * 2,
    wingPhase: Math.random() * Math.PI * 2,
    trail: [],
  };
}

function drawCherryBlossom(ctx, p, time) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  const petalCount = 5;
  for (let i = 0; i < petalCount; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / petalCount);
    ctx.beginPath();
    ctx.ellipse(0, -p.size * 0.45, p.size * 0.32, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  // center
  ctx.beginPath();
  ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "#FFE0EC";
  ctx.fill();

  ctx.restore();
}

function drawRosePetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.7, 0, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();

  // subtle vein
  ctx.beginPath();
  ctx.moveTo(0, -p.size * 0.55);
  ctx.quadraticCurveTo(p.size * 0.08, 0, 0, p.size * 0.55);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.restore();
}

function drawButterfly(ctx, p, time) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation * 0.3);
  ctx.globalAlpha = p.opacity;

  const wingFlap = Math.sin(p.wingPhase + time * 0.04) * 0.4 + 0.6;
  const s = p.size;

  // left wing
  ctx.save();
  ctx.scale(wingFlap, 1);
  ctx.beginPath();
  ctx.ellipse(-s * 0.35, -s * 0.1, s * 0.4, s * 0.55, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.restore();

  // right wing
  ctx.save();
  ctx.scale(wingFlap, 1);
  ctx.beginPath();
  ctx.ellipse(s * 0.35, -s * 0.1, s * 0.4, s * 0.55, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.restore();

  // body
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.08, s * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(80,60,80,0.5)";
  ctx.fill();

  ctx.restore();
}

function drawSparkle(ctx, p, time) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);

  const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset) * 0.5 + 0.5;
  ctx.globalAlpha = p.opacity * twinkle;

  const s = p.size;
  const spikes = 4;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const r = i % 2 === 0 ? s : s * 0.3;
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = p.color;
  ctx.fill();

  // glow
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.6);
  glow.addColorStop(0, `rgba(255, 255, 230, ${0.3 * twinkle})`);
  glow.addColorStop(1, "rgba(255, 255, 230, 0)");
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.restore();
}

function drawHeart(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  const s = p.size * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.4);
  ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.4);
  ctx.fillStyle = p.color;
  ctx.fill();

  ctx.restore();
}

function drawFirefly(ctx, p, time) {
  ctx.save();
  ctx.globalAlpha = p.opacity;

  // trail
  const trail = p.trail;
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    const alpha = (i / trail.length) * 0.25 * p.opacity;
    ctx.beginPath();
    ctx.arc(t.x, t.y, p.size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
    ctx.fill();
  }

  // core glow
  const pulse = Math.sin(time * p.twinkleSpeed + p.twinkleOffset) * 0.3 + 0.7;
  const glowRadius = p.size * 3 * pulse;

  ctx.beginPath();
  ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
  const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
  glow.addColorStop(0, `rgba(255, 255, 220, ${0.4 * pulse * p.opacity})`);
  glow.addColorStop(0.4, `rgba(255, 255, 180, ${0.15 * pulse * p.opacity})`);
  glow.addColorStop(1, "rgba(255, 255, 180, 0)");
  ctx.fillStyle = glow;
  ctx.fill();

  // bright center
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();

  ctx.restore();
}

function drawBokeh(ctx, p) {
  ctx.save();
  ctx.globalAlpha = p.opacity * 0.35;

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
  grad.addColorStop(0, p.color);
  grad.addColorStop(0.5, p.color + "60");
  grad.addColorStop(1, p.color + "00");
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}

export default function FloatingElements() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: window.innerWidth, h: window.innerHeight });

  const initParticles = useCallback(() => {
    const { w, h } = sizeRef.current;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(w, h, false));
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    initParticles();

    function animate() {
      const { w, h } = sizeRef.current;
      timeRef.current++;
      const time = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // update position
        const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude * 0.02;
        p.x += p.speedX + sway;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // firefly trail
        if (p.type === "firefly") {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
        }

        // respawn if out of bounds
        if (p.y > h + p.size * 2 + 20 || p.x < -60 || p.x > w + 60) {
          const newP = createParticle(w, h, true);
          newP.x = Math.random() * w;
          Object.assign(p, newP);
          p.trail = [];
        }

        // draw by type
        switch (p.type) {
          case "cherryBlossom":
            drawCherryBlossom(ctx, p, time);
            break;
          case "rosePetal":
            drawRosePetal(ctx, p);
            break;
          case "butterfly":
            drawButterfly(ctx, p, time);
            break;
          case "sparkle":
            drawSparkle(ctx, p, time);
            break;
          case "heart":
            drawHeart(ctx, p);
            break;
          case "firefly":
            drawFirefly(ctx, p, time);
            break;
          case "bokeh":
            drawBokeh(ctx, p);
            break;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
      aria-hidden="true"
    />
  );
}
