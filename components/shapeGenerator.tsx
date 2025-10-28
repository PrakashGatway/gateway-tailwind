import React, { useMemo } from "react";

type Props = {
  size?: number;
  pointCount?: number;
  jitter?: number;
  radius?: number;
  stroke?: string | null;
  strokeWidth?: number;
  animate?: boolean;
  seed?: number | string;
  className?: string;
  backgroundImage?: string; // image inside shape
};

function createRng(seed?: number | string) {
  let h = 2166136261 >>> 0;
  if (seed !== undefined) {
    const s = String(seed);
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    }
  }
  return function rng() {
    h = Math.imul(h + 0x6D2B79F5, 1) >>> 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function catmullRom2bezier(points: { x: number; y: number }[]) {
  const size = points.length;
  if (size < 2) return "";
  const path: string[] = [];
  const get = (i: number) => points[(i + size) % size];
  const p0 = get(0);
  path.push(`M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`);

  for (let i = 0; i < size; i++) {
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);

    const b1x = p1.x + (p2.x - get(i - 1).x) / 1.8;
    const b1y = p1.y + (p2.y - get(i - 1).y) / 3;

    const b2x = p2.x - (p3.x - p1.x) / 1.8;
    const b2y = p2.y - (p3.y - p1.y) / 3;

    path.push(
      `C ${b1x.toFixed(2)} ${b1y.toFixed(2)}, ${b2x.toFixed(2)} ${b2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }

  path.push("Z");
  return path.join(" ");
}

export default function RandomBlob({
  size = 360,
  pointCount = 8,
  jitter = 0.4,
  radius = 120,
  stroke = null,
  strokeWidth = 2,
  animate = true,
  seed,
  className = "",
  backgroundImage,
}: Props) {
  const rng = useMemo(() => createRng(seed), [seed]);

  const { path } = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;

    const points: { x: number; y: number }[] = [];
    const step = (Math.PI * 2) / pointCount;

    for (let i = 0; i < pointCount; i++) {
      const angle = i * step;
      const r = radius * (1 - jitter / 2 + rng() * jitter);
      const p = polarToCartesian(cx, cy, r, angle);
      points.push(p);
    }

    const path = catmullRom2bezier(points);
    return { path };
  }, [size, pointCount, jitter, radius, rng]);

  const aniStyle = animate
    ? {
        transformOrigin: "50% 50%",
      }
    : {};

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={aniStyle as React.CSSProperties}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {backgroundImage && (
          <defs>
            <pattern id="imgPattern" patternUnits="userSpaceOnUse" width={size} height={size}>
              <image href={backgroundImage} x="0" y="0" width={size} height={size} preserveAspectRatio="xMidYMid slice" />
            </pattern>
          </defs>
        )}
        <path d={path} fill={backgroundImage ? "url(#imgPattern)" : "#ccc"} stroke={stroke || "none"} strokeWidth={strokeWidth} />
      </svg>
      <style>{`
          @keyframes blobFloat {
            0% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-8px) rotate(3deg) scale(1.03); }
            100% { transform: translateY(0px) rotate(0deg) scale(1); }
          }
        `}</style>
    </div>
  );
}
