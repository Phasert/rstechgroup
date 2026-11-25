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

const SHOULDER = { x: 560, y: 248 };
const L1 = 98; // upper arm
const L2 = 92; // forearm
const ANCHOR = { x: 884, y: 340 }; // cable manager the new lead runs into
const PORT_X = 742; // target patch-panel port (index 6)
const PORT = { x: PORT_X + 6, y: 201 };

// Hand keyframes per beat: [x[], y[], times[], duration]
const handPath: Record<number, { x: number[]; y: number[]; times?: number[]; duration: number }> = {
  0: { x: [612, 600, 590], y: [372, 366, 370], duration: 2.4 },
  1: { x: [590, 660, 712], y: [370, 300, 214], times: [0, 0.45, 1], duration: 1.8 },
  2: { x: [712, 690, 672, 704, 720], y: [214, 244, 236, 206, 201], times: [0, 0.25, 0.45, 0.78, 1], duration: 2.6 },
  3: { x: [720, 670, 650], y: [201, 262, 292], times: [0, 0.5, 1], duration: 1.4 },
};

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

  const upper = useRef<SVGPathElement>(null);
  const fore = useRef<SVGPathElement>(null);
  const hand = useRef<SVGGElement>(null);
  const cable = useRef<SVGPathElement>(null);
  const cableShadow = useRef<SVGPathElement>(null);

  // Write arm, hand and cable geometry whenever the hand or cable sag changes.
  useEffect(() => {
    const draw = () => {
      const x = hx.get(), y = hy.get(), sg = sag.get(), at = attach.get();
      const { ex, ey, angle } = solveArm(x, y);
      upper.current?.setAttribute("d", `M${SHOULDER.x} ${SHOULDER.y} L${ex.toFixed(1)} ${ey.toFixed(1)}`);
      fore.current?.setAttribute("d", `M${ex.toFixed(1)} ${ey.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`);
      hand.current?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(angle * 0.55).toFixed(1)})`);
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
            <clipPath id="insetClip"><circle cx="300" cy="138" r="104" /></clipPath>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>

          {/* Room */}
          <rect width="960" height="560" fill="#08163a" />
          <rect width="960" height="560" fill="url(#rackGlow)" />
          <rect y="476" width="960" height="84" fill="url(#floor)" />
          <line x1="0" x2="960" y1="476" y2="476" stroke="#1d3566" strokeWidth="2" />

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
            <rect x="40" y="384" width="270" height="12" rx="3" fill="#1d3566" />
            <rect x="60" y="396" width="10" height="80" fill="#162c58" />
            <rect x="280" y="396" width="10" height="80" fill="#162c58" />
            <rect x="236" y="400" width="40" height="72" rx="5" fill="#122a57" stroke="#2c4f8a" />
            <motion.circle cx="256" cy="414" r="3.5" animate={{ fill: online ? "#3ddc84" : "#c8323a" }} transition={instant} />
            <rect x="150" y="364" width="20" height="22" fill="#1d3566" />
            <rect x="120" y="380" width="80" height="6" rx="3" fill="#1d3566" />
            <rect x="66" y="246" width="188" height="122" rx="10" fill="#0e2350" stroke="#2c4f8a" strokeWidth="2" />
            <rect x="76" y="256" width="168" height="102" rx="5" fill="#0a1a3d" />
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
            <rect x="630" y="78" width="8" height="390" fill="#13295a" />
            <rect x="848" y="78" width="8" height="390" fill="#13295a" />
            {/* Switch */}
            <rect x="640" y="112" width="206" height="46" rx="4" fill="#132f63" stroke="#2c4f8a" />
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
            {[310, 352, 394].map((y) => <rect key={y} x="640" y={y} width="206" height="32" rx="4" fill="#0e2350" stroke="#1d3566" />)}
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

          {/* Technician (upper body, facing the rack) */}
          <g>
            {/* back arm */}
            <path d="M470 256 Q448 330 470 400" fill="none" stroke="#11509b" strokeWidth="30" strokeLinecap="round" />
            {/* torso */}
            <path d="M452 236 Q508 214 566 234 Q588 300 596 400 L604 560 L432 560 L440 400 Q438 300 452 236 Z" fill="url(#shirt)" />
            <path d="M488 222 L508 244 L526 222" fill="none" stroke="#0e3f7e" strokeWidth="5" strokeLinejoin="round" />
            {/* lanyard + ID */}
            <path d="M494 228 Q506 290 516 312 Q528 290 532 226" fill="none" stroke="#021d52" strokeWidth="4" />
            <rect x="503" y="310" width="28" height="36" rx="4" fill="white" />
            <rect x="508" y="316" width="18" height="8" rx="2" fill="#021d52" />
            <rect x="508" y="330" width="18" height="3" rx="1.5" fill="#9aa7bd" />
            <rect x="508" y="337" width="12" height="3" rx="1.5" fill="#9aa7bd" />
            {/* neck + head */}
            <rect x="496" y="196" width="24" height="30" rx="8" fill="#93593c" />
            <motion.g initial={false} animate={{ rotate: step === 0 ? -4 : step === 3 ? 6 : 10 }} transition={instant ?? { duration: 0.8 }} style={{ transformOrigin: "508px 200px", transformBox: "view-box" }}>
              <ellipse cx="510" cy="168" rx="32" ry="35" fill="#a5694a" />
              <ellipse cx="494" cy="172" rx="7" ry="10" fill="#93593c" />
              <path d="M478 156 Q480 126 512 124 Q544 124 546 152 L478 156 Z" fill="#021d52" />
              <path d="M538 150 Q560 150 572 158 L540 158 Z" fill="#021d52" />
              <text x="502" y="148" fill="white" fontSize="12" fontFamily="var(--font-display)" fontWeight="800" letterSpacing="1">RS</text>
              <circle cx="530" cy="172" r="2.6" fill="#1f1f1f" />
              <path d="M536 190 Q530 194 524 192" fill="none" stroke="#6e3f29" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            {/* front arm (IK) */}
            <path ref={upper} fill="none" stroke="#1671d9" strokeWidth="32" strokeLinecap="round" />
            <path ref={fore} fill="none" stroke="#a5694a" strokeWidth="21" strokeLinecap="round" />
            <text x="548" y="276" fill="white" fontSize="10" fontFamily="var(--font-display)" fontWeight="800" opacity="0.85">RS</text>
            {/* hand + held tool */}
            <g ref={hand}>
              {/* connector (beat 3) */}
              <motion.g initial={false} animate={{ opacity: step === 2 ? 1 : 0 }} transition={instant ?? { duration: 0.2, delay: step === 2 ? 0.75 : 0 }}>
                <rect x="14" y="-6" width="20" height="12" rx="2" fill="#dceafb" stroke="#5d9bec" />
                <path d="M30 -4 v8 M27 -4 v8 M24 -4 v8" stroke="#d9a441" strokeWidth="1.4" />
                <rect x="6" y="-5" width="10" height="10" rx="2" fill="#1671d9" />
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
              {/* hand */}
              <rect x="-10" y="-12" width="24" height="24" rx="10" fill="#a5694a" />
              <rect x="8" y="-11" width="14" height="9" rx="4.5" fill="#b77a59" />
              <rect x="8" y="-1" width="12" height="8" rx="4" fill="#b77a59" />
              <ellipse cx="4" cy="-13" rx="8" ry="5" fill="#93593c" transform="rotate(-20 4 -13)" />
            </g>
          </g>

          {/* Foreground tool trolley frames the technician's upper body */}
          <g>
            <rect x="372" y="432" width="250" height="16" rx="5" fill="#2c4f8a" />
            <rect x="384" y="448" width="226" height="112" fill="#13295a" />
            <rect x="396" y="462" width="202" height="34" rx="4" fill="#1d3566" />
            <rect x="396" y="504" width="202" height="34" rx="4" fill="#1d3566" />
            <rect x="476" y="474" width="42" height="8" rx="4" fill="#5d9bec" />
            <rect x="476" y="516" width="42" height="8" rx="4" fill="#5d9bec" />
            <circle cx="420" cy="420" r="16" fill="none" stroke="#1671d9" strokeWidth="6" />
            <circle cx="420" cy="420" r="6" fill="#1671d9" />
            <rect x="560" y="404" width="40" height="28" rx="4" fill="#1f1f1f" />
            <rect x="566" y="410" width="20" height="10" rx="2" fill="#5d9bec" opacity="0.6" />
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
                <rect x="244" y="96" width="62" height="26" rx="13" fill="#a5694a" />
                <rect x="250" y="160" width="58" height="24" rx="12" fill="#a5694a" />
                <rect x="206" y="104" width="56" height="72" rx="24" fill="#93593c" />
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
