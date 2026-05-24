// Shared visual components for the resume site.
// Cream + ink editorial palette.

// ─── Icons (inline SVG, stroke-based, ~24px) ──────────────────────────
const Icon = {
  Linkedin: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  Arrow: ({ size = 16, deg = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${deg}deg)`, transition: "transform .25s" }} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Play: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Sparkle: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  ),
  Dot: ({ size = 8 }) => (
    <svg width={size} height={size} viewBox="0 0 8 8" aria-hidden="true">
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  ),
  Check: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  Loop: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  ),
  // Section icons for AI cards
  Wand: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 4L20 9M3 21l11.5-11.5M14 6l1 1M17 9l1 1M19 4l1 1" />
    </svg>
  ),
  Stack: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5M3 18l9 5 9-5" />
    </svg>
  ),
  Graph: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="7" r="2.5" />
      <circle cx="12" cy="17" r="2.5" />
      <path d="M8 7l8 1M7.5 8l4 6.5M16.5 9L13 15" />
    </svg>
  ),
  Mic: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  Cert: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="10" r="6" />
      <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
    </svg>
  ),
  Dice: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
      <path d="M3 7l9 5 9-5M12 12v10" />
    </svg>
  ),
  Lotus: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4c-1.5 3-1.5 7 0 10 1.5-3 1.5-7 0-10z" />
      <path d="M5 10c-1 3 1 6 4 7-1-3-2.5-5-4-7z" />
      <path d="M19 10c1 3-1 6-4 7 1-3 2.5-5 4-7z" />
      <path d="M3 17c3 2 15 2 18 0" />
    </svg>
  ),
  Code: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  ),
  Bank: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10L12 4l9 6" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />
    </svg>
  ),
  Globe: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  ),
};

// ─── Eyebrow tag pill ─────────────────────────────────────────────────
function Tag({ children, dark = false, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(42,33,27,0.06)",
        color: dark ? "var(--cream)" : "var(--ink-2)",
        border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(42,33,27,0.10)",
        borderRadius: 999,
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── Primary CTA (LinkedIn) ───────────────────────────────────────────
function CTAButton({ children, href, size = "md", invert = false, full = false }) {
  const [hover, setHover] = React.useState(false);
  const big = size === "lg";
  const xl = size === "xl";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: xl ? 18 : big ? 14 : 10,
        padding: xl ? "22px 32px" : big ? "16px 24px" : "12px 18px",
        background: invert ? "var(--cream)" : "var(--ink)",
        color: invert ? "var(--ink)" : "var(--cream)",
        borderRadius: 999,
        textDecoration: "none",
        fontWeight: 500,
        fontSize: xl ? 22 : big ? 17 : 14,
        letterSpacing: "-0.01em",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? "0 12px 32px rgba(42,33,27,0.18)" : "0 4px 12px rgba(42,33,27,0.10)",
        transition: "transform .25s ease, box-shadow .25s ease, background .2s",
        width: full ? "100%" : "auto",
        justifyContent: full ? "center" : "flex-start",
      }}
    >
      <Icon.Linkedin size={xl ? 22 : big ? 18 : 16} />
      <span>{children}</span>
      <span style={{ display: "inline-flex", marginLeft: xl ? 6 : 2 }}>
        <Icon.Arrow size={xl ? 20 : big ? 16 : 14} deg={hover ? 0 : -45} />
      </span>
    </a>
  );
}

// ─── Stylized video placeholder ───────────────────────────────────────
// Looks like motion footage: animated gradient mesh + grain + scan + label.
function VideoBackdrop({ palette = "warm", label, children, scrim = 0.45, intensity = 1, blocks = false }) {
  const palettes = {
    warm: ["#3a2418", "#7a3d1c", "#c97a4b", "#e3a76b"],
    night: ["#0d1117", "#1a2438", "#2d4a6e", "#5b7fb0"],
    ember: ["#1a0b07", "#4a1d10", "#8a3a1a", "#d96638"],
    forest: ["#0e1b14", "#1f3a2c", "#3a6b4e", "#7aa97f"],
    ink: ["#15110d", "#2a211b", "#3f3329", "#6b5544"],
    plum: ["#170e1e", "#2e1a3a", "#5a3370", "#9a6dba"],
  };
  const c = palettes[palette] || palettes.warm;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Animated mesh gradient */}
      <div className="vid-mesh" style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(60% 80% at 20% 30%, ${c[2]} 0%, transparent 60%),
          radial-gradient(50% 70% at 80% 20%, ${c[3]} 0%, transparent 55%),
          radial-gradient(70% 90% at 70% 80%, ${c[1]} 0%, transparent 60%),
          radial-gradient(50% 60% at 10% 90%, ${c[2]} 0%, transparent 60%),
          linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 100%)
        `,
        filter: `saturate(${0.9 * intensity}) brightness(${0.95})`,
      }} />

      {/* Drifting blobs to evoke motion */}
      <div className="vid-blob vid-blob-a" style={{ background: `radial-gradient(circle, ${c[3]}cc 0%, transparent 70%)` }} />
      <div className="vid-blob vid-blob-b" style={{ background: `radial-gradient(circle, ${c[2]}aa 0%, transparent 70%)` }} />
      <div className="vid-blob vid-blob-c" style={{ background: `radial-gradient(circle, ${c[1]}99 0%, transparent 70%)` }} />

      {/* Optional pixel grid suggesting urban / abstract footage */}
      {blocks && <div className="vid-blocks" />}

      {/* Scan line */}
      <div className="vid-scan" />

      {/* Grain */}
      <div className="vid-grain" />

      {/* Scrim for legibility */}
      <div style={{ position: "absolute", inset: 0, background: `rgba(15, 12, 9, ${scrim})` }} />

      {/* REC chip */}
      {label && (
        <div style={{
          position: "absolute", top: 18, left: 22,
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
          color: "rgba(255,255,255,0.78)",
          textTransform: "uppercase",
          mixBlendMode: "screen",
        }}>
          <span className="rec-dot" />
          {label}
        </div>
      )}

      {/* Timecode */}
      <div style={{
        position: "absolute", bottom: 16, right: 22,
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.5)",
      }}>
        00:00:<TimecodeFrame />
      </div>

      {children && <div style={{ position: "relative", height: "100%" }}>{children}</div>}
    </div>
  );
}

function TimecodeFrame() {
  const [f, setF] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setF((x) => (x + 1) % 100), 80);
    return () => clearInterval(id);
  }, []);
  return <span>{String(f).padStart(2, "0")}</span>;
}

// ─── Section wrapper ──────────────────────────────────────────────────
function Section({ id, bg = "cream", children, style, full = false, dataLabel }) {
  const bgs = {
    cream: "var(--cream)",
    cream2: "var(--cream-2)",
    ink: "var(--ink)",
    paper: "var(--paper)",
  };
  return (
    <section
      id={id}
      data-screen-label={dataLabel || id}
      style={{
        background: bgs[bg],
        color: bg === "ink" ? "var(--cream)" : "var(--ink)",
        padding: full ? 0 : "clamp(80px, 9vw, 140px) 0",
        position: "relative",
        ...style,
      }}
    >
      <div style={{ maxWidth: full ? "100%" : 1320, margin: "0 auto", padding: full ? 0 : "0 clamp(24px, 4vw, 64px)" }}>
        {children}
      </div>
    </section>
  );
}

// ─── Section header (kicker + title + lede) ───────────────────────────
function SectionHeader({ kicker, title, lede, align = "left", dark = false, maxWidth = 820 }) {
  return (
    <div style={{ maxWidth, marginInline: align === "center" ? "auto" : undefined, textAlign: align }}>
      {kicker && (
        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: dark ? "rgba(247,242,232,0.55)" : "var(--ink-3)",
          marginBottom: 20,
          display: "inline-flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            width: 24, height: 1, background: dark ? "rgba(247,242,232,0.5)" : "var(--ink-3)",
          }} />
          {kicker}
        </div>
      )}
      {title && (
        <h2 style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(38px, 5.2vw, 76px)",
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          fontWeight: 400,
          margin: 0,
          color: dark ? "var(--cream)" : "var(--ink)",
          textWrap: "balance",
        }}>
          {title}
        </h2>
      )}
      {lede && (
        <p style={{
          marginTop: 24,
          fontSize: "clamp(17px, 1.3vw, 21px)",
          lineHeight: 1.55,
          color: dark ? "rgba(247,242,232,0.78)" : "var(--ink-2)",
          maxWidth: 680,
          textWrap: "pretty",
        }}>
          {lede}
        </p>
      )}
    </div>
  );
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────
function useReveal() {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, y = 24, style }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} style={{
      transform: shown ? "translateY(0)" : `translateY(${y}px)`,
      opacity: shown ? 1 : 0,
      transition: `transform .7s cubic-bezier(.2,.8,.2,1) ${delay}s, opacity .7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, {
  Icon, Tag, CTAButton, VideoBackdrop, Section, SectionHeader, Reveal, useReveal,
});
