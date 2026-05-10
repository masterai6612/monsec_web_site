/* global React */
const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   ICONS — minimal line set
   ============================================================ */
const Icon = ({ name, ...p }) => {
  const common = { width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", ...p };
  const paths = {
    ai: <><path d="M12 2v3"/><path d="M12 19v3"/><path d="M5 12H2"/><path d="M22 12h-3"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M7 7l1.5 1.5"/><path d="M15.5 15.5L17 17"/><path d="M17 7l-1.5 1.5"/><path d="M8.5 15.5L7 17"/></>,
    appsec: <><path d="M3 4h18v6H3z"/><path d="M3 14h18v6H3z"/><path d="M7 7h.01"/><path d="M7 17h.01"/><path d="M11 7l3 3-3 3"/><path d="M16 7h2"/></>,
    devsecops: <><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M8 6h6a4 4 0 014 4v0"/><path d="M8 18h6a4 4 0 004-4v0"/><path d="M12 9l1.5 1.5L12 12"/></>,
    cloud: <><path d="M6 18a4 4 0 010-8 6 6 0 0111.5-1.5A4.5 4.5 0 0118 18H6z"/><path d="M12 12v6"/><path d="M9 15l3 3 3-3"/></>,
    container: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4"/><path d="M12 21V11"/><path d="M7.5 9.5l9-4"/></>,
    arch: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M10 6.5h4"/><path d="M10 17.5h4"/><path d="M6.5 10v4"/><path d="M17.5 10v4"/></>,
    grc: <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></>,
    threat: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/></>,
    arrow: <><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>,
    arrowUR: <><path d="M7 17L17 7"/><path d="M8 7h9v9"/></>,
    close: <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>,
    check: <><path d="M5 12l4 4 10-10"/></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v8"/><circle cx="8" cy="7" r="0.5" fill="currentColor"/><path d="M12 18v-5a3 3 0 016 0v5"/><path d="M12 13v5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/></>,
    play: <><path d="M6 4l14 8-14 8z" fill="currentColor"/></>
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

/* ============================================================
   MONSEC LOGO MARK — hex with M/keyhole
   ============================================================ */
const LogoMark = ({ height = 28 }) => (
  <img src="assets/monsec-logo-trans.png" alt="MonSec"
       loading="eager"
       decoding="sync"
       style={{ height, width: "auto", display: "block",
                imageRendering: "-webkit-optimize-contrast",
                filter: "drop-shadow(0 0 0.5px rgba(255,255,255,0.5)) brightness(1.18) contrast(1.1) saturate(1.05)" }}/>
);

/* ============================================================
   ANIMATED HERO BACKGROUND — node graph
   ============================================================ */
const HeroNetwork = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    let h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const N = 38;
    const nodes = Array.from({length: N}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random()-0.5) * 0.25 * devicePixelRatio,
      vy: (Math.random()-0.5) * 0.25 * devicePixelRatio,
      r: (1 + Math.random()*1.5) * devicePixelRatio
    }));
    const onResize = () => { w = canvas.width = canvas.offsetWidth * devicePixelRatio; h = canvas.height = canvas.offsetHeight * devicePixelRatio; };
    window.addEventListener("resize", onResize);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const maxD = 160 * devicePixelRatio;
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      // edges
      for (let i = 0; i < N; i++) {
        for (let j = i+1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            const alpha = (1 - d/maxD) * 0.35;
            ctx.strokeStyle = `rgba(0, 255, 156, ${alpha})`;
            ctx.lineWidth = 0.6 * devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = "rgba(0, 255, 156, 0.7)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="bg-net" style={{width: "100%", height: "100%"}}/>;
};

/* ============================================================
   HERO VIZ — schematic shield
   ============================================================ */
const HeroViz = () => {
  const layers = [
    { r: 240, dur: "30s", color: "var(--accent)" },
    { r: 190, dur: "26s", color: "var(--accent-2)" },
    { r: 140, dur: "22s", color: "var(--accent)" },
  ];
  const services = [
    { a: 0, label: "AI" },
    { a: 60, label: "APP" },
    { a: 120, label: "DEV" },
    { a: 180, label: "CLD" },
    { a: 240, label: "K8S" },
    { a: 300, label: "GRC" },
  ];
  return (
    <svg viewBox="-300 -300 600 600" style={{width: "100%", height: "100%"}}>
      <defs>
        <radialGradient id="core" cx="0" cy="0" r="0.5">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.3"/>
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="280" fill="url(#core)"/>
      {/* dashed orbits */}
      {layers.map((l,i) => (
        <g key={i} style={{ transformOrigin: "0 0", animation: `${i%2 ? 'spin-r' : 'spin'} ${l.dur} linear infinite` }}>
          <circle cx="0" cy="0" r={l.r} fill="none" stroke={l.color} strokeWidth="0.6" strokeDasharray="2 6" opacity="0.35"/>
        </g>
      ))}
      {/* solid radial spokes */}
      {Array.from({length: 36}).map((_,i)=>(
        <line key={i} x1={Math.cos(i*Math.PI/18)*255} y1={Math.sin(i*Math.PI/18)*255}
              x2={Math.cos(i*Math.PI/18)*265} y2={Math.sin(i*Math.PI/18)*265}
              stroke="var(--ink-faint)" strokeWidth="0.5" opacity="0.5"/>
      ))}
      {/* service hexes around mid-orbit */}
      {services.map((s, i) => {
        const x = Math.cos(s.a*Math.PI/180) * 190;
        const y = Math.sin(s.a*Math.PI/180) * 190;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
                     fill="var(--bg-2)" stroke="var(--accent)" strokeWidth="1"/>
            <text textAnchor="middle" y="4"
                  style={{ fill: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}>
              {s.label}
            </text>
          </g>
        );
      })}
      {/* core */}
      <g>
        <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22"
                 fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.6"/>
        <text textAnchor="middle" y="-2"
              style={{ fill: "var(--ink)", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600 }}>
          MONSEC
        </text>
        <text textAnchor="middle" y="14"
              style={{ fill: "var(--ink-faint)", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.15em" }}>
          v.2026
        </text>
      </g>
      {/* moving probe */}
      <g style={{ transformOrigin: "0 0", animation: "spin 12s linear infinite" }}>
        <line x1="0" y1="0" x2="240" y2="0" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4"/>
        <circle cx="240" cy="0" r="3" fill="var(--accent)">
          <animate attributeName="r" values="2;5;2" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      </g>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-r { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>
    </svg>
  );
};

window.Icon = Icon;
window.LogoMark = LogoMark;
window.HeroNetwork = HeroNetwork;
window.HeroViz = HeroViz;
