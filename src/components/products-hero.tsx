"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { AnimatedHeadline, AnimatedLine } from "@/components/ui/animate";

const ease = [0.22, 1, 0.36, 1] as const;
// One full story loop, in seconds: empty pot → drop seed paper → rain →
// soil sprinkle → grow into flowers → hold → reset.
const CYCLE = 13;

// Seed-paper / flower positions on the soil (around centre 200,200).
// startRot = angle the paper tumbles in from; fall = per-paper stagger so they
// don't all land on the same frame.
const SPOTS = [
  { x: 158, y: 192, rot: -16, startRot: -140, fall: 0.0 },
  { x: 244, y: 178, rot: 18, startRot: 130, fall: 0.06 },
  { x: 176, y: 246, rot: 8, startRot: -95, fall: 0.12 },
  { x: 246, y: 244, rot: -10, startRot: 120, fall: 0.18 },
];

// Rain columns (x positions under the cloud).
const RAIN = [164, 182, 200, 218, 236];

const FLOWER_COLORS = [
  { petal: "#f0a93a", petalDark: "#d98213", core: "#7a3d10" }, // marigold
  { petal: "#e9892f", petalDark: "#c4671a", core: "#7a3d10" }, // orange
  { petal: "#f2c14e", petalDark: "#dba022", core: "#7a3d10" }, // yellow
  { petal: "#e8923a", petalDark: "#cf6f1d", core: "#7a3d10" }, // amber
];

function Flower({
  x,
  y,
  delay,
  c,
}: {
  x: number;
  y: number;
  delay: number;
  c: (typeof FLOWER_COLORS)[number];
}) {
  const outer = Array.from({ length: 10 }, (_, i) => (i * 360) / 10);
  const inner = Array.from({ length: 8 }, (_, i) => (i * 360) / 8 + 22);
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }}
      transition={{
        duration: CYCLE,
        repeat: Infinity,
        ease,
        times: [0, 0.58, 0.72, 0.93, 1],
        delay,
      }}
    >
      {/* soft cast shadow */}
      <ellipse cx={x} cy={y + 3} rx="26" ry="24" fill="#000" opacity="0.12" />
      {/* petals sway in a gentle breeze */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 3,
        }}
      >
        {/* outer petals */}
        {outer.map((deg) => (
          <ellipse
            key={`o${deg}`}
            cx={x}
            cy={y - 18}
            rx="7"
            ry="17"
            fill={c.petalDark}
            transform={`rotate(${deg} ${x} ${y})`}
          />
        ))}
        {/* inner petals */}
        {inner.map((deg) => (
          <ellipse
            key={`i${deg}`}
            cx={x}
            cy={y - 12}
            rx="6"
            ry="12"
            fill={c.petal}
            transform={`rotate(${deg} ${x} ${y})`}
          />
        ))}
        {/* core */}
        <circle cx={x} cy={y} r="9" fill={c.core} />
        <circle cx={x} cy={y} r="9" fill="url(#coreGrad)" />
      </motion.g>
    </motion.g>
  );
}

function PotStory() {
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full max-w-[400px]" role="img"
      aria-label="A top-down pot: seed paper is dropped in, rained on, covered with soil, and grows into flowers">
      <defs>
        <radialGradient id="soilGrad" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#6b4a30" />
          <stop offset="70%" stopColor="#4f3420" />
          <stop offset="100%" stopColor="#3c2718" />
        </radialGradient>
        <radialGradient id="potGrad" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#d98e63" />
          <stop offset="100%" stopColor="#b06a40" />
        </radialGradient>
        <radialGradient id="coreGrad" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#9a5418" />
          <stop offset="100%" stopColor="#5e2f0c" />
        </radialGradient>
        <radialGradient id="paperGrad" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#f7f3e8" />
          <stop offset="100%" stopColor="#e6ddc7" />
        </radialGradient>
        {/* gritty soil texture */}
        <filter id="soilTex" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix"
            values="0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0 0.07  0 0 0 0.6 0" />
        </filter>
        <filter id="cloudBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.18" />
        </filter>
        <clipPath id="soilClip">
          <circle cx="200" cy="200" r="150" />
        </clipPath>
      </defs>

      {/* Pot rim (top-down) */}
      <circle cx="200" cy="200" r="178" fill="url(#potGrad)" filter="url(#soft)" />
      <circle cx="200" cy="200" r="158" fill="#8a5230" />
      {/* Soil */}
      <circle cx="200" cy="200" r="150" fill="url(#soilGrad)" />
      <g clipPath="url(#soilClip)">
        <rect x="50" y="50" width="300" height="300" filter="url(#soilTex)" opacity="0.5" />
      </g>

      {/* Everything that happens inside the pot, clipped to the soil */}
      <g clipPath="url(#soilClip)">
        {/* Seed-paper pieces fall in under gravity, tumble, settle, then fade
            as flowers take over. Shadow on the soil tightens as each lands. */}
        {SPOTS.map((s, i) => (
          <g key={`paper${i}`}>
            {/* contact shadow — wide & faint while high, small & dark on impact */}
            <motion.ellipse
              cx={s.x}
              cy={s.y + 5}
              rx="16"
              ry="5"
              fill="#000"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0, 0.04, 0.22, 0.22, 0, 0],
                scale: [2, 2, 1.6, 1, 1, 1, 1],
              }}
              transition={{
                duration: CYCLE,
                repeat: Infinity,
                ease: "easeOut",
                times: [0, 0.06, 0.11, 0.17, 0.58, 0.66, 1],
                delay: s.fall,
              }}
            />
            {/* the paper: accelerates down (easeIn), overshoots, settles */}
            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 1, 1, 0, 0],
                y: [-130, -130, 7, 0, 0, 0, 0],
                rotate: [s.startRot, s.startRot, s.rot + 7, s.rot, s.rot, s.rot, s.rot],
              }}
              transition={{
                duration: CYCLE,
                repeat: Infinity,
                times: [0, 0.06, 0.15, 0.19, 0.58, 0.66, 1],
                ease: ["linear", "easeIn", "easeOut", "linear", "easeIn", "linear"],
                delay: s.fall,
              }}
            >
              <rect
                x={s.x - 15}
                y={s.y - 11}
                width="30"
                height="22"
                rx="3"
                fill="url(#paperGrad)"
                filter="url(#soft)"
              />
              {/* tiny seed specks on the paper */}
              <circle cx={s.x - 5} cy={s.y - 2} r="1.4" fill="#b9a77c" />
              <circle cx={s.x + 4} cy={s.y + 3} r="1.4" fill="#b9a77c" />
            </motion.g>
          </g>
        ))}

        {/* Light soil sprinkled over the papers */}
        {Array.from({ length: 26 }, (_, i) => {
          const ang = (i * 137.5 * Math.PI) / 180;
          const rad = 20 + (i % 6) * 18;
          // Round so server- and client-rendered strings match exactly (no hydration mismatch)
          const cx = Math.round((200 + Math.cos(ang) * rad) * 100) / 100;
          const cy = Math.round((200 + Math.sin(ang) * rad) * 100) / 100;
          return (
            <motion.circle
              key={`grain${i}`}
              cx={cx}
              cy={cy}
              r={1.6 + (i % 3) * 0.6}
              fill={i % 2 ? "#5a3c25" : "#6e4a2c"}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0], y: [-30, -30, 0, 0, 0] }}
              transition={{
                duration: CYCLE,
                repeat: Infinity,
                ease,
                times: [0, 0.48, 0.56, 0.92, 1],
                delay: (i % 8) * 0.02,
              }}
            />
          );
        })}

        {/* Flowers grow from each spot */}
        {SPOTS.map((s, i) => (
          <Flower key={`flower${i}`} x={s.x} y={s.y} delay={i * 0.1} c={FLOWER_COLORS[i]} />
        ))}
      </g>

      {/* Rain cloud — slides in, rains during the rain phase, slides out */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0, 0], x: [-60, -60, 0, 0, 70, 70] }}
        transition={{
          duration: CYCLE,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.28, 0.46, 0.54, 1],
        }}
      >
        {/* rain (only visible while the cloud is overhead) */}
        {RAIN.map((x, i) => (
          <g key={x}>
            {/* drop streak, falling faster as it drops */}
            <motion.line
              x1={x}
              x2={x - 3}
              y1={112}
              y2={126}
              stroke="#a9c8e2"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ y: [0, 78], opacity: [0, 0.85, 0.85, 0] }}
              transition={{
                duration: 0.85,
                repeat: Infinity,
                ease: "easeIn",
                delay: i * 0.14,
              }}
            />
            {/* splash ring where it hits the soil */}
            <motion.ellipse
              cx={x - 3}
              cy={190}
              rx="3"
              ry="1.4"
              fill="none"
              stroke="#a9c8e2"
              strokeWidth="1.4"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scale: [0, 2.6], opacity: [0, 0.55, 0] }}
              transition={{
                duration: 0.85,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.14 + 0.42,
              }}
            />
          </g>
        ))}
        {/* cloud drifts up and down a touch as it hovers */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <g filter="url(#cloudBlur)" fill="#ffffff">
            <circle cx="168" cy="92" r="22" />
            <circle cx="196" cy="78" r="30" />
            <circle cx="224" cy="86" r="24" />
            <circle cx="238" cy="98" r="17" />
            <rect x="166" y="92" width="74" height="24" rx="12" />
          </g>
          {/* shaded, rain-heavy underside */}
          <g fill="#d3dde5">
            <circle cx="180" cy="104" r="14" />
            <circle cx="204" cy="107" r="15" />
            <circle cx="226" cy="104" r="13" />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  );
}

export function ProductsHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f6f1e6] to-[#e9f0e6]">
      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <AnimatedLine>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Products
            </p>
          </AnimatedLine>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            <AnimatedHeadline text="Plantable packaging, your way" delay={0.1} />
          </h1>
          <AnimatedLine delay={0.5}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0">
              Tap <strong>Add to Quote</strong> on any product to build a list,
              then send it over for pricing, MOQ and lead time — everything is
              made-to-order and custom-printed with your brand.
            </p>
          </AnimatedLine>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.8 }}
          >
            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Request a quote
            </Link>
            <Link
              href="/estimator"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              <Calculator className="h-4 w-4" /> Estimate cost
            </Link>
            <Link
              href="/sample-kit"
              className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Order a sample kit
            </Link>
          </motion.div>
        </div>

        {/* Top-down pot story animation */}
        <div className="flex justify-center">
          <PotStory />
        </div>
      </div>
    </section>
  );
}
