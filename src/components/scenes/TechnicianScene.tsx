"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { useStepper } from "./useStepper";
import { DemoBadge, SceneControls } from "./SceneControls";
import { cn } from "@/lib/utils";

/**
 * Flagship networking scene: an RS technician restores a dropped workstation.
 * Four beats: drop → trace → swap (with connector close-up) → test & reconnect.
 *
 * The arm is a two-bone IK chain solved every frame from the hand position, and
 * the replacement cable is a cubic curve anchored at the hand, so the cable
 * flexes naturally as the technician moves. Rendering is imperative (one
 * motion-value subscription writes SVG attributes) so nothing re-renders at 60fps.
 */

const steps = [
  { title: "A workstation drops offline", body: "The desk computer loses its connection, and the matching port light on the rack switch goes dark." },
  { title: "Trace the connection", body: "The technician follows the run from the desk back to the rack and finds the damaged patch cable on that port." },
  { title: "Swap the cable", body: "The faulty lead is unplugged and a new patch cable is seated firmly until the connector clicks into place." },
  { title: "Test and reconnect", body: "A cable tester confirms the link, the port light returns, and the workstation is back online." },
];

const SHOULDER = { x: 574, y: 262 };
const L1 = 92; // upper arm
const L2 = 88; // forearm
const SKIN = "#a86a49";
const SKIN_SHADE = "#8b5535";
const SKIN_LIGHT = "#c08461";
const ANCHOR = { x: 884, y: 340 }; // cable manager the new lead runs into
const PORT_X = 742; // target patch-panel port (index 6)
const PORT = { x: PORT_X + 6, y: 201 };

// Hand keyframes per beat: [x[], y[], times[], duration]
const handPath: Record<number, { x: number[]; y: number[]; times?: number[]; duration: number }> = {
  // Beat 1: hand resting on the trolley, then a small lift as the screen drops.
  0: { x: [606, 606, 612], y: [420, 420, 408], times: [0, 0.6, 1], duration: 2.4 },
  1: { x: [612, 660, 700], y: [408, 312, 216], times: [0, 0.45, 1], duration: 1.8 },
  2: { x: [700, 684, 668, 698, 712], y: [216, 246, 238, 208, 201], times: [0, 0.25, 0.45, 0.78, 1], duration: 2.6 },
  3: { x: [712, 668, 652], y: [201, 262, 296], times: [0, 0.5, 1], duration: 1.4 },
};

type P = { x: number; y: number };
const f = (n: number) => n.toFixed(1);
/** Tapered limb segment from a (half-width wa) to b (half-width wb). */
function limb(a: P, b: P, wa: number, wb: number) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  return `M${f(a.x + nx * wa)} ${f(a.y + ny * wa)} L${f(b.x + nx * wb)} ${f(b.y + ny * wb)} L${f(b.x - nx * wb)} ${f(b.y - ny * wb)} L${f(a.x - nx * wa)} ${f(a.y - ny * wa)} Z`;
}
function normal(a: P, b: P) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function solveArm(hx: number, hy: number) {
  const dx = hx - SHOULDER.x, dy = hy - SHOULDER.y;
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1);
  const a = Math.atan2(dy, dx);
  const cos = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const alpha = Math.acos(Math.max(-1, Math.min(1, cos)));
  const ex = SHOULDER.x + L1 * Math.cos(a + alpha);
  const ey = SHOULDER.y + L1 * Math.sin(a + alpha);
  return { ex, ey, angle: (Math.atan2(hy - ey, hx - ex) * 180) / Math.PI };
}

export function TechnicianScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const s = useStepper(sceneRef, steps.length, { interval: [3400, 3200, 4200, 4600], reducedStart: 3 });
  const hx = useMotionValue(handPath[0].x[0]);
  const hy = useMotionValue(handPath[0].y[0]);
  const sag = useMotionValue(0);
  // 0 = cable end held in the hand, 1 = seated in the port (stays there while the hand moves on).
  const attach = useMotionValue(0);
  const lead = useRef<SVGPathElement>(null);

  const sleeve = useRef<SVGPathElement>(null);
  const hem = useRef<SVGPathElement>(null);
  const upperSkin = useRef<SVGPathElement>(null);
  const elbow = useRef<SVGCircleElement>(null);
  const fore = useRef<SVGPathElement>(null);
  const foreShade = useRef<SVGPathElement>(null);
  const hand = useRef<SVGGElement>(null);
  const cable = useRef<SVGPathElement>(null);
  const cableShadow = useRef<SVGPathElement>(null);

  // Write arm, hand and cable geometry whenever the hand or cable sag changes.
  useEffect(() => {
    const draw = () => {
      const x = hx.get(), y = hy.get(), sg = sag.get(), at = attach.get();
      const { ex, ey, angle } = solveArm(x, y);
      const E = { x: ex, y: ey }, H = { x, y };
      // Short polo sleeve covers ~55% of the upper arm; skin shows below the hem.
      const S = { x: SHOULDER.x + (ex - SHOULDER.x) * 0.55, y: SHOULDER.y + (ey - SHOULDER.y) * 0.55 };
      const n = normal(SHOULDER, E);
      upperSkin.current?.setAttribute("d", limb(S, E, 10.5, 9));
      sleeve.current?.setAttribute("d", limb(SHOULDER, S, 19, 15.5));
      hem.current?.setAttribute("d", `M${f(S.x + n.x * 15.5)} ${f(S.y + n.y * 15.5)} L${f(S.x - n.x * 15.5)} ${f(S.y - n.y * 15.5)}`);
      elbow.current?.setAttribute("cx", f(ex));
      elbow.current?.setAttribute("cy", f(ey));
      fore.current?.setAttribute("d", limb(E, H, 9, 6.8));
      const fn = normal(E, H);
      foreShade.current?.setAttribute("d", `M${f(ex + fn.x * 7)} ${f(ey + fn.y * 7)} L${f(x + fn.x * 5)} ${f(y + fn.y * 5)}`);
      hand.current?.setAttribute("transform", `translate(${f(x)} ${f(y)}) rotate(${f(angle * 0.6)})`);
      const sx = x + 4 + (PORT.x - 2 - (x + 4)) * at, sy = y + 8 + (PORT.y + 8 - (y + 8)) * at;
      const c = `M${sx.toFixed(1)} ${sy.toFixed(1)} C${(sx - 18).toFixed(1)} ${(sy + 110 + sg).toFixed(1)}, ${(820 + sg * 0.6).toFixed(1)} ${(300 - sg).toFixed(1)}, ${ANCHOR.x} ${ANCHOR.y}`;
      lead.current?.setAttribute("d", `M${(x + 30).toFixed(1)} ${(y - 74).toFixed(1)} C${(x + 40).toFixed(1)} ${(y - 130).toFixed(1)}, ${PORT.x - 30} ${PORT.y + 40}, ${PORT.x} ${PORT.y + 6}`);
      cable.current?.setAttribute("d", c);
      cableShadow.current?.setAttribute("d", c);
    };
    draw();
    const unsub = [hx.on("change", draw), hy.on("change", draw), sag.on("change", draw), attach.on("change", draw)];
    return () => unsub.forEach((u) => u());
  }, [hx, hy, sag, attach]);

  // Drive the hand through the current beat.
  useEffect(() => {
    const k = handPath[s.step];
    attach.set(s.step === 3 ? 1 : 0);
    if (s.reduce) {
      hx.set(k.x[k.x.length - 1]);
      hy.set(k.y[k.y.length - 1]);
      sag.set(0);
      return;
    }
    const opts = { duration: k.duration, times: k.times, ease: "easeInOut" as const };
    const a = animate(hx, k.x, opts);
    const b = animate(hy, k.y, opts);
    const c = animate(sag, s.step === 2 ? [0, 28, -16, 10, 0] : [0, 12, 0], { duration: k.duration, ease: "easeInOut" });
    return () => { a.stop(); b.stop(); c.stop(); };
  }, [s.step, s.run, s.reduce, hx, hy, sag, attach]);

  const step = s.step;
  const instant = s.reduce ? { duration: 0 } : undefined;
  const portLed = step === 3 ? "#3ddc84" : step === 2 ? "#f5b544" : "#1b2a4a";
  const online = step === 3;
  const key = `${step}-${s.run}`;

  return (
    <div ref={sceneRef}>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-navy-950 ring-1 ring-white/10">
        <div className="absolute bottom-3 left-3 z-10 sm:bottom-auto sm:left-4 sm:top-4"><DemoBadge dark>Illustrated scene</DemoBadge></div>
        <svg
          viewBox="0 0 960 560"
          preserveAspectRatio="xMidYMid slice"
          className={cn("block aspect-[4/3] w-full sm:aspect-[960/560]", !s.inView && "[&_*]:[animation-play-state:paused]")}
          role="img"
          aria-labelledby="tech-title tech-desc"
        >
          <title id="tech-title">RS technician replacing a faulty network cable</title>
          <desc id="tech-desc">{`Step ${step + 1} of 4: ${steps[step].title}. ${steps[step].body}`}</desc>
          <defs>
            <radialGradient id="rackGlow" cx="0.75" cy="0.35" r="0.6">
              <stop offset="0" stopColor="#1671d9" stopOpacity="0.32" />
              <stop offset="1" stopColor="#1671d9" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0b1a3e" />
              <stop offset="1" stopColor="#061231" />
            </linearGradient>
            <linearGradient id="shirt" x1="0" x2="1">
              <stop offset="0" stopColor="#1260b8" />
              <stop offset="1" stopColor="#1671d9" />
            </linearGradient>
            <radialGradient id="ceilingLight" cx="0.5" cy="0" r="0.7">
              <stop offset="0" stopColor="#5d9bec" stopOpacity="0.25" />
              <stop offset="1" stopColor="#5d9bec" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="reflect" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#2c4f8a" stopOpacity="0.35" />
              <stop offset="1" stopColor="#2c4f8a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="screenGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#12347a" />
              <stop offset="1" stopColor="#0a1a3d" />
            </linearGradient>
            <clipPath id="insetClip"><circle cx="300" cy="138" r="104" /></clipPath>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>

          {/* Room */}
          <rect width="960" height="560" fill="#08163a" />
          {/* wall panels + skirting */}
          {[120, 240, 360, 480, 600, 720, 840].map((x) => <line key={x} x1={x} x2={x} y1="0" y2="476" stroke="#0b1d47" strokeWidth="2" />)}
          <rect width="960" height="560" fill="url(#rackGlow)" />
          <rect x="380" y="0" width="200" height="6" rx="3" fill="#5d9bec" opacity="0.35" />
          <rect x="330" y="0" width="300" height="70" fill="url(#ceilingLight)" />
          {/* overhead cable tray feeding the rack */}
          <rect x="560" y="30" width="400" height="12" rx="2" fill="#13295a" stroke="#24406f" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${660 + i * 34} 42 C${660 + i * 34} 52, ${672 + i * 34} 58, ${672 + i * 34} 66`} fill="none" stroke={i % 2 ? "#3f8de6" : "#8aa4cc"} strokeWidth="3" opacity="0.8" />)}
          {[580, 640, 700, 760, 820, 880, 940].map((x) => <line key={x} x1={x} x2={x} y1="30" y2="42" stroke="#24406f" strokeWidth="1.5" />)}
          <rect y="468" width="960" height="8" fill="#0b1d47" />
          <rect y="476" width="960" height="84" fill="url(#floor)" />
          <line x1="0" x2="960" y1="476" y2="476" stroke="#1d3566" strokeWidth="2" />
          {/* floor tiles + rack reflection */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={i} x1={i * 120} y1="476" x2={i * 120 - 60} y2="560" stroke="#0e2350" strokeWidth="1.5" />)}
          <line x1="0" x2="960" y1="512" y2="512" stroke="#0e2350" strokeWidth="1.5" />
          <rect x="618" y="478" width="250" height="60" fill="url(#reflect)" />

          {/* Floor run from the desk to the rack */}
          <path id="run" d="M286 462 C420 506, 580 506, 700 488 L700 262 Q700 214 748 207" fill="none" stroke="#24406f" strokeWidth="5" strokeLinecap="round" />
          {step === 1 && (
            <motion.path
              key={`trace-${key}`}
              d="M286 462 C420 506, 580 506, 700 488 L700 262 Q700 214 748 207"
              fill="none"
              stroke="#f5b544"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="10 9"
              initial={{ pathLength: s.reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={instant ?? { duration: 1.6, ease: "easeInOut" }}
            />
          )}
          {online && !s.reduce && [0, 0.7, 1.4].map((d) => (
            <circle key={`pk-${d}-${s.run}`} r="5" fill="#9fd0ff" filter="url(#glow)">
              <animateMotion dur="2.1s" begin={`${d}s`} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#run" />
              </animateMotion>
            </circle>
          ))}

          {/* Workstation */}
          <g>
            {/* wall data outlet + office chair back */}
            <rect x="318" y="430" width="22" height="28" rx="3" fill="#13295a" stroke="#2c4f8a" />
            <rect x="324" y="438" width="10" height="8" rx="1" fill="#061231" />
            <path d="M300 468 C304 440 318 446 329 446" fill="none" stroke="#24406f" strokeWidth="3" />
            <path d="M110 476 L110 430 C110 404 126 396 150 396 C174 396 190 404 190 430 L190 476" fill="#102552" opacity="0.9" />
            {/* desk */}
            <rect x="40" y="384" width="270" height="12" rx="3" fill="#1d3566" />
            <rect x="40" y="384" width="270" height="3" rx="1.5" fill="#2c4f8a" />
            <rect x="60" y="396" width="10" height="80" fill="#162c58" />
            <rect x="280" y="396" width="10" height="80" fill="#162c58" />
            {/* PC tower with vents */}
            <rect x="236" y="400" width="40" height="72" rx="5" fill="#122a57" stroke="#2c4f8a" />
            {[430, 438, 446, 454].map((y) => <line key={y} x1="244" x2="268" y1={y} y2={y} stroke="#0b1d47" strokeWidth="2" />)}
            <motion.circle cx="256" cy="414" r="3.5" animate={{ fill: online ? "#3ddc84" : "#c8323a" }} transition={instant} />
            {/* keyboard, mouse, mug, notepad */}
            <rect x="108" y="376" width="96" height="8" rx="2" fill="#24406f" />
            {Array.from({ length: 10 }, (_, i) => <rect key={i} x={112 + i * 9} y="378" width="6" height="2" rx="0.5" fill="#3f5f96" />)}
            <ellipse cx="222" cy="380" rx="7" ry="4" fill="#24406f" />
            <rect x="52" y="364" width="16" height="20" rx="3" fill="#dceafb" />
            <path d="M68 368 C76 368 76 380 68 380" fill="none" stroke="#dceafb" strokeWidth="3" />
            <rect x="276" y="374" width="26" height="10" rx="1" fill="#f3f5f7" transform="rotate(-6 289 379)" />
            {/* monitor */}
            <rect x="150" y="364" width="20" height="16" fill="#1d3566" />
            <rect x="126" y="378" width="68" height="5" rx="2.5" fill="#1d3566" />
            <rect x="66" y="246" width="188" height="122" rx="10" fill="#0e2350" stroke="#2c4f8a" strokeWidth="2" />
            <rect x="76" y="256" width="168" height="102" rx="5" fill="url(#screenGlow)" />
            <circle cx="160" cy="363" r="1.5" fill="#3f5f96" />
            {/* Online screen */}
            <motion.g key={`scr-on-${key}`} initial={{ opacity: s.reduce ? (online ? 1 : 0) : step === 0 ? 1 : 0 }} animate={{ opacity: online ? 1 : 0 }} transition={instant ?? { duration: 0.35, delay: online ? 1.5 : step === 0 ? 0.9 : 0 }}>
              <rect x="90" y="270" width="80" height="8" rx="4" fill="#24406f" />
              <rect x="90" y="286" width="120" height="6" rx="3" fill="#1d3566" />
              <rect x="90" y="298" width="100" height="6" rx="3" fill="#1d3566" />
              <circle cx="214" cy="334" r="13" fill="#1f9d6b" />
              <path d="M207 334 l5 5 l9 -10" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <text x="90" y="340" fill="#9fe3c0" fontSize="13" fontFamily="var(--font-display)" fontWeight="700">Connected</text>
            </motion.g>
            {/* Offline screen */}
            <motion.g key={`scr-off-${key}`} initial={{ opacity: s.reduce ? (online ? 0 : 1) : step === 0 ? 0 : 1 }} animate={{ opacity: online ? 0 : 1 }} transition={instant ?? { duration: 0.35, delay: online ? 1.2 : step === 0 ? 1.1 : 0 }}>
              <circle cx="160" cy="294" r="20" fill="none" stroke="#f5b544" strokeWidth="3" />
              <path d="M160 283 v13 M160 302 v1" stroke="#f5b544" strokeWidth="3.5" strokeLinecap="round" />
              <text x="160" y="338" textAnchor="middle" fill="#ffd79a" fontSize="14" fontFamily="var(--font-display)" fontWeight="700">No network</text>
            </motion.g>
          </g>

          {/* Rack */}
          <g>
            <rect x="618" y="66" width="250" height="410" rx="8" fill="#0b1a3e" stroke="#2c4f8a" strokeWidth="2" />
            <rect x="618" y="66" width="250" height="14" rx="6" fill="#13295a" />
            {[640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840].map((x) => <line key={x} x1={x} x2={x} y1="70" y2="76" stroke="#0b1a3e" strokeWidth="3" />)}
            <rect x="630" y="78" width="8" height="390" fill="#13295a" />
            <rect x="848" y="78" width="8" height="390" fill="#13295a" />
            {Array.from({ length: 19 }, (_, i) => (
              <g key={`scr-${i}`}>
                <circle cx="634" cy={90 + i * 20} r="1.6" fill="#3f5f96" />
                <circle cx="852" cy={90 + i * 20} r="1.6" fill="#3f5f96" />
              </g>
            ))}
            <rect x="628" y="476" width="14" height="8" rx="2" fill="#13295a" />
            <rect x="844" y="476" width="14" height="8" rx="2" fill="#13295a" />
            {/* Switch */}
            <rect x="640" y="112" width="206" height="46" rx="4" fill="#132f63" stroke="#2c4f8a" />
            <rect x="646" y="148" width="40" height="5" rx="2" fill="#24406f" />
            <circle cx="836" cy="120" r="2.5" fill="#5d9bec" />
            {Array.from({ length: 12 }, (_, i) => (
              <g key={`sw-${i}`}>
                <rect x={642 + i * 17} y={136} width="12" height="10" rx="1.5" fill="#061231" />
                {i === 6 ? (
                  <motion.circle cx={648 + i * 17} cy="126" r="3.6" initial={false} animate={{ fill: portLed }} transition={instant ?? { duration: 0.4, delay: step === 0 ? 0.9 : step === 3 ? 1.5 : 1.9 }} />
                ) : (
                  <circle cx={648 + i * 17} cy="126" r="3.4" fill="#3ddc84" className={s.reduce ? undefined : "animate-[led_1.4s_steps(2)_infinite]"} style={{ animationDelay: `${(i * 0.37) % 1.3}s` }} />
                )}
              </g>
            ))}
            {/* Patch panel */}
            <rect x="640" y="182" width="206" height="38" rx="4" fill="#102552" stroke="#2c4f8a" />
            <rect x="642" y="185" width="202" height="7" rx="1" fill="#dceafb" opacity="0.12" />
            {Array.from({ length: 12 }, (_, i) => (
              <text key={`lbl-${i}`} x={648 + i * 17} y="191" textAnchor="middle" fontSize="5.5" fontFamily="var(--font-display)" fontWeight="700" fill={i === 6 && step >= 1 && step < 3 ? "#f5b544" : "#8aa4cc"}>{String(i + 1).padStart(2, "0")}</text>
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={`pp-${i}`} x={642 + i * 17} y={195} width="12" height="11" rx="1.5" fill="#061231" stroke={i === 6 && step === 1 ? "#f5b544" : "#24406f"} strokeWidth={i === 6 && step === 1 ? 2 : 1} />
            ))}
            {step === 1 && !s.reduce && (
              <motion.circle key={`ring-${key}`} cx={PORT.x} cy={PORT.y} r="10" fill="none" stroke="#f5b544" strokeWidth="2" initial={{ r: 8, opacity: 0.9 }} animate={{ r: 26, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity, delay: 1.4 }} />
            )}
            {/* Other patch leads */}
            {Array.from({ length: 12 }, (_, i) => i).filter((i) => i !== 6).map((i) => (
              <path key={`lead-${i}`} d={`M${648 + i * 17} 206 C${648 + i * 17} 262, 846 ${256 + i * 2}, 880 ${318 + i * 4}`} fill="none" stroke={i % 3 === 0 ? "#5d9bec" : i % 3 === 1 ? "#3f8de6" : "#8aa4cc"} strokeWidth="3" opacity="0.8" />
            ))}
            {/* Router / firewall */}
            <rect x="640" y="246" width="206" height="40" rx="4" fill="#132f63" stroke="#2c4f8a" />
            <circle cx="660" cy="266" r="4" fill="#5d9bec" />
            <rect x="676" y="262" width="80" height="8" rx="4" fill="#1d3566" />
            {/* Cable manager + lower units */}
            <rect x="870" y="250" width="22" height="200" rx="6" fill="#0e2350" stroke="#2c4f8a" />
            {[310, 352, 394].map((y, k) => (
              <g key={y}>
                <rect x="640" y={y} width="206" height="32" rx="4" fill="#0e2350" stroke="#1d3566" />
                {Array.from({ length: 14 }, (_, i) => <rect key={i} x={700 + i * 9} y={y + 10} width="4" height="12" rx="1" fill="#0b1a3e" />)}
                <circle cx="654" cy={y + 16} r="3" fill={k === 0 ? "#3ddc84" : "#5d9bec"} opacity="0.85" />
              </g>
            ))}
            <rect x="640" y="436" width="206" height="30" rx="4" fill="#0e2350" stroke="#1d3566" />
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x={656 + i * 30} y="444" width="16" height="14" rx="2" fill="#061231" stroke="#24406f" />)}
          </g>

          {/* Old (faulty) cable */}
          <motion.path
            key={`old-${key}`}
            d={`M${PORT.x} 207 C${PORT.x - 6} 252, 836 ${262}, ${ANCHOR.x} ${ANCHOR.y - 8}`}
            fill="none"
            stroke={step === 1 ? "#f5b544" : "#a9583f"}
            strokeWidth="4"
            strokeDasharray={step <= 1 ? "16 3 6 3" : undefined}
            initial={{ opacity: s.reduce ? (step >= 2 ? 0 : 1) : step === 3 ? 0 : 1, y: 0 }}
            animate={step >= 2 ? { opacity: 0, y: 70 } : { opacity: 1, y: 0 }}
            transition={instant ?? { duration: 0.9, delay: step === 2 ? 0.35 : 0, ease: "easeIn" }}
          />
          {/* Seated connector once the new lead is in */}
          {step === 3 && <rect x={PORT.x - 7} y={PORT.y - 4} width="14" height="14" rx="2" fill="#1671d9" stroke="#5d9bec" />}
          {step === 1 && <path d={`M${PORT.x} 207 C${PORT.x - 6} 252, 836 262, ${ANCHOR.x} ${ANCHOR.y - 8}`} fill="none" stroke="#f5b544" strokeWidth="10" opacity="0.25" filter="url(#glow)" />}

          {/* New cable (follows the hand) */}
          <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={instant ?? { duration: 0.3, delay: step === 2 ? 0.7 : 0 }}>
            <path ref={cableShadow} fill="none" stroke="#020a1f" strokeWidth="8" opacity="0.35" />
            <path ref={cable} fill="none" stroke="#1671d9" strokeWidth="5" strokeLinecap="round" />
          </motion.g>
          {/* Tester lead clipped onto the new cable */}
          <motion.path ref={lead} fill="none" stroke="#f5b544" strokeWidth="2.5" strokeDasharray="1 0" initial={false} animate={{ opacity: step === 3 ? 0.9 : 0 }} transition={instant ?? { duration: 0.3, delay: step === 3 ? 0.9 : 0 }} />

          {/* Technician: upper body in three-quarter view, facing the rack */}
          <g>
            {/* Far (left) arm, in shadow, resting on the trolley */}
            <path d={limb({ x: 478, y: 268 }, { x: 466, y: 316 }, 17, 14)} fill="#0f4c95" />
            <path d={limb({ x: 466, y: 316 }, { x: 462, y: 356 }, 9.5, 8.5)} fill={SKIN_SHADE} />
            <circle cx="462" cy="356" r="8.5" fill={SKIN_SHADE} />
            <path d={limb({ x: 462, y: 356 }, { x: 492, y: 424 }, 8.5, 6.5)} fill={SKIN_SHADE} />
            <ellipse cx="498" cy="428" rx="12" ry="7" fill={SKIN_SHADE} />

            {/* Torso: polo shirt */}
            <path d="M502 228 C480 230 464 242 458 264 C450 300 448 360 450 448 L604 448 C602 390 600 330 594 292 C590 272 584 258 574 248 C562 238 548 230 534 228 Z" fill="url(#shirt)" />
            {/* back panel in shadow + side seam */}
            <path d="M502 228 C480 230 464 242 458 264 C450 300 448 360 450 448 L500 448 C496 380 494 320 498 268 C500 250 504 238 512 230 Z" fill="#0f4c95" opacity="0.85" />
            <path d="M568 296 C574 340 580 400 584 448" fill="none" stroke="#0e4f9e" strokeWidth="2" />
            <path d="M462 330 C478 340 488 360 494 380" fill="none" stroke="#0d468a" strokeWidth="2" opacity="0.6" />
            {/* neck */}
            <path d="M514 198 L540 198 L544 234 C536 240 518 240 510 234 Z" fill={SKIN_SHADE} />
            <path d="M532 204 L542 204 L544 232 L534 234 Z" fill={SKIN} />
            {/* collar, placket, buttons */}
            <path d="M506 230 C514 224 538 222 548 230 L540 238 C530 232 518 233 512 238 Z" fill="#2a82e6" />
            <path d="M512 238 L520 258 L530 236 Z" fill="#2a82e6" stroke="#0e4f9e" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M530 236 L548 254 L548 232 Z" fill="#2a82e6" stroke="#0e4f9e" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M531 240 L536 298" stroke="#0e4f9e" strokeWidth="2" />
            <circle cx="533" cy="262" r="2" fill="#dceafb" />
            <circle cx="535" cy="282" r="2" fill="#dceafb" />
            {/* embroidered chest logo */}
            <rect x="550" y="282" width="26" height="16" rx="3" fill="#021d52" />
            <text x="563" y="294" textAnchor="middle" fill="white" fontSize="10" fontFamily="var(--font-display)" fontWeight="800">RS</text>
            {/* lanyard + ID badge */}
            <path d="M516 238 C520 280 526 312 532 336" fill="none" stroke="#021d52" strokeWidth="3.5" />
            <path d="M546 236 C544 280 540 312 536 336" fill="none" stroke="#021d52" strokeWidth="3.5" />
            <rect x="531" y="334" width="6" height="8" rx="1" fill="#9aa7bd" />
            <g transform="rotate(-4 534 362)">
              <rect x="520" y="340" width="30" height="40" rx="4" fill="white" />
              <rect x="525" y="346" width="20" height="9" rx="2" fill="#021d52" />
              <circle cx="535" cy="364" r="5" fill="#dceafb" />
              <rect x="525" y="372" width="20" height="3" rx="1.5" fill="#9aa7bd" />
            </g>

            {/* Head (turns slightly with the task) */}
            <motion.g initial={false} animate={{ rotate: step === 0 ? -4 : step === 3 ? 5 : 9 }} transition={instant ?? { duration: 0.8 }} style={{ transformOrigin: "524px 206px", transformBox: "view-box" }}>
              {/* head + profile (nose, lips, chin) */}
              <path d="M490 152 C488 130 506 118 524 119 C543 120 553 136 551 154 L557 170 C559 174 557 176 553 177 L552 181 C554 183 553 186 550 187 L550 191 C548 200 540 205 530 205 L520 205 C504 203 495 194 492 182 C487 174 487 162 490 152 Z" fill={SKIN} />
              {/* jaw + cheek shading */}
              <path d="M494 182 C498 196 508 204 522 205 C510 198 504 190 502 176 Z" fill={SKIN_SHADE} opacity="0.7" />
              <path d="M540 164 C544 172 544 178 540 182" fill="none" stroke={SKIN_SHADE} strokeWidth="1.5" opacity="0.7" />
              {/* hair under the cap */}
              <path d="M489 150 C486 166 488 178 494 186 L500 184 C496 172 495 160 498 150 Z" fill="#1a1410" />
              <path d="M509 150 L511 168 L515 168 L514 150 Z" fill="#1a1410" />
              {/* ear */}
              <ellipse cx="503" cy="168" rx="6.5" ry="9.5" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1.5" />
              <path d="M503 163 C506 166 506 171 503 174" fill="none" stroke={SKIN_SHADE} strokeWidth="1.5" />
              {/* eye, brow, mouth */}
              <path d="M533 160 C536 157 541 157 543 160 C540 162 536 162 533 160 Z" fill="white" />
              <circle cx="539.5" cy="159.8" r="2.2" fill="#1f1f1f" />
              <path d="M531 152 C535 149 541 149 545 151" fill="none" stroke="#1a1410" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M541 190 C545 191 548 190 550 188" fill="none" stroke="#6e3f29" strokeWidth="2" strokeLinecap="round" />
              <path d="M544 177 C548 178 552 177 553 177" fill="none" stroke={SKIN_SHADE} strokeWidth="1.2" />
              {/* cap: crown, panels, button, logo, brim */}
              <path d="M487 152 C485 124 506 110 527 111 C547 112 557 128 555 146 C536 144 510 147 487 156 Z" fill="#021d52" />
              <path d="M520 112 C514 124 512 138 514 148" fill="none" stroke="#12347a" strokeWidth="1.5" />
              <path d="M538 114 C540 126 540 136 538 146" fill="none" stroke="#12347a" strokeWidth="1.5" />
              <circle cx="527" cy="111" r="2.5" fill="#12347a" />
              <text x="526" y="138" textAnchor="middle" fill="white" fontSize="11" fontFamily="var(--font-display)" fontWeight="800" letterSpacing="0.5">RS</text>
              <path d="M548 141 C566 139 582 143 592 150 C580 155 562 154 548 150 Z" fill="#03163d" />
              <path d="M548 141 C566 139 582 143 592 150" fill="none" stroke="#1d3566" strokeWidth="1.5" />
              <path d="M487 152 C510 145 534 142 555 146" fill="none" stroke="#0a2559" strokeWidth="3" />
            </motion.g>

            {/* Near (right) arm, driven by the IK rig */}
            <circle cx={SHOULDER.x} cy={SHOULDER.y} r="19" fill="#1671d9" />
            <path ref={upperSkin} fill={SKIN} />
            <circle ref={elbow} r="9" fill={SKIN} />
            <path ref={fore} fill={SKIN} />
            <path ref={foreShade} fill="none" stroke={SKIN_SHADE} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <path ref={sleeve} fill="#1671d9" />
            <path ref={hem} fill="none" stroke="#0e4f9e" strokeWidth="3.5" strokeLinecap="round" />
            {/* hand + held tool (local space: wrist at 0,0, fingers toward +x) */}
            <g ref={hand}>
              {/* connector (beat 3): boot + body + gold contacts, gripped by the fingers */}
              <motion.g initial={false} animate={{ opacity: step === 2 ? 1 : 0 }} transition={instant ?? { duration: 0.2, delay: step === 2 ? 0.75 : 0 }}>
                <rect x="12" y="-5.5" width="12" height="11" rx="2.5" fill="#1671d9" />
                <rect x="22" y="-6" width="18" height="12" rx="1.5" fill="#dceafb" stroke="#5d9bec" />
                <path d="M36 -4 v8 M33 -4 v8 M30 -4 v8" stroke="#d9a441" strokeWidth="1.3" />
                <path d="M24 -6 L34 -9 L35 -7 L26 -5 Z" fill="#b8d3f5" />
              </motion.g>
              {/* tester (beat 4) */}
              <motion.g initial={false} animate={{ opacity: step === 3 ? 1 : 0, y: step === 3 ? 0 : 10 }} transition={instant ?? { duration: 0.4, delay: step === 3 ? 0.6 : 0 }}>
                <rect x="-4" y="-80" width="56" height="76" rx="9" fill="#f5b544" />
                <rect x="2" y="-74" width="44" height="34" rx="4" fill="#0f2a1f" />
                <motion.text key={`tst0-${key}`} x="24" y="-58" textAnchor="middle" fontSize="9" fontFamily="var(--font-display)" fontWeight="800" fill="#9aa7bd" initial={{ opacity: s.reduce ? 0 : 1 }} animate={{ opacity: 0 }} transition={instant ?? { delay: 1.6, duration: 0.2 }}>TESTING</motion.text>
                <motion.text key={`tst-${key}`} x="24" y="-58" textAnchor="middle" fontSize="10" fontFamily="var(--font-display)" fontWeight="800" fill="#3ddc84" initial={{ opacity: s.reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={instant ?? { delay: 1.7 }}>LINK OK</motion.text>
                <motion.text key={`tst2-${key}`} x="24" y="-46" textAnchor="middle" fontSize="8" fontFamily="var(--font-display)" fontWeight="700" fill="#3ddc84" initial={{ opacity: s.reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={instant ?? { delay: 1.7 }}>8/8 wires</motion.text>
                <circle cx="14" cy="-24" r="4" fill="#1f1f1f" />
                <circle cx="34" cy="-24" r="4" fill="#1f1f1f" />
              </motion.g>
              {/* hand: wrist, palm, four curled fingers, thumb */}
              <path d="M-4 -7.5 L4 -9 L4 9 L-4 7.5 Z" fill={SKIN} />
              <path d="M2 -10 C10 -12 17 -11 20 -8 L21 8 C15 11 8 11 2 10 Z" fill={SKIN} />
              <path d="M2 4 C8 8 15 9 21 7 L21 8 C15 11 8 11 2 10 Z" fill={SKIN_SHADE} opacity="0.7" />
              {[-9, -4.6, -0.2, 4.2].map((fy, i) => (
                <rect key={fy} x="17" y={fy} width={i === 3 ? 9 : 11} height="4.4" rx="2.2" fill={i % 2 ? SKIN_SHADE : SKIN_LIGHT} />
              ))}
              <path d="M17.5 -8.5 v16" stroke={SKIN_SHADE} strokeWidth="1" opacity="0.6" />
              <path d="M3 -8 C9 -16 18 -16 24 -12 C25 -10 24 -8.5 21 -8.5 C15 -10 10 -8 7 -4 Z" fill={SKIN_LIGHT} />
              <path d="M21 -12.5 C22.5 -12 23.5 -11 23.5 -10" fill="none" stroke="#e8c3a8" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>

          {/* Foreground tool trolley frames the technician's upper body */}
          <g>
            {/* tools on top: laptop with port map, cable spool, crimper, label printer */}
            <path d="M386 432 L392 392 L456 392 L452 432 Z" fill="#132f63" stroke="#2c4f8a" />
            <path d="M397 398 L451 398 L448 426 L394 426 Z" fill="#0a1a3d" />
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x={403 + i * 7} y="404" width="5" height="5" rx="1" fill={i === 3 ? (step === 3 ? "#3ddc84" : "#f5b544") : "#24406f"} />)}
            <text x="404" y="420" fill="#9aa7bd" fontSize="6" fontFamily="var(--font-display)" fontWeight="700">PORT 07</text>
            <circle cx="588" cy="418" r="15" fill="none" stroke="#1671d9" strokeWidth="6" />
            <circle cx="588" cy="418" r="5" fill="#0e4f9e" />
            <path d="M588 403 C600 396 610 404 606 414" fill="none" stroke="#1671d9" strokeWidth="3" />
            <path d="M520 428 L548 420 L552 424 L524 432 Z" fill="#9aa7bd" />
            <path d="M546 420 L560 414 L563 418 L550 424 Z" fill="#c8323a" />
            {/* top + body */}
            <rect x="372" y="432" width="250" height="14" rx="5" fill="#2c4f8a" />
            <rect x="372" y="432" width="250" height="3" rx="1.5" fill="#5d9bec" opacity="0.5" />
            <path d="M362 438 C352 438 352 470 362 470" fill="none" stroke="#5d9bec" strokeWidth="5" strokeLinecap="round" />
            <rect x="384" y="446" width="226" height="114" fill="#13295a" />
            {[460, 500].map((y, i) => (
              <g key={y}>
                <rect x="396" y={y} width="202" height="34" rx="4" fill="#1d3566" stroke="#24406f" />
                <rect x="476" y={y + 12} width="42" height="8" rx="4" fill="#5d9bec" />
                <rect x="408" y={y + 10} width="30" height="12" rx="2" fill="#0e2350" />
                <text x="423" y={y + 19} textAnchor="middle" fill="#9aa7bd" fontSize="7" fontFamily="var(--font-display)" fontWeight="700">{i ? "TOOLS" : "CABLES"}</text>
              </g>
            ))}
            <rect x="396" y="540" width="202" height="20" rx="4" fill="#1d3566" stroke="#24406f" />
          </g>

          {/* Close-up inset: hand seats the connector */}
          <motion.g initial={false} animate={{ opacity: step === 2 ? 1 : 0, scale: step === 2 ? 1 : 0.85 }} transition={instant ?? { duration: 0.45, delay: step === 2 ? 0.4 : 0 }} style={{ transformOrigin: "300px 138px", transformBox: "view-box" }} aria-hidden>
            <circle cx="300" cy="138" r="108" fill="#5d9bec" opacity="0.25" />
            <g clipPath="url(#insetClip)">
              <rect x="190" y="30" width="220" height="220" fill="#0e2350" />
              {/* port housing */}
              <rect x="318" y="88" width="96" height="104" rx="8" fill="#132f63" stroke="#2c4f8a" strokeWidth="3" />
              <rect x="334" y="112" width="70" height="56" rx="4" fill="#020a1f" />
              <motion.circle key={`iled-${key}`} cx="398" cy="100" r="6" initial={{ fill: "#1b2a4a" }} animate={{ fill: s.reduce ? "#f5b544" : ["#1b2a4a", "#1b2a4a", "#f5b544"] }} transition={instant ?? { duration: 2.4, times: [0, 0.85, 1] }} />
              {/* connector + fingers sliding in */}
              <motion.g key={`plug-${key}`} initial={{ x: s.reduce ? 0 : -96 }} animate={{ x: s.reduce ? 0 : [-96, -96, -30, 0, -2, 0] }} transition={instant ?? { duration: 2.4, times: [0, 0.3, 0.65, 0.82, 0.88, 0.94] }}>
                <path d="M150 162 C190 150, 230 170, 262 150" fill="none" stroke="#1671d9" strokeWidth="16" strokeLinecap="round" />
                <rect x="252" y="124" width="40" height="38" rx="6" fill="#1671d9" />
                <rect x="288" y="118" width="62" height="44" rx="4" fill="#dceafb" stroke="#5d9bec" strokeWidth="2" />
                {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={340} y={123 + i * 6} width="8" height="3" fill="#d9a441" />)}
                <path d="M300 118 L338 106 L340 112 L304 122 Z" fill="#b8d3f5" />
                {/* fingers */}
                <rect x="244" y="96" width="62" height="26" rx="13" fill={SKIN} />
                <rect x="250" y="160" width="58" height="24" rx="12" fill={SKIN} />
                <rect x="206" y="104" width="56" height="72" rx="24" fill={SKIN_SHADE} />
              </motion.g>
              {!s.reduce && (
                <motion.text key={`click-${key}`} x="300" y="226" textAnchor="middle" fill="#ffd79a" fontSize="16" fontFamily="var(--font-display)" fontWeight="800" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 2.6, times: [0, 0.8, 0.88, 1] }}>click</motion.text>
              )}
            </g>
            <circle cx="300" cy="138" r="104" fill="none" stroke="#5d9bec" strokeWidth="3" />
            <line x1="384" y1="200" x2="716" y2="202" stroke="#5d9bec" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          </motion.g>
        </svg>
      </div>
      <SceneControls s={s} steps={steps} dark label="Cable repair scene" className="mt-6" />
    </div>
  );
}
