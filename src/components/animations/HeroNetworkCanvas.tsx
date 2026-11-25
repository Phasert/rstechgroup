"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic hero scene (Canvas 2D — lighter than WebGL for this many simple shapes).
 * Sequence: drifting particles → central hub appears → signals travel outward →
 * devices connect one by one → idle pulses. The scene parallaxes with the cursor,
 * pauses when offscreen or the tab is hidden, and renders one static, fully
 * connected frame when the user prefers reduced motion.
 */

type Kind = "server" | "laptop" | "phone" | "ap" | "desktop" | "camera";
interface Node { x: number; y: number; kind: Kind; ring: number; at: number; depth: number }
interface Particle { x: number; y: number; vx: number; vy: number; r: number }

const BLUE = "22,113,217";
const SKY = "93,155,236";

export function HeroNetworkCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, start = performance.now();
    let nodes: Node[] = [];
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      const mobile = w < 640;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const kinds: Kind[] = ["laptop", "ap", "phone", "desktop", "server", "desktop", "laptop", "phone", "ap", "desktop"];
      const inner = mobile ? 4 : 5, outer = mobile ? 5 : 9;
      const R = Math.min(w, h) * (mobile ? 0.3 : 0.27);
      nodes = [];
      for (let i = 0; i < inner; i++) {
        const a = (i / inner) * Math.PI * 2 - Math.PI / 2;
        nodes.push({ x: Math.cos(a) * R, y: Math.sin(a) * R * 0.78, kind: kinds[i % kinds.length], ring: 1, at: 1.6 + i * 0.22, depth: 0.6 });
      }
      for (let i = 0; i < outer; i++) {
        const a = (i / outer) * Math.PI * 2 - Math.PI / 2 + 0.35;
        nodes.push({ x: Math.cos(a) * R * (mobile ? 1.5 : 1.85), y: Math.sin(a) * R * 1.35, kind: kinds[(i + 3) % kinds.length], ring: 2, at: 2.8 + i * 0.16, depth: 1 });
      }
      const count = mobile ? 40 : 90;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.4 + 0.3,
      }));
    };

    const parent = (n: Node) => {
      if (n.ring === 1) return null;
      // connect outer devices to their nearest inner access node
      let best: Node | null = null, d = Infinity;
      for (const m of nodes) if (m.ring === 1) {
        const dd = (m.x - n.x) ** 2 + (m.y - n.y) ** 2;
        if (dd < d) { d = dd; best = m; }
      }
      return best;
    };

    const drawDevice = (x: number, y: number, kind: Kind, on: number) => {
      const s = w < 640 ? 0.8 : 1;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      // halo
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 34);
      g.addColorStop(0, `rgba(${BLUE},${0.35 * on})`);
      g.addColorStop(1, `rgba(${BLUE},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
      // tile
      ctx.fillStyle = `rgba(11,26,62,0.92)`;
      ctx.strokeStyle = `rgba(${SKY},${0.25 + 0.75 * on})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      roundRect(ctx, -18, -18, 36, 36, 10); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.45 + 0.55 * on})`;
      ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      switch (kind) {
        case "laptop": roundRect(ctx, -9, -7, 18, 11, 1.5); ctx.moveTo(-12, 7); ctx.lineTo(12, 7); break;
        case "desktop": roundRect(ctx, -10, -8, 20, 13, 1.5); ctx.moveTo(0, 5); ctx.lineTo(0, 9); ctx.moveTo(-5, 9); ctx.lineTo(5, 9); break;
        case "phone": roundRect(ctx, -5.5, -9, 11, 18, 2.5); ctx.moveTo(-1.5, 6); ctx.lineTo(1.5, 6); break;
        case "server": roundRect(ctx, -9, -9, 18, 7, 1.5); roundRect(ctx, -9, 2, 18, 7, 1.5); break;
        case "camera": roundRect(ctx, -9, -5, 13, 9, 2); ctx.moveTo(4, -2); ctx.lineTo(10, -5); ctx.lineTo(10, 3); ctx.lineTo(4, 1); break;
        case "ap": ctx.arc(0, 4, 1.5, 0, Math.PI * 2); ctx.moveTo(-6, 0); ctx.quadraticCurveTo(0, -5, 6, 0); ctx.moveTo(-10, -4); ctx.quadraticCurveTo(0, -12, 10, -4); break;
      }
      ctx.stroke();
      // status dot
      if (on > 0.5) {
        ctx.fillStyle = `rgba(${SKY},${on})`;
        ctx.beginPath(); ctx.arc(14, -14, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      const t = reduce ? 99 : (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      const cx = w * (w < 1024 ? 0.5 : 0.68), cy = h * (w < 1024 ? 0.42 : 0.5);

      // particles
      const pIn = Math.min(1, t / 1.2);
      for (const p of particles) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(${SKY},${0.35 * pIn})`;
        ctx.beginPath(); ctx.arc(p.x - mouse.x * 6, p.y - mouse.y * 6, p.r, 0, Math.PI * 2); ctx.fill();
      }

      const pos = (n: Node) => ({ x: cx + n.x + mouse.x * 18 * n.depth, y: cy + n.y + mouse.y * 14 * n.depth });
      const hub = { x: cx + mouse.x * 8, y: cy + mouse.y * 6 };

      // links + travelling packets
      for (const n of nodes) {
        const from = parent(n);
        const a = from ? pos(from) : hub;
        const b = pos(n);
        const prog = clamp((t - (n.at - 0.6)) / 0.6);
        if (prog <= 0) continue;
        const ex = a.x + (b.x - a.x) * ease(prog), ey = a.y + (b.y - a.y) * ease(prog);
        ctx.strokeStyle = `rgba(${SKY},${n.ring === 1 ? 0.55 : 0.32})`;
        ctx.lineWidth = n.ring === 1 ? 1.6 : 1.1;
        ctx.setLineDash(n.ring === 2 ? [4, 5] : []);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.setLineDash([]);
        if (prog >= 1 && !reduce) {
          const speed = n.ring === 1 ? 0.55 : 0.4;
          const k = ((t * speed + n.at) % 1.6) / 1.6;
          if (k < 1) {
            const px = a.x + (b.x - a.x) * k, py = a.y + (b.y - a.y) * k;
            ctx.fillStyle = `rgba(255,255,255,0.95)`;
            ctx.shadowColor = `rgba(${BLUE},1)`; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // hub: signal rings + core
      const hubIn = clamp((t - 0.6) / 0.8);
      if (hubIn > 0) {
        for (let i = 0; i < 3; i++) {
          const k = reduce ? 0.5 : ((t * 0.45 + i / 3) % 1);
          ctx.strokeStyle = `rgba(${SKY},${(1 - k) * 0.45 * hubIn})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(hub.x, hub.y, 30 + k * 110, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.save();
        ctx.translate(hub.x, hub.y);
        ctx.scale(0.6 + 0.4 * ease(hubIn), 0.6 + 0.4 * ease(hubIn));
        ctx.globalAlpha = hubIn;
        const g = ctx.createLinearGradient(-30, -30, 30, 30);
        g.addColorStop(0, "#1671d9"); g.addColorStop(1, "#021d52");
        ctx.fillStyle = g;
        ctx.shadowColor = `rgba(${BLUE},0.8)`; ctx.shadowBlur = 40;
        ctx.beginPath();
        roundRect(ctx, -30, -30, 60, 60, 16); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = -1; i <= 1; i++) { roundRect(ctx, -16, i * 9 - 3.5, 32, 7, 2); }
        ctx.stroke();
        ctx.restore();
      }

      for (const n of nodes) {
        const on = clamp((t - n.at) / 0.4);
        const appear = clamp((t - (n.at - 0.9)) / 0.5);
        if (appear <= 0) continue;
        const p = pos(n);
        ctx.globalAlpha = appear;
        drawDevice(p.x, p.y, n.kind, on);
        ctx.globalAlpha = 1;
      }

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    });
    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    };

    build();
    const ro = new ResizeObserver(() => { build(); if (reduce) frame(performance.now()); });
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    start = performance.now();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}

function clamp(v: number) { return Math.max(0, Math.min(1, v)); }
function ease(v: number) { return 1 - Math.pow(1 - v, 3); }
function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
